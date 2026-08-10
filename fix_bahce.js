const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');

    // 1. Fix Ayarlı Hortum Lansı Images
    html = html.replace(/("1\/2” Ayarlı Hortum Lansı"[\s\S]*?<img src=")resimler\/bahce_ekipmanlari\/Hortum_Lans\.png/gi, '$1resimler/bahce_ekipmanlari/1-2_Ayarl_Hortum_Lans.png');
    html = html.replace(/("1\/2" Ayarlı Hortum Lansı"[\s\S]*?<img src=")resimler\/bahce_ekipmanlari\/Hortum_Lans\.png/gi, '$1resimler/bahce_ekipmanlari/1-2_Ayarl_Hortum_Lans.png');
    
    html = html.replace(/("3\/4” Ayarlı Hortum Lansı"[\s\S]*?<img src=")resimler\/bahce_ekipmanlari\/Hortum_Lans\.png/gi, '$1resimler/bahce_ekipmanlari/3-4_Ayarl_Hortum_Lans.png');
    html = html.replace(/("3\/4" Ayarlı Hortum Lansı"[\s\S]*?<img src=")resimler\/bahce_ekipmanlari\/Hortum_Lans\.png/gi, '$1resimler/bahce_ekipmanlari/3-4_Ayarl_Hortum_Lans.png');
    
    html = html.replace(/("1” Ayarlı Hortum Lansı"[\s\S]*?<img src=")resimler\/bahce_ekipmanlari\/Hortum_Lans\.png/gi, '$1resimler/bahce_ekipmanlari/1_Ayarl_Hortum_Lans.png');
    html = html.replace(/("1" Ayarlı Hortum Lansı"[\s\S]*?<img src=")resimler\/bahce_ekipmanlari\/Hortum_Lans\.png/gi, '$1resimler/bahce_ekipmanlari/1_Ayarl_Hortum_Lans.png');

    // 2. Duplicate Hortum Lansı to have both 350 and 351
    // The current one is: Hortum Lansı (350)
    // Find the product block for "Hortum Lansı" (exactly)
    const blocks = html.split('<div class="product-card"');
    for (let i = 1; i < blocks.length; i++) {
        // If it's the exact Hortum Lansı (code 350)
        if (blocks[i].match(/<h3[^>]*>Hortum Lansı<\/h3>/i) && blocks[i].includes('350')) {
            // Update 350
            blocks[i] = blocks[i].replace(/<h3>Hortum Lansı<\/h3>/i, '<h3>Hortum Lansı 1/2" - 5/8"</h3>');
            blocks[i] = blocks[i].replace(/data-name="Hortum Lansı"/gi, 'data-name="Hortum Lansı 1/2&quot; - 5/8&quot;"');
            blocks[i] = blocks[i].replace(/data-product="Hortum Lansı"/gi, 'data-product="Hortum Lansı 1/2&quot; - 5/8&quot;"');
            blocks[i] = blocks[i].replace(/<div class="info-row"><span>Koli Adedi:<\/span> <strong>.*?<\/strong><\/div>/i, `<div class="info-row"><span>Koli Adedi:</span> <strong>1400</strong></div>`);
            blocks[i] = blocks[i].replace(/<div class="info-row"><span>Ambalaj:<\/span> <strong>.*?<\/strong><\/div>/i, `<div class="info-row"><span>Ambalaj:</span> <strong>50</strong></div>`);
            blocks[i] = blocks[i].replace(/<div class="price-display">.*?<\/div>/i, `<div class="price-display">₺ 11.00</div>`);
            blocks[i] = blocks[i].replace(/data-price="[^"]*"/i, `data-price="11.00"`);
            blocks[i] = blocks[i].replace(/data-box="[^"]*"/i, `data-box="1400"`);
            blocks[i] = blocks[i].replace(/data-paket="[^"]*"/i, `data-paket="50"`);

            // Create 351 by copying 350 block
            let newBlock = blocks[i];
            newBlock = newBlock.replace(/1\/2" - 5\/8"/g, '3/4" - 1"');
            newBlock = newBlock.replace(/1\/2&quot; - 5\/8&quot;/g, '3/4&quot; - 1&quot;');
            newBlock = newBlock.replace(/<span class="badge">350<\/span>/i, '<span class="badge">351</span>');
            newBlock = newBlock.replace(/data-code="350"/i, 'data-code="351"');
            newBlock = newBlock.replace(/<span>Koli Adedi:<\/span> <strong>1400<\/strong>/i, `<span>Koli Adedi:</span> <strong>-</strong>`);
            newBlock = newBlock.replace(/data-box="1400"/i, `data-box="-"`);
            newBlock = newBlock.replace(/<span>Ambalaj:<\/span> <strong>50<\/strong>/i, `<span>Ambalaj:</span> <strong>25</strong>`);
            newBlock = newBlock.replace(/data-paket="50"/i, `data-paket="25"`);
            newBlock = newBlock.replace(/<div class="price-display">₺ 11\.00<\/div>/i, `<div class="price-display">₺ 34.00</div>`);
            newBlock = newBlock.replace(/data-price="11\.00"/i, `data-price="34.00"`);

            // Insert 351 right after 350
            blocks.splice(i + 1, 0, newBlock);
            break;
        }
    }
    
    // 3. Update the other products user mentioned
    function updateProduct(blocksArray, searchName, newCode, newKoli, newAmbalaj, newFiyat) {
        for (let i = 1; i < blocksArray.length; i++) {
            // Using includes to find it
            if (blocksArray[i].toLowerCase().includes(searchName.toLowerCase())) {
                if (newCode) {
                    blocksArray[i] = blocksArray[i].replace(/<span class="badge">.*?<\/span>/i, `<span class="badge">${newCode}</span>`);
                    blocksArray[i] = blocksArray[i].replace(/data-code="[^"]*"/i, `data-code="${newCode}"`);
                }
                if (newKoli !== null) {
                    blocksArray[i] = blocksArray[i].replace(/<div class="info-row"><span>Koli Adedi:<\/span> <strong>.*?<\/strong><\/div>/i, `<div class="info-row"><span>Koli Adedi:</span> <strong>${newKoli}</strong></div>`);
                    blocksArray[i] = blocksArray[i].replace(/data-box="[^"]*"/i, `data-box="${newKoli}"`);
                }
                if (newAmbalaj !== null) {
                    blocksArray[i] = blocksArray[i].replace(/<div class="info-row"><span>Ambalaj:<\/span> <strong>.*?<\/strong><\/div>/i, `<div class="info-row"><span>Ambalaj:</span> <strong>${newAmbalaj}</strong></div>`);
                    blocksArray[i] = blocksArray[i].replace(/data-paket="[^"]*"/i, `data-paket="${newAmbalaj}"`);
                }
                if (newFiyat !== null) {
                    blocksArray[i] = blocksArray[i].replace(/<div class="price-display">.*?<\/div>/i, `<div class="price-display">₺ ${newFiyat}</div>`);
                    blocksArray[i] = blocksArray[i].replace(/data-price="[^"]*"/i, `data-price="${newFiyat}"`);
                }
                break;
            }
        }
    }

    updateProduct(blocks, "Lüks Rekor", "190", "250", "25", "50.00");
    updateProduct(blocks, "Uzatma Borusu", "361", "300", "-", "48.00");
    updateProduct(blocks, "Maşon", "362", "-", "50", "12.00");
    updateProduct(blocks, "PVC Nipel", "402", "-", "100", "11.00");

    html = blocks.join('<div class="product-card"');

    // Save and re-encode
    fs.writeFileSync('bahce_edit.html', html);
    
    const dataCode = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    const newDataCode = dataCode.replace(routeRegex, `$1${newBase64}$3`);
    fs.writeFileSync('data.js', newDataCode);

    console.log("Successfully updated bahce_edit.html and data.js");

} catch(e) {
    console.error(e);
}

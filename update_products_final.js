const fs = require('fs');

try {
    const code = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const match = code.match(routeRegex);
    
    // We will start fresh from bahce_original.html
    let html = fs.readFileSync('bahce_original.html', 'utf8');
    
    function updateProduct(htmlContent, searchName, newCode, newKoli, newAmbalaj, newFiyat) {
        const blocks = htmlContent.split('<div class="product-card"');
        
        for (let i = 1; i < blocks.length; i++) {
            if (blocks[i].toLowerCase().includes(searchName.toLowerCase())) {
                console.log(`Updating "${searchName}"`);
                
                // Update Badge Code
                if (newCode) {
                    blocks[i] = blocks[i].replace(/<span class="badge">.*?<\/span>/i, `<span class="badge">${newCode}</span>`);
                    blocks[i] = blocks[i].replace(/data-code="[^"]*"/i, `data-code="${newCode}"`);
                }
                
                // Update Koli Adedi
                if (newKoli !== null) {
                    blocks[i] = blocks[i].replace(/<div class="info-row"><span>Koli Adedi:<\/span> <strong>.*?<\/strong><\/div>/i, `<div class="info-row"><span>Koli Adedi:</span> <strong>${newKoli}</strong></div>`);
                    blocks[i] = blocks[i].replace(/data-box="[^"]*"/i, `data-box="${newKoli}"`);
                }
                
                // Update Ambalaj
                if (newAmbalaj !== null) {
                    blocks[i] = blocks[i].replace(/<div class="info-row"><span>Ambalaj:<\/span> <strong>.*?<\/strong><\/div>/i, `<div class="info-row"><span>Ambalaj:</span> <strong>${newAmbalaj}</strong></div>`);
                    blocks[i] = blocks[i].replace(/data-paket="[^"]*"/i, `data-paket="${newAmbalaj}"`);
                }
                
                // Update Fiyat
                if (newFiyat !== null) {
                    blocks[i] = blocks[i].replace(/<div class="price-display">.*?<\/div>/i, `<div class="price-display">₺ ${newFiyat}</div>`);
                    blocks[i] = blocks[i].replace(/data-price="[^"]*"/i, `data-price="${newFiyat}"`);
                }
                
                break;
            }
        }
        
        return blocks.join('<div class="product-card"');
    }

    // 1. Jumbo El Süzeği
    html = updateProduct(html, "Jumbo El", "129", "25", null, "320.00");
    
    // 2. Uzun El Süzeği Dirsekli
    html = updateProduct(html, "Uzun El", "131", "75", null, "115.00");
    
    // 3. Lüks El Süzeği
    html = updateProduct(html, "Lüks El", "132", "144", "12", "75.00");
    
    // 4. 3/4” Jak Adaptörü
    html = updateProduct(html, "Jak Adaptörü", "317", "1600", "160", "30.00");
    
    // 5. 3/4 vantuz
    html = updateProduct(html, '3/4” Vantuz', "283", "100", null, "130.00");
    html = updateProduct(html, '3/4" Vantuz', "283", "100", null, "130.00");
    html = updateProduct(html, '3/4 Vantuz', "283", "100", null, "130.00");
    html = updateProduct(html, '3/4\u201D Vantuz', "283", "100", null, "130.00");
    html = updateProduct(html, '3/4\u0022 Vantuz', "283", "100", null, "130.00");
    html = updateProduct(html, '3/4\ufffd Vantuz', "283", "100", null, "130.00"); // for mangled quotes
    
    // 6. 1 vantuz
    html = updateProduct(html, '1” Vantuz', "284", "100", null, "130.00");
    html = updateProduct(html, '1" Vantuz', "284", "100", null, "130.00");
    html = updateProduct(html, '1 Vantuz', "284", "100", null, "130.00");
    html = updateProduct(html, '1\u201D Vantuz', "284", "100", null, "130.00");
    html = updateProduct(html, '1\ufffd Vantuz', "284", "100", null, "130.00");

    fs.writeFileSync('bahce_updated.html', html);
    
    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    const newCode = code.replace(routeRegex, `$1${newBase64}$3`);
    
    fs.writeFileSync('data.js', newCode);
    console.log("Successfully updated ALL products in data.js cleanly");
    
} catch (err) {
    console.error(err);
}

const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');
    const dataCode = fs.readFileSync('data.js', 'utf8');

    function updateProduct(blocksArray, searchName, newCode, newKoli, newAmbalaj, newFiyat) {
        for (let i = 1; i < blocksArray.length; i++) {
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

    const blocks = html.split('<div class="product-card"');

    updateProduct(blocks, "1/2” Ayarlı Hortum Lansı", "125", "250", "10", "68.00");
    updateProduct(blocks, "1/2 Ayarlı Hortum Lansı", "125", "250", "10", "68.00");
    updateProduct(blocks, "1/2” Klima Çatalı", "111", "600", "50", "26.00");
    updateProduct(blocks, "1/2” Lüks Rekorlu Su Tabancası", "359", "100", "-", "115.00");
    updateProduct(blocks, "1/2” Lüks Rekorlu Süzek Tabanca", "356", "75", "-", "115.00");
    updateProduct(blocks, "1/2” • 3/4” • 1” 2’li Jak Dağıtıcı", "335", "200", "-", "400.00");
    updateProduct(blocks, "1/2” • 3/4” • 1” 4’lü Jak Dağıtıcı", "336", "70", "-", "500.00");
    updateProduct(blocks, "1/2” • 5/8” Hortum Y", "112", "600", "50", "50.00");
    
    updateProduct(blocks, "3/4” Ayarlı Hortum Lansı", "126", "150", "10", "90.00");
    updateProduct(blocks, "3/4” Lüks Rekorlu Su Tabancası", "360", "100", "-", "125.00");
    updateProduct(blocks, "3/4” Lüks Rekorlu Süzek Tabanca", "357", "75", "-", "125.00");
    updateProduct(blocks, "3/4” • 1/2” Lüks Rekor", "195", "250", "25", "53.00");
    
    updateProduct(blocks, "Metal Fıskiye Kazığı", "197", "250", "-", "380.00");
    
    updateProduct(blocks, "Tetikli Su Tabancası 1/2” Lüks Rekorlu", "176", "40", "-", "190.00");
    updateProduct(blocks, "Tetikli Su Tabancası 3/4” Lüks Rekorlu", "348", "75", "-", "210.00");
    updateProduct(blocks, "Tetikli Süzek Tabanca 3/4” Lüks Rekorlu", "349", "60", "-", "210.00");
    updateProduct(blocks, "Tetikli Süzek Tabancası 1/2” Lüks Rekorlu", "177", "30", "-", "190.00");

    html = blocks.join('<div class="product-card"');
    fs.writeFileSync('bahce_edit.html', html);

    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    const newDataCode = dataCode.replace(routeRegex, `$1${newBase64}$3`);
    fs.writeFileSync('data.js', newDataCode);

    console.log("Subagent updates applied successfully.");
} catch (e) {
    console.error(e);
}

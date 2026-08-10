const fs = require('fs');

try {
    const code = fs.readFileSync('data.js', 'utf8');
    
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const match = code.match(routeRegex);
    
    if (!match) {
        console.error("Could not find bahce-ekipmanlari.html in data.js");
        process.exit(1);
    }
    
    const base64Html = match[2];
    let html = Buffer.from(base64Html, 'base64').toString('utf8');
    
    fs.writeFileSync('bahce_original.html', html);
    
    function updateProduct(htmlContent, searchName, newCode, newKoli, newAmbalaj, newFiyat) {
        const blocks = htmlContent.split('<div class="product-card"');
        
        for (let i = 1; i < blocks.length; i++) {
            if (blocks[i].toLowerCase().includes(searchName.toLowerCase())) {
                console.log(`Found product containing "${searchName}"`);
                
                // Update Code
                if (newCode) {
                    blocks[i] = blocks[i].replace(/<div class="product-code-badge">\s*(-|\d+)?\s*<\/div>/i, `<div class="product-code-badge">${newCode}</div>`);
                }
                
                // Update Koli Adedi
                if (newKoli !== null) {
                    blocks[i] = blocks[i].replace(/<span>Koli Adedi\s*:\s*(?:<[^>]+>)?(-|\d+|[0-9,\.]+)?(?:<\/[^>]+>)?<\/span>/i, `<span>Koli Adedi : ${newKoli}</span>`);
                }
                
                // Update Ambalaj
                if (newAmbalaj !== null) {
                    blocks[i] = blocks[i].replace(/<span>Ambalaj\s*:\s*(?:<[^>]+>)?(-|\d+|[0-9,\.]+)?(?:<\/[^>]+>)?<\/span>/i, `<span>Ambalaj : ${newAmbalaj}</span>`);
                }
                
                // Update Fiyat
                if (newFiyat !== null) {
                    blocks[i] = blocks[i].replace(/<span class="product-price">\s*Fiyat\s*:\s*(?:<[^>]+>)?([^<]+)?(?:<\/[^>]+>)?\s*<\/span>/i, `<span class="product-price">Fiyat : ${newFiyat} TL.</span>`);
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
    html = updateProduct(html, "3/4 Vantuz", "283", "100", null, "130.00");
    
    // 6. 1 vantuz
    html = updateProduct(html, "1 Vantuz", "284", "100", null, "130.00");
    html = updateProduct(html, "1\" Vantuz", "284", "100", null, "130.00");

    fs.writeFileSync('bahce_updated.html', html);
    
    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    const newCode = code.replace(routeRegex, `$1${newBase64}$3`);
    
    fs.writeFileSync('data.js', newCode);
    console.log("Successfully updated data.js");
    
} catch (err) {
    console.error(err);
}

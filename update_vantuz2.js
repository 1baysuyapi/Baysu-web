const fs = require('fs');

try {
    const code = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const match = code.match(routeRegex);
    const base64Html = match[2];
    let html = Buffer.from(base64Html, 'base64').toString('utf8');
    
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
                    blocks[i] = blocks[i].replace(/<span>Koli Adedi:\s*<\/span>\s*<strong>(-|\d+|[0-9,\.]+)<\/strong>/i, `<span>Koli Adedi:</span> <strong>${newKoli}</strong>`);
                    blocks[i] = blocks[i].replace(/<span>Koli Adedi\s*:\s*(?:<[^>]+>)?(-|\d+|[0-9,\.]+)?(?:<\/[^>]+>)?<\/span>/i, `<span>Koli Adedi : ${newKoli}</span>`);
                }
                
                // Update Ambalaj
                if (newAmbalaj !== null) {
                    blocks[i] = blocks[i].replace(/<span>Ambalaj:\s*<\/span>\s*<strong>(-|\d+|[0-9,\.]+)<\/strong>/i, `<span>Ambalaj:</span> <strong>${newAmbalaj}</strong>`);
                    blocks[i] = blocks[i].replace(/<span>Ambalaj\s*:\s*(?:<[^>]+>)?(-|\d+|[0-9,\.]+)?(?:<\/[^>]+>)?<\/span>/i, `<span>Ambalaj : ${newAmbalaj}</span>`);
                }
                
                // Update Fiyat
                if (newFiyat !== null) {
                    blocks[i] = blocks[i].replace(/<div class="price-display">[^<]+<\/div>/i, `<div class="price-display">${newFiyat} TL</div>`);
                    blocks[i] = blocks[i].replace(/<span class="product-price">\s*Fiyat\s*:\s*(?:<[^>]+>)?([^<]+)?(?:<\/[^>]+>)?\s*<\/span>/i, `<span class="product-price">Fiyat : ${newFiyat} TL.</span>`);
                    blocks[i] = blocks[i].replace(/data-price="[^"]*"/i, `data-price="${newFiyat}"`);
                }
                
                break;
            }
        }
        
        return blocks.join('<div class="product-card"');
    }
    
    // 5. 3/4 vantuz
    html = updateProduct(html, '3/4” Vantuz', "283", "100", null, "130.00");
    html = updateProduct(html, '3/4" Vantuz', "283", "100", null, "130.00");
    html = updateProduct(html, '3/4 Vantuz', "283", "100", null, "130.00");
    html = updateProduct(html, '3/4\u201D Vantuz', "283", "100", null, "130.00");
    html = updateProduct(html, '3/4\u0022 Vantuz', "283", "100", null, "130.00");
    
    // 6. 1 vantuz
    html = updateProduct(html, '1” Vantuz', "284", "100", null, "130.00");
    html = updateProduct(html, '1" Vantuz', "284", "100", null, "130.00");
    html = updateProduct(html, '1 Vantuz', "284", "100", null, "130.00");
    html = updateProduct(html, '1\u201D Vantuz', "284", "100", null, "130.00");

    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    const newCode = code.replace(routeRegex, `$1${newBase64}$3`);
    
    fs.writeFileSync('data.js', newCode);
    console.log("Successfully updated vantuz in data.js");
    
} catch (err) {
    console.error(err);
}

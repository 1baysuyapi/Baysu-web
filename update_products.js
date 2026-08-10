const fs = require('fs');

try {
    const code = fs.readFileSync('data.js', 'utf8');
    
    // The structure is window.BaysuData = { routes: { "/route": "base64", ... } }
    // Let's use a regex to extract the base64 for /bahce-ekipmanlari
    const routeRegex = /("\/bahce-ekipmanlari":\s*")([^"]+)(")/;
    const match = code.match(routeRegex);
    
    if (!match) {
        console.error("Could not find /bahce-ekipmanlari in data.js");
        process.exit(1);
    }
    
    const base64Html = match[2];
    let html = Buffer.from(base64Html, 'base64').toString('utf8');
    
    // Save original for backup
    fs.writeFileSync('bahce_original.html', html);
    
    // Helper function to update a product card
    function updateProduct(htmlContent, searchName, newCode, newKoli, newAmbalaj, newFiyat) {
        // Find the product card containing the searchName
        // We'll look for <h3>searchName</h3> or similar
        // Since HTML might have newlines, we use a regex to find the .product-card block
        
        // This regex looks for the start of a product-card, then lazily matches until it finds the searchName
        const cardRegex = new RegExp(`(<div class="product-card"[^>]*>)[\\s\\S]*?(<h3[^>]*>[^<]*${searchName}[^<]*<\\/h3>)`, 'i');
        
        // Wait, it's safer to split by '<div class="product-card"' and check each block
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
                    blocks[i] = blocks[i].replace(/<span>Koli Adedi\s*:\s*(?:<[^>]+>)?(-|\d+)?(?:<\/[^>]+>)?<\/span>/i, `<span>Koli Adedi : ${newKoli}</span>`);
                }
                
                // Update Ambalaj
                if (newAmbalaj !== null) {
                    blocks[i] = blocks[i].replace(/<span>Ambalaj\s*:\s*(?:<[^>]+>)?(-|\d+)?(?:<\/[^>]+>)?<\/span>/i, `<span>Ambalaj : ${newAmbalaj}</span>`);
                }
                
                // Update Fiyat
                if (newFiyat !== null) {
                    blocks[i] = blocks[i].replace(/<span class="product-price">\s*Fiyat\s*:\s*(?:<[^>]+>)?([^<]+)?(?:<\/[^>]+>)?\s*<\/span>/i, `<span class="product-price">Fiyat : ${newFiyat} TL.</span>`);
                }
                
                break; // Only update the first match
            }
        }
        
        return blocks.join('<div class="product-card"');
    }

    // 1. Jumbo El Süzeği
    html = updateProduct(html, "Jumbo El Süzeği", "129", "25", null, "320.00");
    
    // 2. Uzun El Süzeği Dirsekli
    html = updateProduct(html, "Uzun El Süzeği Dirsekli", "131", "75", null, "115.00");
    
    // 3. Lüks El Süzeği
    html = updateProduct(html, "Lüks El Süzeği", "132", "144", "12", "75.00");
    
    // 4. 3/4” Jak Adaptörü (or 3/4" Jak Adaptörü)
    html = updateProduct(html, "Jak Adaptörü", "317", "1600", "160", "30.00");
    
    // 5. 3/4 vantuz
    html = updateProduct(html, "3/4 Vantuz", "283", "100", null, "130.00");
    
    // 6. 1 vantuz (or 1" Vantuz, check how it's written)
    html = updateProduct(html, "1 Vantuz", "284", "100", null, "130.00"); // Will check exact name if it fails
    // Also try 1" Vantuz
    html = updateProduct(html, "1\" Vantuz", "284", "100", null, "130.00");

    // Re-encode and replace
    fs.writeFileSync('bahce_updated.html', html);
    
    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    const newCode = code.replace(routeRegex, `$1${newBase64}$3`);
    
    fs.writeFileSync('data.js', newCode);
    console.log("Successfully updated data.js");
    
} catch (err) {
    console.error(err);
}

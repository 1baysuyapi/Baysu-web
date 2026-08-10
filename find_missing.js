const fs = require('fs');

try {
    const code = fs.readFileSync('data.js', 'utf8');
    const w = { PAGE_DATA: {} };
    global.window = w;
    eval(code);

    const routes = w.PAGE_DATA;
    let missingInfoProducts = [];

    for (const route in routes) {
        const html = Buffer.from(routes[route], 'base64').toString('utf8');
        const blocks = html.split('<div class="product-card"');
        
        for (let i = 1; i < blocks.length; i++) {
            const block = blocks[i];
            
            // Extract Name
            const nameMatch = block.match(/<h3[^>]*>([^<]+)<\/h3>/i);
            const name = nameMatch ? nameMatch[1].trim() : "Unknown";
            
            // Extract Code
            const codeMatch = block.match(/<div class="product-code-badge">\s*([^<]+?)\s*<\/div>/i);
            const productCode = codeMatch ? codeMatch[1].trim() : "-";
            
            // Extract Price
            let price = "-";
            const priceMatch = block.match(/<div class="price-display">([^<]+)<\/div>/i);
            if (priceMatch) price = priceMatch[1].trim();
            else {
                const priceSpan = block.match(/<span class="product-price">\s*Fiyat\s*:\s*([^<]+)<\/span>/i);
                if (priceSpan) price = priceSpan[1].trim();
            }

            // Extract Koli Adedi
            const koliMatch = block.match(/<span>Koli Adedi(?:[:\s]*)(?:<\/span>\s*<strong>|<[^>]+>)?([^<]+?)(?:<\/strong>|<\/[^>]+>)?\s*<\/div>/i);
            let koli = koliMatch ? koliMatch[1].replace(/<[^>]+>/g, '').trim() : "-";
            
            if(koli === "-") {
                const koliAlt = block.match(/<span>Koli Adedi\s*:\s*([^<]+)<\/span>/i);
                if(koliAlt) koli = koliAlt[1].trim();
            }

            if (productCode === "-" || price.includes("-") || price.includes("0.00") || price === "?" || price === "") {
                missingInfoProducts.push({
                    category: route.replace('.html', ''),
                    name,
                    code: productCode,
                    price,
                    koli
                });
            }
        }
    }

    fs.writeFileSync('missing_info.json', JSON.stringify(missingInfoProducts, null, 2));
    console.log(`Found ${missingInfoProducts.length} products with missing info.`);

} catch (e) {
    console.error(e);
}

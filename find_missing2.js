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
            
            // Extract Code (from badge)
            const codeMatch = block.match(/<span class="badge">\s*([^<]+?)\s*<\/span>/i);
            const productCode = codeMatch ? codeMatch[1].trim() : "-";
            
            // Extract Price
            let price = "-";
            const priceMatch = block.match(/<div class="price-display">([^<]+)<\/div>/i);
            if (priceMatch) {
                price = priceMatch[1].replace('₺', '').replace('', '').replace('?', '').trim();
            } else {
                const priceSpan = block.match(/<span class="product-price">\s*Fiyat\s*:\s*(?:<[^>]+>)?([^<]+?)(?:<\/span>)/i);
                if (priceSpan) price = priceSpan[1].replace('TL.', '').replace('TL', '').trim();
            }

            // Extract Koli Adedi
            const koliMatch = block.match(/<div class="info-row"><span>Koli Adedi:<\/span> <strong>([^<]+)<\/strong><\/div>/i);
            let koli = koliMatch ? koliMatch[1].trim() : "-";
            
            if (koli === "-") {
                const koliAlt = block.match(/<span>Koli Adedi\s*:\s*([^<]+)<\/span>/i);
                if (koliAlt) koli = koliAlt[1].trim();
            }

            // Extract Ambalaj
            const ambalajMatch = block.match(/<div class="info-row"><span>Ambalaj:<\/span> <strong>([^<]+)<\/strong><\/div>/i);
            let ambalaj = ambalajMatch ? ambalajMatch[1].trim() : "-";

            if (ambalaj === "-") {
                const ambalajAlt = block.match(/<span>Ambalaj\s*:\s*([^<]+)<\/span>/i);
                if (ambalajAlt) ambalaj = ambalajAlt[1].trim();
            }

            // Check if missing
            const isMissingCode = (productCode === "-" || productCode === "");
            const isMissingPrice = (price.includes("-") || price.includes("0.00") || price === "");
            const isMissingKoliAndAmbalaj = ((koli === "-" || koli === "") && (ambalaj === "-" || ambalaj === ""));

            if (isMissingCode || isMissingPrice || isMissingKoliAndAmbalaj) {
                missingInfoProducts.push({
                    category: route.replace('.html', ''),
                    name,
                    code: productCode,
                    price,
                    koli,
                    ambalaj
                });
            }
        }
    }

    let md = '# Gerçekten Eksik Bilgili Ürünler Listesi\n\n';
    let lastCategory = ''; 
    missingInfoProducts.forEach(p => { 
        if (p.category !== lastCategory) { 
            md += '\n## ' + p.category + '\n'; 
            lastCategory = p.category; 
        } 
        
        let eksikler = [];
        if (p.code === "-" || p.code === "") eksikler.push("Kod");
        if (p.price.includes("-") || p.price.includes("0.00") || p.price === "") eksikler.push("Fiyat");
        if ((p.koli === "-" || p.koli === "") && (p.ambalaj === "-" || p.ambalaj === "")) eksikler.push("Koli/Ambalaj");
        
        md += `- **${p.name}** -> (Eksik: ${eksikler.join(', ')}) [Mevcut: Kod: ${p.code}, Fiyat: ${p.price} TL, Koli: ${p.koli}, Ambalaj: ${p.ambalaj}]\n`;
    }); 

    fs.writeFileSync('eksik_urunler_listesi.md', md);
    console.log(`Found ${missingInfoProducts.length} truly missing info products.`);

} catch (e) {
    console.error(e);
}

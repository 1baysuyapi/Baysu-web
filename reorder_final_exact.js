const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');

    // Pattern to match all product cards
    const cardPattern = /<div class="product-card"[\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/g;
    
    let cards = [];
    let match;
    while ((match = cardPattern.exec(html)) !== null) {
        let cardHtml = match[0];
        let codeMatch = cardHtml.match(/data-code="([^"]+)"/);
        let nameMatch = cardHtml.match(/data-name="([^"]+)"/);
        let catMatch = cardHtml.match(/data-category="([^"]+)"/);
        
        cards.push({
            html: cardHtml,
            code: codeMatch ? codeMatch[1] : null,
            name: nameMatch ? nameMatch[1] : null,
            category: catMatch ? catMatch[1] : null
        });
    }

    // The sequence extracted from images 1-12
    const seq = [
      "129", "130", "131", "132",
      "138", "139", "140", "141",
      "162", "163", "164", "198", "151",
      "133", "136", "137", "134",
      "142", "143", "144", "135",
      "197", "145", "146", "147",
      "125", "126", "127", "152",
      "194", "199", "172", "173",
      "348", "349", "355", "356",
      "178", "179", "188", "430",
      "174", "175", "176", "177",
      "357", "358", "359", "360",
      "148", "149", "439", "153",
      "154", "155", "312", "313",
      "535", "186", "187", "181",
      "190", "195", "240", "196",
      "316", "317", "335", "336",
      "182", "185", "189", "191",
      "100", "101", "102", "103",
      "128", "183", "193", "235",
      "267", "268", "269", "270",
      "180", "192", "314", "315",
      "422", "423", "283", "284",
      "361", "362", "402", "265",
      "K001", "K002", "K003", "K004", "K005", "K006", "K007",
      "470", "471", "472", "473", "474", "475", "476",
      "395", "396", "397", "398"
    ];

    let seqCards = {};
    let pool = [...cards];

    for (let i = pool.length - 1; i >= 0; i--) {
        let c = pool[i];
        if (c.code && seq.includes(c.code)) {
            seqCards[c.code] = c;
            pool.splice(i, 1); // Remove from pool
        }
    }

    let finalOrder = [];

    // Push all items in EXACT order specified by the sequence array
    for (let code of seq) {
        if (seqCards[code]) {
            finalOrder.push(seqCards[code]);
        }
    }

    // Push everything else at the end
    finalOrder.push(...pool);

    let newCardsHtml = finalOrder.map(c => c.html).join("");
    
    // Replace the grid content in HTML
    let startIdx = html.indexOf('<div class="products-grid">');
    let endIdx = html.indexOf('</section>', startIdx);
    
    let newHtml = html.substring(0, startIdx + '<div class="products-grid">'.length) + 
                  newCardsHtml + 
                  html.substring(endIdx - '</div>'.length);

    fs.writeFileSync('bahce_edit.html', newHtml);

    // Update data.js
    let dataCodeStr = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(newHtml, 'utf8').toString('base64');
    let newDataCode = dataCodeStr.replace(routeRegex, (m, p1, p2, p3) => p1 + newBase64 + p3);
    fs.writeFileSync('data.js', newDataCode);

    // Dump order to file for inspection
    let dump = finalOrder.map((c, idx) => `${idx + 1}: ${c.name} (${c.code})`).join("\n");
    fs.writeFileSync('current_order.txt', dump);

    console.log("Successfully rebuilt catalog order!");

} catch(e) {
    console.error(e);
}

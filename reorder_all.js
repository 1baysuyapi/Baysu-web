const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');
    const splitStr = '<div class="product-card"';
    let parts = html.split(splitStr);
    
    let header = parts[0];
    let footer = "";
    let lastPart = parts[parts.length - 1];
    
    let footerIndex = lastPart.lastIndexOf('</div>\n    </div>\n</section>');
    if(footerIndex !== -1) {
        footer = lastPart.substring(footerIndex);
        parts[parts.length - 1] = lastPart.substring(0, footerIndex);
    } else {
        footerIndex = lastPart.lastIndexOf('</section>');
        let containerEnd = lastPart.lastIndexOf('</div>', footerIndex - 1);
        let gridEnd = lastPart.lastIndexOf('</div>', containerEnd - 1);
        footer = lastPart.substring(gridEnd);
        parts[parts.length - 1] = lastPart.substring(0, gridEnd);
    }

    let cards = [];
    for (let i = 1; i < parts.length; i++) {
        const blockContent = parts[i];
        const nameMatch = blockContent.match(/<h3[^>]*>([^<]+)<\/h3>/i);
        let name = nameMatch ? nameMatch[1].trim() : "Unknown";
        const codeMatch = blockContent.match(/<span class="badge">([^<]+)<\/span>/i);
        let code = codeMatch ? codeMatch[1].trim() : "";
        cards.push({ name, code, html: splitStr + blockContent });
    }

    // Sequence definitions
    const seq = [
        "194", "199", "172", "173", // User's latest items
        // Image 1
        "348", "349", "355", "356",
        // Image 2
        "178", "179", "188", "430", "174", "175", "176", "177",
        // Image 3
        "357", "358", "359", "360",
        // Image 4
        "148", "149", "439", "153", "154", "155", "312", "313", "535", "186", "187", "181",
        // Image 5
        "190", "195", "240", "196", "316", "317", "335", "336", "182", "185", "189", "191",
        // The Vantuz items from their other 5-image sequence
        "340", "341", "443", "444", "445", "158", "159", "160", "163", "150", "151", "152", "167", "168", "169", "164", "165", "166", "233", "147", "395", "396", "397"
    ];

    let sortedCards = [];
    let unmatchedCards = [];

    // Separate seq items from non-seq items
    let pool = [...cards];
    let seqCards = {};
    
    // First pass: extract all items that belong to the sequence
    for (let i = pool.length - 1; i >= 0; i--) {
        let c = pool[i];
        if (c.code && seq.includes(c.code)) {
            seqCards[c.code] = c;
            pool.splice(i, 1);
        }
    }

    // Identify anchor point (Krom 6 Nozul Tabanca, code 180 or name)
    let anchorIndex = -1;
    for (let i = 0; i < pool.length; i++) {
        if (pool[i].name.toLowerCase().includes('krom 6 nozul tabanca')) {
            anchorIndex = i;
            break;
        }
    }

    // Now insert the sequence!
    let finalOrder = [];
    if (anchorIndex !== -1) {
        finalOrder.push(...pool.slice(0, anchorIndex + 1));
    } else {
        // Fallback: just put them after 1" Ayarlı Hortum Lansı
        let idx = pool.findIndex(c => c.name.includes('1" Ayarl'));
        if (idx !== -1) {
            finalOrder.push(...pool.slice(0, idx + 1));
            pool.splice(0, idx + 1);
        }
    }

    // Append sequenced items in order
    for (let code of seq) {
        if (seqCards[code]) {
            finalOrder.push(seqCards[code]);
        }
    }

    // Append the rest of the items
    if (anchorIndex !== -1) {
        finalOrder.push(...pool.slice(anchorIndex + 1));
    } else {
        finalOrder.push(...pool);
    }

    let newHtml = header + finalOrder.map(c => c.html).join('') + footer;
    fs.writeFileSync('bahce_edit.html', newHtml);

    const dataCode = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(newHtml, 'utf8').toString('base64');
    const newDataCode = dataCode.replace(routeRegex, (match, p1, p2, p3) => p1 + newBase64 + p3);
    fs.writeFileSync('data.js', newDataCode);

    console.log("Successfully rebuilt catalog order!");
} catch (e) {
    console.error(e);
}

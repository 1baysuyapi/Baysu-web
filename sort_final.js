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
        
        cards.push({
            name: name,
            html: splitStr + blockContent
        });
    }

    // New sequence to enforce AFTER Fide Kazığı Plastik
    const newSequence = [
        "3/4\" Vantuz",
        "1\" Vantuz",
        "1/2\" Uzatma Borusu",
        "1/2\" PVC Maşon",
        "1/2\" PVC Nipel",
        "1/2\" Klima Çatalı",
        "1/2\" - 5/8\" Hortum Y",
        "Hortum Lansı 1/2\" - 5/8\"",
        "Hortum Lansı 3/4\" - 1\"",
        "PVC Klepe 1\"",
        "PVC Klepe 1 1/4\"",
        "PVC Klepe 1 1/2\"",
        "PVC Klepe 2\"",
        "PVC Klepe 2 1/2\"",
        "PVC Klepe 3\"",
        "PVC Klepe 4\"",
        "Bitki Destek Çubuğu 9mmx60cm",
        "Bitki Destek Çubuğu 9mmx75cm",
        "Bitki Destek Çubuğu 9mmx90cm",
        "Bitki Destek Çubuğu 9mmx120cm",
        "Bitki Destek Çubuğu 11mmx150cm",
        "Bitki Destek Çubuğu 11mmx180cm",
        "Bitki Destek Çubuğu 16mmx210cm",
        "Plastik Çim Ayırıcı - Yeşil",
        "Plastik Çim Ayırıcı - Siyah",
        "Plastik Çim Ayırıcı - Beyaz",
        "Plastik Çim Ayırıcı - Kahverengi"
    ];

    const normalizeString = (str) => {
        if (!str) return "";
        return str.toLowerCase().replace(/['"”’\-\s\/]/g, '').trim();
    };

    let topCards = [];
    let middleCards = [];
    let bottomCards = [];
    
    // First, let's identify the middle cards and extract them from the pool
    let pool = [...cards];
    
    for (let seqName of newSequence) {
        let nSeqName = normalizeString(seqName);
        let foundIndex = pool.findIndex(c => {
            let cName = normalizeString(c.name);
            return cName === nSeqName || cName.includes(nSeqName) || nSeqName.includes(cName);
        });
        
        if (foundIndex !== -1) {
            let card = pool.splice(foundIndex, 1)[0];
            
            // Special modification for Plastik Çim Ayırıcı
            if (nSeqName.includes('plastikimayrc') || nSeqName.includes('plastikçimayırıcı')) {
                let unitPrice = nSeqName.includes('beyaz') || nSeqName.includes('kahverengi') ? 100 : 95;
                let totalPrice = unitPrice * 25;
                
                // Replace price display and info rows
                card.html = card.html.replace(/<div class="price-display">.*?<\/div>/, 
                    `<div class="price-display">₺ ${totalPrice.toFixed(2)} <span style="font-size: 14px; color: #64748b; font-weight: normal;">(Paket)</span></div>`);
                
                card.html = card.html.replace(/<div class="info-row"><span>Koli Adedi:<\/span>.*?<\/div>/, 
                    `<div class="info-row"><span>Fiyat / 1 mt:</span> <strong>₺ ${unitPrice.toFixed(2)}</strong></div>`);
                
                card.html = card.html.replace(/<div class="info-row"><span>Ambalaj:<\/span>.*?<\/div>/, 
                    `<div class="info-row"><span>Ambalaj:</span> <strong>25 mt.</strong></div>`);
            }
            
            middleCards.push(card);
        }
    }

    // Now, split the remaining pool into topCards (up to Fide Kazığı Plastik) and bottomCards
    let foundAnchor = false;
    for (let c of pool) {
        if (!foundAnchor) {
            topCards.push(c);
            let cName = normalizeString(c.name);
            if (cName.includes('fidekazplastik') || cName.includes('fidekazığıplastik')) {
                foundAnchor = true;
            }
        } else {
            bottomCards.push(c);
        }
    }

    let finalOrderedCards = [...topCards, ...middleCards, ...bottomCards];

    let newHtml = header + finalOrderedCards.map(c => c.html).join('') + footer;
    fs.writeFileSync('bahce_edit.html', newHtml);

    const dataCode = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(newHtml, 'utf8').toString('base64');
    const newDataCode = dataCode.replace(routeRegex, (match, p1, p2, p3) => p1 + newBase64 + p3);
    fs.writeFileSync('data.js', newDataCode);

    console.log("Restructured trailing order successfully.");
} catch (e) {
    console.error(e);
}

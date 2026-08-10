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

    let seenCodes = new Set();
    let seenNames = new Set();
    let finalCards = [];

    const normalizeString = (str) => {
        if (!str) return "";
        return str.toLowerCase().replace(/['"”’\-\s\/]/g, '').trim();
    };

    for (let i = 1; i < parts.length; i++) {
        const blockContent = parts[i];
        const nameMatch = blockContent.match(/<h3[^>]*>([^<]+)<\/h3>/i);
        let name = nameMatch ? nameMatch[1].trim() : "Unknown";
        let codeMatch = blockContent.match(/<span class="badge">([^<]+)<\/span>/i);
        let code = codeMatch ? codeMatch[1].trim() : "";
        
        let nName = normalizeString(name);
        
        // Let's treat some very similar names as identical for deduplication
        // if they are clearly duplicates.
        if (code && seenCodes.has(code)) {
            console.log(`Removing duplicate by code (${code}): ${name}`);
            continue;
        }
        if (seenNames.has(nName)) {
            console.log(`Removing duplicate by name: ${name}`);
            continue;
        }

        if (code) seenCodes.add(code);
        seenNames.add(nName);
        
        finalCards.push(splitStr + blockContent);
    }

    let newHtml = header + finalCards.join('') + footer;
    fs.writeFileSync('bahce_edit.html', newHtml);

    const dataCode = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(newHtml, 'utf8').toString('base64');
    const newDataCode = dataCode.replace(routeRegex, (match, p1, p2, p3) => p1 + newBase64 + p3);
    fs.writeFileSync('data.js', newDataCode);

    console.log(`Cleaned up duplicates. Total unique products: ${finalCards.length}`);
} catch (e) {
    console.error(e);
}

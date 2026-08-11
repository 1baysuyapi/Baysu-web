const fs = require('fs');

const d = fs.readFileSync('data.js', 'utf8');

const regex = /"([^"]+\.html)"\s*:\s*"([^"]+)"/g;
let match;
const pages = {};
let foundCount = 0;

while ((match = regex.exec(d)) !== null) {
    const key = match[1];
    let html = Buffer.from(match[2], 'base64').toString('utf8');
    
    if (html.includes("alert(q + ' adet sepete eklendi!');")) {
        html = html.replace(/alert\(q \+ ' adet sepete eklendi!'\);/g, "if(window.baysuAnimateCartBtn) window.baysuAnimateCartBtn(this);");
        pages[key] = Buffer.from(html, 'utf8').toString('base64');
        foundCount++;
    } else {
        pages[key] = match[2];
    }
}

// Rebuild data.js
let newD = d;
for (const [key, base64] of Object.entries(pages)) {
    const originalRegex = new RegExp(`"${key}"\\s*:\\s*"[^"]+"`);
    newD = newD.replace(originalRegex, `"${key}":"${base64}"`);
}

fs.writeFileSync('data.js', newD);
console.log(`Replaced alert() with animation in ${foundCount} HTML fragments.`);

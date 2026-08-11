const fs = require('fs');
let d = fs.readFileSync('data.js', 'utf8');

const regex = /"([A-Za-z0-9_.-]+\.html)"\s*:\s*"([^"]+)"/g;
let match;
const replacements = [];

while ((match = regex.exec(d)) !== null) {
    const key = match[1];
    const b64 = match[2];
    let html = Buffer.from(b64, 'base64').toString('utf8');
    
    // Check if it has the bug
    if (html.includes("' + p.img + '")) {
        // Find the main product image
        const imgMatch = html.match(/<img src="([^"]+)" alt="[^"]*" class="product-main-image">/);
        let mainImg = '';
        if (imgMatch) {
            mainImg = imgMatch[1];
        } else {
            // fallback if no main image
            mainImg = 'WhatsApp Image 2025-07-25 at 23.57.21 (1)-Photoroom.png'; 
        }
        
        // Replace the broken src
        html = html.replace(/' \+ p\.img \+ '/g, mainImg);
        
        // Re-encode
        const newB64 = Buffer.from(html, 'utf8').toString('base64');
        replacements.push({ key: match[0], newKey: `"${key}":"${newB64}"` });
    }
}

console.log(`Found ${replacements.length} pages with broken p.img`);

replacements.forEach(r => {
    d = d.replace(r.key, r.newKey);
});

fs.writeFileSync('data.js', d);

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/data\.js\?v=\d+/, 'data.js?v=' + Date.now());
fs.writeFileSync('index.html', indexHtml);

console.log('Fixed broken images in data.js');

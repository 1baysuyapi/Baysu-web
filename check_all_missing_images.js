const fs = require('fs');

const d = fs.readFileSync('data.js', 'utf8');

const regex = /"([A-Za-z0-9_.-]+\.html)"\s*:\s*"([^"]+)"/g;
let match;
const missingImages = new Set();
const foundImages = new Set();

while ((match = regex.exec(d)) !== null) {
    const html = Buffer.from(match[2], 'base64').toString('utf8');
    
    // find ALL img src
    const imgRegex = /<img[^>]+src="([^"]+)"/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
        let imgSrc = imgMatch[1];
        // skip logo
        if (imgSrc.includes('WhatsApp Image')) continue;
        // if it starts with resimler/ or something, check if it exists
        if (!fs.existsSync(imgSrc)) {
            missingImages.add(imgSrc);
        } else {
            foundImages.add(imgSrc);
        }
    }
}

console.log('Missing images:');
missingImages.forEach(i => console.log(i));
console.log('Total found:', foundImages.size);
console.log('Total missing:', missingImages.size);

const fs = require('fs');

const d = fs.readFileSync('data.js', 'utf8');

// The keys in data.js for Kaplin are like "mavi-disi-kaplin.html": "..."
const regex = /"([a-z0-9-]+\.html)"\s*:\s*"([^"]+)"/g;
let match;
const missingImages = new Set();
const foundImages = new Set();

while ((match = regex.exec(d)) !== null) {
    const html = Buffer.from(match[2], 'base64').toString('utf8');
    // find the product main image
    const imgMatch = html.match(/<img src="([^"]+)" alt="[^"]+" class="product-main-image">/);
    if (imgMatch) {
        const imgSrc = imgMatch[1];
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

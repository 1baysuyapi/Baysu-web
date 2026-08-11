const fs = require('fs');

const d = fs.readFileSync('data.js', 'utf8');

const regex = /"([^"]+\.html)"\s*:\s*"([^"]+)"/g;
let match;

while ((match = regex.exec(d)) !== null) {
    const key = match[1];
    const html = Buffer.from(match[2], 'base64').toString('utf8');
    
    if (html.includes('batara.jpg') || html.includes('filtreler.jpg') || html.includes('depo-rekoru.jpg')) {
        console.log(`Found missing images in page: ${key}`);
    }
}

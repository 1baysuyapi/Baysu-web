const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
const regex = /"(\/[^"]+)":\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(code)) !== null) {
    const key = match[1];
    const b64 = match[2];
    const html = Buffer.from(b64, 'base64').toString('utf8');
    if (html.toLowerCase().includes('jumbo')) {
        console.log('Found in', key);
    }
}

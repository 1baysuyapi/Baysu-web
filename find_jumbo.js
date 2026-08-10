const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
const regex = /"(\/[^"]+)":\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(code)) !== null) {
    const key = match[1];
    const b64 = match[2];
    const html = Buffer.from(b64, 'base64').toString('utf8');
    
    // Find index of 'jumbo' case insensitive
    const lowerHtml = html.toLowerCase();
    const index = lowerHtml.indexOf('jumbo');
    if (index !== -1) {
        console.log('Found in route:', key);
        // Print 200 characters before and after
        console.log(html.substring(index - 200, index + 200));
    }
}

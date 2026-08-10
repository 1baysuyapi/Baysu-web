const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
const regex = /"(\/[^"]+)":\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(code)) !== null) {
    const html = Buffer.from(match[2], 'base64').toString('utf8');
    if (html.includes('product-features-box')) {
        console.log('product-features-box found in:', match[1]);
        const index = html.indexOf('product-features-box');
        console.log(html.substring(index - 300, index + 300));
        break;
    }
}

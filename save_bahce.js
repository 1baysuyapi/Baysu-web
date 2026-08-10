const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
const regex = /"(\/[^"]+)":\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(code)) !== null) {
    if (match[1] === '/bahce-ekipmanlari') {
        const html = Buffer.from(match[2], 'base64').toString('utf8');
        fs.writeFileSync('bahce.html', html);
        console.log('Saved bahce.html');
    }
}

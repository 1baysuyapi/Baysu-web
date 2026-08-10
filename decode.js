const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
const match = code.match(/"\/bahce-ekipmanlari":\s*"([^"]+)"/);
if (match) {
    fs.writeFileSync('temp.html', Buffer.from(match[1], 'base64').toString('utf8'));
}

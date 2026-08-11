const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');
const regex = /"bahce-ekipmanlari\.html"\s*:\s*"([^"]+)"/;
const m = regex.exec(d);
if (m) {
    const html = Buffer.from(m[1], 'base64').toString('utf8');
    console.log(html.substring(0, 1500));
}

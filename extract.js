const fs = require('fs');
const data = fs.readFileSync('data.js', 'utf8');
const match = data.match(/"mavi-erkek-kaplin\.html"\s*:\s*"([^"]+)"/);
if (match) {
    const html = Buffer.from(unescape(match[1]), 'base64').toString('utf8');
    fs.writeFileSync('mavi_decoded.html', html);
    console.log('Decoded');
} else {
    console.log('Not found');
}

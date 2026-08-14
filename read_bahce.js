const fs = require('fs');
const lines = fs.readFileSync('data.js', 'utf8').split('\n');
const line = lines.find(l => l.includes('bahceEkipmanlariHTML ='));
if(line) {
    const b64 = line.split('"')[1];
    let html = Buffer.from(b64, 'base64').toString('utf8');
    console.log(html.slice(0, 1000));
}

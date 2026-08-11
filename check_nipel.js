const fs = require('fs');

const d = fs.readFileSync('data.js', 'utf8');

const regex = /"disli-disi-nipel\.html"\s*:\s*"([^"]+)"/;
const m = regex.exec(d);
if (m) {
    const html = Buffer.from(m[1], 'base64').toString('utf8');
    const imgMatches = html.match(/<img[^>]+>/g);
    console.log('Images for disli-disi-nipel.html:');
    if (imgMatches) {
        imgMatches.forEach(i => console.log(i));
    }
}

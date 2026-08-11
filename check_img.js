const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');

const regex1 = /"mavi-disi-kaplin\.html"\s*:\s*"([^"]+)"/;
const match1 = regex1.exec(d);
if (match1) {
    const html = Buffer.from(match1[1], 'base64').toString('utf8');
    console.log('mavi-disi-kaplin image:', html.match(/<img[^>]+>/)[0]);
}

const regex2 = /"priz-kolye\.html"\s*:\s*"([^"]+)"/;
const match2 = regex2.exec(d);
if (match2) {
    const html = Buffer.from(match2[1], 'base64').toString('utf8');
    console.log('priz-kolye image:', html.match(/<img[^>]+>/)[0]);
}

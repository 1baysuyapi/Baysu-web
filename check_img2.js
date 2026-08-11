const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');

const regex1 = /"mavi-disi-kaplin\.html"\s*:\s*"([^"]+)"/;
const match1 = regex1.exec(d);
if (match1) {
    const html = Buffer.from(match1[1], 'base64').toString('utf8');
    const imgMatches = html.match(/<img[^>]+>/g);
    console.log('mavi-disi-kaplin images:');
    imgMatches.forEach(i => console.log(i));
}

const regex2 = /"priz-kolye\.html"\s*:\s*"([^"]+)"/;
const match2 = regex2.exec(d);
if (match2) {
    const html = Buffer.from(match2[1], 'base64').toString('utf8');
    const imgMatches = html.match(/<img[^>]+>/g);
    console.log('priz-kolye images:');
    imgMatches.forEach(i => console.log(i));
}

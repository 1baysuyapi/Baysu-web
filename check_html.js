const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');

const regex2 = /"priz-kolye\.html"\s*:\s*"([^"]+)"/;
const match2 = regex2.exec(d);
if (match2) {
    const html = Buffer.from(match2[1], 'base64').toString('utf8');
    const tbodyStart = html.indexOf('<tbody>');
    console.log(html.substring(tbodyStart, tbodyStart + 500));
}

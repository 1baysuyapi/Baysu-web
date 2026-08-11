const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');
const regex = /"priz-kolye\.html"\s*:\s*"([^"]+)"/;
const m = regex.exec(d);
if (m) {
    const html = Buffer.from(m[1], 'base64').toString('utf8');
    const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/);
    if(tableMatch) {
        console.log(tableMatch[1].substring(0, 1500));
    }
}

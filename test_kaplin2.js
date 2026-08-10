const fs = require('fs');
const txt = fs.readFileSync('data.js', 'utf8');
const match = txt.match(/"mavi-disi-kaplin.html"\s*:\s*"([^"]+)"/);
if (match) {
    const html = Buffer.from(match[1], 'base64').toString('utf8');
    fs.writeFileSync('kaplin_full.html', html);
    console.log("Wrote full HTML to kaplin_full.html");
}

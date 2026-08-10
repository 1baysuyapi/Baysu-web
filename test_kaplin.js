const fs = require('fs');
const txt = fs.readFileSync('data.js', 'utf8');
const match = txt.match(/"mavi-disi-kaplin.html"\s*:\s*"([^"]+)"/);
if (match) {
    const html = Buffer.from(match[1], 'base64').toString('utf8');
    console.log("Found kaplin HTML length:", html.length);
    console.log(html.substring(0, 500));
} else {
    console.log("Not found in data.js");
}

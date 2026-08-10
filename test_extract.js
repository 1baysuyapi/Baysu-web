const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');
const match = /"cift-tarafli-depo-rekoru\.html"\s*:\s*"([^"]+)"/.exec(d);
if (match) {
    const html = Buffer.from(match[1], 'base64').toString('utf8');
    fs.writeFileSync('test_output.html', html);
    console.log('Saved to test_output.html');
}

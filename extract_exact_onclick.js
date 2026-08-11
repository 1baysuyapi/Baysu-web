const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');
const regex = /"ayarli-hortum-eki\.html"\s*:\s*"([^"]+)"/;
const m = regex.exec(d);
if (m) {
    const html = Buffer.from(m[1], 'base64').toString('utf8');
    const btnMatch = html.match(/onclick="([^"]*window\.addToCart[^"]*)"/);
    if(btnMatch) {
        console.log(btnMatch[1]);
    }
}

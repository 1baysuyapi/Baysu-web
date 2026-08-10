const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');
const regex = /"mavi-disi-kaplin\.html"\s*:\s*"([A-Za-z0-9+/=]+)"/;
const match = regex.exec(d);
if (match) {
    fs.writeFileSync('kaplin_sample.html', Buffer.from(match[1], 'base64').toString('utf8'));
    console.log('Sample extracted.');
} else {
    console.log('Not found.');
}

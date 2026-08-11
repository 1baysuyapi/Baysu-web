const fs = require('fs');

const d = fs.readFileSync('data.js', 'utf8');

const regex = /"([^"]+\.html)"\s*:\s*"([^"]+)"/g;
let match;
const stillBroken = [];

while ((match = regex.exec(d)) !== null) {
    const key = match[1];
    const html = Buffer.from(match[2], 'base64').toString('utf8');
    
    if (html.includes("' + p.img + '")) {
        stillBroken.push(key);
    }
}

console.log('Still broken pages:', stillBroken);

const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');
const regex = /"(\/[^"]+)"\s*:\s*"/g;
let count = 0;
let match;
while ((match = regex.exec(d)) !== null) {
    count++;
    console.log(match[1]);
}
console.log('Total:', count);

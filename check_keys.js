const fs = require('fs');
const d = fs.readFileSync('data_original.js', 'utf8');
const regex = /['"](\/[^'"]+)['"]\s*:\s*['"]([A-Za-z0-9+/=]+)['"]/g;
let count = 0;
let match;
while ((match = regex.exec(d)) !== null) {
    count++;
}
console.log('Total valid routes found in data_original.js:', count);

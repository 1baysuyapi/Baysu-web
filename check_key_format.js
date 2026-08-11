const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');

const regex1 = /"(\/[^"]+)"\s*:/g;
let count1 = 0;
while (regex1.exec(d) !== null) count1++;

const regex2 = /"([^"\/]+\.html)"\s*:/g;
let count2 = 0;
while (regex2.exec(d) !== null) count2++;

console.log('Keys starting with /:', count1);
console.log('Keys ending with .html (no slash):', count2);

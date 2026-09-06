const fs = require('fs');
const dataJs = fs.readFileSync('data.js', 'utf8');

const regex = /"([^"]+)":"PC/g;
let match;
const keys = [];
while ((match = regex.exec(dataJs)) !== null) {
  keys.push(match[1]);
}

console.log('Keys count:', keys.length);
console.log('Keys containing kaplin:', keys.filter(k => k.includes('kaplin')));

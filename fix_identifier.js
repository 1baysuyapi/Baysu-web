const fs = require('fs');
let c = fs.readFileSync('cart.js', 'utf8');

const oldLine = 'var identifier = item.code ? item.code : item.size;';
const newLine = 'var identifier = (item.code && item.code !== "-" && item.code.trim() !== "") ? item.code : item.size;';

c = c.replace(oldLine, newLine);

fs.writeFileSync('cart.js', c);
console.log('Fixed identifier logic in cart.js');

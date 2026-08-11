const fs = require('fs');
let c = fs.readFileSync('cart.js', 'utf8');

// 1. Revert the earlier adapter change for productName
c = c.replace(/productName = match\[1\]\.trim\(\) \+ \(match\[2\]\.trim\(\) \? ' \(' \+ match\[2\]\.trim\(\) \+ '\)' : ''\);/, "productName = match[1].trim();");

// 2. Fix the WhatsApp exporter to append size if it exists and is different from code
const oldTextLine = 'text += String(identifier) + " | " + String(item.productName) + " | " + String(item.quantity) + " ADET | " + String(itemTotal.toFixed(2)) + " TL\\n";';
const newTextLine = `var finalName = item.productName + (item.size && item.size !== item.code ? ' (' + item.size + ')' : '');\n            text += String(identifier) + " | " + String(finalName) + " | " + String(item.quantity) + " ADET | " + String(itemTotal.toFixed(2)) + " TL\\n";`;

c = c.replace(oldTextLine, newTextLine);

fs.writeFileSync('cart.js', c);
console.log('Fixed WhatsApp exporter');

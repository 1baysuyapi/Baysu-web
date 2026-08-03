const fs = require('fs');
let content = fs.readFileSync('cart.js', 'utf-8');

// Fix double escaped newlines
content = content.replace(/\\\\n/g, '\\n');

// Replace the sendWhatsAppOrder string formatting
const oldForeach = `        cart.forEach(function(item, i) {
            var itemTotal = item.price * item.quantity;
            totalSum += itemTotal;
            if (item.code) {
                text += "*" + String(item.code) + "* | " + String(item.productName) + " | " + String(item.price.toFixed(2)) + " TL | " + String(item.quantity) + " Adet | " + String(itemTotal.toFixed(2)) + " TL\\n";
            } else {
                text += "*" + String(item.size) + "* | " + String(item.productName) + " | " + String(item.price.toFixed(2)) + " TL | " + String(item.quantity) + " Adet | " + String(itemTotal.toFixed(2)) + " TL\\n";
            }
        });`;

const newForeach = `        cart.forEach(function(item, i) {
            var itemTotal = item.price * item.quantity;
            totalSum += itemTotal;
            var identifier = item.code ? item.code : item.size;
            text += String(identifier) + " | " + String(item.productName) + " | " + String(item.quantity) + " ADET | " + String(itemTotal.toFixed(2)) + " TL\\n";
        });`;

content = content.replace(oldForeach, newForeach);

fs.writeFileSync('cart.js', content, 'utf-8');

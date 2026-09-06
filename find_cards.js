const fs = require('fs');
const h = fs.readFileSync('bahce-ekipmanlari.html','utf8');
// Find product card with code 189
const idx189 = h.indexOf('>189</span>');
if (idx189 > -1) {
    const cardStart = h.lastIndexOf('<div class="product-card', idx189);
    const nextCard = h.indexOf('<div class="product-card', idx189);
    console.log('=== CARD 189 ===');
    console.log(h.substring(cardStart, nextCard > -1 ? nextCard : cardStart + 1500));
}

// Find product card 111
const idx111 = h.indexOf('>111</span>');
if (idx111 > -1) {
    const cardStart = h.lastIndexOf('<div class="product-card', idx111);
    console.log('=== CARD 111 position ===', cardStart);
    console.log(h.substring(cardStart, cardStart + 300));
}

// Check if 190 exists
const idx190 = h.indexOf('>190</span>');
console.log('=== 190 exists? ===', idx190 > -1);

// Find card 112
const idx112 = h.indexOf('>112</span>');
console.log('=== 112 exists? ===', idx112 > -1);

// Find card 350
const idx350 = h.indexOf('>350</span>');
console.log('=== 350 exists? ===', idx350 > -1);

// Find card 351
const idx351 = h.indexOf('>351</span>');
console.log('=== 351 exists? ===', idx351 > -1);

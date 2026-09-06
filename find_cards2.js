const fs = require('fs');
const h = fs.readFileSync('bahce-ekipmanlari.html','utf8');

// Find card 111
const idx111 = h.indexOf('>111</span>');
if (idx111 > -1) {
    const cardStart = h.lastIndexOf('<div class="product-card', idx111);
    const nextCard = h.indexOf('<div class="product-card', idx111);
    console.log('=== CARD 111 ===');
    console.log(h.substring(cardStart, nextCard > -1 ? nextCard : cardStart + 800));
} else {
    console.log('111 NOT FOUND');
}

// Find card 350
const idx350 = h.indexOf('>350</span>');
if (idx350 > -1) {
    const cardStart = h.lastIndexOf('<div class="product-card', idx350);
    const nextCard = h.indexOf('<div class="product-card', idx350);
    console.log('=== CARD 350 ===');
    console.log(h.substring(cardStart, nextCard > -1 ? nextCard : cardStart + 800));
} else {
    console.log('350 NOT FOUND');
}

// Show what comes after card 189
const idx189end = h.indexOf('</div>', h.indexOf('>189</span>') + 500);
const after189 = h.indexOf('<div class="product-card', idx189end);
if (after189 > -1) {
    console.log('=== CARD AFTER 189 ===');
    console.log(h.substring(after189, after189 + 300));
}

// Search for 1/2 Lüks Rekor or Luks Rekor
const luxIdx = h.indexOf('Lüks');
const luxIdx2 = h.indexOf('lüks');
console.log('Lüks found at:', luxIdx, luxIdx2);
if (luxIdx > -1) console.log(h.substring(luxIdx - 100, luxIdx + 100));

const fs = require('fs');
let c = fs.readFileSync('cart.js', 'utf8');

const adapter = `
// Rekorlar ve Hortum Ek Parcalari Adapter
window.addToCart = function(rawName, price, code, boxQty) {
    if (window.BaysuCart && window.BaysuCart.addItem) {
        let productName = rawName;
        let ebat = '';
        const match = rawName.match(/^(.*?)\\s*\\((.*?)\\)\\s*-\\s*Kod:/);
        if (match) {
            productName = match[1].trim();
            ebat = match[2].trim();
        } else {
            const dashIndex = rawName.indexOf(' - Kod:');
            if (dashIndex !== -1) {
                productName = rawName.substring(0, dashIndex).trim();
            }
        }
        if (!ebat || ebat === '') {
            ebat = code; 
        }
        window.BaysuCart.addItem(productName, ebat, boxQty || '-', price, 1, code, 1, '-');
    }
};

window.baysuAnimateCartBtn = function(btn) {
    if (!btn) return;
    var originalText = btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML = '<i class="fas fa-check"></i> Eklendi!';
    setTimeout(function() {
        btn.classList.remove('added');
        btn.innerHTML = originalText;
    }, 800);
};
`;

if (!c.includes('window.addToCart = function(rawName')) {
    fs.writeFileSync('cart.js', c + '\n' + adapter);
    console.log('Adapter injected into cart.js');
} else {
    console.log('Adapter already exists');
}

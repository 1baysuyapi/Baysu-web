const fs = require('fs');

let js = fs.readFileSync('site-engine.js', 'utf8');

// 1. Fix touch-action on modal
const oldModalHtml = `class="baysu-cart-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999999; backdrop-filter: blur(5px); align-items: center; justify-content: center;"`;
const newModalHtml = `class="baysu-cart-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999999; backdrop-filter: blur(5px); align-items: center; justify-content: center; touch-action: manipulation;"`;

if (js.includes(oldModalHtml)) {
    js = js.replace(oldModalHtml, newModalHtml);
}

// Also add touch-action manipulation to the inner card for safety
const oldCardHtml = `background: #fff; width: 90%; max-width: 450px; border-radius: 20px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; max-height: 90vh; overflow-y: auto;`;
const newCardHtml = `background: #fff; width: 90%; max-width: 450px; border-radius: 20px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; max-height: 90vh; overflow-y: auto; touch-action: manipulation;`;
if (js.includes(oldCardHtml)) {
    js = js.replace(oldCardHtml, newCardHtml);
}


// 2. Fix add to cart logic
const oldAddToCart = `        window.qvAddToCart = function() {
            var qty = parseInt(document.getElementById('qvQty').value) || 1;
            var btn = window._qvCurrentBtn;
            if (btn) {
                var card = btn.closest('.product-card');
                if (card) {
                    var originalInput = card.querySelector('.qty-input');
                    if (originalInput) {
                        originalInput.value = qty;
                    }
                }
                if (window.baysuAnimateCartBtn) {
                    window.baysuAnimateCartBtn(btn);
                    closeQuickViewModal();
                }
            }
        };`;

const newAddToCart = `        window.qvAddToCart = function() {
            var qty = parseInt(document.getElementById('qvQty').value) || 1;
            var btn = window._qvCurrentBtn;
            if (btn) {
                var card = btn.closest('.product-card');
                if (card) {
                    var originalInput = card.querySelector('.qty-input');
                    if (originalInput) {
                        originalInput.value = qty;
                    }
                }
                
                // Gerçek sepete ekleme işlemini tetikle
                btn.click();
                
                // Modal'ı kapat
                closeQuickViewModal();
            }
        };`;

if (js.includes(oldAddToCart)) {
    js = js.replace(oldAddToCart, newAddToCart);
}

fs.writeFileSync('site-engine.js', js);
console.log("Updated site-engine.js with modal fixes!");

// Bump cache buster in index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('site-engine.js?v5=', 'site-engine.js?v6=');
fs.writeFileSync('index.html', html);
console.log("Cache buster updated in index.html");

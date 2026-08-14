const fs = require('fs');

let js = fs.readFileSync('site-engine.js', 'utf8');

const oldClickBlock = `            (function(card) {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.qty-btn') || e.target.closest('.qty-input') || e.target.closest('.btn-add-cart-custom')) return;
                    
                    e.preventDefault();
                    var btn = card.querySelector('.btn-add-cart-custom, .add-to-cart-btn');
                    if (btn) {
                        var code = btn.getAttribute('data-code');
                        var size = btn.getAttribute('data-size');
                        var name = btn.getAttribute('data-name');
                        var price = btn.getAttribute('data-price');
                        var img = btn.getAttribute('data-img') || (card.querySelector('img') ? card.querySelector('img').src : '');
                        
                        if (window.openQuickViewModal) {
                            window.openQuickViewModal(name, code, size, price, img, btn);
                        }
                    }
                });`;

const newClickBlock = `            (function(card) {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.qty-btn') || e.target.closest('.qty-input') || e.target.closest('.btn-add-cart-custom') || e.target.closest('.add-to-cart-btn')) return;
                    
                    e.preventDefault();
                    
                    // On Desktop, don't open the mobile modal
                    if (window.matchMedia("(hover: hover)").matches && window.innerWidth > 992) {
                        var wasActive = card.classList.contains('card-active');
                        var activeCards = document.querySelectorAll('.product-card.card-active');
                        for (var j = 0; j < activeCards.length; j++) {
                            activeCards[j].classList.remove('card-active');
                        }
                        if (!wasActive) card.classList.add('card-active');
                        return;
                    }
                    
                    var btn = card.querySelector('.btn-add-cart-custom, .add-to-cart-btn');
                    if (btn) {
                        var code = btn.getAttribute('data-code');
                        var size = btn.getAttribute('data-size');
                        var name = btn.getAttribute('data-name');
                        var price = btn.getAttribute('data-price');
                        var img = btn.getAttribute('data-img') || (card.querySelector('img') ? card.querySelector('img').src : '');
                        
                        if (window.openQuickViewModal) {
                            window.openQuickViewModal(name, code, size, price, img, btn);
                        }
                    }
                });`;

if (js.includes(oldClickBlock)) {
    js = js.replace(oldClickBlock, newClickBlock);
    fs.writeFileSync('site-engine.js', js);
    console.log("Successfully updated desktop click behavior!");
} else {
    console.log("Could not find the target block in site-engine.js");
}

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('site-engine.js?v4=', 'site-engine.js?v5=');
fs.writeFileSync('index.html', html);
console.log("Cache buster updated in index.html");

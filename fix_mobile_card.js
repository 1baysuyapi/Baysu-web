const fs = require('fs');
let code = fs.readFileSync('site-engine.js', 'utf8');

// Replace the setupProductCards function
const newSetupFunction = `
    window._baysuSetupProductCards = function() {
        var cards = document.querySelectorAll('.product-card');
        for (var i = 0; i < cards.length; i++) {
            if (cards[i]._hasCardListener) continue;
            cards[i]._hasCardListener = true;
            
            (function(card) {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.qty-btn') || e.target.closest('.qty-input') || e.target.closest('.btn-add-cart-custom')) return;
                    
                    var isActive = card.classList.contains('card-active');
                    
                    var allCards = document.querySelectorAll('.product-card.card-active');
                    for (var j = 0; j < allCards.length; j++) { allCards[j].classList.remove('card-active'); }
                    
                    if (!isActive) { 
                        card.classList.add('card-active'); 
                        if (window.history && window.history.pushState) {
                            window.history.pushState({cardOpen: true}, "");
                        }
                    }
                });
                card.addEventListener('mouseenter', function(e) {
                    if (window.matchMedia("(hover: hover)").matches) {
                        card.classList.add('card-active');
                    }
                });
                card.addEventListener('mouseleave', function(e) {
                    if (window.matchMedia("(hover: hover)").matches) {
                        card.classList.remove('card-active');
                    }
                });
            })(cards[i]);
        }
        
        // Add a document listener to close cards when clicking outside
        if (!window._baysuGlobalCardListener) {
            window._baysuGlobalCardListener = true;
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.product-card')) {
                    var activeCards = document.querySelectorAll('.product-card.card-active');
                    for (var j = 0; j < activeCards.length; j++) {
                        activeCards[j].classList.remove('card-active');
                    }
                }
            });
        }
    };
`;

code = code.replace(/window\._baysuSetupProductCards = function\(\) \{[\s\S]*?\}\;\s*window\.addEventListener\('popstate'/m, newSetupFunction.trim() + "\n    \n    window.addEventListener('popstate'");

fs.writeFileSync('site-engine.js', code);
console.log('Patched site-engine.js to fix card toggling logic.');

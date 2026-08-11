const fs = require('fs');

let js = fs.readFileSync('site-engine.js', 'utf8');

// Inject the Quick View Modal logic at the top or bottom of site-engine.js
const modalLogic = `
    // Inject Quick View Modal
    if (!document.getElementById('quickViewModal')) {
        var qvHtml = \`
        <div id="quickViewModal" class="baysu-cart-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999999; backdrop-filter: blur(5px); align-items: center; justify-content: center;">
            <div style="background: #fff; width: 90%; max-width: 450px; border-radius: 20px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; max-height: 90vh; overflow-y: auto;">
                <button onclick="closeQuickViewModal()" style="position: absolute; top: 15px; right: 15px; background: #F1F5F9; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748B; font-size: 18px; transition: all 0.2s;"><i class="fas fa-times"></i></button>
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <img id="qvImg" src="" style="max-width: 100%; height: 200px; object-fit: contain; border-radius: 12px; margin-bottom: 15px;" />
                    <h2 id="qvTitle" style="font-size: 1.3rem; color: #0b1727; margin: 0 0 10px 0; font-weight: 700;">Ürün Adı</h2>
                    <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px;">
                        <span style="background: #F8FAFC; padding: 5px 12px; border-radius: 8px; font-size: 0.9rem; color: #64748B; font-weight: 600;"><i class="fas fa-barcode"></i> <span id="qvCode">Kod</span></span>
                        <span style="background: #F8FAFC; padding: 5px 12px; border-radius: 8px; font-size: 0.9rem; color: #64748B; font-weight: 600;"><i class="fas fa-ruler"></i> <span id="qvSize">Ebat</span></span>
                    </div>
                    <div id="qvPrice" style="font-size: 2rem; color: #004797; font-weight: 800; margin-bottom: 20px;">0.00 TL</div>
                </div>

                <div style="background: #F8FAFC; padding: 20px; border-radius: 16px; border: 1px solid #E2E8F0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                        <span style="font-weight: 600; color: #334155;">Adet:</span>
                        <div style="display: flex; align-items: center; background: #fff; border: 1px solid #CBD5E1; border-radius: 10px; overflow: hidden; height: 45px;">
                            <button onclick="var inp=document.getElementById('qvQty'); if(inp.value>1)inp.value--;" style="background: #F1F5F9; border: none; width: 45px; height: 100%; font-size: 18px; font-weight: bold; color: #334155; cursor: pointer; transition: 0.2s;"><i class="fas fa-minus"></i></button>
                            <input type="number" id="qvQty" value="1" min="1" style="width: 60px; height: 100%; border: none; text-align: center; font-size: 18px; font-weight: 700; color: #0b1727; outline: none; -moz-appearance: textfield;">
                            <button onclick="document.getElementById('qvQty').value++;" style="background: #F1F5F9; border: none; width: 45px; height: 100%; font-size: 18px; font-weight: bold; color: #334155; cursor: pointer; transition: 0.2s;"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                    
                    <button id="qvAddToCartBtn" onclick="qvAddToCart()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;">
                        <i class="fas fa-shopping-cart"></i> Sepete Ekle
                    </button>
                </div>
            </div>
        </div>
        \`;
        document.body.insertAdjacentHTML('beforeend', qvHtml);
        
        window.openQuickViewModal = function(name, code, size, price, img, btnEl) {
            document.getElementById('qvTitle').innerText = name || '';
            document.getElementById('qvCode').innerText = (code && code !== '-') ? code : ((size && size !== '-') ? size : '-');
            document.getElementById('qvSize').innerText = (size && size !== '-') ? size : '-';
            document.getElementById('qvPrice').innerText = parseFloat(price || 0).toFixed(2) + ' TL';
            document.getElementById('qvImg').src = img || '';
            document.getElementById('qvQty').value = 1;
            
            // Sync with existing card input if available
            if (btnEl) {
                var card = btnEl.closest('.product-card');
                if (card) {
                    var originalInput = card.querySelector('.qty-input');
                    if (originalInput) {
                        document.getElementById('qvQty').value = originalInput.value || 1;
                    }
                }
            }
            
            window._qvCurrentBtn = btnEl;
            
            var modal = document.getElementById('quickViewModal');
            modal.style.display = 'flex';
            if (window.history && window.history.pushState) {
                window.history.pushState({qvOpen: true}, "");
            }
        };

        window.closeQuickViewModal = function() {
            var modal = document.getElementById('quickViewModal');
            if(modal) modal.style.display = 'none';
        };
        
        window.qvAddToCart = function() {
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
        };

        // Close on outside click
        document.getElementById('quickViewModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeQuickViewModal();
            }
        });
    }
`;

// Find where to inject it. We can put it in init()
const initMatch = js.match(/function init\(\) \{[\s\S]*?if \(\!document\.body\) \{[\s\S]*?return;\s*\}/);
if (initMatch) {
    js = js.replace(initMatch[0], initMatch[0] + '\n' + modalLogic);
    
    // Now replace the card click listener
    const oldListener = `
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
                });`;
    
    const newListener = `
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.qty-btn') || e.target.closest('.qty-input') || e.target.closest('.btn-add-cart-custom')) return;
                    
                    e.preventDefault();
                    var btn = card.querySelector('.btn-add-cart-custom');
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
    
    if (js.includes(oldListener)) {
        js = js.replace(oldListener, newListener);
        fs.writeFileSync('site-engine.js', js);
        console.log('Successfully injected Quick View Modal into site-engine.js');
    } else {
        console.log('Could not find old card click listener in site-engine.js');
    }
} else {
    console.log('Could not find init() in site-engine.js');
}

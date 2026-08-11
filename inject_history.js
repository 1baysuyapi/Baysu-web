const fs = require('fs');
let js = fs.readFileSync('cart.js', 'utf8');

// 1. Add "Geçmiş Siparişlerim" button in injectCartUI
const oldFooterStr = `<button class="clear-cart-btn" id="clearCartBtn">Sepeti Temizle</button>`;
const newFooterStr = `<button class="clear-cart-btn" id="clearCartBtn">Sepeti Temizle</button>\n                    <button class="history-order-btn" id="openHistoryBtn" style="background: #334155; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.9rem; margin-top: 10px; transition: 0.2s;"><i class="fas fa-history"></i> Geçmiş Siparişlerim</button>`;
if (js.includes(oldFooterStr)) {
    js = js.replace(oldFooterStr, newFooterStr);
}

// 2. Add openHistoryBtn click listener
const oldListenersStr = `document.getElementById('clearCartBtn').addEventListener('click', function() {
            if (confirm('Sepetinizdeki tüm ürünler silinecek. Onaylıyor musunuz?')) {
                saveCart([]);
            }
        });`;
const newListenersStr = `document.getElementById('clearCartBtn').addEventListener('click', function() {
            if (confirm('Sepetinizdeki tüm ürünler silinecek. Onaylıyor musunuz?')) {
                saveCart([]);
            }
        });
        document.getElementById('openHistoryBtn').addEventListener('click', openHistoryModal);`;
if (js.includes(oldListenersStr)) {
    js = js.replace(oldListenersStr, newListenersStr);
}

// 3. Update sendWhatsAppOrder to clear cart
const oldSendStr = `        saveArchivedOrder({
            id: 'ORD-' + Date.now(),
            date: timestamp,
            items: cart,
            totalSum: totalSum.toFixed(2)
        });

        window.open(whatsappUrl, '_blank');`;
const newSendStr = `        saveArchivedOrder({
            id: 'ORD-' + Date.now(),
            date: timestamp,
            items: cart,
            totalSum: totalSum.toFixed(2)
        });

        saveCart([]); // Clear cart after order is prepared
        closeCartDrawer();
        
        window.open(whatsappUrl, '_blank');`;
if (js.includes(oldSendStr)) {
    js = js.replace(oldSendStr, newSendStr);
}

// 4. Inject History Modal UI and Logic
const historyLogic = `
    // --- ORDER HISTORY MODAL ---
    function injectHistoryModal() {
        if (document.getElementById('historyModalOverlay')) return;
        var modalHtml = \`
            <div class="cart-drawer-overlay" id="historyModalOverlay" style="z-index: 10000000;"></div>
            <div class="cart-drawer" id="historyDrawer" style="z-index: 10000001; width: 450px; max-width: 90vw;">
                <div class="cart-header" style="background: #334155;">
                    <h3><i class="fas fa-history"></i> Geçmiş Siparişlerim</h3>
                    <button class="cart-close-btn" id="historyCloseBtn">&times;</button>
                </div>
                <div class="cart-body" id="historyBody" style="background: #F4F6F9; padding: 15px;">
                    <!-- History Items Go Here -->
                </div>
            </div>
        \`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        document.getElementById('historyCloseBtn').addEventListener('click', closeHistoryModal);
        document.getElementById('historyModalOverlay').addEventListener('click', closeHistoryModal);
    }
    
    function openHistoryModal() {
        injectHistoryModal();
        closeCartDrawer(); // Close cart drawer
        renderHistory();
        document.getElementById('historyModalOverlay').classList.add('active');
        document.getElementById('historyDrawer').classList.add('active');
    }
    
    function closeHistoryModal() {
        if(document.getElementById('historyModalOverlay')) {
            document.getElementById('historyModalOverlay').classList.remove('active');
            document.getElementById('historyDrawer').classList.remove('active');
        }
    }
    
    function renderHistory() {
        var body = document.getElementById('historyBody');
        var orders = getArchivedOrders();
        
        if (orders.length === 0) {
            body.innerHTML = '<div style="text-align:center; padding: 40px 20px; color: #64748B;"><i class="fas fa-box-open" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i><p>Henüz geçmiş siparişiniz bulunmuyor.</p></div>';
            return;
        }
        
        var html = '';
        orders.forEach(function(order, index) {
            html += \`
            <div style="background: #fff; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;">
                <div style="padding: 15px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #F8FAFC;" onclick="var el = document.getElementById('h-items-\${index}'); el.style.display = (el.style.display === 'none' ? 'block' : 'none');">
                    <div>
                        <div style="font-weight: 700; color: #0b1727; font-size: 0.95rem;">\${order.date}</div>
                        <div style="color: #64748B; font-size: 0.8rem; margin-top: 4px;">\${order.items.length} Çeşit Ürün</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 800; color: #1D4ED8;">\${order.totalSum} TL</div>
                        <div style="font-size: 0.8rem; color: #34d399; font-weight: 600;"><i class="fas fa-chevron-down"></i> Detay</div>
                    </div>
                </div>
                <div id="h-items-\${index}" style="display: none; padding: 10px;">
            \`;
            
            order.items.forEach(function(item) {
                var img = item.img || 'https://via.placeholder.com/50';
                html += \`
                    <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #F1F5F9;">
                        <img src="\${img}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 8px; border: 1px solid #E2E8F0; margin-right: 12px;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #334155; font-size: 0.85rem; line-height: 1.3;">\${item.productName}</div>
                            <div style="font-size: 0.75rem; color: #64748B; margin-top: 4px;">\${item.quantity} Adet • \${item.price} TL</div>
                        </div>
                    </div>
                \`;
            });
            
            html += \`
                </div>
            </div>
            \`;
        });
        
        body.innerHTML = html;
    }
    
    // Add logic at the end of file
`;

if (!js.includes('injectHistoryModal')) {
    js += '\n' + historyLogic;
}

fs.writeFileSync('cart.js', js);
console.log('Successfully injected Order History logic into cart.js');

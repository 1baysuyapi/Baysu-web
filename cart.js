function parsePrice(str) {
    if (!str) return 0;
    var cleaned = str.toString().replace(/[^0-9.,]/g, '');
    if (cleaned.indexOf('.') > -1 && cleaned.indexOf(',') > -1) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (cleaned.indexOf(',') > -1) {
        cleaned = cleaned.replace(',', '.');
    }
    return parseFloat(cleaned) || 0;
}
/* =========================================================
   BAYSU YAPI - CİHAZA ÖZEL SEPET VE WHATSAPP SİPARİŞ JS (cart.js)
   ========================================================= */

(function () {
    var ACTIVE_STORAGE_KEY = 'baysu_user_cart';
    var ARCHIVE_LIST_KEY = 'baysu_archived_orders_list';
    var OLD_SINGLE_ARCHIVE_KEY = 'baysu_archived_order';

    // Cihaza özel aktif sepeti getir
    function getCart() {
        try {
            var data = localStorage.getItem(ACTIVE_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('LocalStorage okuma hatası:', e);
            return [];
        }
    }

    // Sepeti kaydet
    function saveCart(cart) {
        try {
            localStorage.setItem(ACTIVE_STORAGE_KEY, JSON.stringify(cart));
            updateCartUI();
        } catch (e) {
            console.error('LocalStorage yazma hatası:', e);
        }
    }

    // Tüm arşivlenmiş geçmiş siparişleri getir
    function getArchivedOrders() {
        try {
            var listData = localStorage.getItem(ARCHIVE_LIST_KEY);
            var list = listData ? JSON.parse(listData) : [];
            
            var oldData = localStorage.getItem(OLD_SINGLE_ARCHIVE_KEY);
            if (oldData) {
                try {
                    var parsedOld = JSON.parse(oldData);
                    if (parsedOld && parsedOld.items) {
                        list.unshift(parsedOld);
                    }
                } catch (err) {}
                localStorage.removeItem(OLD_SINGLE_ARCHIVE_KEY);
                localStorage.setItem(ARCHIVE_LIST_KEY, JSON.stringify(list));
            }

            return list;
        } catch (e) {
            console.error('Arşiv okuma hatası:', e);
            return [];
        }
    }

    // Yeni siparişi geçmiş siparişler arşivine ekle
    function saveArchivedOrder(orderData) {
        try {
            var list = getArchivedOrders();
            list.unshift(orderData);
            if (list.length > 50) list = list.slice(0, 50);
            localStorage.setItem(ARCHIVE_LIST_KEY, JSON.stringify(list));
        } catch (e) {
            console.error('Arşiv kaydetme hatası:', e);
        }
    }

    function getFormattedTimestamp() {
        var now = new Date();
        var months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        var day = String(now.getDate()).padStart(2, '0');
        var month = months[now.getMonth()];
        var year = now.getFullYear();
        var hours = String(now.getHours()).padStart(2, '0');
        var minutes = String(now.getMinutes()).padStart(2, '0');

        return String(day) + " " + String(month) + " " + String(year) + " - " + String(hours) + ":" + String(minutes);
    }

    function sanitizeAttr(str) {
        if (!str) return '';
        return String(str)
            .replace(/data-box=.*/gi, '')
            .replace(/[”"]+$/g, '')
            .trim();
    }

    function injectCartUI() {
        if (document.getElementById('cartDrawerOverlay')) return;

        var triggerHtml = "\n" +
"            <div class=\"floating-cart-trigger\" id=\"floatingCartBtn\" title=\"Sepetimi Görüntüle\">\n" +
"                <i class=\"fas fa-shopping-basket\" style=\"font-size: 18px;\"></i>\n" +
"                <span style=\"font-weight: 600;\">Sepetim</span>\n" +
"                <span class=\"cart-count-badge\" id=\"cartBadge\">0</span>\n" +
"            </div>\n" +
"        ";

        var drawerHtml = "\n" +
"            <div class=\"cart-drawer-overlay\" id=\"cartDrawerOverlay\"></div>\n" +
"            <div class=\"cart-drawer\" id=\"cartDrawer\">\n" +
"                <div class=\"cart-header\">\n" +
"                    <h3><i class=\"fas fa-shopping-cart\"></i> Sipariş Sepetim</h3>\n" +
"                    <button class=\"cart-close-btn\" id=\"cartCloseBtn\">&times;</button>\n" +
"                </div>\n" +
"                <div class=\"cart-timestamp-bar\">\n" +
"                    <i class=\"far fa-clock\"></i>\n" +
"                    <span>Tarih: <strong id=\"cartTimestamp\">" + String(getFormattedTimestamp()) + "</strong></span>\n" +
"                </div>\n" +
"                <div class=\"cart-body\" id=\"cartBody\">\n" +
"                    <!-- Dinamik Sepet İçeriği -->\n" +
"                </div>\n" +
"                <div class=\"cart-footer\">\n" +
"                    <div class=\"cart-total-row\" style=\"display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid #E2E8F0;\">\n" +
"                        <span style=\"font-weight: 600; color: #1E293B;\">Liste Fiyatı Toplamı:</span>\n" +
"                        <span class=\"cart-total-amount\" id=\"cartTotalAmount\" style=\"font-weight: 700; color: #1D4ED8; font-size: 1.15rem;\">0.00 ₺</span>\n" +
"                    </div>\n" +
"                    <div style=\"background: #EFF6FF; border: 1px dashed #3B82F6; border-radius: 8px; padding: 10px 12px; margin: 10px 0; font-size: 12px; color: #1E40AF; text-align: center; line-height: 1.4;\">\n" +
"                         <strong>Toptan İskonto Fırsatı:</strong> Bu tutar liste fiyatıdır. Sipariş miktarınıza göre <strong>yüksek iskonto</strong> düşülecektir!\n" +
"                    </div>\n" +
"                    <button class=\"whatsapp-order-btn\" id=\"sendWhatsAppOrderBtn\" style=\"background: #25D366; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);\">\n" +
"                        <i class=\"fab fa-whatsapp\" style=\"font-size: 22px;\"></i> İskontolu Fiyat Teklifi Al (WhatsApp)\n" +
"                    </button>\n" +
"                    <button class=\"clear-cart-btn\" id=\"clearCartBtn\">Sepeti Temizle</button>\n" +
"                </div>\n" +
"            </div>\n" +
"        ";

        document.body.insertAdjacentHTML('beforeend', triggerHtml);
        document.body.insertAdjacentHTML('beforeend', drawerHtml);

        document.getElementById('floatingCartBtn').addEventListener('click', openCartDrawer);
        document.getElementById('cartCloseBtn').addEventListener('click', closeCartDrawer);
        document.getElementById('cartDrawerOverlay').addEventListener('click', closeCartDrawer);
        document.getElementById('sendWhatsAppOrderBtn').addEventListener('click', sendWhatsAppOrder);
        document.getElementById('clearCartBtn').addEventListener('click', function() {
            if (confirm('Sepetinizdeki tüm ürünler silinecek. Onaylıyor musunuz?')) {
                saveCart([]);
            }
        });
    }

    function openCartDrawer() {
        document.getElementById('cartTimestamp').textContent = getFormattedTimestamp();
        document.getElementById('cartDrawerOverlay').classList.add('active');
        document.getElementById('cartDrawer').classList.add('active');
        document.body.classList.add('cart-drawer-open');
        renderCartItems();
    }

    function closeCartDrawer() {
        document.getElementById('cartDrawerOverlay').classList.remove('active');
        document.getElementById('cartDrawer').classList.remove('active');
        document.body.classList.remove('cart-drawer-open');
    }

    function updateCartUI() {
        var cart = getCart();
        var totalItems = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
        var badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = totalItems;
        }
        renderCartItems();
    }

    function renderCartItems() {
        var cartBody = document.getElementById('cartBody');
        var cartTotalAmount = document.getElementById('cartTotalAmount');
        if (!cartBody) return;

        var cart = getCart();
        var totalSum = 0;
        var html = '';

        if (cart.length === 0) {
            html += "\n" +
"                <div class=\"cart-empty-state\">\n" +
"                    <i class=\"fas fa-shopping-basket\"></i>\n" +
"                    <p style=\"font-weight: 600; color: #64748B;\">Aktif sepetiniz boş.</p>\n" +
"                    <p style=\"font-size: 13px;\">Ürün sayfalarından ölçü seçip \"Sepete Ekle\" butonuna basarak sipariş oluşturabilirsiniz.</p>\n" +
"                </div>\n" +
"            ";
        } else {
            html += cart.map(function(item, index) {
                var itemTotal = (item.price * item.quantity).toFixed(2);
                totalSum += parseFloat(itemTotal);
                var cleanSize = sanitizeAttr(item.size);

                var qtyMeta = '';
                if (item.paketQty && item.paketQty !== '-') {
                    qtyMeta += "Paket: <strong>" + String(item.paketQty) + "</strong> | ";
                }
                qtyMeta += "Koli: <strong>" + String(item.boxQty || '-') + "</strong>";

                return "\n" +
"                    <div class=\"cart-item\">\n" +
"                        <div class=\"cart-item-info\">\n" +
"                            <h4>" + String(sanitizeAttr(item.productName)) + "</h4>\n" +
"                            <div class=\"cart-item-meta\">Ebat: <strong>" + String(cleanSize) + "</strong> | " + String(qtyMeta) + "</div>\n" +
"                            <div class=\"cart-item-price\">" + String(item.quantity) + " Adet x " + String(item.price.toFixed(2)) + " TL = <strong>" + String(itemTotal) + " TL</strong></div>\n" +
"                        </div>\n" +
"                        <div class=\"cart-item-actions\">\n" +
"                            <div class=\"drawer-qty-selector\" style=\"display: inline-flex; align-items: center; background: #F1F5F9; border-radius: 8px; padding: 2px; border: 1px solid #CBD5E1;\">\n" +
"                                <button type=\"button\" class=\"drawer-qty-btn\" data-action=\"minus\" data-index=\"" + String(index) + "\" style=\"width: 28px; height: 28px; border: none; background: #fff; border-radius: 6px; font-weight: bold; cursor: pointer;\">-</button>\n" +
"                                <span style=\"padding: 0 8px; font-weight: 700; font-size: 13px;\">" + String(item.quantity) + "</span>\n" +
"                                <button type=\"button\" class=\"drawer-qty-btn\" data-action=\"plus\" data-index=\"" + String(index) + "\" style=\"width: 28px; height: 28px; border: none; background: #fff; border-radius: 6px; font-weight: bold; cursor: pointer;\">+</button>\n" +
"                            </div>\n" +
"                            <button type=\"button\" class=\"remove-cart-item\" onclick=\"window.baysuRemoveItem(" + String(index) + ")\" style=\"background: none; border: none; color: #EF4444; cursor: pointer; font-size: 16px; margin-left: 8px;\" title=\"Sil\">\n" +
"                                <i class=\"fas fa-trash\"></i>\n" +
"                            </button>\n" +
"                        </div>\n" +
"                    </div>\n" +
"                ";
            }).join('');
        }

        cartBody.innerHTML = html;

        if (cartTotalAmount) {
            cartTotalAmount.textContent = String(totalSum.toFixed(2)) + " ₺";
        }
    }

    function addItem(productName, size, boxQty, price, quantity, code, stepVal, paketQty) {
        var cart = getCart();
        var cleanName = sanitizeAttr(productName);
        var cleanSize = sanitizeAttr(size);
        var step = parseInt(stepVal) || 1;
        var min = step;
        var parsedQty = Math.max(min, parseInt(quantity) || min);

        var existingIndex = cart.findIndex(function(item) { return sanitizeAttr(item.productName) === cleanName && sanitizeAttr(item.size) === cleanSize; });

        if (existingIndex > -1) {
            cart[existingIndex].quantity += parsedQty;
            if (code) cart[existingIndex].code = code;
            cart[existingIndex].step = step;
            if (paketQty) cart[existingIndex].paketQty = paketQty;
        } else {
            cart.push({
                productName: cleanName,
                size: cleanSize,
                boxQty: boxQty || '-',
                paketQty: paketQty || '-',
                price: parseFloat(price) || 0,
                quantity: parsedQty,
                code: code || '',
                step: step,
                min: min
            });
        }

        saveCart(cart);
    }

    function changeQty(index, delta) {
        var cart = getCart();
        if (cart[index]) {
            var step = cart[index].step || 1;
            var min = cart[index].min || step;
            var newQty = cart[index].quantity + (delta * step);
            if (newQty < min) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = newQty;
            }
            saveCart(cart);
        }
    }

    window.baysuRemoveItem = function(index) {
        var cart = getCart();
        if (cart[index]) {
            cart.splice(index, 1);
            saveCart(cart);
        }
    };

    function sendWhatsAppOrder() {
        var cart = getCart();
        if (cart.length === 0) {
            alert('Aktif sepetiniz boş! Lütfen önce sipariş verilecek ürünleri ekleyin.');
            return;
        }

        var timestamp = getFormattedTimestamp();

        var text = "📋 *BAYRAKÇI SULAMA VE YAPI MALZEMELERİ*\n";
        text += "*İSKONTOLU FİYAT TEKLİFİ VE SİPARİŞ TALEBİ*\n";
        text += "--------------------------------------------------\n";
        text += "📅 *Tarih:* " + String(timestamp) + "\n";
        text += "--------------------------------------------------\n\n";
        text += "*ÜRÜN İSMİ | EBAT | LİSTE FİYATI | MİKTAR | TUTAR*\n";
        text += "--------------------------------------------------\n";

        var totalSum = 0;

        cart.forEach(function(item, i) {
            var itemTotal = item.price * item.quantity;
            totalSum += itemTotal;
            var identifier = (item.code && item.code !== "-" && item.code.trim() !== "") ? item.code : item.size;
            var finalName = item.productName + (item.size && item.size !== item.code ? ' (' + item.size + ')' : '');
            text += String(identifier) + " | " + String(finalName) + " | " + String(item.quantity) + " ADET | " + String(itemTotal.toFixed(2)) + " TL\n";
        });

        text += "--------------------------------------------------\n";
        text += "💰 *TOPLAM LİSTE TUTARI:* *" + String(totalSum.toFixed(2)) + " TL*\n";
        text += "--------------------------------------------------\n";
        text += "⚠️ *Not:* Yukarıdaki tutar liste fiyatıdır. Sipariş miktarımıza göre özel toptan iskonto teklifinizi rica ederiz.";

        var encodedText = encodeURIComponent(text);
        var whatsappUrl = "https://wa.me/905533973603?text=" + String(encodedText);

        saveArchivedOrder({
            id: 'ORD-' + Date.now(),
            date: timestamp,
            items: cart,
            totalSum: totalSum.toFixed(2)
        });

        window.open(whatsappUrl, '_blank');
    }

    document.addEventListener('DOMContentLoaded', function() {
        injectCartUI();
        updateCartUI();

        document.body.addEventListener('click', function(e) {
            if (e._handledByBaysuCart) return;

            var drawerBtn = e.target.closest('.drawer-qty-btn');
            if (drawerBtn) {
                e.preventDefault();
                e.stopPropagation();
                e._handledByBaysuCart = true;
                var idx = parseInt(drawerBtn.getAttribute('data-index'));
                var action = drawerBtn.getAttribute('data-action');
                if (!isNaN(idx)) {
                    changeQty(idx, action === 'plus' ? 1 : -1);
                }
                return;
            }


            var tableQtyBtn = e.target.closest('.qty-selector .qty-btn, .qty-stepper .qty-btn');
            if (tableQtyBtn) {
                // Skip if button already has inline onclick (prevent double increment)
                if (tableQtyBtn.hasAttribute('onclick')) return;
                e.preventDefault();
                e.stopPropagation();
                e._handledByBaysuCart = true;

                var selector = tableQtyBtn.closest('.qty-selector, .qty-stepper');
                var input = selector ? selector.querySelector('.qty-input') : null;
                if (input) {
                    var step = parseInt(input.getAttribute('step')) || 1;
                    var min = parseInt(input.getAttribute('min')) || step;
                    var currentVal = parseInt(input.value) || step;

                    if (tableQtyBtn.classList.contains('qty-plus') || tableQtyBtn.textContent.trim() === '+') {
                        input.value = currentVal + step;
                    } else if (tableQtyBtn.classList.contains('qty-minus') || tableQtyBtn.textContent.trim() === '-') {
                        if (currentVal - step >= min) {
                            input.value = currentVal - step;
                        } else {
                            input.value = min;
                        }
                    }
                }
                return;
            }

            var addBtn = e.target.closest('.add-to-cart-btn');
            if (addBtn) {
                e.preventDefault();
                e.stopPropagation();
                e._handledByBaysuCart = true;

                if (addBtn.disabled) return;
                addBtn.disabled = true;

                var productName = addBtn.getAttribute('data-product');
                var size = addBtn.getAttribute('data-size');
                var boxQty = addBtn.getAttribute('data-box');
                var paketQty = addBtn.getAttribute('data-paket');
                var price = addBtn.getAttribute('data-price');
                var code = addBtn.getAttribute('data-code');
                var container = addBtn.closest('tr') || addBtn.closest('.product-card');
                var qtyInput = container ? container.querySelector('.qty-input') : null;

                var stepAttr = qtyInput ? qtyInput.getAttribute('step') : null;
                var stepVal = parseInt(stepAttr) || 1;
                var quantity = qtyInput ? (parseInt(qtyInput.value) || stepVal) : stepVal;

                addItem(productName, size, boxQty, price, quantity, code, stepVal, paketQty);

                var originalText = addBtn.innerHTML;
                addBtn.classList.add('added');
                addBtn.innerHTML = "<i class=\"fas fa-check\"></i> Eklendi!";

                setTimeout(function() {
                    addBtn.classList.remove('added');
                    addBtn.innerHTML = originalText;
                    addBtn.disabled = false;
                }, 800);
                return;
            }
        });
    });

    try {
        if (window.top !== window.self) {
            window.top.location = window.self.location;
        }
    } catch (e) {}

    var targetLinks = document.querySelectorAll('a[target="_blank"]');
    for (var j = 0; j < targetLinks.length; j++) {
        targetLinks[j].setAttribute('rel', 'noopener noreferrer');
    }

    window.BaysuCart = {
        addItem: addItem,
        changeQty: changeQty,
        removeItem: window.baysuRemoveItem,
        sendWhatsAppOrder: sendWhatsAppOrder,
        getCart: getCart,
        getArchivedOrders: getArchivedOrders
    };
})();

// KVKK Modal Logic
window.openKvkkModal = function() {
    var modal = document.getElementById('kvkkModalBackdrop');
    if (modal) modal.classList.add('active');
};

// Image Product Add to Cart Logic
window.baysuAddToCartImageProduct = function(code, name, price, boxQty, packaging, quantity) {
    var qty = quantity || 1;
    if (window.BaysuCart && window.BaysuCart.addItem) {
        window.BaysuCart.addItem(name, packaging, boxQty, price, qty, code, 1, 1);
        // alert(name + " (" + qty + " adet) sepete eklendi!");
    }
};
window.closeKvkkModal = function() {
    var modal = document.getElementById('kvkkModalBackdrop');
    if (modal) modal.classList.remove('active');
};

// Toggle Product Features
window.toggleProductFeatures = function(btn) {
    var box = btn.nextElementSibling;
    if (box && box.classList.contains('product-features-box')) {
        var icon = btn.querySelector('.toggle-icon');
        if (box.style.display === 'none' || !box.style.display) {
            box.style.display = 'block';
            if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
            box.style.display = 'none';
            if (icon) icon.style.transform = 'rotate(0deg)';
        }
    }
};

// Quantity Stepper
window.incrementQty = function(btn) {
    var input = btn.previousElementSibling;
    if (input) {
        var step = parseInt(input.getAttribute('step')) || 1;
        input.value = parseInt(input.value || 0) + step;
    }
};
window.decrementQty = function(btn) {
    var input = btn.nextElementSibling;
    if (input) {
        var step = parseInt(input.getAttribute('step')) || 1;
        var min = parseInt(input.getAttribute('min')) || step;
        var current = parseInt(input.value || 0);
        if (current - step >= min) {
            input.value = current - step;
        } else {
            input.value = min;
        }
    }
};



// Rekorlar ve Hortum Ek Parcalari Adapter
window.addToCart = function(rawName, price, code, boxQty) {
    if (window.BaysuCart && window.BaysuCart.addItem) {
        let productName = rawName;
        let ebat = '';
        const match = rawName.match(/^(.*?)\s*\((.*?)\)\s*-\s*Kod:/);
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


    // --- ORDER HISTORY MODAL ---
    function injectHistoryModal() {
        if (document.getElementById('historyModalOverlay')) return;
        var modalHtml = `
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
        `;
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
            html += `
            <div style="background: #fff; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;">
                <div style="padding: 15px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #F8FAFC;" onclick="var el = document.getElementById('h-items-${index}'); el.style.display = (el.style.display === 'none' ? 'block' : 'none');">
                    <div>
                        <div style="font-weight: 700; color: #0b1727; font-size: 0.95rem;">${order.date}</div>
                        <div style="color: #64748B; font-size: 0.8rem; margin-top: 4px;">${order.items.length} Çeşit Ürün</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 800; color: #1D4ED8;">${order.totalSum} TL</div>
                        <div style="font-size: 0.8rem; color: #34d399; font-weight: 600;"><i class="fas fa-chevron-down"></i> Detay</div>
                    </div>
                </div>
                <div id="h-items-${index}" style="display: none; padding: 10px;">
            `;
            
            order.items.forEach(function(item) {
                var img = item.img || 'https://via.placeholder.com/50';
                html += `
                    <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #F1F5F9;">
                        <img src="${img}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 8px; border: 1px solid #E2E8F0; margin-right: 12px;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #334155; font-size: 0.85rem; line-height: 1.3;">${item.productName}</div>
                            <div style="font-size: 0.75rem; color: #64748B; margin-top: 4px;">${item.quantity} Adet • ${item.price} TL</div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                </div>
            </div>
            `;
        });
        
        body.innerHTML = html;
    }
    
    // Add logic at the end of file

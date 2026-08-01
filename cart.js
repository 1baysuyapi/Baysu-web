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

        return `${day} ${month} ${year} - ${hours}:${minutes}`;
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

        var triggerHtml = `
            <div class="floating-cart-trigger" id="floatingCartBtn" title="Sepetimi Görüntüle">
                <i class="fas fa-shopping-basket" style="font-size: 18px;"></i>
                <span style="font-weight: 600;">Sepetim</span>
                <span class="cart-count-badge" id="cartBadge">0</span>
            </div>
        `;

        var drawerHtml = `
            <div class="cart-drawer-overlay" id="cartDrawerOverlay"></div>
            <div class="cart-drawer" id="cartDrawer">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-cart"></i> Sipariş Sepetim</h3>
                    <button class="cart-close-btn" id="cartCloseBtn">&times;</button>
                </div>
                <div class="cart-timestamp-bar">
                    <i class="far fa-clock"></i>
                    <span>Tarih: <strong id="cartTimestamp">${getFormattedTimestamp()}</strong></span>
                </div>
                <div class="cart-body" id="cartBody">
                    <!-- Dinamik Sepet İçeriği -->
                </div>
                <div class="cart-footer">
                    <div class="cart-total-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid #E2E8F0;">
                        <span style="font-weight: 600; color: #1E293B;">Liste Fiyatı Toplamı:</span>
                        <span class="cart-total-amount" id="cartTotalAmount" style="font-weight: 700; color: #1D4ED8; font-size: 1.15rem;">0.00 ₺</span>
                    </div>
                    <div style="background: #EFF6FF; border: 1px dashed #3B82F6; border-radius: 8px; padding: 10px 12px; margin: 10px 0; font-size: 12px; color: #1E40AF; text-align: center; line-height: 1.4;">
                         <strong>Toptan İskonto Fırsatı:</strong> Bu tutar liste fiyatıdır. Sipariş miktarınıza göre <strong>yüksek iskonto</strong> düşülecektir!
                    </div>
                    <button class="whatsapp-order-btn" id="sendWhatsAppOrderBtn" style="background: #25D366; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 700; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                        <i class="fab fa-whatsapp" style="font-size: 22px;"></i> İskontolu Fiyat Teklifi Al (WhatsApp)
                    </button>
                    <button class="clear-cart-btn" id="clearCartBtn">Sepeti Temizle</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', triggerHtml);
        document.body.insertAdjacentHTML('beforeend', drawerHtml);

        document.getElementById('floatingCartBtn').addEventListener('click', openCartDrawer);
        document.getElementById('cartCloseBtn').addEventListener('click', closeCartDrawer);
        document.getElementById('cartDrawerOverlay').addEventListener('click', closeCartDrawer);
        document.getElementById('sendWhatsAppOrderBtn').addEventListener('click', sendWhatsAppOrder);
        document.getElementById('clearCartBtn').addEventListener('click', () => {
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
        var totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
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
            html += `
                <div class="cart-empty-state">
                    <i class="fas fa-shopping-basket"></i>
                    <p style="font-weight: 600; color: #64748B;">Aktif sepetiniz boş.</p>
                    <p style="font-size: 13px;">Ürün sayfalarından ölçü seçip "Sepete Ekle" butonuna basarak sipariş oluşturabilirsiniz.</p>
                </div>
            `;
        } else {
            html += cart.map(function(item, index) {
                var itemTotal = (item.price * item.quantity).toFixed(2);
                totalSum += parseFloat(itemTotal);
                var cleanSize = sanitizeAttr(item.size);

                var qtyMeta = '';
                if (item.paketQty && item.paketQty !== '-') {
                    qtyMeta += `Paket: <strong>${item.paketQty}</strong> | `;
                }
                qtyMeta += `Koli: <strong>${item.boxQty || '-'}</strong>`;

                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${sanitizeAttr(item.productName)}</h4>
                            <div class="cart-item-meta">Ebat: <strong>${cleanSize}</strong> | ${qtyMeta}</div>
                            <div class="cart-item-price">${item.quantity} Adet x ${item.price.toFixed(2)} TL = <strong>${itemTotal} TL</strong></div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="drawer-qty-selector" style="display: inline-flex; align-items: center; background: #F1F5F9; border-radius: 8px; padding: 2px; border: 1px solid #CBD5E1;">
                                <button type="button" class="drawer-qty-btn" data-action="minus" data-index="${index}" style="width: 28px; height: 28px; border: none; background: #fff; border-radius: 6px; font-weight: bold; cursor: pointer;">-</button>
                                <span style="padding: 0 8px; font-weight: 700; font-size: 13px;">${item.quantity}</span>
                                <button type="button" class="drawer-qty-btn" data-action="plus" data-index="${index}" style="width: 28px; height: 28px; border: none; background: #fff; border-radius: 6px; font-weight: bold; cursor: pointer;">+</button>
                            </div>
                            <button type="button" class="remove-cart-item" onclick="window.baysuRemoveItem(${index})" style="background: none; border: none; color: #EF4444; cursor: pointer; font-size: 16px; margin-left: 8px;" title="Sil">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        cartBody.innerHTML = html;

        if (cartTotalAmount) {
            cartTotalAmount.textContent = `${totalSum.toFixed(2)} ₺`;
        }
    }

    function addItem(productName, size, boxQty, price, quantity, code, stepVal, paketQty) {
        var cart = getCart();
        var cleanName = sanitizeAttr(productName);
        var cleanSize = sanitizeAttr(size);
        var step = parseInt(stepVal) || 1;
        var min = step;
        var parsedQty = Math.max(min, parseInt(quantity) || min);

        var existingIndex = cart.findIndex(item => sanitizeAttr(item.productName) === cleanName && sanitizeAttr(item.size) === cleanSize);

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

        var text = `📋 *BAYRAKÇI SULAMA VE YAPI MALZEMELERİ*\n`;
        text += `*İSKONTOLU FİYAT TEKLİFİ VE SİPARİŞ TALEBİ*\n`;
        text += `--------------------------------------------------\n`;
        text += `📅 *Tarih:* ${timestamp}\n`;
        text += `--------------------------------------------------\n\n`;
        text += `*ÜRÜN İSMİ | EBAT | LİSTE FİYATI | MİKTAR | TUTAR*\n`;
        text += `--------------------------------------------------\n`;

        var totalSum = 0;

        cart.forEach(function(item, i) {
            var itemTotal = item.price * item.quantity;
            totalSum += itemTotal;
            if (item.code) {
                text += `*${item.code}* | ${item.productName} | ${item.price.toFixed(2)} TL | ${item.quantity} Adet | ${itemTotal.toFixed(2)} TL\n`;
            } else {
                text += `*${item.size}* | ${item.productName} | ${item.price.toFixed(2)} TL | ${item.quantity} Adet | ${itemTotal.toFixed(2)} TL\n`;
            }
        });

        text += `--------------------------------------------------\n`;
        text += `💰 *TOPLAM LİSTE TUTARI:* *${totalSum.toFixed(2)} TL*\n`;
        text += `--------------------------------------------------\n`;
        text += `⚠️ *Not:* Yukarıdaki tutar liste fiyatıdır. Sipariş miktarımıza göre özel toptan iskonto teklifinizi rica ederiz.`;

        var encodedText = encodeURIComponent(text);
        var whatsappUrl = `https://wa.me/905533973603?text=${encodedText}`;

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
                var row = addBtn.closest('tr');
                var qtyInput = row ? row.querySelector('.qty-input') : null;

                var stepAttr = qtyInput ? qtyInput.getAttribute('step') : null;
                var stepVal = parseInt(stepAttr) || 1;
                var quantity = qtyInput ? (parseInt(qtyInput.value) || stepVal) : stepVal;

                addItem(productName, size, boxQty, price, quantity, code, stepVal, paketQty);

                var originalText = addBtn.innerHTML;
                addBtn.classList.add('added');
                addBtn.innerHTML = `<i class="fas fa-check"></i> Eklendi!`;

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
        addItem,
        changeQty,
        removeItem,
        sendWhatsAppOrder,
        getCart,
        getArchivedOrders,
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
        alert(name + " (" + qty + " adet) sepete eklendi!");
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


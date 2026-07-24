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
    const ACTIVE_STORAGE_KEY = 'baysu_user_cart';
    const ARCHIVE_LIST_KEY = 'baysu_archived_orders_list';
    const OLD_SINGLE_ARCHIVE_KEY = 'baysu_archived_order';

    // Cihaza özel aktif sepeti getir
    function getCart() {
        try {
            const data = localStorage.getItem(ACTIVE_STORAGE_KEY);
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
            const listData = localStorage.getItem(ARCHIVE_LIST_KEY);
            let list = listData ? JSON.parse(listData) : [];
            
            const oldData = localStorage.getItem(OLD_SINGLE_ARCHIVE_KEY);
            if (oldData) {
                try {
                    const parsedOld = JSON.parse(oldData);
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
            let list = getArchivedOrders();
            list.unshift(orderData);
            if (list.length > 50) list = list.slice(0, 50);
            localStorage.setItem(ARCHIVE_LIST_KEY, JSON.stringify(list));
        } catch (e) {
            console.error('Arşiv kaydetme hatası:', e);
        }
    }

    // Geçmiş sipariş arşivini temizle
    function clearArchivedOrders() {
        if (confirm('Tüm geçmiş sipariş arşiviniz silinecektir. Emin misiniz?')) {
            try {
                localStorage.removeItem(ARCHIVE_LIST_KEY);
                localStorage.removeItem(OLD_SINGLE_ARCHIVE_KEY);
                renderCartItems();
            } catch (e) {}
        }
    }

    function getFormattedTimestamp() {
        const now = new Date();
        const months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        const day = String(now.getDate()).padStart(2, '0');
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

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

        const triggerHtml = `
            <div class="floating-cart-trigger" id="floatingCartBtn" title="Sepetimi Görüntüle">
                <i class="fas fa-shopping-basket" style="font-size: 18px;"></i>
                <span style="font-weight: 600;">Sepetim</span>
                <span class="cart-count-badge" id="cartBadge">0</span>
            </div>
        `;

        const drawerHtml = `
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
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = totalItems;
        }
        renderCartItems();
    }

    function renderCartItems() {
        const cartBody = document.getElementById('cartBody');
        const cartTotalAmount = document.getElementById('cartTotalAmount');
        if (!cartBody) return;

        const cart = getCart();
        const archivedOrders = getArchivedOrders();
        let totalSum = 0;

        let html = '';

        if (cart.length === 0) {
            html += `
                <div class="cart-empty-state">
                    <i class="fas fa-shopping-basket"></i>
                    <p style="font-weight: 600; color: #64748B;">Aktif sepetiniz boş.</p>
                    <p style="font-size: 13px;">Ürün sayfalarından ölçü seçip "Sepete Ekle" butonuna basarak sipariş oluşturabilirsiniz.</p>
                </div>
            `;
        } else {
            html += cart.map((item, index) => {
                const itemTotal = (item.price * item.quantity).toFixed(2);
                totalSum += parseFloat(itemTotal);
                const cleanSize = sanitizeAttr(item.size);

                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${sanitizeAttr(item.productName)}</h4>
                            <div class="cart-item-meta">Ebat: <strong>${cleanSize}</strong> | Çuval Adedi: <strong>${item.boxQty || '-'}</strong></div>
                            <div class="cart-item-price">${item.quantity} Adet x ${item.price.toFixed(2)} TL = <strong>${itemTotal} TL</strong></div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="drawer-qty-selector" style="display: inline-flex; align-items: center; background: #F1F5F9; border-radius: 8px; padding: 2px; border: 1px solid #CBD5E1;">
                                <button type="button" class="drawer-qty-btn" data-action="minus" data-index="${index}" style="width: 28px; height: 28px; border: none; background: #fff; border-radius: 6px; font-weight: bold; cursor: pointer;">-</button>
                                <span style="padding: 0 10px; font-weight: 700; font-size: 14px;">${item.quantity}</span>
                                <button type="button" class="drawer-qty-btn" data-action="plus" data-index="${index}" style="width: 28px; height: 28px; border: none; background: #fff; border-radius: 6px; font-weight: bold; cursor: pointer;">+</button>
                            </div>
                            <button class="remove-cart-item" data-remove-index="${index}" style="background: none; border: none; color: #EF4444; cursor: pointer; font-size: 16px; margin-left: 10px;" title="Sil">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        if (archivedOrders && archivedOrders.length > 0) {
            html += `
                <div class="archived-order-section" style="margin-top: 25px; padding-top: 15px; border-top: 2px dashed #CBD5E1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="margin: 0; font-size: 14px; color: #004797; font-weight: 700;"><i class="fas fa-history"></i> Geçmiş Siparişler (${archivedOrders.length})</h4>
                        <button type="button" id="clearArchiveBtn" style="background: none; border: none; color: #64748B; font-size: 11px; cursor: pointer; text-decoration: underline;">Arşivi Temizle</button>
                    </div>
                    ${archivedOrders.map((order, orderIdx) => `
                        <div class="archived-order-box" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px; margin-bottom: 12px;">
                            <div style="font-size: 12px; font-weight: 700; color: #1E293B; margin-bottom: 6px; display: flex; justify-content: space-between;">
                                <span>📋 Sipariş #${archivedOrders.length - orderIdx}</span>
                                <span style="color: #64748B; font-weight: 500; font-size: 11px;"><i class="far fa-clock"></i> ${order.timestamp}</span>
                            </div>
                            ${(order.items || []).map(item => `
                                <div class="archived-item-line" style="font-size: 12px; color: #475569; margin-bottom: 4px;">
                                    • <strong>${sanitizeAttr(item.productName)}</strong> (${sanitizeAttr(item.size)}) - ${item.quantity} Adet x ${item.price.toFixed(2)} TL = ${(item.price * item.quantity).toFixed(2)} TL
                                </div>
                            `).join('')}
                            <div style="font-weight: 700; color: #059669; font-size: 13px; margin-top: 8px; text-align: right; border-top: 1px solid #E2E8F0; padding-top: 6px;">
                                Sipariş Tutarı: ${order.totalSum ? order.totalSum.toFixed(2) : '0.00'} TL
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        cartBody.innerHTML = html;

        if (cartTotalAmount) {
            cartTotalAmount.textContent = totalSum.toFixed(2) + ' TL';
        }

        const clearArchiveBtn = document.getElementById('clearArchiveBtn');
        if (clearArchiveBtn) {
            clearArchiveBtn.addEventListener('click', clearArchivedOrders);
        }
    }

    function addItem(productName, size, boxQty, price, quantity, code) {
        let cart = getCart();
        const cleanName = sanitizeAttr(productName);
        const cleanSize = sanitizeAttr(size);
        const parsedQty = Math.max(1, parseInt(quantity) || 1);

        const existingIndex = cart.findIndex(item => sanitizeAttr(item.productName) === cleanName && sanitizeAttr(item.size) === cleanSize);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += parsedQty;
            if (code) cart[existingIndex].code = code;
        } else {
            cart.push({
                productName: cleanName,
                size: cleanSize,
                boxQty: boxQty || '-',
                price: parseFloat(price) || 0,
                quantity: parsedQty,
                code: code || ''
            });
        }

        saveCart(cart);
    }

    function changeQty(index, delta) {
        let cart = getCart();
        if (cart[index]) {
            cart[index].quantity += delta;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            saveCart(cart);
        }
    }

    function removeItem(index) {
        let cart = getCart();
        if (cart[index]) {
            cart.splice(index, 1);
            saveCart(cart);
        }
    }

    function sendWhatsAppOrder() {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Aktif sepetiniz boş! Lütfen önce sipariş verilecek ürünleri ekleyin.');
            return;
        }

        const timestamp = getFormattedTimestamp();

        let text = `📋 *BAYRAKÇI SULAMA VE YAPI MALZEMELERİ*\n`;
        text += `*İSKONTOLU FİYAT TEKLİFİ VE SİPARİŞ TALEBİ*\n`;
        text += `--------------------------------------------------\n`;
        text += `📅 *Tarih:* ${timestamp}\n`;
        text += `--------------------------------------------------\n\n`;
        text += `*ÜRÜN İSMİ | EBAT | LİSTE FİYATI | MİKTAR | TUTAR*\n`;
        text += `--------------------------------------------------\n`;

        let totalSum = 0;

        const sizeToCodeMap = {
            '1/2': '318',
            '1/2"': '318',
            '3/4': '236',
            '3/4"': '236',
            '1': '237',
            '1"': '237',
            '1 1/4': '238',
            '1 1/4"': '238',
            '1 1/2': '239',
            '1 1/2"': '239',
            '2': '323',
            '2"': '323',
            '2 1/2': '324',
            '2 1/2"': '324',
            '3': '325',
            '3"': '325'
        };

        cart.forEach((item, idx) => {
            const price = parseFloat(item.price || 0);
            const qty = parseInt(item.quantity || 1);
            const itemTotal = (price * qty).toFixed(2);
            totalSum += parseFloat(itemTotal);

            let cleanName = sanitizeAttr(item.productName || 'Sintine Depo Rekoru');
            let cleanSize = sanitizeAttr(item.size || '');
            let code = item.code || '';

            if (!cleanSize) {
                if (cleanName.indexOf('1 1/4') > -1) cleanSize = '1 1/4';
                else if (cleanName.indexOf('1 1/2') > -1) cleanSize = '1 1/2';
                else if (cleanName.indexOf('3/4') > -1) cleanSize = '3/4';
                else if (cleanName.indexOf(' 1') > -1 || cleanName === '1') cleanSize = '1';
            }

            cleanName = cleanName.replace('3/4', '').replace('1 1/4', '').replace('1 1/2', '').replace('1', '').replace(/-\s*$/, '').trim();
            if (!cleanName) cleanName = 'Sintine Depo Rekoru';

            if (!code) {
                if (cleanSize && sizeToCodeMap[cleanSize]) {
                    code = sizeToCodeMap[cleanSize];
                } else if (Math.abs(price - 80) < 0.1 && (cleanSize.indexOf('3/4') > -1)) {
                    code = '236';
                } else if (Math.abs(price - 80) < 0.1 && (cleanSize === '1' || cleanSize === '1"' || cleanSize.indexOf('3/4') === -1)) {
                    code = '237';
                } else if (Math.abs(price - 115) < 0.1) {
                    code = '238';
                } else if (Math.abs(price - 130) < 0.1) {
                    code = '239';
                } else {
                    code = '236';
                }
            }

            cleanSize = cleanSize.replace(/"/g, '').trim();

            let line = `${idx + 1}. KOD ${code} | ${cleanName}`;
            if (cleanSize) {
                line += ` | Ebat: ${cleanSize}`;
            }
            line += ` | ${price.toFixed(2)} TL | ${qty} Adet | ${itemTotal} TL`;

            text += line + `\n`;
        });

        text += `--------------------------------------------------\n`;
        text += ` *TOPLAM LİSTE FİYATI:* ${totalSum.toFixed(2)} TL\n`;
        text += `🎁 *İSKONTO TALEBİ:* Ürün miktarlarımıza ve projemize özel iskonto oranınız ile net iskontolu fiyat teklifinizi öğrenmek istiyoruz.\n`;
        text += `--------------------------------------------------\n`;
        text += `Lütfen ürün stok teyidi ile birlikte iskontolu net fiyat teklifinizi iletiniz.`;

        const newOrderRecord = {
            id: Date.now(),
            timestamp: timestamp,
            items: cart,
            totalSum: totalSum
        };

        saveArchivedOrder(newOrderRecord);

        try {
            localStorage.removeItem(ACTIVE_STORAGE_KEY);
        } catch (e) {}

        updateCartUI();

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/905324965835?text=${encodedText}`;

        window.open(whatsappUrl, '_blank');
    }

    let isInitialized = false;

    document.addEventListener('DOMContentLoaded', () => {
        if (isInitialized) return;
        isInitialized = true;

        injectCartUI();
        updateCartUI();

        document.body.addEventListener('change', (e) => {
            if (e.target.classList.contains('qty-input')) {
                let val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) {
                    e.target.value = 1;
                } else {
                    e.target.value = val;
                }
            }
        });

        document.body.addEventListener('click', (e) => {
            if (e._handledByBaysuCart) return;

            const drawerBtn = e.target.closest('.drawer-qty-btn');
            if (drawerBtn) {
                e.preventDefault();
                e.stopPropagation();
                e._handledByBaysuCart = true;
                const idx = parseInt(drawerBtn.getAttribute('data-index'));
                const action = drawerBtn.getAttribute('data-action');
                if (!isNaN(idx)) {
                    changeQty(idx, action === 'plus' ? 1 : -1);
                }
                return;
            }

            const removeBtn = e.target.closest('.remove-cart-item');
            if (removeBtn) {
                e.preventDefault();
                e.stopPropagation();
                e._handledByBaysuCart = true;
                const idx = parseInt(removeBtn.getAttribute('data-remove-index'));
                if (!isNaN(idx)) {
                    removeItem(idx);
                }
                return;
            }

            const tableQtyBtn = e.target.closest('.qty-selector .qty-btn');
            if (tableQtyBtn) {
                e.preventDefault();
                e.stopPropagation();
                e._handledByBaysuCart = true;

                const selector = tableQtyBtn.closest('.qty-selector');
                const input = selector ? selector.querySelector('.qty-input') : null;
                if (input) {
                    let currentVal = parseInt(input.value) || 1;
                    if (tableQtyBtn.classList.contains('qty-plus') || tableQtyBtn.textContent.trim() === '+') {
                        input.value = currentVal + 1;
                    } else if (tableQtyBtn.classList.contains('qty-minus') || tableQtyBtn.textContent.trim() === '-') {
                        if (currentVal > 1) {
                            input.value = currentVal - 1;
                        }
                    }
                }
                return;
            }

            const addBtn = e.target.closest('.add-to-cart-btn');
            if (addBtn) {
                e.preventDefault();
                e.stopPropagation();
                e._handledByBaysuCart = true;

                if (addBtn.disabled) return;
                addBtn.disabled = true;

                const productName = addBtn.getAttribute('data-product');
                const size = addBtn.getAttribute('data-size');
                const boxQty = addBtn.getAttribute('data-box');
                const price = addBtn.getAttribute('data-price');
                const code = addBtn.getAttribute('data-code');
                const row = addBtn.closest('tr');
                const qtyInput = row ? row.querySelector('.qty-input') : null;
                const quantity = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

                addItem(productName, size, boxQty, price, quantity, code);

                const originalText = addBtn.innerHTML;
                addBtn.classList.add('added');
                addBtn.innerHTML = `<i class="fas fa-check"></i> Eklendi!`;

                setTimeout(() => {
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

    document.querySelectorAll('a[target="_blank"]').forEach(a => {
        a.setAttribute('rel', 'noopener noreferrer');
    });

    window.BaysuCart = {
        addItem,
        changeQty,
        removeItem,
        sendWhatsAppOrder,
        getCart,
        getArchivedOrders,
        clearArchivedOrders
    };
})();

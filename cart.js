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

        function injectCartStyles() {
        if (document.getElementById('baysu-injected-cart-css')) return;
        const style = document.createElement('style');
        style.id = 'baysu-injected-cart-css';
        style.textContent = 
            .floating-cart-trigger, #floatingCartBtn {
                position: fixed !important;
                bottom: 25px !important;
                right: 25px !important;
                background: linear-gradient(135deg, #004797 0%, #002D62 100%) !important;
                color: #ffffff !important;
                padding: 12px 20px !important;
                border-radius: 50px !important;
                font-weight: 700 !important;
                font-size: 14px !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                box-shadow: 0 8px 25px rgba(0, 71, 151, 0.4) !important;
                z-index: 999999 !important;
                transition: all 0.3s ease !important;
                border: 2px solid rgba(255, 255, 255, 0.2) !important;
            }
            .floating-cart-trigger:hover, #floatingCartBtn:hover {
                transform: translateY(-3px) scale(1.05) !important;
                box-shadow: 0 12px 30px rgba(0, 71, 151, 0.5) !important;
            }
            .cart-count-badge, #cartBadge {
                background: #EF4444 !important;
                color: #ffffff !important;
                font-size: 12px !important;
                font-weight: 800 !important;
                padding: 2px 8px !important;
                border-radius: 12px !important;
                margin-left: 4px !important;
            }
            .cart-drawer-overlay, #cartDrawerOverlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(15, 23, 42, 0.6) !important;
                backdrop-filter: blur(4px) !important;
                z-index: 9999999 !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transition: all 0.3s ease !important;
            }
            .cart-drawer-overlay.active, #cartDrawerOverlay.active {
                opacity: 1 !important;
                visibility: visible !important;
            }
            .cart-drawer, #cartDrawer {
                position: fixed !important;
                top: 0 !important;
                right: -450px !important;
                width: 420px !important;
                max-width: 90vw !important;
                height: 100vh !important;
                background: #ffffff !important;
                box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2) !important;
                z-index: 99999999 !important;
                display: flex !important;
                flex-direction: column !important;
                transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            .cart-drawer.active, #cartDrawer.active {
                right: 0 !important;
            }
            .cart-header {
                background: linear-gradient(135deg, #004797 0%, #002D62 100%) !important;
                color: #ffffff !important;
                padding: 20px !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            }
            .cart-header h3 {
                margin: 0 !important;
                font-size: 1.15rem !important;
                font-weight: 700 !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
            }
            .cart-close-btn {
                background: rgba(255, 255, 255, 0.15) !important;
                border: none !important;
                color: #ffffff !important;
                font-size: 24px !important;
                width: 36px !important;
                height: 36px !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            .cart-timestamp-bar {
                background: #EFF6FF !important;
                color: #1D4ED8 !important;
                padding: 10px 20px !important;
                font-size: 13px !important;
                border-bottom: 1px solid #DBEAFE !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            .cart-body {
                flex: 1 !important;
                overflow-y: auto !important;
                padding: 20px !important;
            }
            .cart-empty-state {
                text-align: center !important;
                padding: 40px 20px !important;
                color: #64748B !important;
            }
            .cart-empty-state i {
                font-size: 48px !important;
                color: #CBD5E1 !important;
                margin-bottom: 16px !important;
            }
            .cart-item {
                background: #F8FAFC !important;
                border: 1px solid #E2E8F0 !important;
                border-radius: 12px !important;
                padding: 14px !important;
                margin-bottom: 12px !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            }
            .cart-footer {
                padding: 20px !important;
                background: #ffffff !important;
                border-top: 1px solid #E2E8F0 !important;
            }
            .clear-cart-btn {
                background: none !important;
                border: none !important;
                color: #94A3B8 !important;
                font-size: 12px !important;
                width: 100% !important;
                padding: 8px !important;
                margin-top: 6px !important;
                cursor: pointer !important;
                text-decoration: underline !important;
            }
        ;
        document.head.appendChild(style);
    }

    function injectCartUI() {
        injectCartStyles();
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
            alert('Aktif sepetiniz boÅŸ! LÃ¼tfen Ã¶nce sipariÅŸ verilecek Ã¼rÃ¼nleri ekleyin.');
            return;
        }

        const timestamp = getFormattedTimestamp();

        let text = ğŸ“‹ *BAYRAKÃ‡I SULAMA VE YAPI MALZEMELERÄ°*\n;
        text += *Ä°SKONTOLU FÄ°YAT TEKLÄ°FÄ° VE SÄ°PARÄ°Å TALEBÄ°*\n;
        text += --------------------------------------------------\n;
        text += ğŸ“… *Tarih:* \n;
        text += --------------------------------------------------\n\n;
        text += *ÃœRÃœN Ä°SMÄ° | EBAT | LÄ°STE FÄ°YATI | MÄ°KTAR | TUTAR*\n;
        text += --------------------------------------------------\n;

        let totalSum = 0;

        const sizeToCodeMap = {
            '1/2': '275',
            '1/2"': '275',
            '3/4': '276',
            '3/4"': '276',
            '1': '277',
            '1"': '277',
            '1 1/4': '278',
            '1 1/4"': '278',
            '1 1/2': '279',
            '1 1/2"': '279',
            '2': '280',
            '2"': '280',
            '3': '281',
            '3"': '281',
            '4': '282',
            '4"': '282',
            '2 1/2': '324',
            '2 1/2"': '324'
        };

        cart.forEach((item, idx) => {
            const price = parseFloat(item.price || 0);
            const qty = parseInt(item.quantity || 1);
            const itemTotal = (price * qty).toFixed(2);
            totalSum += parseFloat(itemTotal);

            let cleanName = sanitizeAttr(item.productName || 'ÃœrÃ¼n');
            let cleanSize = sanitizeAttr(item.size || '').replace(/"/g, '').trim();
            let code = (item.code || '').trim();

            // Mapped code fallback ONLY for standard Depo Rekoru if code is missing
            if (!code && cleanName.toLowerCase().indexOf('depo rekoru') > -1) {
                if (cleanSize && sizeToCodeMap[cleanSize]) {
                    code = sizeToCodeMap[cleanSize];
                }
            }

            let line = ${idx + 1}. ;
            if (code) {
                line += KOD  | ;
            }
            line += ${cleanName};
            if (cleanSize) {
                line +=  | Ebat: ;
            }
            line +=  |  TL |  Adet |  TL;

            text += line + \n;
        });

        text += --------------------------------------------------\n;
        text +=  ğŸ’° *TOPLAM LÄ°STE FÄ°YATI:*  TL\n;
        text += ğŸ *Ä°SKONTO TALEBÄ°:* ÃœrÃ¼n miktarlarÄ±mÄ±za ve projemize Ã¶zel iskonto oranÄ±nÄ±z ile net iskontolu fiyat teklifinizi Ã¶ÄŸrenmek istiyoruz.\n;
        text += --------------------------------------------------\n;
        text += LÃ¼tfen Ã¼rÃ¼n stok teyidi ile birlikte iskontolu net fiyat teklifinizi iletiniz.;

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
        const whatsappUrl = https://wa.me/905533973603?text=;
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

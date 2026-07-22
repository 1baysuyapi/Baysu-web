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
            
            // Eski tekli arşiv verisi varsa listeye aktar ve eskiyi kaldır
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
            list.unshift(orderData); // En son siparişi başa ekle
            if (list.length > 50) list = list.slice(0, 50); // En fazla 50 sipariş sakla
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

    // Tarih ve Saati Türkçe Formatla
    function getFormattedTimestamp() {
        const now = new Date();
        const months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${day} ${month} ${year} - ${hours}:${minutes}`;
    }

    // Metin Temizleme Yardımcısı
    function sanitizeAttr(str) {
        if (!str) return '';
        return String(str)
            .replace(/data-box=.*/gi, '')
            .replace(/[”"]+$/g, '')
            .trim();
    }

    // UI Bileşenlerini Enjekte Et
    function injectCartUI() {
        if (document.getElementById('cartDrawerOverlay')) return;

        // Floating Cart Trigger (Sağ Alt Buton)
        const triggerHtml = `
            <div class="floating-cart-trigger" id="floatingCartBtn" title="Sepetimi Görüntüle">
                <i class="fas fa-shopping-basket" style="font-size: 18px;"></i>
                <span style="font-weight: 600;">Sepetim</span>
                <span class="cart-count-badge" id="cartBadge">0</span>
            </div>
        `;

        // Cart Drawer Overlay & Panel
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
                    <div class="cart-total-row">
                        <span>Toplam Tutar:</span>
                        <span class="cart-total-amount" id="cartTotalAmount">0.00 ₺</span>
                    </div>
                    <button class="whatsapp-order-btn" id="sendWhatsAppOrderBtn">
                        <i class="fab fa-whatsapp" style="font-size: 20px;"></i> WhatsApp ile Siparişi Gönder
                    </button>
                    <button class="clear-cart-btn" id="clearCartBtn">Sepeti Temizle</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', triggerHtml);
        document.body.insertAdjacentHTML('beforeend', drawerHtml);

        // Event Listener'lar
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
        renderCartItems();
    }

    function closeCartDrawer() {
        document.getElementById('cartDrawerOverlay').classList.remove('active');
        document.getElementById('cartDrawer').classList.remove('active');
    }

    // Sepet Görünümünü Güncelle
    function updateCartUI() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = totalItems;
        }
        renderCartItems();
    }

    // Sepet İçeriğini Çizdir
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

        // Tüm Geçmiş Siparişler (Arşiv Listesi)
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

        // Arşivi temizle butonu dinleyicisi
        const clearArchiveBtn = document.getElementById('clearArchiveBtn');
        if (clearArchiveBtn) {
            clearArchiveBtn.addEventListener('click', clearArchivedOrders);
        }
    }

    // Ürün Ekleme
    function addItem(productName, size, boxQty, price, quantity) {
        let cart = getCart();
        const cleanName = sanitizeAttr(productName);
        const cleanSize = sanitizeAttr(size);
        const parsedQty = Math.max(1, parseInt(quantity) || 1);

        const existingIndex = cart.findIndex(item => sanitizeAttr(item.productName) === cleanName && sanitizeAttr(item.size) === cleanSize);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += parsedQty;
        } else {
            cart.push({
                productName: cleanName,
                size: cleanSize,
                boxQty: boxQty || '-',
                price: parseFloat(price) || 0,
                quantity: parsedQty
            });
        }

        saveCart(cart);
    }

    // Miktar Değiştirme (Tekli adım garanti)
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

    // Ürün Silme
    function removeItem(index) {
        let cart = getCart();
        if (cart[index]) {
            cart.splice(index, 1);
            saveCart(cart);
        }
    }

    // WhatsApp Sipariş Gönderimi
    function sendWhatsAppOrder() {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Aktif sepetiniz boş! Lütfen önce sipariş verilecek ürünleri ekleyin.');
            return;
        }

        const timestamp = getFormattedTimestamp();

        let text = `📋 *BAYRAKÇI SULAMA VE YAPI MALZEMELERİ*\n`;
        text += `*SİPARİŞ / TEKLİF TALEBİ*\n`;
        text += `--------------------------------------------------\n`;
        text += `📅 *Tarih:* ${timestamp}\n`;
        text += `--------------------------------------------------\n\n`;
        text += `*ÜRÜN İSMİ | EBAT | BİRİM FİYATI | MİKTAR | TUTAR*\n`;
        text += `--------------------------------------------------\n`;

        let totalSum = 0;

        cart.forEach((item, idx) => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            totalSum += parseFloat(itemTotal);
            const cleanName = sanitizeAttr(item.productName);
            const cleanSize = sanitizeAttr(item.size);
            text += `${idx + 1}. ${cleanName} | Ebat: ${cleanSize} | ${item.price.toFixed(2)} TL | ${item.quantity} Adet | ${itemTotal} TL\n`;
        });

        text += `--------------------------------------------------\n`;
        text += `💰 *GENEL TOPLAM SİPARİŞ TUTARI:* ${totalSum.toFixed(2)} TL\n`;
        text += `--------------------------------------------------\n`;
        text += `Lütfen ürün stok teyidini ve teslimat bilgisini iletiniz.`;

        // Siparişi Tüm Geçmiş Arşive Ekle ve Aktif Sepeti Sıfırla
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
        const whatsappUrl = `https://wa.me/905533973603?text=${encodedText}`;

        window.open(whatsappUrl, '_blank');
    }

    // Sayfa Yüklendiğinde Başlat
    let isInitialized = false;

    document.addEventListener('DOMContentLoaded', () => {
        if (isInitialized) return;
        isInitialized = true;

        injectCartUI();
        updateCartUI();

        // Input değişimlerinde doğrudan yazılan değerleri doğrula
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

        // Tüm Tıklama Olayları için Çakışmasız Tekil Yönetici (Single Event Dispatcher)
        document.body.addEventListener('click', (e) => {
            // Çift çalışmayı önleme bayrağı
            if (e._handledByBaysuCart) return;

            // 1. Sepet Çekmecesindeki (Drawer) Miktar Butonları (+/-)
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

            // 2. Sepet Çekmecesindeki Ürün Silme Butonu
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

            // 3. Ürün Tablosundaki (Sayfa İçindeki) Miktar + / - Butonları
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

            // 4. Sepete Ekle Butonu
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
                const row = addBtn.closest('tr');
                const qtyInput = row ? row.querySelector('.qty-input') : null;
                const quantity = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

                addItem(productName, size, boxQty, price, quantity);

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

            const link = e.target.closest('a');
            if (link) {
                const href = link.getAttribute('href');
                const missingPages = [];
                if (href && missingPages.includes(href)) {
                    e.preventDefault();
                    e._handledByBaysuCart = true;
                    alert('Bu ürün çeşidi henüz kataloğumuza yüklenme aşamasındadır.');
                }
            }
        });
    });

    // Global Erişim API
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

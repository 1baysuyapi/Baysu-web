/* =========================================================
   BAYSU YAPI - CİHAZA ÖZEL SEPET VE WHATSAPP SİPARİŞ JS (cart.js)
   ========================================================= */

(function () {
    const STORAGE_KEY = 'baysu_user_cart';

    // Cihaza özel localStorage sepetini getir
    function getCart() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('LocalStorage okuma hatası:', e);
            return [];
        }
    }

    // Sepeti localStorage'a kaydet
    function saveCart(cart) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
            updateCartUI();
        } catch (e) {
            console.error('LocalStorage yazma hatası:', e);
        }
    }

    // Tarih ve Saati Türkçe Olarak Formatla
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

    // UI Bileşenlerini Enjekte Et (Floating Cart Trigger & Cart Drawer)
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
                    <!-- Dinamik Sepet Ürünleri -->
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

        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fas fa-shopping-basket"></i>
                    <p style="font-weight: 600; color: #64748B;">Sepetinizde ürün bulunmamaktadır.</p>
                    <p style="font-size: 13px;">Ürün sayfalarından ölçü seçip "Sepete Ekle" butonuna basarak sipariş oluşturabilirsiniz.</p>
                </div>
            `;
            if (cartTotalAmount) cartTotalAmount.textContent = '0.00 ₺';
            return;
        }

        let totalSum = 0;

        cartBody.innerHTML = cart.map((item, index) => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            totalSum += parseFloat(itemTotal);

            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.productName}</h4>
                        <div class="cart-item-meta">Ebat: <strong>${item.size}</strong> | Çuval Adedi: <strong>${item.boxQty}</strong></div>
                        <div class="cart-item-price">${item.quantity} x ${item.price.toFixed(2)} ₺ = <strong>${itemTotal} ₺</strong></div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="qty-selector" style="transform: scale(0.9);">
                            <button class="qty-btn" onclick="window.BaysuCart.changeQty(${index}, -1)">-</button>
                            <span style="padding: 0 8px; font-weight: 700;">${item.quantity}</span>
                            <button class="qty-btn" onclick="window.BaysuCart.changeQty(${index}, 1)">+</button>
                        </div>
                        <button class="remove-cart-item" onclick="window.BaysuCart.removeItem(${index})" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (cartTotalAmount) {
            cartTotalAmount.textContent = totalSum.toFixed(2) + ' ₺';
        }
    }

    // Ürün Ekleme
    function addItem(productName, size, boxQty, price, quantity) {
        let cart = getCart();
        const existingIndex = cart.findIndex(item => item.productName === productName && item.size === size);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                productName,
                size,
                boxQty,
                price: parseFloat(price),
                quantity: parseInt(quantity)
            });
        }

        saveCart(cart);
    }

    // Miktar Değiştirme
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

    // WhatsApp Sipariş Gönderimi (Tarih ve Formatlı Liste)
    function sendWhatsAppOrder() {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Sepetiniz boş! Lütfen önce ürün ekleyin.');
            return;
        }

        const timestamp = getFormattedTimestamp();
        let text = `📋 *BAYRAKÇI SULAMA VE YAPI MALZEMELERİ*\n`;
        text += `*SİPARİŞ / TEKLİF TALEBİ*\n`;
        text += `-------------------------------------------\n`;
        text += `📅 *Tarih:* ${timestamp}\n`;
        text += `-------------------------------------------\n\n`;
        text += `📦 *SİPARİŞ VERİLEN ÜRÜNLER:*\n\n`;

        let totalSum = 0;

        cart.forEach((item, idx) => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            totalSum += parseFloat(itemTotal);
            text += `${idx + 1}️⃣ *${item.productName}*\n`;
            text += `   • Ebat: ${item.size}\n`;
            text += `   • Çuval/Ambalaj Adedi: ${item.boxQty}\n`;
            text += `   • Sipariş Miktarı: ${item.quantity} Paket/Çuval\n`;
            text += `   • Birim Fiyat: ${item.price.toFixed(2)} ₺\n`;
            text += `   • Kalem Tutarı: ${itemTotal} ₺\n\n`;
        });

        text += `-------------------------------------------\n`;
        text += `💰 *GENEL TOPLAM TUTAR:* ${totalSum.toFixed(2)} ₺\n`;
        text += `-------------------------------------------\n`;
        text += `Lütfen ürün stok ve teslimat teyidini bildiriniz.`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/905533973603?text=${encodedText}`;

        window.open(whatsappUrl, '_blank');
    }

    // Sayfa Yüklendiğinde Başlat
    document.addEventListener('DOMContentLoaded', () => {
        injectCartUI();
        updateCartUI();

        // Miktar artı/eksi butonlarının çalıştırılması (Sayfadaki tablolarda)
        document.body.addEventListener('click', (e) => {
            const qtyBtn = e.target.closest('.qty-btn');
            if (qtyBtn && qtyBtn.closest('.product-size-table')) {
                const selector = qtyBtn.closest('.qty-selector');
                const input = selector.querySelector('.qty-input');
                let val = parseInt(input.value) || 1;

                if (qtyBtn.classList.contains('qty-minus')) {
                    if (val > 1) input.value = val - 1;
                } else if (qtyBtn.classList.contains('qty-plus')) {
                    input.value = val + 1;
                }
            }

            // Sepete Ekle Butonuna Tıklama
            const addBtn = e.target.closest('.add-to-cart-btn');
            if (addBtn) {
                const productName = addBtn.getAttribute('data-product');
                const size = addBtn.getAttribute('data-size');
                const boxQty = addBtn.getAttribute('data-box');
                const price = addBtn.getAttribute('data-price');
                const row = addBtn.closest('tr');
                const qtyInput = row ? row.querySelector('.qty-input') : null;
                const quantity = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

                addItem(productName, size, boxQty, price, quantity);

                // Buton Efekti (Görsel geri bildirim)
                const originalText = addBtn.innerHTML;
                addBtn.classList.add('added');
                addBtn.innerHTML = `<i class="fas fa-check"></i> Eklendi!`;

                setTimeout(() => {
                    addBtn.classList.remove('added');
                    addBtn.innerHTML = originalText;
                }, 1500);
            }
        });
    });

    // Global Erişim
    window.BaysuCart = {
        addItem,
        changeQty,
        removeItem,
        sendWhatsAppOrder,
        getCart
    };
})();

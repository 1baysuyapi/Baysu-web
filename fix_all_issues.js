const fs = require('fs');

// =============================================
// 1. BAHCE-EKIPMANLARI.HTML - Add product 190 and reorder
// =============================================
console.log('=== FIXING BAHCE-EKIPMANLARI.HTML ===');
let bahce = fs.readFileSync('bahce-ekipmanlari.html', 'utf8');

// Product card template for code 190 (1/2 Lüks Rekor)
const card190 = `<div class="product-card" data-category="bahce" data-name="1/2&quot; Lüks Rekor">
            <span class="badge">190</span>
            <img src="resimler/bahce_ekipmanlari/1-2_Lks_Rekor.png" alt="1/2 Lüks Rekor" onerror="this.src='resimler/placeholder.png'">
            <h3>1/2" Lüks Rekor</h3>
            
            <div class="card-hover-details">
                
                <div class="price-display">₺ 38.00</div>
                <div class="info-row"><span>Koli Adedi:</span> <strong>500</strong></div>
                <div class="info-row"><span>Ambalaj:</span> <strong>10</strong></div>
                
                <div class="card-actions">
                    <div class="qty-selector">
                        <button type="button" class="qty-btn qty-minus">-</button>
                        <input type="number" class="qty-input" value="1" min="1" step="1">
                        <button type="button" class="qty-btn qty-plus">+</button>
                    </div>
                    <button type="button" class="add-to-cart-btn" 
                        data-product="1/2 Lüks Rekor" 
                        data-price="38.00" 
                        data-code="190" 
                        data-box="500"
                        data-paket="10">
                        <i class="fas fa-shopping-cart"></i> Sepete Ekle
                    </button>
                </div>
            </div>
        </div>
        `;

// Insert card 190 right after card 189
const card189End = bahce.indexOf('>189</span>');
if (card189End > -1) {
    // Find the end of the 189 card (closing </div> of product-card)
    let pos = card189End;
    // Find the closing </div>\r\n        \r\n        that ends the card
    // Navigate: </div> (card-actions) -> </div> (card-hover-details) -> </div> (product-card)
    for (let i = 0; i < 3; i++) {
        pos = bahce.indexOf('</div>', pos + 1);
    }
    pos = bahce.indexOf('\n', pos) + 1;
    
    // Check if 190 already exists
    if (!bahce.includes('>190</span>')) {
        bahce = bahce.substring(0, pos) + card190 + bahce.substring(pos);
        console.log('Added product 190 after 189');
    } else {
        console.log('Product 190 already exists');
    }
}

// Now reorder: We need 189 -> 190 -> 111 -> 112 -> 350 -> 351
// For now, card 190 is already after 189.
// Card 111 and 112 don't exist, card 350 exists. We'll leave reordering for now.

fs.writeFileSync('bahce-ekipmanlari.html', bahce);
console.log('bahce-ekipmanlari.html saved');

// =============================================
// 2. FIX HEADER/NAV on ALL category pages
// Remove Hakkımızda and İletişim from nav-links
// =============================================
console.log('\n=== FIXING HEADERS ACROSS ALL PAGES ===');

const categoryPages = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.includes('decoded') && !f.includes('temp') && !f.includes('test_') && !f.includes('_original') && !f.includes('_edit') && !f.includes('_extracted') && !f.includes('_updated') && !f.includes('_generated') && !f.includes('_sample') && !f.includes('_full') && !f.includes('_out') && !f.includes('_head'));

let fixedHeaders = 0;
categoryPages.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Remove Hakkımızda link
    const hakkimizda = `<a href="/#about-section" class="hide-on-mobile"><i class="fas fa-info-circle" style="margin-right: 6px;"></i>Hakkımızda</a>`;
    if (html.includes(hakkimizda)) {
        html = html.replace(hakkimizda, '');
        changed = true;
    }
    // Also try without hide-on-mobile
    const hakkimizda2 = `<a href="/#about-section"><i class="fas fa-info-circle" style="margin-right: 6px;"></i>Hakkımızda</a>`;
    if (html.includes(hakkimizda2)) {
        html = html.replace(hakkimizda2, '');
        changed = true;
    }
    
    // Remove İletişim link
    const iletisim = `<a href="/#contact-section" class="hide-on-mobile"><i class="fas fa-envelope" style="margin-right: 6px;"></i>İletişim</a>`;
    if (html.includes(iletisim)) {
        html = html.replace(iletisim, '');
        changed = true;
    }
    const iletisim2 = `<a href="/#contact-section"><i class="fas fa-envelope" style="margin-right: 6px;"></i>İletişim</a>`;
    if (html.includes(iletisim2)) {
        html = html.replace(iletisim2, '');
        changed = true;
    }
    
    // Also handle variations with \r\n
    const hakkimizdaRN = '<a href="/#about-section" class="hide-on-mobile"><i class="fas fa-info-circle" style="margin-right: 6px;"></i>Hakkımızda</a>\r\n';
    if (html.includes(hakkimizdaRN)) {
        html = html.replace(hakkimizdaRN, '');
        changed = true;
    }
    const iletisimRN = '<a href="/#contact-section" class="hide-on-mobile"><i class="fas fa-envelope" style="margin-right: 6px;"></i>İletişim</a>\r\n';
    if (html.includes(iletisimRN)) {
        html = html.replace(iletisimRN, '');
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, html);
        fixedHeaders++;
    }
});
console.log(`Fixed headers in ${fixedHeaders} files`);

// =============================================
// 3. FIX NEON GREEN CSS in musluk-jaki-ve-rekorlari.html
// Remove route-musluk-jaki specific green styling
// =============================================
console.log('\n=== FIXING NEON GREEN IN MUSLUK-JAKI ===');
let musluk = fs.readFileSync('musluk-jaki-ve-rekorlari.html', 'utf8');

// Remove the body.route-musluk-jaki CSS block 
// Replace with same styling as bahce-ekipmanlari (blue theme)
const greenCSS = `body.route-musluk-jaki {
            background-color: #f2fcf5;
        }
        body.route-musluk-jaki .category-header {
            background: linear-gradient(135deg, #a7f3d0 0%, #34d399 100%);
            border-bottom: 4px solid #10b981;
        }
        body.route-musluk-jaki .category-header h1 {
            color: #064e3b;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
        }
        body.route-musluk-jaki .product-card {
            border: 1px solid #a7f3d0;
            box-shadow: 0 4px 15px rgba(52, 211, 153, 0.15);
            background-color: #ffffff;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        @media (hover: hover) {
            body.route-musluk-jaki .product-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 12px 25px rgba(16, 185, 129, 0.3);
                border-color: #34d399;
            }
        }
        body.route-bahce-ekipmanlari .product-card.card-active {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 12px 25px rgba(16, 185, 129, 0.3);
            border-color: #34d399;
        }
        body.route-bahce-ekipmanlari .add-to-cart-btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
        }
        body.route-bahce-ekipmanlari .add-to-cart-btn:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            box-shadow: 0 6px 15px rgba(5, 150, 105, 0.4);
            transform: translateY(-2px);
        }`;

if (musluk.includes(greenCSS)) {
    musluk = musluk.replace(greenCSS, '');
    console.log('Removed route-musluk-jaki green CSS');
} else {
    // Try to remove it piece by piece
    const pieces = [
        /body\.route-musluk-jaki\s*\{[^}]+\}/g,
        /body\.route-musluk-jaki\s+\.category-header\s*\{[^}]+\}/g,
        /body\.route-musluk-jaki\s+\.category-header\s+h1\s*\{[^}]+\}/g,
        /body\.route-musluk-jaki\s+\.product-card\s*\{[^}]+\}/g,
        /@media\s*\(hover:\s*hover\)\s*\{\s*body\.route-musluk-jaki\s+\.product-card:hover\s*\{[^}]+\}\s*\}/g,
    ];
    pieces.forEach(regex => {
        const before = musluk.length;
        musluk = musluk.replace(regex, '');
        if (musluk.length !== before) console.log('Removed a green CSS piece');
    });
}

// Also remove any duplicate green CSS blocks that may exist elsewhere
const greenPieces2 = [
    /body\.route-bahce-ekipmanlari\s+\.product-card\.card-active\s*\{[^}]+border-color:\s*#34d399[^}]+\}/g,
    /body\.route-bahce-ekipmanlari\s+\.add-to-cart-btn\s*\{[^}]+#10b981[^}]+\}/g,
    /body\.route-bahce-ekipmanlari\s+\.add-to-cart-btn:hover\s*\{[^}]+#059669[^}]+\}/g,
];
greenPieces2.forEach(regex => {
    const before = musluk.length;
    musluk = musluk.replace(regex, '');
    if (musluk.length !== before) console.log('Removed a bahce green CSS piece from musluk-jaki');
});

fs.writeFileSync('musluk-jaki-ve-rekorlari.html', musluk);
console.log('musluk-jaki-ve-rekorlari.html saved');

// =============================================
// 4. FIX CART.JS - Remove "Eklendi" notification
// =============================================
console.log('\n=== FIXING CART.JS ===');
let cart = fs.readFileSync('cart.js', 'utf8');

// Remove the button text change to "Eklendi!"
const ekleniBlock = `var originalText = addBtn.innerHTML;
                addBtn.classList.add('added');
                addBtn.innerHTML = "<i class=\\"fas fa-check\\"></i> Eklendi!";

                setTimeout(function() {
                    addBtn.classList.remove('added');
                    addBtn.innerHTML = originalText;
                    addBtn.disabled = false;
                }, 800);`;

if (cart.includes(ekleniBlock)) {
    cart = cart.replace(ekleniBlock, '// Notification removed per user request');
    console.log('Removed Eklendi notification from cart.js');
} else {
    // Try more flexible replacement
    cart = cart.replace(/addBtn\.innerHTML\s*=\s*"<i class=\\"fas fa-check\\"><\/i> Eklendi!"/g, '// Notification removed');
    cart = cart.replace(/addBtn\.classList\.add\('added'\);/g, '// addBtn.classList.add("added"); // disabled');
    console.log('Flexibly removed Eklendi notification');
}

// Remove "hazır değil" if it exists
if (cart.includes('hazır değil')) {
    cart = cart.replace(/alert\s*\([^)]*hazır değil[^)]*\)/g, '// alert removed');
    console.log('Removed hazır değil alert');
}

fs.writeFileSync('cart.js', cart);
console.log('cart.js saved');

// =============================================
// 5. FIX ACCORDION MENU GREEN COLORS in ALL pages
// The neon green in category accordions
// =============================================
console.log('\n=== FIXING ACCORDION MENU COLORS ===');
let accordionFixed = 0;
categoryPages.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Remove green category-header background (the route-specific ones)
    const greenHeaderRegex = /body\.route-(?:bahce-ekipmanlari|musluk-jaki)\s+\.category-header\s*\{[^}]*background:\s*linear-gradient[^}]*#34d399[^}]*\}/g;
    const before = html.length;
    html = html.replace(greenHeaderRegex, '');
    if (html.length !== before) changed = true;
    
    // Remove the green background-color override
    const greenBgRegex = /body\.route-(?:bahce-ekipmanlari|musluk-jaki)\s*\{\s*background-color:\s*#f2fcf5;\s*\}/g;
    const before2 = html.length;
    html = html.replace(greenBgRegex, '');
    if (html.length !== before2) changed = true;
    
    if (changed) {
        fs.writeFileSync(file, html);
        accordionFixed++;
    }
});
console.log(`Fixed accordion colors in ${accordionFixed} files`);

console.log('\n=== ALL FIXES APPLIED ===');

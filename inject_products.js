const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\kopya\\Pictures\\ÜZÜMCÜ\\Bahçe Ekipmanları';
const destDir = path.join(__dirname, 'resimler', 'bahce_ekipmanlari');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

let products = JSON.parse(fs.readFileSync('extracted_products.json', 'utf8'));
let indexHtml = fs.readFileSync('index.html', 'utf8');

const header = indexHtml.substring(0, indexHtml.indexOf('<main class="page-content">') + '<main class="page-content">'.length);
const footer = indexHtml.substring(indexHtml.indexOf('</main>'));

let productCards = '';

products.forEach(p => {
    const actualFileName = p.actualImageFile || (p.image ? p.image + '.png' : '');
    const srcImagePath = actualFileName ? path.join(srcDir, actualFileName) : '';
    
    // SKIP IF NO IMAGE (user requested: görseli olmayan ürünü koyma)
    if (!actualFileName || !fs.existsSync(srcImagePath)) {
        return;
    }

    const safeName = actualFileName.replace(/\s+/g, '_').replace(/"/g, 'inc').replace(/[^a-zA-Z0-9_\-\.]/g, '');
    const destImagePath = path.join(destDir, safeName);
    fs.copyFileSync(srcImagePath, destImagePath);
    const imgSrc = `resimler/bahce_ekipmanlari/${safeName}`;

    const codeDisplay = (p.code && p.code !== '-') ? p.code : '-';
    const packDisplay = (p.pack && p.pack !== '-') ? p.pack : '-';
    const boxDisplay = (p.box && p.box !== '-') ? p.box : '-';
    
    let parsedPrice = parseFloat(p.price);
    const priceDisplay = (p.price && p.price !== '-' && !isNaN(parsedPrice)) ? `₺ ${parsedPrice.toFixed(2)}` : '₺ 0.00';

    let perfTableHtml = '';
    if (p.performanceTable) {
        let rows = '';
        p.performanceTable.forEach(row => {
            rows += `<tr><td>${row.bar}</td><td>${row.m}</td><td>${row.lh}</td></tr>`;
        });
        perfTableHtml = `
            <table class="perf-table">
                <thead>
                    <tr><th>Bar</th><th>m</th><th>l/h</th></tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }

    productCards += `
        <div class="product-card" data-category="bahce" data-name="${p.name}">
            <span class="badge">${codeDisplay}</span>
            <img src="${imgSrc}" alt="${p.name}" onerror="this.src='resimler/placeholder.png'">
            <h3>${p.name}</h3>
            
            <div class="card-hover-details">
                ${perfTableHtml}
                <div class="price-display">${priceDisplay}</div>
                <div class="info-row"><span>Koli Adedi:</span> <strong>${boxDisplay}</strong></div>
                <div class="info-row"><span>Ambalaj:</span> <strong>${packDisplay}</strong></div>
                
                <div class="card-actions">
                    <div class="qty-selector">
                        <button type="button" class="qty-btn qty-minus">-</button>
                        <input type="number" class="qty-input" value="1" min="1" step="1">
                        <button type="button" class="qty-btn qty-plus">+</button>
                    </div>
                    <button type="button" class="add-to-cart-btn" 
                        data-product="${p.name}" 
                        data-price="${p.price}" 
                        data-code="${p.code}" 
                        data-box="${p.box}"
                        data-paket="${p.pack}">
                        <i class="fas fa-shopping-cart"></i> Sepete Ekle
                    </button>
                </div>
            </div>
        </div>`;
});

const pageContent = `
        <style id="bahce-card-inject-css">
            .hero-slider-container {
                width: 100%;
                height: 350px;
                border-radius: var(--border-radius);
                overflow: hidden;
                margin: 20px 0 40px 0;
                position: relative;
                box-shadow: var(--box-shadow);
            }
            .hero-slide {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                opacity: 0;
                transition: opacity 1.5s ease-in-out;
                z-index: 1;
            }
            .hero-slide.active {
                opacity: 1;
                z-index: 2;
            }

            .product-card {
                position: relative;
                height: 340px; 
                overflow: visible !important;
                z-index: 1;
                margin-bottom: 30px;
            }
            .product-card h3 {
                margin: 5px 0 10px 0;
                min-height: 40px;
            }
            .card-hover-details {
                position: absolute;
                top: 100%;
                left: -1px;
                right: -1px;
                background: #fff;
                border: 1px solid var(--border-color);
                border-top: none;
                border-bottom-left-radius: var(--border-radius);
                border-bottom-right-radius: var(--border-radius);
                padding: 0 20px 20px 20px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-5px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: var(--hover-shadow);
                z-index: -1;
            }
            .product-card:hover {
                z-index: 10;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                border-color: var(--border-color);
                box-shadow: none;
            }
            .product-card:hover .card-hover-details {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
                z-index: 10;
            }
            .price-display {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--primary-color);
                text-align: center;
                margin: 5px 0 15px 0;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--border-color);
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                font-size: 0.9rem;
                margin-bottom: 8px;
                color: var(--light-text-color);
            }
            .info-row strong {
                color: var(--text-color);
            }
            .card-actions {
                margin-top: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .qty-selector {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                overflow: hidden;
            }
            .qty-btn {
                background: #F8FAFC;
                border: none;
                padding: 10px 15px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.2s;
            }
            .qty-btn:hover { background: #E2E8F0; }
            .qty-input {
                width: 50px;
                text-align: center;
                border: none;
                font-weight: 600;
                outline: none;
            }
            .add-to-cart-btn {
                background: var(--primary-color);
                color: #fff;
                border: none;
                padding: 12px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.3s;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
            }
            .add-to-cart-btn:hover { background: var(--primary-hover); }
            
            .perf-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
                font-size: 0.8rem;
                text-align: center;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
            }
            .perf-table th {
                background: #F38562; /* Approximate orange color from screenshot */
                color: #000;
                padding: 4px;
                font-weight: 700;
                border: 1px solid #e2e8f0;
            }
            .perf-table td {
                padding: 4px;
                border: 1px solid #e2e8f0;
                background: #FBD6C8; /* Lighter orange for rows */
                color: #000;
                font-weight: 600;
            }

            .products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                gap: 25px;
                margin-top: 20px;
            }
        </style>

        <section id="bahce-ekipmanlari" class="page-content active" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            
            <!-- Page Header (Outside Slider) -->
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="font-size: 2.5rem; font-weight: 800; color: var(--primary-color); margin-bottom: 10px;">Bahçe Ekipmanları</h1>
                <p style="font-size: 1.1rem; color: var(--text-color);">Bahçenizin ihtiyacı olan en kaliteli bahçe sulama süzekleri ve fıskiyeleri tek bir yerde.</p>
            </div>

            <!-- Hero Slider -->
            <div class="hero-slider-container">
                <!-- 6 images, no humans, garden/irrigation products -->
                <div class="hero-slide active" style="background-image: url('resimler/slider/1.jpg');"></div>
                <div class="hero-slide" style="background-image: url('resimler/slider/2.jpg');"></div>
                <div class="hero-slide" style="background-image: url('resimler/slider/3.jpg');"></div>
                <div class="hero-slide" style="background-image: url('resimler/slider/4.jpg');"></div>
                <div class="hero-slide" style="background-image: url('resimler/slider/5.jpg');"></div>
                <div class="hero-slide" style="background-image: url('resimler/slider/6.jpg');"></div>
                <div class="hero-slide" style="background-image: url('resimler/slider/7.jpg');"></div>
            </div>

            <div class="products-grid">
                ${productCards}
            </div>
            
            <script>
                // Simple CSS Slider Logic
                let currentSlide = 0;
                const slides = document.querySelectorAll('.hero-slide');
                if(slides.length > 0) {
                    setInterval(() => {
                        slides[currentSlide].classList.remove('active');
                        currentSlide = (currentSlide + 1) % slides.length;
                        slides[currentSlide].classList.add('active');
                    }, 3500); // 3.5 saniye
                }
            </script>
        </section>
`;

const timestamp = Date.now();
const scriptTags = `\n    <script src="security.js" defer></script>\n    <script src="data.js?v=${timestamp}" defer></script>\n    <script src="site-engine.js?v=${timestamp}" defer></script>\n`;

let finalHtml = header + pageContent + footer;
finalHtml = finalHtml.replace('</head>', scriptTags + '</head>');
finalHtml = finalHtml.replace(/<title>[^<]*<\/title>/, '<title>Bahçe Ekipmanları - BAYRAKÇI SULAMA VE YAPI MALZEMELERİ</title>');
finalHtml = finalHtml.replace(/cart\.js\?v=\d+/g, `cart.js?v=${timestamp}`);

const base64Encoded = Buffer.from(unescape(encodeURIComponent(finalHtml)), 'binary').toString('base64');

let dataJs = fs.readFileSync('data.js', 'utf8');
const regex = /("bahce-ekipmanlari\.html"\s*:\s*")[^"]+(")/;
if (regex.test(dataJs)) {
    dataJs = dataJs.replace(regex, '$1' + base64Encoded + '$2');
    fs.writeFileSync('data.js', dataJs);
    console.log('Successfully updated data.js with bahce-ekipmanlari.html. Total products generated: ' + (productCards.match(/class="product-card"/g) || []).length);
}

fs.writeFileSync('bahce_ekipmanlari_generated.html', finalHtml, 'utf8');
fs.writeFileSync('bahce-ekipmanlari.html', finalHtml, 'utf8');
console.log('Updated bahce-ekipmanlari.html (static) and data.js (dynamic). Timestamp: ' + timestamp);

const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\kopya\\Pictures\\ÜZÜMCÜ\\Bahçe Ekipmanlarý';
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
    let imgSrc = 'resimler/placeholder.png';
    const actualFileName = p.actualImageFile || (p.image ? p.image + '.png' : '');
    const srcImagePath = actualFileName ? path.join(srcDir, actualFileName) : '';
    
    if (actualFileName && fs.existsSync(srcImagePath)) {
        const safeName = actualFileName.replace(/\s+/g, '_').replace(/\"/g, 'inc').replace(/[^a-zA-Z0-9_\-\.]/g, '');
        const destImagePath = path.join(destDir, safeName);
        fs.copyFileSync(srcImagePath, destImagePath);
        imgSrc = \esimler/bahce_ekipmanlari/\\;
    }

    const codeDisplay = (p.code && p.code !== '-') ? p.code : '-';
    const packDisplay = (p.pack && p.pack !== '-') ? p.pack : '-';
    const boxDisplay = (p.box && p.box !== '-') ? p.box : '-';
    const priceDisplay = (p.price && p.price !== '-') ? \? \\ : '? 0.00';

    productCards += \
        <div class="product-card" data-category="bahce" data-name="\">
            <span class="badge">\</span>
            <img src="\" alt="\" onerror="this.src='resimler/placeholder.png'">
            <h3>\</h3>
            
            <div class="card-hover-details">
                <div class="price-display">\</div>
                <div class="info-row"><span>Koli Adedi:</span> <strong>\</strong></div>
                <div class="info-row"><span>Ambalaj:</span> <strong>\</strong></div>
                
                <div class="card-actions">
                    <div class="qty-selector">
                        <button type="button" class="qty-btn qty-minus">-</button>
                        <input type="number" class="qty-input" value="1" min="1" step="1">
                        <button type="button" class="qty-btn qty-plus">+</button>
                    </div>
                    <button type="button" class="add-to-cart-btn" 
                        data-product="\" 
                        data-price="\" 
                        data-code="\" 
                        data-box="\"
                        data-paket="\">
                        <i class="fas fa-shopping-cart"></i> Sepete Ekle
                    </button>
                </div>
            </div>
        </div>\;
});

const pageContent = \
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
            .hero-slide::after {
                content: '';
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(to right, rgba(0,71,151,0.7) 0%, rgba(0,71,151,0.2) 100%);
            }

            .product-card {
                position: relative;
                height: 320px; /* Base height */
                overflow: visible !important;
                z-index: 1;
                margin-bottom: 20px;
            }
            .product-card:hover {
                z-index: 10;
            }
            .card-hover-details {
                position: absolute;
                top: 100%;
                left: -1px;
                right: -1px;
                background: #fff;
                border: 1px solid rgba(0, 71, 151, 0.2);
                border-top: none;
                border-bottom-left-radius: var(--border-radius);
                border-bottom-right-radius: var(--border-radius);
                padding: 0 20px 20px 20px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 20px 35px -5px rgba(0, 71, 151, 0.15);
                z-index: -1;
            }
            .product-card:hover {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
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
                margin: 10px 0;
                padding-bottom: 10px;
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
            
            .products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                gap: 25px;
                margin-top: 30px;
            }
        </style>

        <section id="bahce-ekipmanlari" class="page-content active" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: var(--primary-color); font-size: 2.5rem; font-weight: 800; margin-bottom: 10px;">Bahçe Ekipmanlarý</h1>
                <p style="color: var(--light-text-color); font-size: 1.1rem;">Bahçenizin ihtiyacý olan en kaliteli bahçe sulama süzekleri ve fýskiyeleri tek bir yerde.</p>
            </div>
            
            <!-- Hero Slider -->
            <div class="hero-slider-container">
                <!-- Using aesthetic Unsplash images for garden/irrigation, no humans -->
                <div class="hero-slide active" style="background-image: url('https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1200&auto=format&fit=crop');"></div>
                <div class="hero-slide" style="background-image: url('https://images.unsplash.com/photo-1416879598553-61f2510b65bf?q=80&w=1200&auto=format&fit=crop');"></div>
                <div class="hero-slide" style="background-image: url('https://images.unsplash.com/photo-1592424001815-568393e3d231?q=80&w=1200&auto=format&fit=crop');"></div>
            </div>

            <div class="products-grid">
                \
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
                    }, 4000);
                }
            </script>
        </section>
\;

const timestamp = Date.now();
const scriptTags = \\\n    <script src="security.js" defer></script>\\n    <script src="data.js?v=\" defer></script>\\n    <script src="site-engine.js?v=\" defer></script>\\n\;

let finalHtml = header + pageContent + footer;
finalHtml = finalHtml.replace('</head>', scriptTags + '</head>');
finalHtml = finalHtml.replace(/<title>[^<]*<\\/title>/, '<title>Bahçe Ekipmanlarý - BAYRAKÇI SULAMA VE YAPI MALZEMELERÝ</title>');
finalHtml = finalHtml.replace(/cart\\.js\\?v=\\d+/g, \cart.js?v=\\);

const base64Encoded = Buffer.from(unescape(encodeURIComponent(finalHtml)), 'binary').toString('base64');

let dataJs = fs.readFileSync('data.js', 'utf8');
const regex = /("bahce-ekipmanlari\\.html"\\s*:\\s*")[^"]+(")/;
if (regex.test(dataJs)) {
    dataJs = dataJs.replace(regex, '' + base64Encoded + '');
    fs.writeFileSync('data.js', dataJs);
    console.log('Successfully updated data.js with bahce-ekipmanlari.html. Total products: ' + products.length);
}

fs.writeFileSync('bahce_ekipmanlari_generated.html', finalHtml);
fs.writeFileSync('bahce-ekipmanlari.html', finalHtml);
console.log('Updated bahce-ekipmanlari.html (static) and data.js (dynamic). Timestamp: ' + timestamp);

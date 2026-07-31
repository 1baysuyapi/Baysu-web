import os
import urllib.parse
import re

def slugify(text):
    text = text.lower()
    text = text.replace('ç', 'c').replace('ğ', 'g').replace('ı', 'i').replace('ö', 'o').replace('ş', 's').replace('ü', 'u')
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
    return text

def generate_html_for_category(category_dir_name, category_title, base_code):
    images_dir = os.path.join('images', 'bahce', category_dir_name)
    if not os.path.exists(images_dir):
        return
    
    files = [f for f in os.listdir(images_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    files.sort()
    
    html = f'''<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{category_title} - BAYRAKÇI SULAMA VE YAPI MALZEMELERİ</title>
<script src="security.js"></script>
<script src="data.js?v=1019"></script>
<script src="site-engine.js?v=1019"></script>
<style>
/* Grid Styles */
.image-product-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;
}}
.image-product-card {{
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
}}
.image-product-card:hover {{
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}}
.ipc-code {{
    position: absolute;
    top: 0;
    left: 0;
    background: #f8f9fa;
    color: #e63946;
    font-weight: bold;
    padding: 5px 10px;
    border-bottom-right-radius: 8px;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    z-index: 2;
}}
.ipc-img-container {{
    height: 180px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}}
.ipc-img-container img {{
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}}
.ipc-title {{
    padding: 15px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    border-top: 1px solid #e0e0e0;
    min-height: 50px;
    display: flex;
    align-items: center;
}}
/* Hover Reveal Section */
.ipc-details {{
    background: #f8f9fa;
    padding: 15px;
    border-top: 1px solid #e0e0e0;
    display: none; /* hidden by default */
    flex-direction: column;
    gap: 10px;
}}
.image-product-card:hover .ipc-details {{
    display: flex;
}}
.ipc-info-row {{
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #555;
}}
.ipc-price {{
    font-size: 16px;
    font-weight: bold;
    color: #e63946;
    text-align: right;
}}
.ipc-add-btn {{
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}}
.ipc-add-btn:hover {{
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
}}
</style>
</head>
<body oncontextmenu="return false;" onselectstart="return false;" ondragstart="return false;">

    <main class="page-content">
        <div class="breadcrumb">
            <a href="index.html">Ana Sayfa</a> &gt; <span>Bahçe Sulama Sistemleri</span> &gt; <span>{category_title}</span>
        </div>

        <section class="products-section">
            <h1 class="section-title">{category_title}</h1>
            <div class="image-product-grid">
'''
    current_code = base_code
    for f in files:
        product_name = os.path.splitext(f)[0]
        # Clean up name if it has a number prefix like "1-2"
        img_url = f"images/bahce/{category_dir_name}/{f}"
        
        # We need to URL encode the filename because it contains spaces and special chars
        img_url_encoded = f"images/bahce/{category_dir_name}/{urllib.parse.quote(f)}"
        
        # Test values
        price = 50.00
        koli = 100
        ambalaj = "Paket"
        
        # Create an add to cart string format. We'll use a special class to identify image products for the WhatsApp cart
        
        html += f'''
                <div class="image-product-card">
                    <div class="ipc-code">{current_code}</div>
                    <div class="ipc-img-container">
                        <img src="{img_url_encoded}" alt="{product_name}" loading="lazy">
                    </div>
                    <div class="ipc-title">{product_name}</div>
                    <div class="ipc-details">
                        <div class="ipc-info-row">
                            <span>Koli Adedi:</span>
                            <strong>{koli}</strong>
                        </div>
                        <div class="ipc-info-row">
                            <span>Ambalaj:</span>
                            <strong>{ambalaj}</strong>
                        </div>
                        <div class="ipc-price">{price:.2f} TL</div>
                        
                        <button class="ipc-add-btn" onclick="if(window.baysuAddToCartImageProduct) window.baysuAddToCartImageProduct('{current_code}', '{product_name.replace("'", "\\'")}', {price}, {koli})">
                            <i class="fas fa-shopping-cart"></i> Sepete Ekle
                        </button>
                    </div>
                </div>
'''
        current_code += 1

    html += '''
            </div>
        </section>
    </main>

</body>
</html>
'''
    with open(f'{category_dir_name}.html', 'w', encoding='utf-8') as outfile:
        outfile.write(html)
    print(f"Generated {category_dir_name}.html with {len(files)} products.")

generate_html_for_category('bahce-ekipmanlari', 'Bahçe Ekipmanları', 129)
generate_html_for_category('depo-rekorlari', 'Depo Rekorları', 200)
generate_html_for_category('hortum-ek-parcalari', 'Hortum Ek Parçaları', 300)
generate_html_for_category('musluk-jaki', 'Musluk Jakı Ve Rekorları', 400)

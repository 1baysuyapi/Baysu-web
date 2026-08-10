const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const headerRegex = /<header class="header-main">[\s\S]*?<\/header>/;
const navRegex = /<nav class="nav-bar">[\s\S]*?<\/nav>/;
const indexHeader = indexHtml.match(headerRegex)[0];
const indexNav = indexHtml.match(navRegex)[0];

const products = [
    {
        filename: 'ayarli-hortum-eki.html',
        title: 'Ayarlı Hortum Eki',
        category: 'Bahçe Sulama Sistemleri - Hortum Ek Parçaları',
        image: 'Ayarlı Hortum Eki.png',
        desc: 'Ayarlı Hortum Eki, bahçe sulama sistemlerinde hortum bağlantılarını güvenli ve sızdırmaz şekilde sağlamak için kullanılır. Yüksek kaliteli malzemeden üretilmiştir.',
        items: [] // To be filled by user
    },
    {
        filename: 'ayarli-hortum-te.html',
        title: 'Ayarlı Hortum TE',
        category: 'Bahçe Sulama Sistemleri - Hortum Ek Parçaları',
        image: 'Ayarlı Hortum TE.png',
        desc: 'Ayarlı Hortum TE, hortum hatlarını üç yönlü olarak birleştirmek veya ayırmak için idealdir. Dayanıklı yapısıyla uzun ömürlü kullanım sunar.',
        items: []
    },
    {
        filename: 'hortum-eki.html',
        title: 'Hortum Eki',
        category: 'Bahçe Sulama Sistemleri - Hortum Ek Parçaları',
        image: 'Hortum Eki.png',
        desc: 'Standart Hortum Eki, hasar görmüş hortumları onarmak veya iki farklı hortumu birbirine eklemek için pratik bir çözümdür.',
        items: []
    },
    {
        filename: 'hortum-reduksiyonu.html',
        title: 'Hortum Redüksiyonu',
        category: 'Bahçe Sulama Sistemleri - Hortum Ek Parçaları',
        image: 'Hortum Rediksiyonu.png',
        desc: 'Hortum Redüksiyonu, farklı çaplardaki hortumları birbirine bağlamak için kullanılır. Sızdırmazlık garantisi ile sulama sisteminizin verimini artırır.',
        items: []
    },
    {
        filename: 'hortum-te.html',
        title: 'Hortum TE',
        category: 'Bahçe Sulama Sistemleri - Hortum Ek Parçaları',
        image: 'Hortum TE.png',
        desc: 'Standart Hortum TE, bahçe sulama sisteminizde suyu birden fazla yöne dağıtmanızı sağlayan güvenilir bir ek parçasıdır.',
        items: []
    }
];

products.forEach(p => {
    let outHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${p.title} - BAYRAKÇI SULAMA</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        :root {
            --primary-color: #004797;
            --secondary-color: #0288D1;
            --accent-color: #FFC107;
            --bg-color: #F8FAFC;
            --card-background: #ffffff;
            --text-color: #334155;
            --light-text-color: #64748B;
            --border-radius: 12px;
            --box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--bg-color);
            margin: 0;
            padding: 0;
            color: var(--text-color);
        }

        .product-detail-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            padding: 20px;
            max-width: 1200px;
            margin: 20px auto;
            background: var(--card-background);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
        }

        .product-image {
            flex: 1 1 400px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            background: #F1F5F9;
            border-radius: 8px;
        }

        .product-image img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }

        .product-info {
            flex: 1 1 400px;
            padding: 20px;
            box-sizing: border-box;
        }

        .product-category {
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--secondary-color);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }

        .product-title {
            font-size: 1.75rem;
            font-weight: 800;
            color: var(--primary-color);
            margin: 0 0 12px 0;
            line-height: 1.25;
        }

        .product-features-box {
            background: #F8FAFC;
            border: 1px solid #CBD5E1;
            border-radius: 12px;
            padding: 14px 16px;
            font-size: 13.5px;
            color: var(--text-color);
            line-height: 1.5;
            margin-bottom: 12px;
        }
        
        .discount-badge-bar {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #ECFDF5;
            border-left: 4px solid #10B981;
            padding: 10px 14px;
            border-radius: 4px 8px 8px 4px;
            margin: 15px 0;
            font-size: 0.85rem;
            color: #065F46;
        }

        /* PREMIUM BLUE TABLE CSS */
        .table-wrapper {
            overflow-x: auto;
            margin-top: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            background: #fff;
            border: 1px solid #eaeaea;
        }
        .premium-table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'Poppins', sans-serif;
            color: #333;
            text-align: center;
        }
        .premium-table th, .premium-table td {
            padding: 16px 12px;
            vertical-align: middle;
        }
        .premium-table th {
            background: linear-gradient(135deg, #002244 0%, #005599 100%);
            color: #ffffff;
            font-weight: 700;
            font-size: 14px;
            border-right: 1px solid rgba(255,255,255,0.1);
            white-space: nowrap;
        }
        .premium-table th:last-child { border-right: none; }
        .premium-table tbody tr { border-bottom: 1px solid #f0f0f0; }
        .premium-table tbody tr:nth-child(even) { background-color: #f9fbfc; }
        .premium-table tbody tr:hover { background-color: #f1f6fa; }
        .premium-table td { font-size: 15px; }

        .ebat-pill {
            background: #e8f4fd;
            color: #005599;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 13px;
            display: inline-block;
        }
        .price-val {
            font-weight: 800;
            color: #002244;
            font-size: 16px;
        }
        
        .qty-controls {
            display: inline-flex;
            align-items: center;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 20px;
            padding: 2px;
        }
        .qty-btn {
            background: none;
            border: none;
            color: #004797;
            font-size: 16px;
            width: 28px;
            height: 28px;
            cursor: pointer;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.2s;
        }
        .qty-btn:hover { background: #e9ecef; }
        .qty-input {
            width: 40px;
            text-align: center;
            border: none;
            background: transparent;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 14px;
            color: #333;
        }
        .qty-input:focus { outline: none; }
        
        .add-btn {
            background: #004797;
            color: #fff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .add-btn:hover {
            background: #002244;
            box-shadow: 0 4px 10px rgba(0,71,151,0.3);
            transform: translateY(-1px);
        }

        .whatsapp-float-wrapper {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000;
        }

        @media (max-width: 768px) {
            .product-info { padding: 10px; }
            .product-title { font-size: 1.4rem; }
        }
    </style>
</head>
<body>
    ${indexHeader}
    ${indexNav}

    <main>
        <div class="product-detail-container">
            <div class="product-image">
                <img src="${p.image}" alt="${p.title}">
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <h1 class="product-title">${p.title}</h1>
                <div class="product-features-box">
                    ${p.desc}
                </div>
                <div class="discount-badge-bar">
                    <i class="fas fa-percentage" style="font-size: 16px; color: #10B981;"></i>
                    <span><strong>Özel İskonto Fırsatı:</strong> Toplu alımlarda ve sepete ekleyeceğiniz tüm ürünlerde sepette özel iskonto uygulanır.</span>
                </div>
            </div>
        </div>

        <div class="full-width-table-section" style="max-width: 1200px; margin: 0 auto 40px auto; padding: 20px; background: var(--card-background, #fff); border-radius: var(--border-radius, 12px); box-shadow: var(--box-shadow, 0 4px 20px rgba(0,0,0,0.05)); box-sizing: border-box;">
            <div class="product-section-title" style="font-size: 1.1rem; font-weight: 700; color: #004797; margin-bottom: 12px;">Ölçü ve Fiyat Listesi</div>
            <div class="table-wrapper">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th>KOD</th>
                            <th>EBAT</th>
                            <th>AMBALAJ</th>
                            <th>KOLİ ADEDİ</th>
                            <th>FİYAT (TL)</th>
                            <th>MİKTAR</th>
                            <th>İŞLEM</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Items will be injected here later when user provides data -->
                        <tr>
                            <td colspan="7" style="color: #666; font-style: italic;">Fiyat ve ölçü bilgileri yakında eklenecektir...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <div class="whatsapp-float-wrapper">
        <a href="https://wa.me/905533973603?text=Merhaba,%20Baysu%20Yap%C4%B1%20web%20sitenizden%20${encodeURIComponent(p.title)}%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." 
           target="_blank" 
           class="add-btn" 
           style="background: #25D366; padding: 12px 24px; border-radius: 50px; font-size: 15px; box-shadow: 0 4px 15px rgba(37,211,102,0.4);">
            <i class="fab fa-whatsapp" style="font-size: 20px;"></i> SİPARİŞ & DESTEK
        </a>
    </div>

    <script src="site-engine.js?v=${Date.now()}"></script>
</body>
</html>`;

    fs.writeFileSync(p.filename, outHtml);
    console.log('Created ' + p.filename);
});

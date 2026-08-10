const fs = require('fs');

const kaplinHtml = fs.readFileSync('kaplin_sample.html', 'utf8');

const products = [
    {
        id: 'cift-tarafli-depo-rekoru',
        title: 'Çift Taraflı Depo Rekoru',
        image: 'resimler/depo_rekorlari/cift_tarafli_depo_rekoru.png',
        desc: 'Depo giriş ve çıkışlarında sızdırmazlık sağlamak üzere tasarlanmış, yüksek kaliteli hammaddeden üretilmiş çift taraflı depo rekoru.',
        data: [
            {kod:'326', ebat:'1/2"', fiyat:'65.00', koli:'-'},
            {kod:'327', ebat:'3/4"', fiyat:'72.00', koli:'-'},
            {kod:'328', ebat:'1"', fiyat:'78.00', koli:'-'}
        ]
    },
    {
        id: 'depo-rekoru-ters-dis',
        title: 'Depo Rekoru (Ters Diş)',
        image: 'resimler/depo_rekorlari/depo_rekoru_ters_dis.png',
        desc: 'Ters dişli yapısı sayesinde montaj kolaylığı ve maksimum sızdırmazlık sunan yüksek kaliteli depo rekoru.',
        data: [
            {kod:'275', ebat:'1/2"', fiyat:'83.00', koli:'400'},
            {kod:'276', ebat:'3/4"', fiyat:'83.00', koli:'400'},
            {kod:'277', ebat:'1"', fiyat:'90.00', koli:'250'},
            {kod:'278', ebat:'1 1/4"', fiyat:'135.00', koli:'125'},
            {kod:'279', ebat:'1 1/2"', fiyat:'150.00', koli:'125'},
            {kod:'280', ebat:'2"', fiyat:'185.00', koli:'75'},
            {kod:'281', ebat:'3"', fiyat:'420.00', koli:'25'},
            {kod:'282', ebat:'4"', fiyat:'540.00', koli:'18'}
        ]
    },
    {
        id: 'sintine-rekoru-ters-dis',
        title: 'Sintine Rekoru (Ters Diş)',
        image: 'resimler/depo_rekorlari/sintine_rekoru_ters_dis.png',
        desc: 'Özellikle dar alanlarda ve sintine tahliye noktalarında kullanılmak üzere tasarlanmış ters dişli sintine rekoru.',
        data: [
            {kod:'236', ebat:'3/4"', fiyat:'80.00', koli:'350'},
            {kod:'237', ebat:'1"', fiyat:'80.00', koli:'200'},
            {kod:'238', ebat:'1 1/4"', fiyat:'115.00', koli:'125'},
            {kod:'239', ebat:'1 1/2"', fiyat:'130.00', koli:'125'}
        ]
    },
    {
        id: 'pvc-hortum-rekoru',
        title: 'PVC Hortum Rekoru',
        image: 'resimler/depo_rekorlari/pvc_hortum_rekoru.png',
        desc: 'PVC hortum bağlantıları için basınca ve dış etkenlere dayanıklı sızdırmaz hortum rekoru.',
        data: [
            {kod:'241', ebat:'1/2"', fiyat:'13.00', koli:'1250'},
            {kod:'242', ebat:'3/4"', fiyat:'14.00', koli:'1000'},
            {kod:'243', ebat:'1"', fiyat:'27.50', koli:'500'},
            {kod:'244', ebat:'1 1/4"', fiyat:'32.00', koli:'300'},
            {kod:'245', ebat:'1 1/2"', fiyat:'40.00', koli:'200'},
            {kod:'246', ebat:'2"', fiyat:'67.00', koli:'120'},
            {kod:'247', ebat:'2 1/2"', fiyat:'90.00', koli:'75'},
            {kod:'248', ebat:'3"', fiyat:'145.00', koli:'40'},
            {kod:'249', ebat:'4"', fiyat:'200.00', koli:'25'}
        ]
    },
    {
        id: 'galvanizli-hortum-rekoru',
        title: 'Galvanizli Hortum Rekoru',
        image: 'resimler/depo_rekorlari/galvanizli_hortum_rekoru.png',
        desc: 'Ağır hizmet şartlarına uygun, yüksek mukavemetli galvanizli kaplaması sayesinde paslanmaya karşı dirençli hortum rekoru.',
        data: [
            {kod:'251', ebat:'1/2"', fiyat:'70.00', koli:'500'},
            {kod:'252', ebat:'3/4"', fiyat:'80.00', koli:'300'},
            {kod:'253', ebat:'1"', fiyat:'95.00', koli:'200'},
            {kod:'254', ebat:'1 1/4"', fiyat:'110.00', koli:'100'},
            {kod:'255', ebat:'1 1/2"', fiyat:'130.00', koli:'100'},
            {kod:'256', ebat:'2"', fiyat:'175.00', koli:'60'},
            {kod:'257', ebat:'2 1/2"', fiyat:'215.00', koli:'30'},
            {kod:'258', ebat:'3"', fiyat:'320.00', koli:'24'},
            {kod:'259', ebat:'4"', fiyat:'530.00', koli:'30'}
        ]
    },
    {
        id: 'ozel-depo-rekoru',
        title: 'Özel Depo Rekoru',
        image: 'resimler/depo_rekorlari/ozel_depo_rekoru.png',
        desc: 'Özel projeler ve endüstriyel kullanımlar için geliştirilmiş yüksek toleranslı özel üretim depo rekoru.',
        data: [
            {kod:'318', ebat:'1/2"', fiyat:'65.00', koli:'200'},
            {kod:'319', ebat:'3/4"', fiyat:'65.00', koli:'200'},
            {kod:'320', ebat:'1"', fiyat:'65.00', koli:'200'},
            {kod:'321', ebat:'1 1/4"', fiyat:'65.00', koli:'180'},
            {kod:'322', ebat:'1 1/2"', fiyat:'65.00', koli:'160'},
            {kod:'323', ebat:'2"', fiyat:'65.00', koli:'150'},
            {kod:'324', ebat:'2 1/2" (l)', fiyat:'220.00', koli:'-'},
            {kod:'325', ebat:'3" (l)', fiyat:'235.00', koli:'-'}
        ]
    }
];

const svgCart = '<svg viewBox="0 0 576 512" style="width:14px; height:14px; fill:currentColor;"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>';

function generateTableHtml(groupArr, namePrefix) {
    let html = `
<style>
/* PREMIUM BLUE TABLE */
.table-wrapper {
    overflow-x: auto;
    margin-top: 30px;
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
}
.premium-table th:last-child {
    border-right: none;
}
.premium-table tbody tr {
    border-bottom: 1px solid #f0f0f0;
}
.premium-table tbody tr:nth-child(even) {
    background-color: #f9fbfc;
}
.premium-table tbody tr:hover {
    background-color: #f1f6fa;
}
.premium-table td {
    font-size: 15px;
}

/* EBAT PILL */
.ebat-pill {
    display: inline-block;
    border: 1px solid #cce0ff;
    background-color: #f0f7ff;
    color: #0056b3;
    border-radius: 6px;
    padding: 6px 14px;
    font-weight: 700;
    font-size: 14px;
    white-space: nowrap;
}
.koli-text { color: #555; font-weight: 500; }
.fiyat-text {
    color: #0a3d7c;
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;
}

/* STEPPER */
.qty-stepper {
    display: inline-flex;
    align-items: center;
    border: 1px solid #ced4da;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
    height: 34px;
}
.stepper-btn {
    background: #f8f9fa;
    color: #0a3d7c;
    border: none;
    width: 32px;
    height: 100%;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
}
.stepper-btn.minus { border-right: 1px solid #ced4da; }
.stepper-btn.plus { border-left: 1px solid #ced4da; }
.stepper-btn:hover { background: #e9ecef; }
.qty-stepper input {
    width: 40px;
    height: 100%;
    border: none;
    text-align: center;
    font-weight: 700;
    color: #333;
    -moz-appearance: textfield;
}
.qty-stepper input::-webkit-outer-spin-button,
.qty-stepper input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* CART BTN */
.cart-btn {
    background: linear-gradient(135deg, #003366 0%, #005599 100%);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-weight: bold;
    font-size: 13px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: 0.2s;
    white-space: nowrap;
}
.cart-btn:hover {
    background: linear-gradient(135deg, #001a33 0%, #004480 100%);
}
</style>
<div class="table-wrapper">
<table class="premium-table">
    <thead>
        <tr><th>KOD</th><th>EBAT</th><th>KOLİ ADEDİ</th><th>FİYAT (TL)</th><th>MİKTAR</th><th>İŞLEM</th></tr>
    </thead>
    <tbody>
`;

    groupArr.forEach(item => {
        let fmtFiyat = item.fiyat.replace('.', ',') + ' TL';
        let ambalaj = item.koli === '-' ? '-' : (item.koli + ' Adet');
        let itemName = namePrefix + ' ' + item.ebat.replace(/"/g, '&quot;');
        
        let minusScript = `var inp=document.getElementById('qty-${item.kod}'); if(inp.value>1) inp.value--`;
        let plusScript = `var inp=document.getElementById('qty-${item.kod}'); inp.value++`;
        let cartScript = `var q=parseInt(document.getElementById('qty-${item.kod}').value)||1; if(window.addToCart){ for(var i=0;i<q;i++) window.addToCart('${itemName}', ${item.fiyat}, '${item.kod}', '${item.koli}'); alert(q + ' adet sepete eklendi!'); } else { alert('Sepet sistemi hazır değil'); }`;

        html += `<tr>
            <td style="font-weight:bold;">${item.kod}</td>
            <td><span class="ebat-pill">${item.ebat}</span></td>
            <td><span class="koli-text">${ambalaj}</span></td>
            <td><span class="fiyat-text">${fmtFiyat}</span></td>
            <td>
                <div class="qty-stepper" onclick="event.stopPropagation()">
                    <button type="button" class="stepper-btn minus" onclick="${minusScript}">-</button>
                    <input type="number" id="qty-${item.kod}" value="1" min="1">
                    <button type="button" class="stepper-btn plus" onclick="${plusScript}">+</button>
                </div>
            </td>
            <td>
                <button class="cart-btn" type="button" onclick="${cartScript}">
                    ${svgCart} Sepete Ekle
                </button>
            </td>
        </tr>`;
    });
    
    html += `</tbody></table></div>`;
    return html;
}

for (const prod of products) {
    let outHtml = kaplinHtml;

    // 1. Replace Title in <title>
    outHtml = outHtml.replace(/<title>.*?<\/title>/, `<title>${prod.title} - BAYSU YAPI VE SULAMA MALZEMELERİ</title>`);
    
    // 2. Replace breadcrumb / Category label (e.g. Mavi Seri > Mavi Seri Dişi Kaplin)
    outHtml = outHtml.replace(/<span class="product-category">.*?<\/span>/, `<span class="product-category">REKORLAR > ${prod.title}</span>`);

    // 3. Replace main product title
    outHtml = outHtml.replace(/<h1 class="product-title">.*?<\/h1>/, `<h1 class="product-title">${prod.title}</h1>`);

    // 4. Replace product image
    outHtml = outHtml.replace(/<div class="product-image">[\s\S]*?<img src=".*?"[\s\S]*?<\/div>/, 
        `<div class="product-image"><img src="${prod.image}" alt="${prod.title}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;"></div>`);

    // 5. Replace description
    outHtml = outHtml.replace(/<p class="product-description">.*?<\/p>/, `<p class="product-description">${prod.desc}</p>`);

    // 6. Replace size options and table
    const newTableHtml = generateTableHtml(prod.data, prod.title);
    
    // Remove old size options
    outHtml = outHtml.replace(/<div class="product-section-title">.*?<\/div>[\s\S]*?<div class="size-options">[\s\S]*?<\/div>/, '');

    // Replace the old table with our new table
    outHtml = outHtml.replace(/<div class="table-responsive">[\s\S]*?<\/table>\s*<\/div>/, newTableHtml);
    
    // Remove "Depo Rekorları" from the top nav if it's there
    outHtml = outHtml.replace(/Depo Rekorları/g, 'Rekorlar');

    // Update nav-bar to match index.html
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const indexNavMatch = indexHtml.match(/<nav class="nav-bar">[\s\S]*?<\/nav>/);
    if (indexNavMatch) {
        outHtml = outHtml.replace(/<nav class="nav-bar">[\s\S]*?<\/nav>/, indexNavMatch[0]);
    }

    fs.writeFileSync(prod.id + '.html', outHtml);
    console.log('Created ' + prod.id + '.html');
}

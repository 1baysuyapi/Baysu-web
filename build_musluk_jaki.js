const fs = require('fs');

const template = fs.readFileSync('bahce-ekipmanlari.html', 'utf8');

// The data we just extracted
const products = [
  {
    "name": "Batarya Jak Rekoru",
    "img": "WhatsApp Image 2025-07-25 at 23.57.19-Photoroom.png",
    "code": "100",
    "ebat": "-",
    "ambalaj": "25",
    "koli": "250",
    "price": "175.00"
  },
  {
    "name": "Mix Batarya Jak Rekoru",
    "img": "WhatsApp Image 2025-07-25 at 23.57.20 (1)-Photoroom.png",
    "code": "101",
    "ebat": "-",
    "ambalaj": "25",
    "koli": "250",
    "price": "175.00"
  },
  {
    "name": "Batarya Hortum Rekoru",
    "img": "WhatsApp Image 2025-07-25 at 23.57.20-Photoroom.png",
    "code": "102",
    "ebat": "-",
    "ambalaj": "25",
    "koli": "250",
    "price": "180.00"
  },
  {
    "name": "Mix Batarya Hortum Rekoru",
    "img": "WhatsApp Image 2025-07-25 at 23.57.21-Photoroom.png",
    "code": "103",
    "ebat": "-",
    "ambalaj": "25",
    "koli": "250",
    "price": "180.00"
  },
  {
    "name": "Otomatik Kelepçeli Musluk Bağlantısı",
    "img": "WhatsApp Image 2025-07-25 at 23.57.19 (1)-Photoroom.png",
    "code": "128",
    "ebat": "-",
    "ambalaj": "25",
    "koli": "250",
    "price": "95.00"
  },
  {
    "name": "1/2\" Jak Ekleme",
    "img": "1/2\" Jak Ekleme.png",
    "code": "180",
    "ebat": "-",
    "ambalaj": "25",
    "koli": "250",
    "price": "55.00"
  },
  {
    "name": "3/4\" Jak Ekleme",
    "img": "3/4\" Jak Ekleme.png",
    "code": "192",
    "ebat": "-",
    "ambalaj": "25",
    "koli": "250",
    "price": "72.00"
  },
  {
    "name": "3/4\" Jak Rekoru",
    "img": "3/4\" Jak Rekoru.png",
    "code": "183",
    "ebat": "-",
    "ambalaj": "100",
    "koli": "1000",
    "price": "30.00"
  },
  {
    "name": "1/2\" Jak Rekoru",
    "img": "1/2\" Jak Rekoru.png",
    "code": "193",
    "ebat": "-",
    "ambalaj": "100",
    "koli": "1000",
    "price": "30.00"
  },
  {
    "name": "3/4\" - 1/2\" Jak Rekoru",
    "img": "3/4\" - 1/2\" Jak Rekoru.png",
    "code": "235",
    "ebat": "-",
    "ambalaj": "75",
    "koli": "750",
    "price": "43.00"
  },
  {
    "name": "1/2\" Stoplu Jak Ekleme",
    "img": "1/2\" Stoplu Jak Ekleme.png",
    "code": "314",
    "ebat": "-",
    "ambalaj": "25",
    "koli": "250",
    "price": "65.00"
  },
  {
    "name": "3/4\" Stoplu Jak Ekleme",
    "img": "3/4\" Stoplu Jak Ekleme.png",
    "code": "315",
    "ebat": "-",
    "ambalaj": "25",
    "koli": "250",
    "price": "80.00"
  }
];

let cardsHtml = '';
for (const p of products) {
    cardsHtml += `
        <div class="product-card" data-category="musluk-jaki" data-name="${p.name}">
            <span class="badge">${p.code}</span>
            <img src="${p.img}" alt="${p.name}" onerror="this.src='resimler/placeholder.png'">
            <h3>${p.name}</h3>
            
            <div class="card-hover-details">
                <div class="price-display">₺ ${p.price}</div>
                <div class="info-row"><span>Koli Adedi:</span> <strong>${p.koli}</strong></div>
                <div class="info-row"><span>Ambalaj:</span> <strong>${p.ambalaj}</strong></div>
                
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
                        data-box="${p.koli}"
                        data-paket="${p.ambalaj}">
                        <i class="fas fa-shopping-cart"></i> Sepete Ekle
                    </button>
                </div>
            </div>
        </div>
`;
}

// Replace the title
let newHtml = template.replace(
    '<title>Bahçe Ekipmanları - BAYRAKÇI SULAMA VE YAPI MALZEMELERİ</title>', 
    '<title>Musluk Jakı Ve Rekorları - BAYRAKÇI SULAMA VE YAPI MALZEMELERİ</title>'
);

// Remove the hero slider
const sliderStart = newHtml.indexOf('<!-- Hero Slider -->');
const sliderEnd = newHtml.indexOf('<div class="products-grid">');
if (sliderStart > -1 && sliderEnd > -1) {
    newHtml = newHtml.substring(0, sliderStart) + newHtml.substring(sliderEnd);
}

// Replace page title/subtitle
newHtml = newHtml.replace(
    '<h1 style="font-size: 2.5rem; font-weight: 800; color: var(--primary-color); margin-bottom: 10px;">Bahçe Ekipmanları</h1>',
    '<h1 style="font-size: 2.5rem; font-weight: 800; color: var(--primary-color); margin-bottom: 10px;">Musluk Jakı Ve Rekorları</h1>'
);
newHtml = newHtml.replace(
    '<p style="font-size: 1.1rem; color: var(--text-color);">Bahçenizin ihtiyacı olan en kaliteli bahçe sulama süzekleri ve fıskiyeleri tek bir yerde.</p>',
    '<p style="font-size: 1.1rem; color: var(--text-color);">Bahçe sulama sistemleriniz için sızdırmaz, dayanıklı musluk jakı ve rekor bağlantı parçaları.</p>'
);

// Replace the products grid content
const gridStart = newHtml.indexOf('<div class="products-grid">') + '<div class="products-grid">'.length;
const gridEnd = newHtml.indexOf('</div>\n        </section>');
if (gridStart > -1 && gridEnd > -1) {
    newHtml = newHtml.substring(0, gridStart) + cardsHtml + newHtml.substring(gridEnd);
}

// Change the route class for body
newHtml = newHtml.replace('body.route-bahce-ekipmanlari', 'body.route-musluk-jaki');
newHtml = newHtml.replace('body.route-bahce-ekipmanlari', 'body.route-musluk-jaki');
newHtml = newHtml.replace('body.route-bahce-ekipmanlari', 'body.route-musluk-jaki');
newHtml = newHtml.replace('body.route-bahce-ekipmanlari', 'body.route-musluk-jaki');
newHtml = newHtml.replace('body.route-bahce-ekipmanlari', 'body.route-musluk-jaki');
newHtml = newHtml.replace('<body', '<body class="route-musluk-jaki"'); // bahce-ekipmanlari didn't actually have this in <body class="">, it might have been missing or dynamic, but adding it guarantees it works.

fs.writeFileSync('musluk-jaki-ve-rekorlari.html', newHtml);
console.log('Created musluk-jaki-ve-rekorlari.html!');

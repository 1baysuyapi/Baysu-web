const fs = require('fs');

const products = [
  { "name": "Batarya Jak Rekoru", "img": "batarya-jak-rekoru.png", "code": "100", "ebat": "-", "ambalaj": "25", "koli": "250", "price": "175.00" },
  { "name": "Mix Batarya Jak Rekoru", "img": "mix-batarya-jak-rekoru.png", "code": "101", "ebat": "-", "ambalaj": "25", "koli": "250", "price": "175.00" },
  { "name": "Batarya Hortum Rekoru", "img": "batarya-hortum-rekoru.png", "code": "102", "ebat": "-", "ambalaj": "25", "koli": "250", "price": "180.00" },
  { "name": "Mix Batarya Hortum Rekoru", "img": "mix-batarya-hortum-rekoru.png", "code": "103", "ebat": "-", "ambalaj": "25", "koli": "250", "price": "180.00" },
  { "name": "Otomatik Kelepçeli Musluk Bağlantısı", "img": "otomatik-kelepseli-musluk-baglantisi.png", "code": "128", "ebat": "-", "ambalaj": "25", "koli": "250", "price": "95.00" },
  { "name": "1/2\" Jak Ekleme", "img": "1-2-jak-ekleme.png", "code": "180", "ebat": "-", "ambalaj": "25", "koli": "250", "price": "55.00" },
  { "name": "3/4\" Jak Ekleme", "img": "3-4-jak-ekleme.png", "code": "192", "ebat": "-", "ambalaj": "25", "koli": "250", "price": "72.00" },
  { "name": "3/4\" Jak Rekoru", "img": "3-4-jak-rekoru.png", "code": "183", "ebat": "-", "ambalaj": "100", "koli": "1000", "price": "30.00" },
  { "name": "1/2\" Jak Rekoru", "img": "1-2-jak-rekoru.png", "code": "193", "ebat": "-", "ambalaj": "100", "koli": "1000", "price": "30.00" },
  { "name": "3/4\" - 1/2\" Jak Rekoru", "img": "3-4-1-2-jak-rekoru.png", "code": "235", "ebat": "-", "ambalaj": "75", "koli": "750", "price": "43.00" },
  { "name": "1/2\" Stoplu Jak Ekleme", "img": "1-2-stoplu-jak-ekleme.png", "code": "314", "ebat": "-", "ambalaj": "25", "koli": "250", "price": "65.00" },
  { "name": "3/4\" Stoplu Jak Ekleme", "img": "3-4-stoplu-jak-ekleme.png", "code": "315", "ebat": "-", "ambalaj": "25", "koli": "250", "price": "80.00" }
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

let html = fs.readFileSync('musluk-jaki-ve-rekorlari.html', 'utf8');
html = html.replace(/<div class="products-grid">[\s\S]*?(<\/section>)/, '<div class="products-grid">\n' + cardsHtml + '\n</div>\n$1');
fs.writeFileSync('musluk-jaki-ve-rekorlari.html', html);
console.log('Fixed musluk-jaki-ve-rekorlari.html!');

const fs = require('fs');

const products = [
  { name: 'Batarya Jak Rekoru', code: '100', price: '175.00', ambalaj: '25', koli: '250', image: 'Batarya Jak Rekoru.png', slug: 'batarya-jak-rekoru' },
  { name: 'Mix Batarya Jak Rekoru', code: '101', price: '175.00', ambalaj: '25', koli: '250', image: 'Mix Batarya Jak Rekoru.png', slug: 'mix-batarya-jak-rekoru' },
  { name: 'Batarya Hortum Rekoru', code: '102', price: '180.00', ambalaj: '25', koli: '250', image: 'Batarya Hortum Rekoru.png', slug: 'batarya-hortum-rekoru' },
  { name: 'Mix Batarya Hortum Rekoru', code: '103', price: '180.00', ambalaj: '25', koli: '250', image: 'Mix Batarya Hortum Rekoru.png', slug: 'mix-batarya-hortum-rekoru' },
  { name: 'Otomatik Kelepçeli Musluk Bağlantısı', code: '128', price: '95.00', ambalaj: '25', koli: '250', image: 'Otomatik Kelepçeli Musluk Bağlantısı.png', slug: 'otomatik-kelepseli-musluk-baglantisi' },
  { name: '1/2" Jak Ekleme', code: '180', price: '55.00', ambalaj: '25', koli: '250', image: '1-2" Jak Ekleme.png', slug: '1-2-jak-ekleme' },
  { name: '3/4" Jak Ekleme', code: '192', price: '72.00', ambalaj: '25', koli: '250', image: '3-4" Jak Ekleme.png', slug: '3-4-jak-ekleme' },
  { name: '3/4" Jak Rekoru', code: '183', price: '30.00', ambalaj: '100', koli: '1000', image: '3-4" Jak Rekoru.png', slug: '3-4-jak-rekoru' },
  { name: '1/2" Jak Rekoru', code: '193', price: '30.00', ambalaj: '100', koli: '1000', image: '1-2" Jak Rekoru.png', slug: '1-2-jak-rekoru' },
  { name: '3/4" - 1/2" Jak Rekoru', code: '235', price: '43.00', ambalaj: '75', koli: '750', image: '3-4"   1-2" Jak Rekoru.png', slug: '3-4-1-2-jak-rekoru' },
  { name: '1/2" Stoplu Jak Ekleme', code: '314', price: '65.00', ambalaj: '25', koli: '250', image: '1-2" Stoplu Jak Ekleme.png', slug: '1-2-stoplu-jak-ekleme' },
  { name: '3/4" Stoplu Jak Ekleme', code: '315', price: '80.00', ambalaj: '25', koli: '250', image: '3-4" Stoplu Jak Ekleme.png', slug: '3-4-stoplu-jak-ekleme' }
];

let baseTemplate = fs.readFileSync('ayarli-hortum-eki.html', 'utf8');

for (let p of products) {
    let html = baseTemplate;
    
    // Replace titles
    html = html.replace(/AYARLI HORTUM EKİ/g, p.name.toUpperCase());
    html = html.replace(/Ayarlı Hortum Eki/g, p.name);
    
    // Replace image
    html = html.replace(/ayarli-hortum-eki\.png/g, p.image);
    
    // Replace table
    let newTbody = `<tbody>
                        <tr>
                            <td><strong>${p.code}</strong></td>
                            <td><span class="ebat-pill">-</span></td>
                            <td>${p.ambalaj}</td>
                            <td>${p.koli}</td>
                            <td class="price-val">${p.price} ₺</td>
                            <td>
                                <div class="qty-controls">
                                    <button class="qty-btn" onclick="let inp=this.nextElementSibling; let v=parseInt(inp.value)||0; if(v>1)inp.value=v-1;">-</button>
                                    <input type="text" class="qty-input" value="1">
                                    <button class="qty-btn" onclick="let inp=this.previousElementSibling; let v=parseInt(inp.value)||0; inp.value=v+1;">+</button>
                                </div>
                            </td>
                            <td>
                                <button class="add-btn" type="button" onclick="
    var row = this.closest('tr');
    var code = row.cells[0].innerText.trim();
    var ebat = row.cells[1].innerText.trim();
    var priceStr = row.cells[4].innerText.trim().replace('₺', '').replace(',', '.').trim();
    var price = parseFloat(priceStr);
    var q = parseInt(row.querySelector('.qty-input').value) || 1;
    var name = document.querySelector('.product-title').innerText.trim() + ' (' + ebat + ') - Kod: ' + code;
    if(window.addToCart){
        for(var i=0;i<q;i++) window.addToCart(name, price, code, '-');
        alert(q + ' adet sepete eklendi!');
    } else {
        alert('Sepet sistemi hazır değil');
    }
">
    <i class="fas fa-shopping-cart" style="margin-right: 5px;"></i> Sepete Ekle
</button>
                            </td>
                        </tr>
                    </tbody>`;
                    
    html = html.replace(/<tbody>[\s\S]*?<\/tbody>/, newTbody);
    
    fs.writeFileSync(p.slug + '.html', html);
    console.log("Created " + p.slug + ".html");
}

console.log("All pages created!");

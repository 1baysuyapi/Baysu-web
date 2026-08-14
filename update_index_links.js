const fs = require('fs');

const products = [
  { name: 'Batarya Jak Rekoru', slug: 'batarya-jak-rekoru' },
  { name: 'Mix Batarya Jak Rekoru', slug: 'mix-batarya-jak-rekoru' },
  { name: 'Batarya Hortum Rekoru', slug: 'batarya-hortum-rekoru' },
  { name: 'Mix Batarya Hortum Rekoru', slug: 'mix-batarya-hortum-rekoru' },
  { name: 'Otomatik Kelepçeli Musluk Bağlantısı', slug: 'otomatik-kelepseli-musluk-baglantisi' },
  { name: '1/2" Jak Ekleme', slug: '1-2-jak-ekleme' },
  { name: '3/4" Jak Ekleme', slug: '3-4-jak-ekleme' },
  { name: '3/4" Jak Rekoru', slug: '3-4-jak-rekoru' },
  { name: '1/2" Jak Rekoru', slug: '1-2-jak-rekoru' },
  { name: '3/4" - 1/2" Jak Rekoru', slug: '3-4-1-2-jak-rekoru' },
  { name: '1/2" Stoplu Jak Ekleme', slug: '1-2-stoplu-jak-ekleme' },
  { name: '3/4" Stoplu Jak Ekleme', slug: '3-4-stoplu-jak-ekleme' }
];

let lis = products.map(p => `                        <li><a href="/${p.slug}">${p.name}</a></li>`).join('\n');

let html = fs.readFileSync('index.html', 'utf8');

// The marker we added earlier
html = html.replace('<!-- Buraya musluk jakı ve rekorları eklenecek -->', lis);

fs.writeFileSync('index.html', html);
console.log('index.html updated with dropdown list!');

// Update kuresel-vana.html as well
let kvHtml = fs.readFileSync('kuresel-vana.html', 'utf8');
kvHtml = kvHtml.replace(/<ul class="product-list">\s*<\/ul>\s*<\/li>\s*<li class="category-item">\s*<a href="\/kuresel-vana"/, `<ul class="product-list">\n${lis}\n                    </ul>\n                </li>\n                <li class="category-item">\n                    <a href="/kuresel-vana"`);
fs.writeFileSync('kuresel-vana.html', kvHtml);
console.log('kuresel-vana.html updated with dropdown list!');

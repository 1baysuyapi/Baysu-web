const fs = require('fs');
const files = [
  'batarya-jak-rekoru.html', 'mix-batarya-jak-rekoru.html', 'batarya-hortum-rekoru.html',
  'mix-batarya-hortum-rekoru.html', 'otomatik-kelepseli-musluk-baglantisi.html',
  '1-2-jak-ekleme.html', '3-4-jak-ekleme.html', '3-4-jak-rekoru.html',
  '1-2-jak-rekoru.html', '3-4-1-2-jak-rekoru.html', '1-2-stoplu-jak-ekleme.html',
  '3-4-stoplu-jak-ekleme.html'
];
const products = [];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, 'utf8');
  const titleMatch = html.match(/<h1 class="product-title">([^<]+)<\/h1>/);
  const imgMatch = html.match(/<div class="product-image">\s*<img src="([^"]+)"/);
  
  // Scrape table rows
  const tbodyStart = html.indexOf('<tbody>');
  const tbodyEnd = html.indexOf('</tbody>');
  if (tbodyStart > -1 && tbodyEnd > -1) {
    const tbody = html.substring(tbodyStart, tbodyEnd);
    const codeMatch = tbody.match(/<td><strong>([^<]+)<\/strong><\/td>/);
    const ebatMatch = tbody.match(/<span class="ebat-pill">([^<]+)<\/span>/);
    const ambMatch = tbody.match(/<td>(\d+|-)<\/td>\s*<td>(\d+|-)<\/td>/);
    const priceMatch = tbody.match(/<td class="price-val">([^<]+)<\/td>/);
    
    if (titleMatch && imgMatch && codeMatch) {
      products.push({
        name: titleMatch[1],
        img: imgMatch[1],
        code: codeMatch[1],
        ebat: ebatMatch ? ebatMatch[1] : '-',
        ambalaj: ambMatch ? ambMatch[1] : '-',
        koli: ambMatch ? ambMatch[2] : '-',
        price: priceMatch ? priceMatch[1].replace('₺','').trim() : '-'
      });
    }
  }
}
console.log(JSON.stringify(products, null, 2));

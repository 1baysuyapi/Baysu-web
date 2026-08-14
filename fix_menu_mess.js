const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

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

const correctStructure = `<li class="category-item">
                    <div class="category-header" onclick="event.preventDefault(); event.stopPropagation(); var item = this.closest('.category-item'); var list = item.querySelector('.product-list'); if(list) { item.classList.toggle('active'); list.classList.toggle('active'); list.style.setProperty('display', list.classList.contains('active') ? 'block' : 'none', 'important'); }">
                        <h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;</span></h3>
                    </div>
                    <ul class="product-list">
${lis}
                    </ul>
                </li>
                <li class="category-item">
                    <a href="/kuresel-vana" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Küresel Vana</h3>
                        </div>
                    </a>
                </li>`;

// Remove all occurrences of the broken structure
// The broken structure starts from "Musluk Jakı Ve Rekorları" header div to the end of the "Küresel Vana" lis.
const badRegex = /<li class="category-item">\s*<div class="category-header"[^>]*>\s*<h3>Musluk Jak. Ve Rekorlar. <span class="arrow-icon">&#9658;<\/span><\/h3>[\s\S]*?(?:<li class="category-item">\s*<a href="\/kuresel-vana"[\s\S]*?<\/a>\s*<\/li>\s*)+/g;

indexHtml = indexHtml.replace(badRegex, correctStructure);

fs.writeFileSync('index.html', indexHtml);
console.log("Fixed index.html structure!");

// Now sync the nav again
const navRegex = /<nav class="nav-bar">[\s\S]*?<\/nav>/;
let navMatch = indexHtml.match(navRegex);

if (navMatch) {
    let newNav = navMatch[0];
    let files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');
    
    for (let file of files) {
        let html = fs.readFileSync(file, 'utf8');
        if (navRegex.test(html)) {
            html = html.replace(navRegex, newNav);
            fs.writeFileSync(file, html);
        }
    }
    console.log("Navigation sync complete!");
} else {
    console.log("Could not find nav in index.html");
}

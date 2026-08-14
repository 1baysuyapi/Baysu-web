const fs = require('fs');

const oldMenu = `                <li class="category-item">
                    <div class="category-header" onclick="event.preventDefault(); event.stopPropagation(); var item = this.closest('.category-item'); var list = item.querySelector('.product-list'); if(list) { item.classList.toggle('active'); list.classList.toggle('active'); list.style.setProperty('display', list.classList.contains('active') ? 'block' : 'none', 'important'); }">
                        <h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;</span></h3>
                    </div>
                    <ul class="product-list">
                        <li><a href="/batarya-jak-rekoru">Batarya Jak Rekoru</a></li>
                        <li><a href="/mix-batarya-jak-rekoru">Mix Batarya Jak Rekoru</a></li>
                        <li><a href="/batarya-hortum-rekoru">Batarya Hortum Rekoru</a></li>
                        <li><a href="/mix-batarya-hortum-rekoru">Mix Batarya Hortum Rekoru</a></li>
                        <li><a href="/otomatik-kelepseli-musluk-baglantisi">Otomatik Kelepçeli Musluk Bağlantısı</a></li>
                        <li><a href="/1-2-jak-ekleme">1/2" Jak Ekleme</a></li>
                        <li><a href="/3-4-jak-ekleme">3/4" Jak Ekleme</a></li>
                        <li><a href="/3-4-jak-rekoru">3/4" Jak Rekoru</a></li>
                        <li><a href="/1-2-jak-rekoru">1/2" Jak Rekoru</a></li>
                        <li><a href="/3-4-1-2-jak-rekoru">3/4" - 1/2" Jak Rekoru</a></li>
                        <li><a href="/1-2-stoplu-jak-ekleme">1/2" Stoplu Jak Ekleme</a></li>
                        <li><a href="/3-4-stoplu-jak-ekleme">3/4" Stoplu Jak Ekleme</a></li>
                    </ul>
                </li>`;

const newMenu = `                <li class="category-item">
                    <a href="/musluk-jaki-ve-rekorlari" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Musluk Jakı Ve Rekorları</h3>
                        </div>
                    </a>
                </li>`;

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes(oldMenu)) {
        html = html.replace(oldMenu, newMenu);
        fs.writeFileSync(file, html);
        console.log('Updated menu in', file);
    } else {
        // Fallback for slight whitespace differences
        const startMatch = html.indexOf('<h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;</span></h3>');
        if (startMatch > -1) {
            const startLi = html.lastIndexOf('<li class="category-item">', startMatch);
            const endLi = html.indexOf('</li>', startMatch) + 5;
            if (startLi > -1 && endLi > -1) {
                html = html.substring(0, startLi) + newMenu + html.substring(endLi);
                fs.writeFileSync(file, html);
                console.log('Updated menu (fallback) in', file);
            }
        }
    }
}

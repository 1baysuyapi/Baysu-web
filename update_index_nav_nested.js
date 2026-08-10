const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the standalone REKORLAR top level section I added earlier.
const oldRekorlarMenu = `
            <div class="main-category-item" onclick="if(event.target.closest('a'))return; event.preventDefault(); event.stopPropagation(); this.classList.toggle('active'); var m = document.getElementById('rekorlar-menu'); if(m) { m.classList.toggle('active'); m.style.setProperty('display', m.classList.contains('active') ? 'grid' : 'none', 'important'); }">
                <h3>REKORLAR <span class="arrow-icon">&#9658;</span></h3>
            </div>
            <ul class="category-group" id="rekorlar-menu">
                <li class="category-item">
                    <a href="/cift-tarafli-depo-rekoru" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Çift Taraflı Depo Rekoru</h3>
                        </div>
                    </a>
                </li>
                <li class="category-item">
                    <a href="/depo-rekoru-ters-dis" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Depo Rekoru (Ters Diş)</h3>
                        </div>
                    </a>
                </li>
                <li class="category-item">
                    <a href="/sintine-rekoru-ters-dis" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Sintine Rekoru (Ters Diş)</h3>
                        </div>
                    </a>
                </li>
                <li class="category-item">
                    <a href="/pvc-hortum-rekoru" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>PVC Hortum Rekoru</h3>
                        </div>
                    </a>
                </li>
                <li class="category-item">
                    <a href="/galvanizli-hortum-rekoru" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Galvanizli Hortum Rekoru</h3>
                        </div>
                    </a>
                </li>
                <li class="category-item">
                    <a href="/ozel-depo-rekoru" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Özel Depo Rekoru</h3>
                        </div>
                    </a>
                </li>
            </ul>
`;

// It might have formatting differences. Let's use Regex to remove it.
const regexRemove = /<div class="main-category-item" onclick="[^"]*?rekorlar-menu[^"]*?">[\s\S]*?<ul class="category-group" id="rekorlar-menu">[\s\S]*?<\/ul>/;
html = html.replace(regexRemove, '');

// 2. Add Rekorlar as an accordion INSIDE bahce-menu
const nestedRekorlar = `
                <li class="category-item">
                    <div class="category-header" onclick="event.preventDefault(); event.stopPropagation(); var item = this.closest('.category-item'); var list = item.querySelector('.product-list'); if(list) { item.classList.toggle('active'); list.classList.toggle('active'); list.style.setProperty('display', list.classList.contains('active') ? 'block' : 'none', 'important'); }">
                        <h3>Rekorlar <span class="arrow-icon">&#9658;</span></h3>
                    </div>
                    <ul class="product-list">
                        <li><a href="/cift-tarafli-depo-rekoru">Çift Taraflı Depo Rekoru</a></li>
                        <li><a href="/depo-rekoru-ters-dis">Depo Rekoru (Ters Diş)</a></li>
                        <li><a href="/sintine-rekoru-ters-dis">Sintine Rekoru (Ters Diş)</a></li>
                        <li><a href="/pvc-hortum-rekoru">PVC Hortum Rekoru</a></li>
                        <li><a href="/galvanizli-hortum-rekoru">Galvanizli Hortum Rekoru</a></li>
                        <li><a href="/ozel-depo-rekoru">Özel Depo Rekoru</a></li>
                    </ul>
                </li>
`;

// Find where to insert it: Inside <ul class="category-group" id="bahce-menu">
// We can insert it right after the first item (Bahçe Ekipmanları) or just at the top. Let's put it right after <ul class="category-group" id="bahce-menu">
html = html.replace(/(<ul class="category-group" id="bahce-menu">)/, '$1' + nestedRekorlar);

// 3. Update the 6 Rekor files' navigation bars so they match this new index.html navigation!
fs.writeFileSync('index.html', html);
console.log('index.html nav updated to nest Rekorlar inside Bahçe Sulama Sistemleri');

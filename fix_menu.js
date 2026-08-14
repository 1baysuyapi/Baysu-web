
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const searchStr = `<li class="category-item">
                    <div class="category-header" onclick="event.preventDefault(); event.stopPropagation(); var item = this.closest('.category-item'); var list = item.querySelector('.product-list'); if(list) { item.classList.toggle('active'); list.classList.toggle('active'); list.style.setProperty('display', list.classList.contains('active') ? 'block' : 'none', 'important'); }">
                        <h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;</span></h3>
                    </div>
                    <ul class="product-list">
                        <li><a href="/musluk-jaki">Musluk Jakı</a></li>
                        <li><a href="/kuresel-vana">Küresel Vana</a></li>
                    </ul>
                </li>`;

const searchStrRegex = /<li class="category-item">[\s\S]*?<h3>Musluk Jak[ı] Ve Rekorlar[ı] <span class="arrow-icon">&#9658;</span></h3>[\s\S]*?</ul>\s*</li>/;

const replaceStr = `<li class="category-item">
                    <div class="category-header" onclick="event.preventDefault(); event.stopPropagation(); var item = this.closest('.category-item'); var list = item.querySelector('.product-list'); if(list) { item.classList.toggle('active'); list.classList.toggle('active'); list.style.setProperty('display', list.classList.contains('active') ? 'block' : 'none', 'important'); }">
                        <h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;</span></h3>
                    </div>
                    <ul class="product-list">
                        <!-- İçerik eklenecek -->
                    </ul>
                </li>
                <li class="category-item">
                    <a href="/kuresel-vana" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Küresel Vana</h3>
                        </div>
                    </a>
                </li>`;

if(searchStrRegex.test(html)) {
    html = html.replace(searchStrRegex, replaceStr);
    fs.writeFileSync('index.html', html);
    console.log("Fixed menu!");
} else {
    console.log("Regex not matched");
}

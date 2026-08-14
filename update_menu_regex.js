const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<li class="category-item">\s*<a href="\/musluk-jaki"[\s\S]*?<\/a>\s*<\/li>/;

const newMenu = `<li class="category-item">
                    <div class="category-header" onclick="event.preventDefault(); event.stopPropagation(); var item = this.closest('.category-item'); var list = item.querySelector('.product-list'); if(list) { item.classList.toggle('active'); list.classList.toggle('active'); list.style.setProperty('display', list.classList.contains('active') ? 'block' : 'none', 'important'); }">
                        <h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;</span></h3>
                    </div>
                    <ul class="product-list">
                        <li><a href="/musluk-jaki">Musluk Jakı</a></li>
                        <li><a href="/kuresel-vana">Küresel Vana</a></li>
                    </ul>
                </li>`;

if (regex.test(html)) {
    html = html.replace(regex, newMenu);
    fs.writeFileSync('index.html', html);
    console.log("Menu updated successfully via regex!");
} else {
    console.log("Could not find the target menu block in index.html via regex");
}

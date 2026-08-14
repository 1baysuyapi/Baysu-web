const fs = require('fs');

let html = fs.readFileSync('kuresel-vana.html', 'utf8');

const searchRegex = /<li class="category-item">\s*<a href="\/musluk-jaki" style="text-decoration: none; color: inherit; display: block; width: 100%;">\s*<div class="category-header">\s*<h3>Musluk Jak[ı] Ve Rekorlar[ı]<\/h3>\s*<\/div>\s*<\/a>\s*<\/li>/;

const replacement = `<li class="category-item">
                    <div class="category-header" onclick="event.preventDefault(); event.stopPropagation(); var item = this.closest('.category-item'); var list = item.querySelector('.product-list'); if(list) { item.classList.toggle('active'); list.classList.toggle('active'); list.style.setProperty('display', list.classList.contains('active') ? 'block' : 'none', 'important'); }">
                        <h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;</span></h3>
                    </div>
                    <ul class="product-list">
                        
                    </ul>
                </li>
                <li class="category-item">
                    <a href="/kuresel-vana" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Küresel Vana</h3>
                        </div>
                    </a>
                </li>`;

if (searchRegex.test(html)) {
    html = html.replace(searchRegex, replacement);
    fs.writeFileSync('kuresel-vana.html', html);
    console.log("Successfully fixed kuresel-vana.html!");
} else {
    console.log("Failed to match old menu in kuresel-vana.html.");
}

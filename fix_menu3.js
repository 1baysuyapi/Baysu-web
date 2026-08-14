const fs = require('fs');

function fixMenu(file) {
    let html = fs.readFileSync(file, 'utf8');

    const regexDesktop = /<li class="category-item">\s*<div class="category-header" onclick="event.preventDefault\(\); event.stopPropagation\(\); var item = this.closest\('\.category-item'\); var list = item.querySelector\('\.product-list'\); if\(list\) \{ item.classList.toggle\('active'\); list.classList.toggle\('active'\); list.style.setProperty\('display', list.classList.contains\('active'\) \? 'block' : 'none', 'important'\); \}">\s*<h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;<\/span><\/h3>\s*<\/div>\s*<ul class="product-list">\s*<li><a href="\/musluk-jaki">Musluk Jakı<\/a><\/li>\s*<li><a href="\/kuresel-vana">Küresel Vana<\/a><\/li>\s*<\/ul>\s*<\/li>/g;

    const newDesktop = `<li class="category-item">
                    <div class="category-header" onclick="event.preventDefault(); event.stopPropagation(); var item = this.closest('.category-item'); var list = item.querySelector('.product-list'); if(list) { item.classList.toggle('active'); list.classList.toggle('active'); list.style.setProperty('display', list.classList.contains('active') ? 'block' : 'none', 'important'); }">
                        <h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;</span></h3>
                    </div>
                    <ul class="product-list">
                        <!-- Buraya musluk jakı ve rekorları eklenecek -->
                    </ul>
                </li>
                <li class="category-item">
                    <a href="/kuresel-vana" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Küresel Vana</h3>
                        </div>
                    </a>
                </li>`;

    let count = (html.match(regexDesktop) || []).length;
    console.log("Found matches in " + file + ":", count);

    if(count > 0) {
        html = html.replace(regexDesktop, newDesktop);
        fs.writeFileSync(file, html);
        console.log("Successfully replaced in " + file);
    } else {
        const fallbackRegex = /<h3>Musluk Jak. Ve Rekorlar. <span class="arrow-icon">&#9658;<\/span><\/h3>[\s\S]*?<\/ul>\s*<\/li>/g;
        let count2 = (html.match(fallbackRegex) || []).length;
        if(count2 > 0) {
            html = html.replace(fallbackRegex, `<h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;</span></h3>
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
                </li>`);
            fs.writeFileSync(file, html);
            console.log("Fallback replacement executed in " + file);
        } else {
             console.log("No match found in " + file);
        }
    }
}

fixMenu('index.html');
fixMenu('kuresel-vana.html');

const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const regex = /<li class="category-item">\s*<a href="\/hortum-ek-parcalari"[\s\S]*?<\/a>\s*<\/li>/;

const newNav = `                <li class="category-item">
                    <div class="category-header" onclick="event.preventDefault(); event.stopPropagation(); var item = this.closest('.category-item'); var list = item.querySelector('.product-list'); if(list) { item.classList.toggle('active'); list.classList.toggle('active'); list.style.setProperty('display', list.classList.contains('active') ? 'block' : 'none', 'important'); }">
                        <h3>Hortum Ek Parçaları <span class="arrow-icon">&#9658;</span></h3>
                    </div>
                    <ul class="product-list">
                        <li><a href="/ayarli-hortum-eki">Ayarlı Hortum Eki</a></li>
                        <li><a href="/ayarli-hortum-te">Ayarlı Hortum TE</a></li>
                        <li><a href="/hortum-eki">Hortum Eki</a></li>
                        <li><a href="/hortum-reduksiyonu">Hortum Redüksiyonu</a></li>
                        <li><a href="/hortum-te">Hortum TE</a></li>
                    </ul>
                </li>`;

if (regex.test(html)) {
    html = html.replace(regex, newNav);
    fs.writeFileSync('index.html', html);
    console.log('Updated index.html Hortum Ek Parçaları menu');
} else {
    console.log('Could not find hortum ek link');
}

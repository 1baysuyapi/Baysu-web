const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the old Rekorlar link from Bahçe Sulama Sistemleri
const oldLinkRegex = /<li class="category-item">\s*<a href="\/depo-rekorlari"[\s\S]*?<\/li>/;
html = html.replace(oldLinkRegex, '');

// 2. Add the new REKORLAR main menu section right after KAPLİNLER VE EK PARÇALARI section ends
const newMenuStr = `
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

// Find where to insert it. The best place is after `<ul class="category-group" id="kaplinler-menu"> ... </ul>`
// It ends around line 1070 in the original file.
const insertPos = html.indexOf('</ul>\r\n            \r\n            <div class="main-category-item" onclick="if(event.target.closest(\'a\'))return; event.preventDefault(); event.stopPropagation(); this.classList.toggle(\'active\'); var m = document.getElementById(\'bahce-menu\');');

if (insertPos !== -1) {
    html = html.substring(0, insertPos + 5) + newMenuStr + html.substring(insertPos + 5);
} else {
    // try fallback
    html = html.replace(/<ul class="category-group" id="kaplinler-menu">[\s\S]*?<\/ul>/, match => match + newMenuStr);
}

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully.');

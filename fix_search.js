const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldStr = `                    if (filtered.length > 0) {
                        searchResults.innerHTML = filtered.slice(0, 8).map(p => 
                            <a href="$"{p.url}" class="search-result-item">
                                <i class="fas fa-cube"></i>
                                <span class="search-result-title">$"{p.name}</span>
                            </a>
                        ).join('');
                        searchResults.classList.add('active');
                    } else {
                        searchResults.innerHTML = 
                            <div class="search-result-item" style="color: #94A3B8; justify-content: center;">
                                AradÄ±ÄŸÄ±nÄ±z Ã¼rÃ¼n bulunamadÄ±.
                            </div>
                        ;
                        searchResults.classList.add('active');
                    }`;

const newStr = `                    if (filtered.length > 0) {
                        searchResults.innerHTML = filtered.slice(0, 8).map(p => \`
                            <a href="\${p.url}" class="search-result-item">
                                <i class="fas fa-cube"></i>
                                <span class="search-result-title">\${p.name}</span>
                            </a>
                        \`).join('');
                        searchResults.classList.add('active');
                    } else {
                        searchResults.innerHTML = \`
                            <div class="search-result-item" style="color: #94A3B8; justify-content: center;">
                                Aradığınız ürün bulunamadı.
                            </div>
                        \`;
                        searchResults.classList.add('active');
                    }`;

if (html.includes(oldStr)) {
    html = html.replace(oldStr, newStr);
    fs.writeFileSync('index.html', html);
    console.log('Successfully fixed search JS in index.html');
} else {
    console.log('Could not find old string in index.html');
}

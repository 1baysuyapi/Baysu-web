const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldSearch = `        // CanlÄ± Arama (Instant Live Search)
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            if (searchInput && searchResults) {
                const allProductLinks = Array.from(document.querySelectorAll('.product-list li a'));
                const productsData = allProductLinks.map(link => ({
                    name: link.textContent.trim(),
                    url: link.getAttribute('href')
                }));

                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase().trim();
                    if (query.length < 2) {
                        searchResults.innerHTML = '';
                        searchResults.classList.remove('active');
                        return;
                    }

                    const filtered = productsData.filter(p => p.name.toLowerCase().includes(query));

                    if (filtered.length > 0) {
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
                    }
                });
            }
        });`;

const newSearch = `        // CanlÄ± Arama (Instant Live Search)
        (function() {
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            if (searchInput && searchResults) {
                const allProductLinks = Array.from(document.querySelectorAll('.product-list li a'));
                const productsData = allProductLinks.map(link => ({
                    name: link.textContent.trim(),
                    url: link.getAttribute('href')
                }));

                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase().trim();
                    if (query.length < 2) {
                        searchResults.innerHTML = '';
                        searchResults.classList.remove('active');
                        return;
                    }

                    // FIX: use toLocaleLowerCase('tr-TR') for better Turkish character matching
                    const filtered = productsData.filter(p => p.name.toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR')));

                    if (filtered.length > 0) {
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
                    }
                });
            }
        })();`;

if (html.includes(oldSearch)) {
    html = html.replace(oldSearch, newSearch);
    fs.writeFileSync('index.html', html);
    console.log("Successfully updated live search logic.");
} else {
    console.log("Could not find the old search block!");
}

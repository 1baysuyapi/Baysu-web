const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');

    // Fix the backticks and syntax error
    const badJsRegex = /searchResults\.innerHTML = filtered\.slice\(0, 8\)\.map\(p =>\s*<a href="\$"\{p\.url\}" class="search-result-item">[\s\S]*?<\/div>\s*;/g;
    
    // We can just replace the whole Live Search block to be safe.
    // The Live Search block starts at: // Canl" Arama
    const liveSearchRegex = /\/\/\s*Canl.*?Arama.*?document\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]*?\}\);\s*\}\);/i;
    
    const correctLiveSearch = `
        // Canlı Arama (Instant Live Search)
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

    html = html.replace(liveSearchRegex, correctLiveSearch);

    // Also remove any extra </body></html> tags at the end
    // Keep only one pair.
    html = html.replace(/(<\/body>\s*<\/html>\s*)+$/i, '</body>\n</html>\n');

    fs.writeFileSync('bahce_edit.html', html);

    const dataCode = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    
    // Use a custom replace function to avoid $ parsing issues
    const newDataCode = dataCode.replace(routeRegex, (match, p1, p2, p3) => {
        return p1 + newBase64 + p3;
    });
    
    fs.writeFileSync('data.js', newDataCode);
    console.log("Fixed syntax error and extra body tags.");
} catch (e) {
    console.error(e);
}

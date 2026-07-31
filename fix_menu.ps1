$html = Get-Content 'index.html' -Raw -Encoding UTF8

$newScript = @"
    <script>
        // Hakkımızda ve İletişim linklerini sadece ana sayfada göster
        document.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname;
            if (path !== '/' && path !== '/index.html' && !path.endsWith('/Baysu-web/') && !path.endsWith('/Baysu-web/index.html')) {
                document.querySelectorAll('a[href="#about-section"], a[href="#contact-section"]').forEach(el => el.style.display = 'none');
            }
        });

        // Event Delegation ile Menü Yönetimi (Daha güvenilir)
        document.addEventListener('click', (e) => {
            const menuToggleMobile = e.target.closest('#menuToggle');
            const menuToggleDesktop = e.target.closest('#menuToggleDesktop');
            const heroCatalogBtn = e.target.closest('#heroCatalogBtn');
            const mainCategoryItem = e.target.closest('.main-category-item');
            const categoryHeader = e.target.closest('.category-header');
            const mainMenuContainer = document.getElementById('mainMenuContainer');
            const kaplinlerMenu = document.getElementById('kaplinler-menu');
            
            // Ana menüyü aç/kapat (butonlar)
            if (menuToggleMobile || menuToggleDesktop || (heroCatalogBtn && !e.target.closest('#mainMenuContainer'))) {
                e.preventDefault();
                if (mainMenuContainer) {
                    const isActive = mainMenuContainer.classList.toggle('active');
                    if (!isActive) {
                        const mci = document.querySelector('.main-category-item');
                        if (mci) mci.classList.remove('active');
                        if (kaplinlerMenu) kaplinlerMenu.classList.remove('active');
                        document.querySelectorAll('.category-item').forEach(item => {
                            item.classList.remove('active');
                            const productList = item.querySelector('.product-list');
                            if (productList) productList.classList.remove('active');
                        });
                    } else if (heroCatalogBtn) {
                        mainMenuContainer.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                return;
            }

            // Kaplinler ana kategorisine tıklandığında
            if (mainCategoryItem) {
                if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                    e.preventDefault(); 
                    mainCategoryItem.classList.toggle('active');
                    if (kaplinlerMenu) kaplinlerMenu.classList.toggle('active');
                }
                return;
            }

            // Alt kategorilere (Mavi Seri, vb.) tıklandığında
            if (categoryHeader) {
                e.preventDefault();
                const item = categoryHeader.closest('.category-item');
                const targetList = item ? item.querySelector('.product-list') : null;
                if (targetList) {
                    item.classList.toggle('active');
                    targetList.classList.toggle('active');
                    
                    // Diğerlerini kapat
                    document.querySelectorAll('.category-item').forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherList = otherItem.querySelector('.product-list');
                            if (otherList) otherList.classList.remove('active');
                        }
                    });
                }
                return;
            }

            // Sayfa dışına tıklandığında menüyü kapat
            if (mainMenuContainer && mainMenuContainer.classList.contains('active')) {
                if (!mainMenuContainer.contains(e.target) && !e.target.closest('.nav-bar') && !e.target.closest('#heroCatalogBtn')) {
                    mainMenuContainer.classList.remove('active');
                }
            }
            
            // Sayfa dışına tıklandığında arama sonuçlarını kapat
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            if (searchResults && searchResults.classList.contains('active')) {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    searchResults.classList.remove('active');
                }
            }
            
            // Ana Sayfa Kategori Filtreleme
            const filterBtn = e.target.closest('.filter-btn');
            if (filterBtn) {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                filterBtn.classList.add('active');
                const filterValue = filterBtn.getAttribute('data-filter');
                document.querySelectorAll('.product-card').forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeIn 0.3s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });

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
                        searchResults.innerHTML = filtered.slice(0, 8).map(p => `
                            <a href="`$"{p.url}" class="search-result-item">
                                <i class="fas fa-cube"></i>
                                <span class="search-result-title">`$"{p.name}</span>
                            </a>
                        `).join('');
                        searchResults.classList.add('active');
                    } else {
                        searchResults.innerHTML = `
                            <div class="search-result-item" style="color: #94A3B8; justify-content: center;">
                                Aradığınız ürün bulunamadı.
                            </div>
                        `;
                        searchResults.classList.add('active');
                    }
                });
            }
        });
    </script>
"@

$html = $html -replace '(?s)<script>\s*document\.addEventListener\(''DOMContentLoaded'', \(\) => \{\s*const mainMenuContainer.*?</script>', $newScript

Set-Content 'index.html' -Value $html -Encoding UTF8
Write-Host "Updated index.html with new event delegation script"


        // Hakkımızda ve İletişim linklerini sadece ana sayfada göster
        document.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname;
            if (path !== '/' && path !== '/index.html' && !path.endsWith('/Baysu-web/') && !path.endsWith('/Baysu-web/index.html')) {
                document.querySelectorAll('a[href="#about-section"], a[href="/#about-section"], a[href="#contact-section"], a[href="/#contact-section"]').forEach(el => el.style.display = 'none');
            }
        });

        <script>
        // HakkÄ±mÄ±zda ve Ä°letiÅŸim linklerini sadece ana sayfada gÃ¶ster
        

        // Global function for Menu Toggle
        window.baysuToggleMenu = function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const mainMenuContainer = document.getElementById('mainMenuContainer');
            if (mainMenuContainer) {
                const isActive = mainMenuContainer.classList.toggle('active');
                if (isActive) {
                    mainMenuContainer.style.setProperty('display', 'block', 'important');
                    mainMenuContainer.style.setProperty('z-index', '999999', 'important');
                } else {
                    mainMenuContainer.style.setProperty('display', 'none', 'important');
                    const mci = document.querySelector('.main-category-item');
                    if (mci) mci.classList.remove('active');
                    const kaplinlerMenu = document.getElementById('kaplinler-menu');
                    if (kaplinlerMenu) kaplinlerMenu.classList.remove('active');
                    document.querySelectorAll('.category-item').forEach(item => {
                        item.classList.remove('active');
                        const productList = item.querySelector('.product-list');
                        if (productList) productList.classList.remove('active');
                    });
                }
            }
        };

        window.baysuToggleAccordion = function(element, e) {
            if (e && e.target && (e.target.tagName === 'A' || e.target.closest('a'))) return;
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            element.classList.toggle('active');
            const kaplinlerMenu = document.getElementById('kaplinler-menu');
            if (kaplinlerMenu) kaplinlerMenu.classList.toggle('active');
        };

        window.baysuToggleSubAccordion = function(element, e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const item = element.closest('.category-item');
            if (!item) return;
            
            const targetList = item.querySelector('.product-list');
            if (targetList) {
                const isActive = item.classList.toggle('active');
                if (isActive) {
                    targetList.classList.add('active');
                } else {
                    targetList.classList.remove('active');
                }
            }
        };

        // Event Delegation ile Menü Yönetimi (Daha güvenilir)
        document.addEventListener('click', (e) => {
            const menuToggleMobile = e.target.closest('#menuToggle');
            const menuToggleDesktop = e.target.closest('#menuToggleDesktop');
            const heroCatalogBtn = e.target.closest('#heroCatalogBtn');
            const mainMenuContainer = document.getElementById('mainMenuContainer');
            
            // Ana menüyü aç/kapat (butonlar)
            if (heroCatalogBtn && !e.target.closest('#mainMenuContainer')) {
                e.preventDefault();
                if (mainMenuContainer) {
                    const isActive = mainMenuContainer.classList.toggle('active');
                    if (!isActive) {
                        const mci = document.querySelector('.main-category-item');
                        if (mci) mci.classList.remove('active');
                        const kaplinlerMenu = document.getElementById('kaplinler-menu');
                        if (kaplinlerMenu) kaplinlerMenu.classList.remove('active');
                        document.querySelectorAll('.category-item').forEach(item => {
                            item.classList.remove('active');
                            const productList = item.querySelector('.product-list');
                            if (productList) productList.classList.remove('active');
                        });
                    } else {
                        mainMenuContainer.style.setProperty('display', 'block', 'important');
                        mainMenuContainer.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                return;
            }



            // Sayfa dÄ±ÅŸÄ±na tÄ±klandÄ±ÄŸÄ±nda menÃ¼yÃ¼ kapat
            if (mainMenuContainer && mainMenuContainer.classList.contains('active')) {
                if (!mainMenuContainer.contains(e.target) && !e.target.closest('#menuToggleDesktop') && !e.target.closest('.menu-toggle') && !e.target.closest('#heroCatalogBtn')) {
                    mainMenuContainer.classList.remove('active');
                }
            }
            
            // Sayfa dÄ±ÅŸÄ±na tÄ±klandÄ±ÄŸÄ±nda arama sonuÃ§larÄ±nÄ± kapat
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            if (searchResults && searchResults.classList.contains('active')) {
                if (e.target !== searchInput && !searchResults.contains(e.target)) {
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

        // CanlÄ± Arama (Instant Live Search)
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
        })();
    </script>

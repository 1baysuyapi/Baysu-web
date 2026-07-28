(function () {
    function getPageName(path) {
        if (!path || path === '' || path === '/' || path === 'index.html') return 'Ana Sayfa';
        var name = path.replace('.html', '').replace(/-/g, ' ');
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    function getRefName() {
        var ref = document.referrer;
        if (!ref || ref === '') return 'Doğrudan Giriş (Direct)';
        if (ref.indexOf('google') > -1) return 'Google Arama';
        if (ref.indexOf('whatsapp') > -1) return 'WhatsApp';
        if (ref.indexOf('instagram') > -1) return 'Instagram';
        if (ref.indexOf(window.location.hostname) > -1) return 'Site İçi Dolaşım';
        return 'Harici Bağlantı (' + ref.split('/')[2] + ')';
    }

    function logVisit(path) {
        try {
            var logs = JSON.parse(localStorage.getItem('baysu_access_logs') || '[]');
            var now = new Date();
            var timeStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR');
            var isMobile = navigator.userAgent.indexOf('Mobile') > -1 || navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('iPhone') > -1;
            var devStr = isMobile ? '📱 Mobil Cihaz' : '💻 Masaüstü Bilgisayar';
            var sid = sessionStorage.getItem('baysu_sid') || (function(){
                var id = Math.random().toString(36).substring(2, 9);
                sessionStorage.setItem('baysu_sid', id);
                return id;
            })();

            logs.push({
                time: timeStr,
                page: path,
                pageName: getPageName(path),
                ref: getRefName(),
                device: devStr,
                sid: sid
            });

            if (logs.length > 250) logs.shift();
            localStorage.setItem('baysu_access_logs', JSON.stringify(logs));
        } catch(e) {}
    }

    // =============================================
    // GLOBAL MENU TOGGLE - uses ONLY classList
    // CSS has .active { display: block !important }
    // so we MUST use classList, NOT style.display
    // =============================================
    window.toggleCatalogMenu = function(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        var menu = document.getElementById('mainMenuContainer') || document.querySelector('.main-menu-container');
        if (!menu) return;
        menu.classList.toggle('active');
    };

    // =============================================
    // PRODUCT CARD CLICK TOGGLE (for mobile)
    // Only ONE card open at a time
    // =============================================
    window._baysuSetupProductCards = function() {
        var cards = document.querySelectorAll('.product-card');
        for (var i = 0; i < cards.length; i++) {
            (function(card) {
                card.addEventListener('click', function(e) {
                    // Don't toggle if clicking on buttons/inputs inside
                    if (e.target.closest('.qty-btn') || e.target.closest('.qty-input') || e.target.closest('.btn-add-cart-custom')) return;
                    
                    var wasActive = card.classList.contains('card-active');
                    // Close ALL other cards first
                    var allCards = document.querySelectorAll('.product-card.card-active');
                    for (var j = 0; j < allCards.length; j++) {
                        allCards[j].classList.remove('card-active');
                    }
                    // Toggle current card
                    if (!wasActive) {
                        card.classList.add('card-active');
                    }
                });
            })(cards[i]);
        }
    };

    // =============================================
    // ACCORDION SETUP
    // =============================================
    window._baysuSetupAccordion = function() {
        var triggers = document.querySelectorAll('#menuToggle, #menuToggleNav, #menuToggleDesktop, #menuToggleMobile, .menu-toggle, .dropdown-toggle');
        for (var i = 0; i < triggers.length; i++) {
            (function(btn) {
                btn.addEventListener('click', function(e) {
                    window.toggleCatalogMenu(e);
                });
            })(triggers[i]);
        }

        var menu = document.getElementById('mainMenuContainer') || document.querySelector('.main-menu-container');
        if (menu) {
            menu.addEventListener('click', function(e) {
                var mainHeader = e.target.closest('.main-category-header');
                if (mainHeader) {
                    e.preventDefault();
                    e.stopPropagation();
                    var nextGroup = mainHeader.nextElementSibling;
                    if (nextGroup && nextGroup.classList.contains('category-group')) {
                        mainHeader.classList.toggle('active');
                        nextGroup.classList.toggle('active');
                    }
                    return;
                }
                var subHeader = e.target.closest('.category-header');
                if (subHeader) {
                    if (e.target.closest('a[href]')) {
                        var href = e.target.closest('a[href]').getAttribute('href');
                        if (href && href !== '#' && href !== 'javascript:void(0)') return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    var parentItem = subHeader.closest('.category-item');
                    if (parentItem) {
                        parentItem.classList.toggle('active');
                    }
                    return;
                }
            });
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        var path = window.location.pathname.split('/').pop().toLowerCase();
        if (!path || path === '' || path === '/') {
            path = 'index.html';
        }
        if (path !== 'admin.html') {
            logVisit(path);
        }
        if (window.PAGE_DATA && window.PAGE_DATA[path]) {
            try {
                var rawHtml = decodeURIComponent(escape(atob(window.PAGE_DATA[path])));
                
                var noCacheMeta = '\n<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n<meta http-equiv="Pragma" content="no-cache" />\n<meta http-equiv="Expires" content="0" />\n';
                var headIndex = rawHtml.indexOf('<head>');
                if (headIndex > -1) {
                    rawHtml = rawHtml.substring(0, headIndex + 6) + noCacheMeta + rawHtml.substring(headIndex + 6);
                }

                document.open();
                document.write(rawHtml);
                document.close();

                // Re-define after document.write
                window.toggleCatalogMenu = function(e) {
                    if (e) { e.preventDefault(); e.stopPropagation(); }
                    var menu = document.getElementById('mainMenuContainer') || document.querySelector('.main-menu-container');
                    if (!menu) return;
                    menu.classList.toggle('active');
                };

                window._baysuSetupAccordion();
                window._baysuSetupProductCards();

            } catch (e) {
                console.error(e);
            }
        } else {
            window._baysuSetupAccordion();
            window._baysuSetupProductCards();
        }
    });
})();
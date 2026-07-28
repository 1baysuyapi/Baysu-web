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

    // GLOBAL MENU TOGGLE - defined at window scope BEFORE document.write
    window.toggleCatalogMenu = function(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        var menu = document.getElementById('mainMenuContainer') || document.querySelector('.main-menu-container');
        if (!menu) return;
        if (menu.classList.contains('active') || menu.style.display === 'block') {
            menu.classList.remove('active');
            menu.style.display = 'none';
        } else {
            menu.classList.add('active');
            menu.style.display = 'block';
            menu.style.zIndex = '999999';
        }
    };

    // GLOBAL ACCORDION SETUP - bind after DOM is ready
    window._baysuSetupAccordion = function() {
        // Bind toggle triggers
        var triggers = document.querySelectorAll('#menuToggle, #menuToggleNav, #menuToggleDesktop, #menuToggleMobile, .menu-toggle, .dropdown-toggle');
        for (var i = 0; i < triggers.length; i++) {
            triggers[i].style.cursor = 'pointer';
            // Use addEventListener so it doesn't override onclick attribute
            (function(btn) {
                btn.addEventListener('click', function(e) {
                    window.toggleCatalogMenu(e);
                });
            })(triggers[i]);
        }

        // Accordion: main category headers & sub-headers
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
                
                // Inject meta headers to disable browser caching inside the compiled HTML output
                var noCacheMeta = '\n<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n<meta http-equiv="Pragma" content="no-cache" />\n<meta http-equiv="Expires" content="0" />\n';
                var headIndex = rawHtml.indexOf('<head>');
                if (headIndex > -1) {
                    rawHtml = rawHtml.substring(0, headIndex + 6) + noCacheMeta + rawHtml.substring(headIndex + 6);
                }

                document.open();
                document.write(rawHtml);
                document.close();

                // RE-DEFINE global toggleCatalogMenu after document.write (it wipes window properties on some browsers)
                window.toggleCatalogMenu = function(e) {
                    if (e) { e.preventDefault(); e.stopPropagation(); }
                    var menu = document.getElementById('mainMenuContainer') || document.querySelector('.main-menu-container');
                    if (!menu) return;
                    if (menu.classList.contains('active') || menu.style.display === 'block') {
                        menu.classList.remove('active');
                        menu.style.display = 'none';
                    } else {
                        menu.classList.add('active');
                        menu.style.display = 'block';
                        menu.style.zIndex = '999999';
                    }
                };

                // Setup accordion after the new document is ready
                window._baysuSetupAccordion();

            } catch (e) {
                console.error(e);
            }
        } else {
            // No SPA page found - we are on the raw HTML page, just setup accordion
            window._baysuSetupAccordion();
        }
    });
})();
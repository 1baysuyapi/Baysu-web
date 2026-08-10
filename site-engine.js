(function () {
    window.changeIpcQty = function(btn, delta) {
        var input = btn.parentElement.querySelector('.ipc-qty-input');
        var val = parseInt(input.value) || 1;
        val += delta;
        if (val < 1) val = 1;
        input.value = val;
    };
    window.getIpcQty = function(btn) {
        var input = btn.parentElement.parentElement.querySelector('.ipc-qty-input');
        return parseInt(input.value) || 1;
    };

    function getPageName(path) {
        if (!path || path === '' || path === '/' || path === 'index.html') return 'Ana Sayfa';
        var name = path.replace('.html', '').replace(/-/g, ' ');
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    function getRefName() {
        var ref = document.referrer;
        if (!ref || ref === '') return 'DoÄŸrudan GiriÅŸ (Direct)';
        if (ref.indexOf('google') > -1) return 'Google Arama';
        if (ref.indexOf('whatsapp') > -1) return 'WhatsApp';
        if (ref.indexOf('instagram') > -1) return 'Instagram';
        if (ref.indexOf(window.location.hostname) > -1) return 'Site Ä°Ã§i DolaÅŸÄ±m';
        return 'Harici BaÄŸlantÄ± (' + ref.split('/')[2] + ')';
    }

    function logVisit(path) {
        try {
            var logs = JSON.parse(localStorage.getItem('baysu_access_logs') || '[]');
            var now = new Date();
            var timeStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR');
            var isMobile = navigator.userAgent.indexOf('Mobile') > -1 || navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('iPhone') > -1;
            var devStr = isMobile ? 'ğŸ“± Mobil Cihaz' : 'ğŸ’» MasaÃ¼stÃ¼ Bilgisayar';
            var sid = sessionStorage.getItem('baysu_sid') || (function(){
                var id = Math.random().toString(36).substring(2, 9);
                sessionStorage.setItem('baysu_sid', id);
                return id;
            })();
            logs.push({ time: timeStr, page: path, pageName: getPageName(path), ref: getRefName(), device: devStr, sid: sid });
            if (logs.length > 250) logs.shift();
            localStorage.setItem('baysu_access_logs', JSON.stringify(logs));
        } catch(e) {}
    }

    // =============================================
    // GLOBAL MENU TOGGLE
    // =============================================
    // Visual error debugging to catch any javascript errors and display them
    window.onerror = function(msg, url, line) {
        var errDiv = document.createElement('div');
        errDiv.style = 'position:fixed;bottom:0;left:0;width:100%;background:rgba(255,0,0,0.9);color:white;padding:10px;z-index:9999999;font-family:monospace;font-size:12px;max-height:150px;overflow:auto;';
        errDiv.innerText = 'JS Error: ' + msg + ' at ' + url + ':' + line;
        document.body.appendChild(errDiv);
        return false;
    };

    window.toggleCatalogMenu = function(e) {
        if (e) { 
            try { e.preventDefault(); } catch(err){}
            try { e.stopPropagation(); } catch(err){}
        }
        var menu = document.getElementById('mainMenuContainer') || document.querySelector('.main-menu-container');
        if (!menu) {
            console.error('Menu element mainMenuContainer not found!');
            return;
        }
        
        // Toggle active class
        menu.classList.toggle('active');
        
        // Force display style update to bypass any CSS !important rule
        if (menu.classList.contains('active')) {
            menu.style.setProperty('display', 'block', 'important');
            menu.style.setProperty('z-index', '999999', 'important');
        } else {
            menu.style.setProperty('display', 'none', 'important');
        }
    };

    // =============================================
    // PRODUCT CARD CLICK TOGGLE (one at a time)
    // =============================================
    window._baysuSetupProductCards = function() {
        var cards = document.querySelectorAll('.product-card');
        for (var i = 0; i < cards.length; i++) {
            (function(card) {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.qty-btn') || e.target.closest('.qty-input') || e.target.closest('.btn-add-cart-custom')) return;
                    var wasActive = card.classList.contains('card-active');
                    var allCards = document.querySelectorAll('.product-card.card-active');
                    for (var j = 0; j < allCards.length; j++) { allCards[j].classList.remove('card-active'); }
                    if (!wasActive) { 
                        card.classList.add('card-active'); 
                        if (window.history && window.history.pushState) {
                            window.history.pushState({cardOpen: true}, "");
                        }
                    }
                });
                card.addEventListener('mouseenter', function(e) {
                    if (window.matchMedia("(hover: hover)").matches) {
                        card.classList.add('card-active');
                    }
                });
                card.addEventListener('mouseleave', function(e) {
                    if (window.matchMedia("(hover: hover)").matches) {
                        card.classList.remove('card-active');
                    }
                });
            })(cards[i]);
        }
    };
    
    window.addEventListener('popstate', function(e) {
        var activeCards = document.querySelectorAll('.product-card.card-active');
        if (activeCards.length > 0) {
            for (var j = 0; j < activeCards.length; j++) {
                activeCards[j].classList.remove('card-active');
            }
        }
    });

    // =============================================
    // FULL ACCORDION SETUP
    // =============================================
    window._baysuSetupAccordion = function() {
        // Bind menu toggle buttons (ONLY if they do not have an onclick attribute)
        var triggers = document.querySelectorAll('#menuToggle, #menuToggleNav, #menuToggleDesktop, #menuToggleMobile, .menu-toggle, .dropdown-toggle');
        for (var i = 0; i < triggers.length; i++) {
            (function(btn) {
                if (btn.hasAttribute('onclick')) return; // Avoid double triggering!
                btn.addEventListener('click', function(e) { window.toggleCatalogMenu(e); });
            })(triggers[i]);
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            var menu = document.getElementById('mainMenuContainer') || document.querySelector('.main-menu-container');
            if (!menu || !menu.classList.contains('active')) return;
            if (e.target.closest('#mainMenuContainer') || e.target.closest('.main-menu-container')) return;
            if (e.target.closest('#menuToggle') || e.target.closest('#menuToggleDesktop') || e.target.closest('.menu-toggle') || e.target.closest('.dropdown-toggle')) return;
            menu.classList.remove('active');
        });

        // ACCORDION: main-category-header click (KAPLINLER, BAHCE SULAMA)
        var mainHeaders = document.querySelectorAll('.main-category-header, .main-category-item');
        for (var i = 0; i < mainHeaders.length; i++) {
            (function(header) {
                if (header.hasAttribute('onclick')) return; // Avoid double triggering!
                header.style.cursor = 'pointer';
                header.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle this header
                    header.classList.toggle('active');
                    
                    // Toggle the next sibling (category-group)
                    var next = header.nextElementSibling;
                    if (next && (next.classList.contains('category-group') || next.tagName === 'UL')) {
                        if (next.style.display === 'grid' || next.style.display === 'block' || next.classList.contains('active')) {
                            next.style.display = 'none';
                            next.classList.remove('active');
                        } else {
                            next.style.display = 'grid';
                            next.classList.add('active');
                        }
                    }
                });
            })(mainHeaders[i]);
        }

        // ACCORDION: sub-category headers (Mavi Seri, Siyah Seri, etc.)
        var subHeaders = document.querySelectorAll('.category-header');
        for (var i = 0; i < subHeaders.length; i++) {
            (function(header) {
                if (header.hasAttribute('onclick')) return; // Avoid double triggering!
                header.addEventListener('click', function(e) {
                    // Allow direct links to work (like Bahce Ekipmanlari)
                    var link = e.target.closest('a[href]');
                    if (link) {
                        var href = link.getAttribute('href');
                        if (href && href !== '#' && href !== 'javascript:void(0)') {
                            return; // Let the link navigate
                        }
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var parentItem = header.closest('.category-item');
                    if (parentItem) {
                        parentItem.classList.toggle('active');
                        var productList = parentItem.querySelector('.product-list');
                        if (productList) {
                            if (productList.style.display === 'block') {
                                productList.style.display = 'none';
                            } else {
                                productList.style.display = 'block';
                            }
                        }
                    }
                });
            })(subHeaders[i]);
        }
    };

    function init() {
        // If document.body is null, the script is executing synchronously during parsing of the written document.
        // Return early and let DOMContentLoaded trigger the initialization once parsing is complete!
        if (!document.body) {
            return;
        }

        var pathname = window.location.pathname;
        if (pathname.length > 1 && pathname.charAt(pathname.length - 1) === '/') {
            pathname = pathname.substring(0, pathname.length - 1);
        }
        var path = pathname.split('/').pop().toLowerCase();
        if (!path || path === '') { 
            path = 'index.html'; 
        } else if (path.indexOf('.html') === -1) {
            path += '.html';
        }

        if (path !== 'admin.html') { logVisit(path); }

        if (path !== 'index.html' && window.PAGE_DATA && window.PAGE_DATA[path]) {
            try {
                var base64Str = window.PAGE_DATA[path];
                var rawHtml = '';
                try {
                    var binStr = atob(base64Str);
                    var bytes = new Uint8Array(binStr.length);
                    for (var i = 0; i < binStr.length; i++) { bytes[i] = binStr.charCodeAt(i); }
                    rawHtml = new TextDecoder('utf-8').decode(bytes);
                } catch(e) {
                    rawHtml = decodeURIComponent(escape(atob(base64Str)));
                }
                var doc = new DOMParser().parseFromString(rawHtml, "text/html");
                var newMain = doc.querySelector('main');
                if (!newMain) {
                    var b = doc.querySelector('body');
                    if (b) {
                        var elemsToRemove = b.querySelectorAll('header, footer, nav.nav-bar, .main-menu-container, .whatsapp-button');
                        for(var i = 0; i < elemsToRemove.length; i++) {
                            elemsToRemove[i].remove();
                        }
                        newMain = document.createElement('main');
                        newMain.innerHTML = b.innerHTML;
                    }
                }
                var currentMain = document.querySelector('main');
                
                if (newMain && currentMain) {
                    currentMain.innerHTML = newMain.innerHTML;
                    var newTitle = doc.querySelector('title');
                    document.title = newTitle ? newTitle.textContent : "BAYRAKÇI SULAMA VE YAPI MALZEMELERİ";
                    document.body.className = 'route-' + path.replace(/\//g, '');
                    window.scrollTo(0, 0);
                    // Toggle visibility of Hakkimizda and Iletisim based on route
                    var links = document.querySelectorAll('.nav-links a');
                    var isHomePage = (path === '/' || path === '/index.html' || path === '');
                    for (var i = 0; i < links.length; i++) {
                        if (links[i].textContent.indexOf('Hakkımızda') > -1 || links[i].textContent.indexOf('İletişim') > -1) {
                            links[i].style.display = isHomePage ? '' : 'none';
                        }
                    }

                } else {
                    console.error("Main content missing.");
                }

                window._baysuSetupAccordion();
                window._baysuSetupProductCards();
            } catch (e) {
                console.error("Failed to render page content", e);
            }
        } else {
            window._baysuSetupAccordion();
            window._baysuSetupProductCards();
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
// Global Cart Listener for dynamically loaded Image Products
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-add-to-cart')) {
        const btn = e.target.closest('.btn-add-to-cart');
        const card = btn.closest('.product-card');
        if (!card) return;
        
        const codeElem = card.querySelector('.product-code-badge');
        const nameElem = card.querySelector('h3');
        const priceElem = card.querySelector('.product-price');
        const infoSpans = card.querySelectorAll('.hover-info-row span');
        const qtyElem = card.querySelector('.qty-selector input');
        
        if (codeElem && nameElem && priceElem && infoSpans.length >= 2 && qtyElem) {
            const code = codeElem.innerText.trim();
            const name = nameElem.innerText.trim();
            const priceText = priceElem.innerText.trim().replace('â‚º', '').trim();
            const boxQty = infoSpans[0].innerText.trim();
            const packaging = infoSpans[1].innerText.trim();
            const qty = qtyElem.value;
            
            if (window.baysuAddToCartImageProduct) {
                window.baysuAddToCartImageProduct(code, name, priceText, boxQty, packaging, qty);
            }
        }
    }
});


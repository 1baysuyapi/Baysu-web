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
            if (cards[i]._hasCardListener) continue;
            cards[i]._hasCardListener = true;
            
            (function(card) {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.qty-btn') || e.target.closest('.qty-input') || e.target.closest('.btn-add-cart-custom') || e.target.closest('.add-to-cart-btn')) return;
                    
                    e.preventDefault();
                    
                    // On Desktop, don't open the mobile modal
                    if (window.matchMedia("(hover: hover)").matches && window.innerWidth > 992) {
                        var wasActive = card.classList.contains('card-active');
                        var activeCards = document.querySelectorAll('.product-card.card-active');
                        for (var j = 0; j < activeCards.length; j++) {
                            activeCards[j].classList.remove('card-active');
                        }
                        if (!wasActive) card.classList.add('card-active');
                        return;
                    }
                    
                    var btn = card.querySelector('.btn-add-cart-custom, .add-to-cart-btn');
                    if (btn) {
                        var code = btn.getAttribute('data-code');
                        var size = btn.getAttribute('data-size');
                        var name = btn.getAttribute('data-name');
                        var price = btn.getAttribute('data-price');
                        var img = btn.getAttribute('data-img') || (card.querySelector('img') ? card.querySelector('img').src : '');
                        
                        if (window.openQuickViewModal) {
                            window.openQuickViewModal(name, code, size, price, img, btn);
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
        
        // Add a document listener to close cards when clicking outside
        if (!window._baysuGlobalCardListener) {
            window._baysuGlobalCardListener = true;
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.product-card')) {
                    var activeCards = document.querySelectorAll('.product-card.card-active');
                    for (var j = 0; j < activeCards.length; j++) {
                        activeCards[j].classList.remove('card-active');
                    }
                }
            });
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

    // Inject Quick View Modal
    if (!document.getElementById('quickViewModal')) {
        var qvHtml = `
        <div id="quickViewModal" class="baysu-cart-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999999; backdrop-filter: blur(5px); align-items: center; justify-content: center; touch-action: manipulation;">
            <div style="background: #fff; width: 90%; max-width: 450px; border-radius: 20px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; max-height: 90vh; overflow-y: auto; touch-action: manipulation;">
                <button onclick="closeQuickViewModal()" style="position: absolute; top: 15px; right: 15px; background: #F1F5F9; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748B; font-size: 18px; transition: all 0.2s;"><i class="fas fa-times"></i></button>
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <img id="qvImg" src="" style="max-width: 100%; height: 200px; object-fit: contain; border-radius: 12px; margin-bottom: 15px;" />
                    <h2 id="qvTitle" style="font-size: 1.3rem; color: #0b1727; margin: 0 0 10px 0; font-weight: 700;">Ürün Adı</h2>
                    <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 15px;">
                        <span style="background: #F8FAFC; padding: 5px 12px; border-radius: 8px; font-size: 0.9rem; color: #64748B; font-weight: 600;"><i class="fas fa-barcode"></i> <span id="qvCode">Kod</span></span>
                        <span style="background: #F8FAFC; padding: 5px 12px; border-radius: 8px; font-size: 0.9rem; color: #64748B; font-weight: 600;"><i class="fas fa-ruler"></i> <span id="qvSize">Ebat</span></span>
                    </div>
                    <div id="qvPrice" style="font-size: 2rem; color: #004797; font-weight: 800; margin-bottom: 20px;">0.00 TL</div>
                </div>

                <div style="background: #F8FAFC; padding: 20px; border-radius: 16px; border: 1px solid #E2E8F0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                        <span style="font-weight: 600; color: #334155;">Adet:</span>
                        <div style="display: flex; align-items: center; background: #fff; border: 1px solid #CBD5E1; border-radius: 10px; overflow: hidden; height: 45px;">
                            <button onclick="var inp=document.getElementById('qvQty'); if(inp.value>1)inp.value--;" style="background: #F1F5F9; border: none; width: 45px; height: 100%; font-size: 18px; font-weight: bold; color: #334155; cursor: pointer; transition: 0.2s;"><i class="fas fa-minus"></i></button>
                            <input type="number" id="qvQty" value="1" min="1" style="width: 60px; height: 100%; border: none; text-align: center; font-size: 18px; font-weight: 700; color: #0b1727; outline: none; -moz-appearance: textfield;">
                            <button onclick="document.getElementById('qvQty').value++;" style="background: #F1F5F9; border: none; width: 45px; height: 100%; font-size: 18px; font-weight: bold; color: #334155; cursor: pointer; transition: 0.2s;"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                    
                    <button id="qvAddToCartBtn" onclick="qvAddToCart()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;">
                        <i class="fas fa-shopping-cart"></i> Sepete Ekle
                    </button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', qvHtml);
        
        window.openQuickViewModal = function(name, code, size, price, img, btnEl) {
            document.getElementById('qvTitle').innerText = name || '';
            document.getElementById('qvCode').innerText = (code && code !== '-') ? code : ((size && size !== '-') ? size : '-');
            document.getElementById('qvSize').innerText = (size && size !== '-') ? size : '-';
            document.getElementById('qvPrice').innerText = parseFloat(price || 0).toFixed(2) + ' TL';
            document.getElementById('qvImg').src = img || '';
            document.getElementById('qvQty').value = 1;
            
            // Sync with existing card input if available
            if (btnEl) {
                var card = btnEl.closest('.product-card');
                if (card) {
                    var originalInput = card.querySelector('.qty-input');
                    if (originalInput) {
                        document.getElementById('qvQty').value = originalInput.value || 1;
                    }
                }
            }
            
            window._qvCurrentBtn = btnEl;
            
            var modal = document.getElementById('quickViewModal');
            modal.style.display = 'flex';
            if (window.history && window.history.pushState) {
                window.history.pushState({qvOpen: true}, "");
            }
        };

        window.closeQuickViewModal = function() {
            var modal = document.getElementById('quickViewModal');
            if(modal) modal.style.display = 'none';
        };
        
        window.qvAddToCart = function() {
            var qty = parseInt(document.getElementById('qvQty').value) || 1;
            var btn = window._qvCurrentBtn;
            if (btn) {
                var card = btn.closest('.product-card');
                if (card) {
                    var originalInput = card.querySelector('.qty-input');
                    if (originalInput) {
                        originalInput.value = qty;
                    }
                }
                
                // Gerçek sepete ekleme işlemini tetikle
                btn.click();
                
                // Modal'ı kapat
                closeQuickViewModal();
            }
        };

        // Close on outside click
        document.getElementById('quickViewModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeQuickViewModal();
            }
        });
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
                      document.body.classList.add('is-product-page');
                    window.scrollTo(0, 0);
                    

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


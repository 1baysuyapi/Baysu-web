const fs = require('fs');

// 1. Fix outside click in index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
    /!e\.target\.closest\('\.nav-bar'\)/g,
    "!e.target.closest('#menuToggleDesktop') && !e.target.closest('.menu-toggle')"
);
fs.writeFileSync('index.html', indexHtml);

// 2. Add nav links visibility toggle to site-engine.js
let siteEngineJs = fs.readFileSync('site-engine.js', 'utf8');

const navLinksLogic = `
                    // Toggle visibility of Hakkimizda and Iletisim based on route
                    var links = document.querySelectorAll('.nav-links a');
                    var isHomePage = (path === '/' || path === '/index.html' || path === '');
                    for (var i = 0; i < links.length; i++) {
                        if (links[i].textContent.indexOf('Hakkımızda') > -1 || links[i].textContent.indexOf('İletişim') > -1) {
                            links[i].style.display = isHomePage ? '' : 'none';
                        }
                    }
`;

// Insert the logic after window.scrollTo(0, 0); in loadRoute
if (!siteEngineJs.includes("Toggle visibility of Hakkimizda")) {
    siteEngineJs = siteEngineJs.replace(
        /window\.scrollTo\(0, 0\);/,
        `window.scrollTo(0, 0);${navLinksLogic}`
    );
    
    // Also add it in handleInitialRoute for when the page loads directly on a product page
    siteEngineJs = siteEngineJs.replace(
        /function handleInitialRoute\(\) \{/,
        `function handleInitialRoute() {
            const path = window.location.pathname;
            // Toggle visibility of Hakkimizda and Iletisim for initial load
            var links = document.querySelectorAll('.nav-links a');
            var isHomePage = (path === '/' || path === '/index.html' || path === '');
            for (var i = 0; i < links.length; i++) {
                if (links[i].textContent.indexOf('Hakkımızda') > -1 || links[i].textContent.indexOf('İletişim') > -1) {
                    links[i].style.display = isHomePage ? '' : 'none';
                }
            }`
    );
    
    fs.writeFileSync('site-engine.js', siteEngineJs);
}

console.log('Applied click-outside fix and SPA nav links fix');

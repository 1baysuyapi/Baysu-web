const fs = require('fs');

// 1. Update site-engine.js to add/remove .is-product-page class
let js = fs.readFileSync('site-engine.js', 'utf8');

// Inside loadRoute, after setting the route- class, add is-product-page
if (!js.includes("document.body.classList.add('is-product-page');")) {
    js = js.replace(
        "document.body.className = 'route-' + path.replace(/\\//g, '');",
        "document.body.className = 'route-' + path.replace(/\\//g, '');\n                      document.body.classList.add('is-product-page');"
    );
}

// Inside handleInitialRoute, if home page, remove it
if (!js.includes("document.body.classList.remove('is-product-page');")) {
    js = js.replace(
        "// Ana sayfa zaten ykl, bir ey yapmaya gerek yok",
        "// Ana sayfa zaten yüklü, bir şey yapmaya gerek yok\n                document.body.classList.remove('is-product-page');"
    );
}
// Also remove it when clicking logo to go home: window.history.pushState(null, '', '/');
js = js.replace(
    /window\.history\.pushState\(null, '', '\/'\);/g,
    "window.history.pushState(null, '', '/');\n            document.body.classList.remove('is-product-page');"
);

// Remove the buggy javascript visibility toggle from earlier
js = js.replace(/\/\/ Toggle visibility of Hakkimizda and Iletisim based on route[\s\S]*?\}\s*\}/g, '');

fs.writeFileSync('site-engine.js', js);


// 2. Update cart.css to hide the links when .is-product-page is active
let css = fs.readFileSync('cart.css', 'utf8');
if (!css.includes('.is-product-page .nav-links a[href="/#about-section"]')) {
    css += `
/* SADECE URUN SAYFALARINDA HAKKIMIZDA VE ILETISIM LINKLERINI GIZLE */
.is-product-page .nav-links a[href="/#about-section"],
.is-product-page .nav-links a[href="/#contact-section"] {
    display: none !important;
}
`;
    fs.writeFileSync('cart.css', css);
}

console.log('Fixed SPA routing for nav links using CSS classes');

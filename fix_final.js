const fs = require('fs');

// 1. Fix site-engine.js for Bahce Ekipmanlari buttons
let js = fs.readFileSync('site-engine.js', 'utf8');
const oldBtnSelect = `var btn = card.querySelector('.btn-add-cart-custom');`;
const newBtnSelect = `var btn = card.querySelector('.btn-add-cart-custom, .add-to-cart-btn');`;
if (js.includes(oldBtnSelect)) {
    js = js.replace(oldBtnSelect, newBtnSelect);
    fs.writeFileSync('site-engine.js', js);
    console.log("Fixed site-engine.js for bahce buttons");
} else {
    console.log("Could not find button selector in site-engine.js");
}

// 2. Fix extracted_styles.css for Font Boosting
let css = fs.readFileSync('extracted_styles.css', 'utf8');
const fontBoostCss = `
/* Prevent Mobile Browsers from artificially boosting font sizes (Fixes iPhone vs Android differences) */
html, body {
    -webkit-text-size-adjust: 100% !important;
    -moz-text-size-adjust: 100% !important;
    text-size-adjust: 100% !important;
}
`;
if (!css.includes('-webkit-text-size-adjust')) {
    css = fontBoostCss + css;
    fs.writeFileSync('extracted_styles.css', css);
    console.log("Fixed font boosting in extracted_styles.css");
}

// Update cache busters in index.html to ensure users get the new CSS and JS
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('extracted_styles.css?', 'extracted_styles.css?v3=');
html = html.replace('site-engine.js?v2=', 'site-engine.js?v3=');
fs.writeFileSync('index.html', html);
console.log("Updated cache busters in index.html");

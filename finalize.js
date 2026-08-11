const fs = require('fs');

let css = fs.readFileSync('extracted_styles.css', 'utf8');
if (!css.includes('touch-action: manipulation;')) {
    css = `* { touch-action: manipulation; }\n` + css;
    fs.writeFileSync('extracted_styles.css', css);
}

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('cart.js?', 'cart.js?v2=');
html = html.replace('site-engine.js?', 'site-engine.js?v2=');
fs.writeFileSync('index.html', html);
console.log('done');

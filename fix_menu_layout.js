const fs = require('fs');

// Fix menu layout
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/m\.classList\.contains\('active'\) \? 'grid' : 'none'/g, "m.classList.contains('active') ? 'block' : 'none'");
fs.writeFileSync('index.html', html);

let css = fs.readFileSync('cart.css', 'utf8');
css = css.replace(/\.category-group\.active \{ display: grid !important; \}/g, '.category-group.active { display: block !important; }');
css = css.replace(/\.main-category-header\.active \+ \.category-group \{ display: grid !important; \}/g, '.main-category-header.active + .category-group { display: block !important; }');
fs.writeFileSync('cart.css', css);

console.log('Menu layout fixed');

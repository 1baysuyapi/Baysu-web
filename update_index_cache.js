const fs = require('fs');
const timestamp = Date.now();
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace cache busters for js and css
indexHtml = indexHtml.replace(/data\.js\?v=\d+/g, `data.js?v=${timestamp}`);
indexHtml = indexHtml.replace(/cart\.js\?v=\d+/g, `cart.js?v=${timestamp}`);
indexHtml = indexHtml.replace(/site-engine\.js\?v=\d+/g, `site-engine.js?v=${timestamp}`);
indexHtml = indexHtml.replace(/cart\.css\?v=\d+/g, `cart.css?v=${timestamp}`);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Updated index.html cache busters to: ' + timestamp);

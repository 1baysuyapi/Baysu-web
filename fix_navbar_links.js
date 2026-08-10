const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Change links to use absolute paths to homepage so they work from product pages
indexHtml = indexHtml.replace(/href="#about-section"/g, 'href="/#about-section"');
indexHtml = indexHtml.replace(/href="#contact-section"/g, 'href="/#contact-section"');

// 2. Remove the script that hides these links on product pages
const scriptToHide = /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*const\s*path\s*=\s*window\.location\.pathname;[\s\S]*?\}\);/;
indexHtml = indexHtml.replace(scriptToHide, '');

// 3. Bump cache
indexHtml = indexHtml.replace(/data\.js\?v=\d+/, 'data.js?v=' + Date.now());

fs.writeFileSync('index.html', indexHtml);
console.log('Fixed navbar links to show on all pages');

const fs = require('fs');

// 1. Restore hiding of Hakkimizda and Iletisim on product pages
let indexHtml = fs.readFileSync('index.html', 'utf8');

const hideScript = `
        // Hakkımızda ve İletişim linklerini sadece ana sayfada göster
        document.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname;
            if (path !== '/' && path !== '/index.html' && !path.endsWith('/Baysu-web/') && !path.endsWith('/Baysu-web/index.html')) {
                document.querySelectorAll('a[href="#about-section"], a[href="/#about-section"], a[href="#contact-section"], a[href="/#contact-section"]').forEach(el => el.style.display = 'none');
            }
        });
`;

if (!indexHtml.includes('Hakkımızda ve İletişim linklerini sadece ana sayfada göster')) {
    indexHtml = indexHtml.replace(/<script src="cart\.js\?v=\d+"><\/script>/, '<script src="cart.js?v=' + Date.now() + '"></script>\n<script>' + hideScript + '</script>');
}

// Bump cache
indexHtml = indexHtml.replace(/data\.js\?v=\d+/, 'data.js?v=' + Date.now());
fs.writeFileSync('index.html', indexHtml);

// 2. Clean up product pages in data.js to remove bad .nav-bar CSS overrides
let d = fs.readFileSync('data.js', 'utf8');
const regexData = /"([^"]+\.html)"\s*:\s*"([A-Za-z0-9+/=]+)"/g;

let validData = {};
let match;
while ((match = regexData.exec(d)) !== null) {
    validData[match[1]] = match[2];
}

for (const key of Object.keys(validData)) {
    let html = Buffer.from(validData[key], 'base64').toString('utf8');

    // Remove any .nav-bar background overrides
    html = html.replace(/\.nav-bar\s*\{[\s\S]*?background[^}]*\}/g, '');
    html = html.replace(/\.nav-bar\s*\{[^}]*display:\s*none\s*!important;[^}]*\}/g, '');
    html = html.replace(/\.top-nav-bar\s*\{[^}]*\}/g, '');
    
    // Specifically remove the inline style block causing issues if we can find it
    // Actually, just a simple regex to wipe out any .nav-bar blocks that remain and might interfere
    html = html.replace(/\.nav-bar\s*\{[\s\S]*?\}/g, '');

    validData[key] = Buffer.from(html, 'utf8').toString('base64');
}

let newData = 'window.PAGE_DATA = {\n';
let keys = Object.keys(validData);
for (let i = 0; i < keys.length; i++) {
    newData += '    "' + keys[i] + '": "' + validData[keys[i]] + '"';
    if (i < keys.length - 1) newData += ',\n';
    else newData += '\n';
}
newData += '};\n';

fs.writeFileSync('data.js', newData);
console.log('Fixed navbar color and restored link hiding logic');

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexRekorlar = /<li class="category-item">\s*<div class="category-header"[^>]*>\s*<h3>Rekorlar <span class="arrow-icon">&#9658;<\/span><\/h3>\s*<\/div>\s*<ul class="product-list">[\s\S]*?<\/ul>\s*<\/li>/;
const matchRekorlar = html.match(regexRekorlar);
const rekorlarBlock = matchRekorlar ? matchRekorlar[0] : '';

const bahceBlockRegex = /<li class="category-item">\s*<a href="\/bahce-ekipmanlari"[\s\S]*?<\/li>/;
const bahceBlockMatch = html.match(bahceBlockRegex);
const bahceBlock = bahceBlockMatch ? bahceBlockMatch[0] : '';

if (bahceBlock && rekorlarBlock) {
    // Remove Rekorlar
    html = html.replace(rekorlarBlock, '');
    
    // Remove Bahce
    html = html.replace(bahceBlock, '');
    
    // Insert them in correct order right after bahce-menu
    html = html.replace(/<ul class="category-group" id="bahce-menu">/, '<ul class="category-group" id="bahce-menu">\n' + bahceBlock + '\n' + rekorlarBlock);
    
    fs.writeFileSync('index.html', html);
    console.log('Swapped successfully');
} else {
    console.log('Could not find blocks');
}

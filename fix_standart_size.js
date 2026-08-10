const fs = require('fs');

let html = fs.readFileSync('ayarli-hortum-te.html', 'utf8');
html = html.replace(/<span class="ebat-pill">Standart<\/span>/, '<span class="ebat-pill">3/4" &bull; 1/2" &bull; 3/4"</span>');
fs.writeFileSync('ayarli-hortum-te.html', html);

console.log('Fixed Standart size to 3/4" • 1/2" • 3/4" in ayarli-hortum-te.html');

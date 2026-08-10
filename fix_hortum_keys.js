const fs = require('fs');
let d = fs.readFileSync('data.js', 'utf8');

d = d.replace(/"\/ayarli-hortum-eki"\s*:/, '"ayarli-hortum-eki.html":');
d = d.replace(/"\/ayarli-hortum-te"\s*:/, '"ayarli-hortum-te.html":');
d = d.replace(/"\/hortum-eki"\s*:/, '"hortum-eki.html":');
d = d.replace(/"\/hortum-reduksiyonu"\s*:/, '"hortum-reduksiyonu.html":');
d = d.replace(/"\/hortum-te"\s*:/, '"hortum-te.html":');

fs.writeFileSync('data.js', d);

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/data\.js\?v=\d+/, 'data.js?v=' + Date.now());
fs.writeFileSync('index.html', indexHtml);

console.log('Fixed Hortum keys in data.js to match Kaplin format!');

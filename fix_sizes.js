const fs = require('fs');
let js = fs.readFileSync('build_rekor_pages.js', 'utf8');
js = js.replace('2 1/2" (l)', '2 1/2"').replace('3" (l)', '3"');
fs.writeFileSync('build_rekor_pages.js', js);
console.log('Fixed sizes');

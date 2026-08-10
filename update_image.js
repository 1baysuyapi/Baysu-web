const fs = require('fs');
let html = fs.readFileSync('bahce_edit.html', 'utf8');

// The card name is '1" Ayarl Hortum Lans' or similar due to encoding, so let's match with a regex
html = html.replace(/(data-name="1"\s*Ayarl\s*Hortum\s*Lans"[^>]*>\s*<span class="badge">127<\/span>\s*)<img src="[^"]+"/i, '$1<img src="resimler/bahce_ekipmanlari/1_Inc_Ayarli_Hortum_Lansi.png"');

fs.writeFileSync('bahce_edit.html', html);

const dataCode = fs.readFileSync('data.js', 'utf8');
const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
const newBase64 = Buffer.from(html, 'utf8').toString('base64');
const newDataCode = dataCode.replace(routeRegex, (match, p1, p2, p3) => p1 + newBase64 + p3);
fs.writeFileSync('data.js', newDataCode);
console.log("Updated HTML for 1 inch Ayarlı Hortum Lansı image.");

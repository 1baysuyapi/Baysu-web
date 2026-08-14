const fs = require('fs');
let html = fs.readFileSync('kuresel-vana.html', 'utf8');

// Replace titles and names
html = html.replace(/Ayarlı Hortum Eki/g, 'PP Küresel Vana');
html = html.replace(/ayarli-hortum-eki/g, 'pp-kuresel-vana');
html = html.replace(/AYARLI HORTUM EKİ/g, 'PP KÜRESEL VANA');

// Replace image (assuming user will send it later, put a placeholder or generic for now)
// We will just leave the image tag, but maybe change the src to something like 'pp-kuresel-vana-placeholder.png'
html = html.replace(/ayarli-hortum-eki\.png/g, 'pp-kuresel-vana-placeholder.png');

fs.writeFileSync('kuresel-vana.html', html);
console.log("kuresel-vana.html updated!");

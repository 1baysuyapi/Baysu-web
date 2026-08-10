const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
const w = {PAGE_DATA:{}};
global.window = w;
eval(code);

for (const r in w.PAGE_DATA) {
    const html = Buffer.from(w.PAGE_DATA[r], 'base64').toString('utf8');
    const b = html.split('<div class="product-card"');
    for(let i=1; i<b.length; i++) {
        if(b[i].toLowerCase().includes('hortum lans')) {
            const nameMatch = b[i].match(/<h3[^>]*>([^<]+)<\/h3>/i);
            const name = nameMatch ? nameMatch[1] : '';
            const imgMatch = b[i].match(/<img src="([^"]+)"/i);
            const img = imgMatch ? imgMatch[1] : '';
            console.log(r, '|', name, '|', img);
        }
    }
}

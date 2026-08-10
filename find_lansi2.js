const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
const w = {PAGE_DATA:{}};
global.window = w;
eval(code);

const html = Buffer.from(w.PAGE_DATA['bahce-ekipmanlari.html'], 'base64').toString('utf8');
const b = html.split('<div class="product-card"');
for(let i=1; i<b.length; i++) {
    if(b[i].toLowerCase().includes('lans')) {
        const nameMatch = b[i].match(/<h3[^>]*>([^<]+)<\/h3>/i);
        const imgMatch = b[i].match(/<img src="([^"]+)"/i);
        const codeMatch = b[i].match(/<span class="badge">([^<]+)<\/span>/i);
        console.log(`Name: ${nameMatch?nameMatch[1]:''} | Code: ${codeMatch?codeMatch[1]:'-'} | Img: ${imgMatch?imgMatch[1]:''}`);
    }
}

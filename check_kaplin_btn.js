const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');
const regex = /"disli-disi-nipel\.html"\s*:\s*"([^"]+)"/;
const m = regex.exec(d);
if (m) {
    const html = Buffer.from(m[1], 'base64').toString('utf8');
    const btnMatch = html.match(/<button[^>]*class="add-btn"[^>]*>([\s\S]*?)<\/button>/);
    if(btnMatch) {
        console.log("Add-btn string found");
    } else {
        const otherBtn = html.match(/<button[^>]*add-to-cart-btn[^>]*>([\s\S]*?)<\/button>/);
        if (otherBtn) {
            console.log("add-to-cart-btn found:");
            console.log(html.match(/<button[^>]*add-to-cart-btn[^>]*>/)[0]);
        }
    }
}

const fs = require('fs');
const html = fs.readFileSync('bahce_edit.html', 'utf8');
const blocks = html.split('<div class="product-card"');
let output = [];
for (let i = 1; i < blocks.length; i++) {
    const m = blocks[i].match(/<h3[^>]*>([^<]+)<\/h3>/i);
    if(m) output.push(i + ': ' + m[1].trim());
}
fs.writeFileSync('current_order.txt', output.join('\n'));

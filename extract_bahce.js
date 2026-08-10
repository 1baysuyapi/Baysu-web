const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
const w = {PAGE_DATA:{}};
global.window = w;
eval(code);

const html = Buffer.from(w.PAGE_DATA['bahce-ekipmanlari.html'], 'base64').toString('utf8');
fs.writeFileSync('bahce_edit.html', html);

const fs = require('fs');

let dataJs = fs.readFileSync('data.js', 'utf8');
let finalHtml = fs.readFileSync('bahce_ekipmanlari_generated.html', 'utf8');
const base64Encoded = Buffer.from(unescape(encodeURIComponent(finalHtml)), 'binary').toString('base64');

const regex = /("bahce-ekipmanlari\.html"\s*:\s*")[^"]+(")/;
if (regex.test(dataJs)) {
    dataJs = dataJs.replace(regex, '$1' + base64Encoded + '$2');
    fs.writeFileSync('data.js', dataJs, 'utf8');
    console.log('data.js updated successfully!');
} else {
    console.log('Regex failed to match in data.js');
}

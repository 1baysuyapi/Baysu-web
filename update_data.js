const fs = require('fs');

let dataJs = fs.readFileSync('data.js', 'utf8');
let finalHtml = fs.readFileSync('bahce_ekipmanlari_generated.html', 'utf8');
const base64Encoded = Buffer.from(unescape(encodeURIComponent(finalHtml)), 'binary').toString('base64');

if (dataJs.includes('"bahce-ekipmanlari.html"')) {
    const regex = /("bahce-ekipmanlari\.html"\s*:\s*")[^"]+(")/;
    dataJs = dataJs.replace(regex, '$1' + base64Encoded + '$2');
} else {
    // Inject before the closing bracket
    dataJs = dataJs.replace(/};\s*$/, '  "bahce-ekipmanlari.html": "' + base64Encoded + '",\n};');
}

fs.writeFileSync('data.js', dataJs, 'utf8');
console.log('data.js updated successfully!');

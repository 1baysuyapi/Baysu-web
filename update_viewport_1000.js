const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/<meta name="viewport" content="width=device-width, initial-scale=1\.0"\s*\/>/g, '<meta name="viewport" content="width=1000" />');
fs.writeFileSync('index.html', indexHtml);

let dataJs = fs.readFileSync('data.js', 'utf8');

const regex = /"([^"]+\.html)"\s*:\s*"([^"]+)"/g;
let match;
const replacements = [];

while ((match = regex.exec(dataJs)) !== null) {
    const key = match[1];
    const b64 = match[2];
    let html = Buffer.from(b64, 'base64').toString('utf8');
    
    if (html.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0" />')) {
        html = html.replace(/<meta name="viewport" content="width=device-width, initial-scale=1\.0"\s*\/>/g, '<meta name="viewport" content="width=1000" />');
        const newB64 = Buffer.from(html, 'utf8').toString('base64');
        replacements.push({ key: match[0], newKey: `"${key}":"${newB64}"` });
    }
}

replacements.forEach(r => {
    dataJs = dataJs.replace(r.key, r.newKey);
});

fs.writeFileSync('data.js', dataJs);
console.log(`Updated viewport to width=1000 in index.html and ${replacements.length} pages in data.js`);

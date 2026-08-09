const fs = require('fs');

let d = fs.readFileSync('data.js', 'utf8');
const validData = {};
const regex = /"([^"]+\.html)"\s*:\s*"([A-Za-z0-9+/=]+)"/g;

let match;
while ((match = regex.exec(d)) !== null) {
    validData[match[1]] = match[2];
}

// FORCE OVERWRITE WITH NEWEST HTML
const html = fs.readFileSync('depo_rekorlari.html', 'utf8');
validData['depo-rekorlari.html'] = Buffer.from(html, 'utf8').toString('base64');

let newData = 'window.PAGE_DATA = {\n';
let keys = Object.keys(validData);
for (let i = 0; i < keys.length; i++) {
    newData += '    "' + keys[i] + '": "' + validData[keys[i]] + '"';
    if (i < keys.length - 1) newData += ',\n';
    else newData += '\n';
}
newData += '};\n';

fs.writeFileSync('data.js', newData);
console.log('Successfully injected newest depo_rekorlari.html!');

// Also bump the cache buster in index.html to be absolutely sure
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/data\.js\?v=\d+/, 'data.js?v=' + Date.now());
fs.writeFileSync('index.html', indexHtml);

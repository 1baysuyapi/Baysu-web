const fs = require('fs');
let d = fs.readFileSync('data.js', 'utf8');

// The file should start with window.PAGE_DATA = {
// and end with };
// We will extract all valid keys!
const validData = {};
const regex = /"([^"]+\.html)"\s*:\s*"([A-Za-z0-9+/=]+)"/g;

let match;
while ((match = regex.exec(d)) !== null) {
    validData[match[1]] = match[2];
}

// Ensure depo-rekorlari.html is correctly present!
if (!validData['depo-rekorlari.html']) {
    console.log("depo-rekorlari.html missing, adding it now!");
    const html = fs.readFileSync('depo_rekorlari.html', 'utf8');
    validData['depo-rekorlari.html'] = Buffer.from(html, 'utf8').toString('base64');
}

let newData = 'window.PAGE_DATA = {\n';
let keys = Object.keys(validData);
for (let i = 0; i < keys.length; i++) {
    newData += '    "' + keys[i] + '": "' + validData[keys[i]] + '"';
    if (i < keys.length - 1) newData += ',\n';
    else newData += '\n';
}
newData += '};\n';

fs.writeFileSync('data.js', newData);
console.log("data.js successfully rebuilt with " + keys.length + " keys.");

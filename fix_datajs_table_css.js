const fs = require('fs');

let d = fs.readFileSync('data.js', 'utf8');
const regexData = /"([^"]+\.html)"\s*:\s*"([A-Za-z0-9+/=]+)"/g;

let validData = {};
let match;
while ((match = regexData.exec(d)) !== null) {
    validData[match[1]] = match[2];
}

for (const key of Object.keys(validData)) {
    let html = Buffer.from(validData[key], 'base64').toString('utf8');

    // Replace `.table-responsive, table {` with `.table-responsive {`
    html = html.replace(/\.table-responsive,\s*table\s*\{/g, '.table-responsive {');

    // Also remove any direct `table { display: block; }` just in case
    html = html.replace(/table\s*\{\s*display:\s*block;/g, 'table { display: table;');

    validData[key] = Buffer.from(html, 'utf8').toString('base64');
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
console.log('Fixed table display block issue inside data.js');

const fs = require('fs');

const pagesToInject = [
    'ayarli-hortum-eki.html',
    'ayarli-hortum-te.html',
    'hortum-eki.html',
    'hortum-reduksiyonu.html',
    'hortum-te.html'
];

let d = fs.readFileSync('data.js', 'utf8');
const validData = {};
const regex = /"([^"]+\.html)"\s*:\s*"([A-Za-z0-9+/=]+)"/g;

let match;
while ((match = regex.exec(d)) !== null) {
    validData[match[1]] = match[2];
}

pagesToInject.forEach(file => {
    if(fs.existsSync(file)) {
        const html = fs.readFileSync(file, 'utf8');
        validData[file] = Buffer.from(html, 'utf8').toString('base64');
        console.log('Injected ' + file);
    }
});

let newData = 'window.PAGE_DATA = {\n';
let keys = Object.keys(validData);
for (let i = 0; i < keys.length; i++) {
    newData += '    "' + keys[i] + '": "' + validData[keys[i]] + '"';
    if (i < keys.length - 1) newData += ',\n';
    else newData += '\n';
}
newData += '};\n';

fs.writeFileSync('data.js', newData);

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/data\.js\?v=\d+/, 'data.js?v=' + Date.now());
fs.writeFileSync('index.html', indexHtml);

console.log('Successfully injected Hortum Ek Parçaları pages into data.js');

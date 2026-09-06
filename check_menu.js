const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const searchStr = 'id="kaplinler-menu"';
const start = html.indexOf(searchStr);
console.log(html.substring(start, start + 1000));

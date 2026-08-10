const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
// Mock window object
global.window = {};
eval(code);

let allHtml = '';
for (const route in window.BaysuData.routes) {
    allHtml += '\n\n<!-- ROUTE: ' + route + ' -->\n\n';
    allHtml += Buffer.from(window.BaysuData.routes[route], 'base64').toString('utf8');
}
fs.writeFileSync('all_routes.html', allHtml);
console.log('Saved all_routes.html, length:', allHtml.length);

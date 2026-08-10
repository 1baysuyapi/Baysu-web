const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');

// The structure is window.PAGE_DATA = { routes: { ... } }
// So we can extract it manually
const startIndex = code.indexOf('"'); // Start of the first string (assuming it's a key)
// Just regex the keys
const regex = /"(\/[^"]+)":\s*"/g;
let match;
while ((match = regex.exec(code)) !== null) {
    console.log(match[1]);
}

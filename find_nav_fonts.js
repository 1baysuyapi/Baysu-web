const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const searchStrings = ['.nav-links a {', '.main-category-item h3 {', '.category-group .category-header h3 {', '.product-list li a {'];

for (let i = 0; i < lines.length; i++) {
    for (const str of searchStrings) {
        if (lines[i].includes(str)) {
            console.log(`Match for ${str} at line ${i + 1}`);
            console.log(lines.slice(i, i + 8).join('\n'));
            console.log('---');
        }
    }
}

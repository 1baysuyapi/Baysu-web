const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let count = 0;
for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const modified = content.replace(/ defer><\/script>/g, '></script>');
    
    if (content !== modified) {
        fs.writeFileSync(filePath, modified, 'utf8');
        count++;
    }
}
console.log(`Fixed ${count} files.`);

const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');
const regex = /"([^"]+)"\s*:/g;
let m;
while (m = regex.exec(d)) {
    if (m[1].includes('jumbo')) {
        console.log(m[1]);
    }
}

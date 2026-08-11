const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
lines.forEach((l, i) => {
    if (l.includes('search') || l.includes('Arama') || l.includes('arama')) {
        console.log(i + 1, l);
    }
});

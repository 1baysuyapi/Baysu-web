const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');
const regex = /"([^"]+)"\s*:\s*"([^"]+)"/g;
let m;
while (m = regex.exec(d)) {
    const html = Buffer.from(m[2], 'base64').toString('utf8');
    if (html.toLowerCase().includes('129') || html.toLowerCase().includes('jumbo')) {
        console.log('Found in:', m[1]);
        const btnMatch = html.match(/<button[^>]*>([\s\S]*?)<\/button>/);
        if (btnMatch) {
            // Check if there is an accordion or what
            const lines = html.split('\n');
            lines.forEach(l => {
                if(l.includes('product-features-box') || l.includes('card-active')) console.log(l.trim());
            });
        }
    }
}

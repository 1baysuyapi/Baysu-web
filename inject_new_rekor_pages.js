const fs = require('fs');
const path = require('path');

let dataJsContent = fs.readFileSync('data.js', 'utf8');

// The array of new pages to inject
const newPages = [
    'cift-tarafli-depo-rekoru.html',
    'depo-rekoru-ters-dis.html',
    'sintine-rekoru-ters-dis.html',
    'pvc-hortum-rekoru.html',
    'galvanizli-hortum-rekoru.html',
    'ozel-depo-rekoru.html'
];

for (const filename of newPages) {
    if (fs.existsSync(filename)) {
        const fileContent = fs.readFileSync(filename, 'utf8');
        const base64Str = Buffer.from(fileContent).toString('base64');
        
        // Remove the entry if it already exists (to avoid duplicates)
        const regex = new RegExp(`"${filename.replace(/\./g, '\\.')}"\\s*:\\s*"[^"]*",?`, 'g');
        dataJsContent = dataJsContent.replace(regex, '');
        
        // Insert it right after `window.PAGE_DATA = {`
        const injection = `\n    "${filename}": "${base64Str}",`;
        dataJsContent = dataJsContent.replace(/window\.PAGE_DATA\s*=\s*\{/, "window.PAGE_DATA = {" + injection);
        console.log(`Successfully injected ${filename} into data.js`);
    } else {
        console.warn(`${filename} not found, skipping.`);
    }
}

// Remove old 'depo_rekorlari.html' completely
const oldRegex = new RegExp(`"depo_rekorlari\\.html"\\s*:\\s*"[^"]*",?`, 'g');
dataJsContent = dataJsContent.replace(oldRegex, '');
const oldRegex2 = new RegExp(`"depo-rekorlari\\.html"\\s*:\\s*"[^"]*",?`, 'g');
dataJsContent = dataJsContent.replace(oldRegex2, '');

fs.writeFileSync('data.js', dataJsContent);
console.log('data.js update complete.');

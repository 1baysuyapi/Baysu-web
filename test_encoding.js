const fs = require('fs');
const dataJs = fs.readFileSync('data.js', 'utf8');
const lines = dataJs.split('\n');
const match = lines[1].match(/^\s*"[^"]+"\s*:\s*"([^"]+)"/);
if (match) {
    const b64 = match[1];
    const html = Buffer.from(b64, 'base64').toString('utf8');
    const snippet = html.substring(34500, 35500);
    if (snippet.includes('KAPLİNLER')) {
        console.log("SUCCESS: Characters are correct.");
    } else if (snippet.includes('KAPL')) {
        console.log("FAILED: Found corrupted characters: " + snippet.match(/KAPL.*/)[0]);
    } else {
        console.log("Could not find KAPL string in this chunk.");
    }
}

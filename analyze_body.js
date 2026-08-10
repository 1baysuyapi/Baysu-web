const fs = require('fs');
const html = fs.readFileSync('kaplin_full.html', 'utf8');
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if(bodyMatch) {
    const body = bodyMatch[1];
    // Find where the actual product content starts
    // In index.html, it is usually inside <main>
    // Let's see what's after the navigation
    console.log(body.substring(body.indexOf('<!-- MAIN CATEGORY 1'), body.indexOf('<!-- MAIN CATEGORY 1') + 1000));
}

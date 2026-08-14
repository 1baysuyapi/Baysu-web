const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const styleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) {
    console.error('No style tag in index.html!');
    process.exit(1);
}
const fullCSS = styleMatch[1];

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;

    // We know from inline_css.js that we injected the styles like this:
    // </title>\n<style>\n...extracted_styles.css content...\n</style>\n
    // Let's replace the first <style>...</style> block with the fullCSS from index.html!
    
    // Find the first <style>...</style> block after </title>
    const firstStyleStart = html.indexOf('<style>');
    const firstStyleEnd = html.indexOf('</style>') + 8;
    
    if (firstStyleStart !== -1 && firstStyleEnd !== -1) {
        const newStyleBlock = `<style>\n${fullCSS}\n</style>`;
        html = html.substring(0, firstStyleStart) + newStyleBlock + html.substring(firstStyleEnd);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, html);
        console.log('Injected full CSS into', file);
    }
}

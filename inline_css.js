const fs = require('fs');

const cssContent = fs.readFileSync('extracted_styles.css', 'utf8');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Remove the link to extracted_styles.css if it exists
    if (html.includes('<link rel="stylesheet" href="extracted_styles.css?v=1029">')) {
        html = html.replace('<link rel="stylesheet" href="extracted_styles.css?v=1029">', '');
        changed = true;
    }

    // Inject the inline styles right after <head>
    if (!html.includes('/* Prevent Mobile Browsers from artificially boosting font sizes')) {
        const styleBlock = `\n<style>\n${cssContent}\n</style>\n`;
        html = html.replace('</title>', '</title>' + styleBlock);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, html);
        console.log('Inlined CSS into', file);
    }
}

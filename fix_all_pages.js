const fs = require('fs');

// Read index.html to get the correct header and nav
const indexHtml = fs.readFileSync('index.html', 'utf8');

const headerRegex = /<header class="header-main">[\s\S]*?<\/header>/;
const navRegex = /<nav class="nav-bar">[\s\S]*?<\/nav>/;

const indexHeader = indexHtml.match(headerRegex)[0];
const indexNav = indexHtml.match(navRegex)[0];

// Also get the top-nav-bar if it exists in index.html (the very top small blue bar, if any)
const topNavRegex = /<div class="top-nav-bar">[\s\S]*?<\/div>/;
const indexTopNavMatch = indexHtml.match(topNavRegex);
const indexTopNav = indexTopNavMatch ? indexTopNavMatch[0] : '';

// Read data.js
let d = fs.readFileSync('data.js', 'utf8');
const regexData = /"([^"]+\.html)"\s*:\s*"([A-Za-z0-9+/=]+)"/g;

let validData = {};
let match;
while ((match = regexData.exec(d)) !== null) {
    validData[match[1]] = match[2];
}

console.log('Processing ' + Object.keys(validData).length + ' pages...');

for (const key of Object.keys(validData)) {
    let html = Buffer.from(validData[key], 'base64').toString('utf8');

    // 1. REPLACE HEADER AND NAV
    // Remove existing top-nav-bar if any
    html = html.replace(/<div class="top-nav-bar">[\s\S]*?<\/div>/, '');
    
    // Replace header
    html = html.replace(/<header class="header-main">[\s\S]*?<\/header>/, indexHeader);
    
    // Replace nav
    html = html.replace(/<nav class="nav-bar">[\s\S]*?<\/nav>/, indexNav);
    
    // If index had top-nav-bar, insert it before header
    if (indexTopNav && !html.includes(indexTopNav)) {
        html = html.replace(/<header class="header-main">/, indexTopNav + '\n<header class="header-main">');
    }

    // 2. FIX TABLE FULL WIDTH LAYOUT
    // Currently, the structure is:
    // <div class="product-info">
    //     ...
    //     <div class="table-wrapper">...</div>  (or <div class="table-responsive">...</div>)
    // </div>
    // 
    // We want to move the table-wrapper OUTSIDE of product-info, and place it right after <div class="product-info">...</div>
    // However, the product-detail-container might have flex: 1 1 400px; which is fine for product-image and product-info.
    // If we move the table outside product-info but KEEP it inside product-detail-container, it will wrap below IF it has width 100%.
    
    // First, let's find the table block. It could be table-responsive or table-wrapper.
    let tableRegex = /(<div class="(?:table-responsive|table-wrapper)">[\s\S]*?<\/table>\s*<\/div>)/;
    let tableMatch = html.match(tableRegex);
    
    if (tableMatch) {
        let tableHtml = tableMatch[0];
        
        // Remove the table from its current position
        html = html.replace(tableRegex, '');
        
        // Insert the table right after the closing </div> of product-info
        // How to find the closing div? 
        // We know product-info ends shortly after the table usually.
        // Or we can just insert the table at the very end of <div class="product-detail-container">.
        // Let's insert it before the closing </div> of product-detail-container.
        // The container ends where the footer starts, or we can just replace `</main>` or `<div class="whatsapp-float-wrapper">`
        
        // A safer way: add a new div wrapper for the table, width: 100%
        let newTableBlock = '<div class="full-width-table-container" style="width: 100%; flex: 0 0 100%; margin-top: 20px;">' + tableHtml + '</div>';
        
        // Find `</div>` that belongs to product-detail-container.
        // Actually, since it's a flex container with flex-wrap: wrap, we can just insert it inside the container at the bottom.
        // Let's find `<div class="product-info">...` and insert after its closing div? Hard with regex.
        // Let's just find the closing tag of product-detail-container. We can't easily parse it.
        // BUT wait, we can just append it right after the `product-info` block by searching for `<div class="product-info">` and appending.
        
        // Actually, if we just put it inside `product-detail-container`, at the end, it will naturally take 100% width if we set flex: 0 0 100%.
        // Let's search for `<!-- table goes here -->` or something? No.
        
        // Let's use a simple approach:
        // In the original, the table was inside `product-info`.
        // Let's put it back into `product-info`, BUT change `product-detail-container` to NOT be flex? No, image and info are side-by-side.
        // If we want the table full width below BOTH, the container must wrap.
        // If we inject `newTableBlock` right before `</main>`, wait, `kaplin_sample` doesn't have `<main>`.
        // Let's just append it after `<div class="product-detail-container">...</div>`.
        // But how to find the end?
        // In most of these pages, after product-detail-container, there's `<footer>` or `<div class="whatsapp-float-wrapper">` or `<script>`.
        // Let's just replace `<footer>` with `</div> <!-- end of container --> \n <div class="table-container" style="max-width:1200px; margin: 0 auto; padding: 20px; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 20px;">${tableHtml}</div> \n <footer>`
        
        // Wait, if I extract the table and insert it BEFORE `<footer>`:
        // But I also need to remove it from inside `product-info`.
        // I already did `html = html.replace(tableRegex, '');`
        
        // Let's inject it before `<div class="whatsapp-float-wrapper">` or `<footer>`
        let tableInjectionPoint = html.indexOf('<footer>');
        if (tableInjectionPoint === -1) tableInjectionPoint = html.indexOf('<div class="whatsapp-float-wrapper"');
        if (tableInjectionPoint === -1) tableInjectionPoint = html.indexOf('</body>');
        
        if (tableInjectionPoint !== -1) {
             let part1 = html.substring(0, tableInjectionPoint);
             let part2 = html.substring(tableInjectionPoint);
             
             let standaloneTable = `
             <div class="full-width-table-section" style="max-width: 1200px; margin: 0 auto 40px auto; padding: 20px; background: var(--card-background, #fff); border-radius: var(--border-radius, 12px); box-shadow: var(--box-shadow, 0 4px 20px rgba(0,0,0,0.05)); box-sizing: border-box;">
                 ${tableHtml}
             </div>
             `;
             html = part1 + standaloneTable + part2;
        }
    }
    
    validData[key] = Buffer.from(html, 'utf8').toString('base64');
}

// Write back to data.js
let newData = 'window.PAGE_DATA = {\n';
let keys = Object.keys(validData);
for (let i = 0; i < keys.length; i++) {
    newData += '    "' + keys[i] + '": "' + validData[keys[i]] + '"';
    if (i < keys.length - 1) newData += ',\n';
    else newData += '\n';
}
newData += '};\n';

fs.writeFileSync('data.js', newData);
console.log('Successfully updated all pages in data.js!');

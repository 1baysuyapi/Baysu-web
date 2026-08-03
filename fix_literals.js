const fs = require('fs');

let content = fs.readFileSync('cart.js', 'utf-8');

// Replace template literals with string concatenations
content = content.replace(/`([\s\S]*?)`/g, function(match, inner) {
    let parts = [];
    let regex = /\$\{([^}]+)\}/g;
    let lastIndex = 0;
    let m;
    
    while ((m = regex.exec(inner)) !== null) {
        let text = inner.substring(lastIndex, m.index);
        if (text) {
            // Escape double quotes and newlines
            text = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n" +\n"');
            parts.push('"' + text + '"');
        }
        parts.push('String(' + m[1] + ')');
        lastIndex = regex.lastIndex;
    }
    
    let text = inner.substring(lastIndex);
    if (text) {
        text = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n" +\n"');
        parts.push('"' + text + '"');
    }
    
    if (parts.length === 0) return '""';
    return parts.join(' + ');
});

fs.writeFileSync('cart.js', content, 'utf-8');
console.log('Template literals replaced!');

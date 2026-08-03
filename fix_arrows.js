const fs = require('fs');
let content = fs.readFileSync('cart.js', 'utf-8');

// Replace () => {
content = content.replace(/\(\)\s*=>\s*\{/g, 'function() {');

// Replace item => ...
content = content.replace(/item\s*=>\s*([^=\s].+?)(?=\s*(?:&&|\|\||===|!==|;|\)))/g, 'function(item) { return $1; }');

// Specific replacements to be safe
content = content.replace(/item => sanitizeAttr\(item.productName\) === cleanName && sanitizeAttr\(item.size\) === cleanSize/g, 'function(item) { return sanitizeAttr(item.productName) === cleanName && sanitizeAttr(item.size) === cleanSize; }');

content = content.replace(/\(sum, item\)\s*=>\s*sum\s*\+\s*item\.quantity/g, 'function(sum, item) { return sum + item.quantity; }');

fs.writeFileSync('cart.js', content, 'utf-8');
console.log('Arrow functions replaced');

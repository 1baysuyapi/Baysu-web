const fs = require('fs');
let d = fs.readFileSync('data.js', 'utf8');

// The string near the end looks like: 
// ",
// ,\n    "depo-rekorlari.html": "

// First, let's fix any occurrences of '",\r\n,\\n    "depo-rekorlari' or similar
let fixed = d.replace(/",\r?\n,\\n\s*"depo-rekorlari\.html"/, '",\n    "depo-rekorlari.html"');
fixed = fixed.replace(/",\r?\n,\s*"depo-rekorlari\.html"/, '",\n    "depo-rekorlari.html"');
fixed = fixed.replace(/",\n,\\n\s*"depo-rekorlari\.html"/, '",\n    "depo-rekorlari.html"');

fs.writeFileSync('data.js', fixed);
console.log("Fixed syntax");

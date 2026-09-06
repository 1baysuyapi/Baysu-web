const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Get all product titles in index.html
const titles = [...html.matchAll(/<h3>([^<]+)<\/h3>/g)].map(m => m[1]);
console.log('Categories/Titles found in index.html:', titles);

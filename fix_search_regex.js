const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Match everything from "// CanlÄ± Arama" to the end of that block
const startStr = '// CanlÄ± Arama';
const startIndex = html.indexOf(startStr);
if (startIndex !== -1) {
    const endIndex = html.indexOf('});', html.indexOf('});', startIndex) + 3) + 3;
    const oldBlock = html.substring(startIndex, endIndex);
    
    let newBlock = oldBlock.replace("document.addEventListener('DOMContentLoaded', () => {", "(function() {");
    newBlock = newBlock.replace("productsData.filter(p => p.name.toLowerCase().includes(query));", "productsData.filter(p => p.name.toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR')));");
    
    // The block ends with }); which closed DOMContentLoaded. Change it to })();
    newBlock = newBlock.substring(0, newBlock.lastIndexOf('});')) + '})();';
    
    html = html.replace(oldBlock, newBlock);
    
    // Also, there's a click outside listener that might be interfering. Let's fix that too.
    const oldClick = "if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {";
    const newClick = "if (e.target !== searchInput && !searchResults.contains(e.target)) {";
    html = html.replace(oldClick, newClick);
    
    fs.writeFileSync('index.html', html);
    console.log("Fixed search logic in index.html");
} else {
    console.log("Could not find start index");
}

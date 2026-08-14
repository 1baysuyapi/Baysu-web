const fs = require('fs');

// Read extracted_styles.css
const cssLines = fs.readFileSync('extracted_styles.css', 'utf8').split('\n');

// Find start and end of the script tag
let startIdx = -1;
let endIdx = -1;
for (let i = 0; i < cssLines.length; i++) {
    if (cssLines[i].includes('<script id="baysu-search-engine">')) {
        startIdx = i;
    }
    if (startIdx !== -1 && cssLines[i].includes('</script>')) {
        endIdx = i;
        break; // Only remove the first instance if there are somehow multiple
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    // Remove the lines
    cssLines.splice(startIdx, endIdx - startIdx + 1);
    
    // Save back to extracted_styles.css
    fs.writeFileSync('extracted_styles.css', cssLines.join('\n'));
    console.log(`Successfully removed JS block from CSS (lines ${startIdx} to ${endIdx})`);
} else {
    console.log("Could not find the script block in CSS.");
}

// Ensure index.html cache buster is updated so the browser fetches the clean CSS
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('extracted_styles.css?v3=', 'extracted_styles.css?v4=');
fs.writeFileSync('index.html', html);
console.log("Updated cache busters in index.html");

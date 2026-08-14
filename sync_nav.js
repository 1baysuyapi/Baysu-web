const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
const navRegex = /<nav class="nav-bar">[\s\S]*?<\/nav>/;
let navMatch = indexHtml.match(navRegex);

if (navMatch) {
    let newNav = navMatch[0];
    
    // Get all html files
    let files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');
    
    for (let file of files) {
        let html = fs.readFileSync(file, 'utf8');
        if (navRegex.test(html)) {
            html = html.replace(navRegex, newNav);
            fs.writeFileSync(file, html);
            console.log("Updated nav in " + file);
        }
    }
    console.log("Navigation sync complete!");
} else {
    console.log("Could not find nav in index.html");
}

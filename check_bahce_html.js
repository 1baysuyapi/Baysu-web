const fs = require('fs');
const lines = fs.readFileSync('data.js', 'utf8').split('\n');
const line = lines.find(l => l.includes('"bahce-ekipmanlari.html":"'));
if (line) {
    const b64 = line.split(':"')[1].slice(0, -2); // remove ",
    let html = Buffer.from(b64, 'base64').toString('utf8');
    
    // Check classes
    const match = html.match(/class="[^"]*product-card[^"]*"/);
    if (match) {
        console.log("Found product-card class:", match[0]);
    } else {
        console.log("No product-card class found!");
    }
    
    // Check if there's an inline script
    const scriptStart = html.indexOf('<script>');
    if (scriptStart !== -1) {
        console.log("Found script tag!");
        console.log(html.substring(scriptStart, html.indexOf('</script>') + 9));
        
        // Remove it!
        html = html.replace(/<script>[\s\S]*?<\/script>/g, '');
        const newB64 = Buffer.from(html).toString('base64');
        let newJs = fs.readFileSync('data.js', 'utf8');
        newJs = newJs.replace(b64, newB64);
        fs.writeFileSync('data.js', newJs);
        console.log("Removed script and saved data.js");
    }
}

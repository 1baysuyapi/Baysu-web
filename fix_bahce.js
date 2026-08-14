const fs = require('fs');
const lines = fs.readFileSync('data.js', 'utf8').split('\n');
const line = lines.find(l => l.includes('bahceEkipmanlariHTML ='));
if(line) {
    const b64 = line.split('"')[1];
    let html = Buffer.from(b64, 'base64').toString('utf8');
    const scriptStart = html.indexOf('<script>');
    if (scriptStart !== -1) {
        console.log("FOUND SCRIPT IN BAHCE EKIPMANLARI:");
        console.log(html.substring(scriptStart, html.indexOf('</script>') + 9));
        
        // Remove the script that adds click listener manually
        // We will just replace it with an empty string
        html = html.replace(/<script>[\s\S]*?bahceCards\.forEach[\s\S]*?<\/script>/, '');
        const newB64 = Buffer.from(html).toString('base64');
        let newJs = fs.readFileSync('data.js', 'utf8');
        newJs = newJs.replace(b64, newB64);
        fs.writeFileSync('data.js', newJs);
        console.log("Removed script from data.js bahceEkipmanlariHTML");
    } else {
        console.log("No script found");
    }
}

const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');

    // Replace height: 340px; with min-height: 340px; height: auto;
    // We can just use a regex
    html = html.replace(/height:\s*340px;/g, 'min-height: 340px; height: auto;');
    
    // Just in case there's another specific fixed height in the main CSS for .product-card
    // wait, in the generic CSS it was:
    // .product-card { ... overflow: hidden; }
    // In the injected CSS <style id="bahce-card-inject-css"> it was height: 340px; overflow: visible !important;

    fs.writeFileSync('bahce_edit.html', html);

    const dataCode = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    
    const newDataCode = dataCode.replace(routeRegex, (match, p1, p2, p3) => {
        return p1 + newBase64 + p3;
    });
    
    fs.writeFileSync('data.js', newDataCode);
    console.log("Fixed product card height constraint.");
} catch (e) {
    console.error(e);
}

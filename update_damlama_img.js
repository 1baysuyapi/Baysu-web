const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');
    const dataCode = fs.readFileSync('data.js', 'utf8');

    function updateProductImage(blocksArray, searchName, newImgSrc) {
        for (let i = 1; i < blocksArray.length; i++) {
            if (blocksArray[i].toLowerCase().includes(searchName.toLowerCase())) {
                blocksArray[i] = blocksArray[i].replace(/<img src="[^"]+"/i, `<img src="${newImgSrc}"`);
                break;
            }
        }
    }

    const blocks = html.split('<div class="product-card"');
    updateProductImage(blocks, "Damlama Filtresi", "resimler/bahce_ekipmanlari/Damlama_Filtresi.png");

    html = blocks.join('<div class="product-card"');
    fs.writeFileSync('bahce_edit.html', html);

    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    const newDataCode = dataCode.replace(routeRegex, `$1${newBase64}$3`);
    fs.writeFileSync('data.js', newDataCode);

    console.log("Image updated successfully.");
} catch (e) {
    console.error(e);
}

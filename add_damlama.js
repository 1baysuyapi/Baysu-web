const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');

    // Remove the old "Damlama Filtresi" entry
    let blocks = html.split('<div class="product-card"');
    
    // Find and remove old Damlama Filtresi
    let oldIndex = -1;
    for (let i = 1; i < blocks.length; i++) {
        if (blocks[i].match(/<h3[^>]*>Damlama Filtresi<\/h3>/i)) {
            oldIndex = i;
            break;
        }
    }
    
    if (oldIndex !== -1) {
        blocks.splice(oldIndex, 1);
    }

    // Add the 5 new Damlama Filtresi entries
    const filters = [
        { name: '3/4" Damlama Filtresi', code: '260', koli: '50', price: '350.00' },
        { name: '1" Damlama Filtresi', code: '261', koli: '50', price: '350.00' },
        { name: '1 1/4" Damlama Filtresi', code: '262', koli: '15', price: '500.00' },
        { name: '1 1/2" Damlama Filtresi', code: '263', koli: '15', price: '500.00' },
        { name: '2" Damlama Filtresi', code: '264', koli: '15', price: '500.00' }
    ];

    let newBlocksStr = '';
    filters.forEach(f => {
        newBlocksStr += `
 data-category="bahce" data-name="${f.name}" data-price="${f.price}" data-code="${f.code}" data-box="${f.koli}" data-paket="-">
    <div class="product-image">
        <img src="resimler/bahce_ekipmanlari/Damlama_Filtresi.png" alt="${f.name}">
        <span class="badge">${f.code}</span>
    </div>
    <div class="product-info">
        <h3>${f.name}</h3>
        <div class="info-row"><span>Koli Adedi:</span> <strong>${f.koli}</strong></div>
        <div class="info-row"><span>Ambalaj:</span> <strong>-</strong></div>
        <div class="price-display">₺ ${f.price}</div>
    </div>
</div><div class="product-card"`;
    });

    // Remove the trailing `<div class="product-card"` from newBlocksStr
    newBlocksStr = newBlocksStr.substring(0, newBlocksStr.length - 26);

    // Rejoin the blocks
    html = blocks.join('<div class="product-card"');
    
    // Insert new blocks at the end (before closing container)
    html = html.replace('</div>\n    </div>\n</section>', `<div class="product-card"${newBlocksStr}</div>\n    </div>\n</section>`);

    fs.writeFileSync('bahce_edit.html', html);
    console.log("Added 5 Damlama Filtresi products.");
} catch (e) {
    console.error(e);
}

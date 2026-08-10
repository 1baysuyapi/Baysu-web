const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');

    // 1. Fix the CSS overlapping issue
    html = html.replace(/height:\s*340px;/g, 'min-height: 340px; height: auto;');

    // 2. Remove the old "Damlama Filtresi" entry
    let blocks = html.split('<div class="product-card"');
    
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

    // 3. Add the 5 new Damlama Filtresi entries
    const filters = [
        { name: '3/4" Damlama Filtresi', code: '260', koli: '50', price: '350.00' },
        { name: '1" Damlama Filtresi', code: '261', koli: '50', price: '350.00' },
        { name: '1 1/4" Damlama Filtresi', code: '262', koli: '15', price: '500.00' },
        { name: '1 1/2" Damlama Filtresi', code: '263', koli: '15', price: '500.00' },
        { name: '2" Damlama Filtresi', code: '264', koli: '15', price: '500.00' }
    ];

    let newBlocksStr = '';
    filters.forEach(f => {
        newBlocksStr += ` data-category="bahce" data-name="${f.name.replace(/"/g, '&quot;')}">
              <span class="badge">${f.code}</span>
              <img src="resimler/bahce_ekipmanlari/Damlama_Filtresi.png" alt="${f.name.replace(/"/g, '&quot;')}" onerror="this.src='resimler/placeholder.png'">
              <h3>${f.name}</h3>
              
              <div class="card-hover-details">
                  <div class="price-display">₺ ${f.price}</div>
                  <div class="info-row"><span>Koli Adedi:</span> <strong>${f.koli}</strong></div>
                  <div class="info-row"><span>Ambalaj:</span> <strong>-</strong></div>
                  
                  <div class="card-actions">
                      <div class="qty-selector">
                          <button type="button" class="qty-btn qty-minus">-</button>
                          <input type="number" class="qty-input" value="1" min="1" step="1">
                          <button type="button" class="qty-btn qty-plus">+</button>
                      </div>
                      <button type="button" class="add-to-cart-btn" 
                          data-product="${f.name.replace(/"/g, '&quot;')}" 
                          data-price="${f.price}" 
                          data-code="${f.code}" 
                          data-box="${f.koli}" 
                          data-paket="-">
                          <i class="fas fa-shopping-cart"></i> Ekle
                      </button>
                  </div>
              </div>
          </div><div class="product-card"`;
    });

    // Remove the trailing `<div class="product-card"` from newBlocksStr
    newBlocksStr = newBlocksStr.substring(0, newBlocksStr.length - 26);

    // Rejoin the blocks
    html = blocks.join('<div class="product-card"');
    
    // Insert new blocks at the end (before closing container)
    // Wait, the last block will end with </div> </div> </section> or something similar.
    // So let's insert it right before the last closing of the grid container.
    // The grid container ends right before </section>. Let's inject into the last </div>
    const insertPoint = html.lastIndexOf('</div>\n    </div>\n</section>');
    if (insertPoint !== -1) {
        html = html.substring(0, insertPoint) + '\n<div class="product-card"' + newBlocksStr + html.substring(insertPoint);
    } else {
        // Fallback
        html = html.replace('</div>\n    </div>\n</section>', `<div class="product-card"${newBlocksStr}</div>\n    </div>\n</section>`);
    }

    fs.writeFileSync('bahce_edit.html', html);

    const dataCode = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    const newDataCode = dataCode.replace(routeRegex, (match, p1, p2, p3) => p1 + newBase64 + p3);
    fs.writeFileSync('data.js', newDataCode);

    console.log("Reverted sorting, fixed overlapping CSS, added Damlama products.");
} catch (e) {
    console.error(e);
}

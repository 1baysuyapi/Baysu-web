const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');

    const splitStr = '<div class="product-card"';
    let parts = html.split(splitStr);
    
    let header = parts[0];
    let footer = "";

    let lastPart = parts[parts.length - 1];
    
    let footerIndex = lastPart.lastIndexOf('</div>\n    </div>\n</section>');
    if(footerIndex !== -1) {
        footer = lastPart.substring(footerIndex);
        parts[parts.length - 1] = lastPart.substring(0, footerIndex);
    } else {
        footerIndex = lastPart.lastIndexOf('</section>');
        let containerEnd = lastPart.lastIndexOf('</div>', footerIndex - 1);
        let gridEnd = lastPart.lastIndexOf('</div>', containerEnd - 1);
        footer = lastPart.substring(gridEnd);
        parts[parts.length - 1] = lastPart.substring(0, gridEnd);
    }

    let cards = [];
    for (let i = 1; i < parts.length; i++) {
        const blockContent = parts[i];
        const nameMatch = blockContent.match(/<h3[^>]*>([^<]+)<\/h3>/i);
        let name = nameMatch ? nameMatch[1].trim() : "Unknown";
        let codeMatch = blockContent.match(/<span class="badge">([^<]+)<\/span>/i);
        let code = codeMatch ? codeMatch[1].trim() : "";
        
        cards.push({
            name: name,
            code: code,
            html: splitStr + blockContent
        });
    }

    // Products to fix and their correct data
    const fixes = [
        { origNameMatches: ['thal 6 Nozul Metal Tabanca', 'İthal 6 Nozul Metal Tabanca'], code: '194', name: 'İthal 6 Nozul Metal Tabanca', koli: '24', price: '1200.00', img: 'thal_6_Nozul_Metal_Tabanca.png' },
        { origNameMatches: ['Metal Su Tabancas'], code: '199', name: 'Metal Su Tabancası', koli: '48', price: '750.00', img: 'Metal_Su_Tabancas.png' },
        { origNameMatches: ['Tetikli Su Tabancas Jakl'], code: '172', name: 'Tetikli Su Tabancası Jaklı', koli: '40', price: '190.00', img: 'Tetikli_Su_Tabancas_Jakl.png' },
        { origNameMatches: ['Tetikli Szek Tabancas Jakl', 'Tetikli Süzek Tabancası Jaklı'], code: '173', name: 'Tetikli Süzek Tabancası Jaklı', koli: '30', price: '190.00', img: 'Tetikli_Szek_Tabancas_Jakl.png' },
        { origNameMatches: ['Tetikli Su Tabancas 3/4'], code: '348', name: 'Tetikli Su Tabancası 3/4" Lüks Rekorlu', koli: '75', price: '210.00', img: 'Tetikli_Su_Tabancas_3-4_Lks_Rekorlu.png' },
        { origNameMatches: ['Tetikli Szek Tabanca 3/4'], code: '349', name: 'Tetikli Süzek Tabanca 3/4" Lüks Rekorlu', koli: '60', price: '210.00', img: 'Tetikli_Szek_Tabanca_3-4_Lks_Rekorlu.png' },
        { origNameMatches: ['Szek Tabanca'], exactMatch: true, code: '355', name: 'Süzek Tabanca', koli: '75', price: '105.00', img: 'Szek_Tabanca.png' },
        { origNameMatches: ['1/2" Lks Rekorlu Szek Tabanca', '1/2" Lüks Rekorlu Süzek Tabanca'], code: '356', name: '1/2" Lüks Rekorlu Süzek Tabanca', koli: '75', price: '115.00', img: '1-2_Lks_Rekorlu_Szek_Tabanca.png' }
    ];

    const generateHtml = (f) => `
          <div class="product-card" data-category="bahce" data-name="${f.name.replace(/"/g, '&quot;')}">
              <span class="badge">${f.code}</span>
              <img src="resimler/bahce_ekipmanlari/${f.img}" alt="${f.name.replace(/"/g, '&quot;')}" onerror="this.src='resimler/placeholder.png'">
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
                          <i class="fas fa-shopping-cart"></i> Sepete Ekle
                      </button>
                  </div>
              </div>
          </div>`;

    const normalizeString = (str) => {
        if (!str) return "";
        return str.toLowerCase().replace(/['"”’\-\s\/]/g, '').trim();
    };

    let extractedCards = [];
    let pool = [...cards];

    for (let f of fixes) {
        let foundIndex = pool.findIndex(c => {
            let nName = normalizeString(c.name);
            if (f.code === c.code) return true;
            for(let matchName of f.origNameMatches) {
                if(f.exactMatch) {
                   if(nName === normalizeString(matchName)) return true;
                } else {
                   if (nName.includes(normalizeString(matchName))) return true;
                }
            }
            return false;
        });

        if (foundIndex !== -1) {
            let card = pool.splice(foundIndex, 1)[0];
            card.html = generateHtml(f); // Update with correct HTML
            card.code = f.code;
            extractedCards.push(card);
        } else {
            console.log("Could not find product for:", f.name);
            // If it doesn't exist, we just create it!
            extractedCards.push({
                name: f.name,
                code: f.code,
                html: generateHtml(f)
            });
        }
    }

    // Now, where should this sequence of 8 cards go?
    // The user said: "bu üründen sonra 2. görseldekilerin gelmesi gerekiyordu sonra sonra 3. eklediğim resimdeklier gelmesi gerekiyordu"
    // So this 8-card sequence should probably just be placed right after "Krom 6 Nozul Tabanca" where they originally were!
    // Let's find "Krom 6 Nozul Tabanca" (or just put them at the top, or keep them where they were).
    // Let's find "Krom 6 Nozul Tabanca" in the pool to anchor it.
    let finalCards = [];
    let foundAnchor = false;
    for (let c of pool) {
        finalCards.push(c);
        let nName = normalizeString(c.name);
        if (nName.includes('krom6nozultabanca') && !foundAnchor) {
            foundAnchor = true;
            // Append the 8 fixed cards here
            finalCards.push(...extractedCards);
        }
    }

    if (!foundAnchor) {
        // Fallback, just put them before the new Vantuz items
        // Let's find 3/4" Vantuz
        let fallbackCards = [];
        let inserted = false;
        for (let c of pool) {
            let nName = normalizeString(c.name);
            if (nName.includes('34vantuz') && !inserted) {
                fallbackCards.push(...extractedCards);
                inserted = true;
            }
            fallbackCards.push(c);
        }
        if(!inserted) fallbackCards.push(...extractedCards);
        finalCards = fallbackCards;
    }

    let newHtml = header + finalCards.map(c => c.html).join('') + footer;
    fs.writeFileSync('bahce_edit.html', newHtml);

    const dataCode = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(newHtml, 'utf8').toString('base64');
    const newDataCode = dataCode.replace(routeRegex, (match, p1, p2, p3) => p1 + newBase64 + p3);
    fs.writeFileSync('data.js', newDataCode);

    console.log("Fixed corrupted product data and sequence.");
} catch (e) {
    console.error(e);
}

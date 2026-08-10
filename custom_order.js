const fs = require('fs');

try {
    let html = fs.readFileSync('bahce_edit.html', 'utf8');

    // Remove the old "Damlama Filtresi" and old "El Süzeği" if they exist, to start clean
    // Actually, I'll extract all cards first.
    let cards = [];
    let currentHtml = html;
    
    const splitStr = '<div class="product-card"';
    let parts = currentHtml.split(splitStr);
    
    let header = parts[0];
    let footer = "";

    let lastPart = parts[parts.length - 1];
    
    let footerIndex = lastPart.lastIndexOf('</div>\n    </div>\n</section>');
    if(footerIndex !== -1) {
        footer = lastPart.substring(footerIndex);
        parts[parts.length - 1] = lastPart.substring(0, footerIndex);
    } else {
        footerIndex = lastPart.lastIndexOf('</section>');
        if(footerIndex !== -1) {
            let containerEnd = lastPart.lastIndexOf('</div>', footerIndex - 1);
            let gridEnd = lastPart.lastIndexOf('</div>', containerEnd - 1);
            footer = lastPart.substring(gridEnd);
            parts[parts.length - 1] = lastPart.substring(0, gridEnd);
        }
    }

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

    // Deduplicate cards based on name to avoid issues
    let uniqueCards = [];
    let seenNames = new Set();
    // Exclude the old generic "Damlama Filtresi" which we replaced
    const excludeNames = ["Damlama Filtresi", "El Süzeği"]; // We will add El Süzeği manually
    
    for (let c of cards) {
        let cleanName = c.name.replace(/['"”’\-\s\/]/g, '').toLowerCase();
        if (cleanName === 'damlamafiltresi' || cleanName === 'elszeyi' || cleanName === 'elsüzeği' || cleanName === 'elsuzeği') continue;
        
        if (!seenNames.has(cleanName)) {
            seenNames.add(cleanName);
            uniqueCards.push(c);
        }
    }

    // Add Damlama Filtreleri
    const damlamaFilters = [
        { name: '3/4" Damlama Filtresi', code: '260', koli: '50', price: '350.00' },
        { name: '1" Damlama Filtresi', code: '261', koli: '50', price: '350.00' },
        { name: '1 1/4" Damlama Filtresi', code: '262', koli: '15', price: '500.00' },
        { name: '1 1/2" Damlama Filtresi', code: '263', koli: '15', price: '500.00' },
        { name: '2" Damlama Filtresi', code: '264', koli: '15', price: '500.00' }
    ];

    damlamaFilters.forEach(f => {
        let htmlStr = `<div class="product-card" data-category="bahce" data-name="${f.name.replace(/"/g, '&quot;')}">
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
          </div>`;
          uniqueCards.push({ name: f.name, code: f.code, html: htmlStr });
    });

    // We create the new El Süzeği
    const elSuzegiHtml = `<div class="product-card" data-category="bahce" data-name="El Süzeği">
              <span class="badge">130</span>
              <img src="resimler/bahce_ekipmanlari/El_Süzegi.png" alt="El Süzeği" onerror="this.src='resimler/placeholder.png'">
              <h3>El Süzeği</h3>
              
              <div class="card-hover-details">
                  <div class="price-display">₺ 68.00</div>
                  <div class="info-row"><span>Koli Adedi:</span> <strong>156</strong></div>
                  <div class="info-row"><span>Ambalaj:</span> <strong>12</strong></div>
                  
                  <div class="card-actions">
                      <div class="qty-selector">
                          <button type="button" class="qty-btn qty-minus">-</button>
                          <input type="number" class="qty-input" value="1" min="1" step="1">
                          <button type="button" class="qty-btn qty-plus">+</button>
                      </div>
                      <button type="button" class="add-to-cart-btn" 
                          data-product="El Süzeği" 
                          data-price="68.00" 
                          data-code="130" 
                          data-box="156" 
                          data-paket="12">
                          <i class="fas fa-shopping-cart"></i> Ekle
                      </button>
                  </div>
              </div>
          </div>`;

    let finalOrderedCards = [];
    
    // We want the original order up to Tetikli Süzek Tabancası Jaklı
    // But inserting El Süzeği after Jumbo El Süzeği
    
    let imageSequence = [
        // Image 1
        "Tetikli Su Tabancası 3/4\" Lüks Rekorlu",
        "Tetikli Süzek Tabanca 3/4\" Lüks Rekorlu",
        "Süzek Tabanca",
        "1/2\" Lüks Rekorlu Süzek Tabanca",
        // Image 2
        "Lüks Rekorlu 6 Nozul Tabanca",
        "6 Fonksiyonlu Su Tabancası Seti",
        "İthal Tetikli Su Tabancası",
        "İthal 6 Nozul Tabanca",
        "Tetikli Su Tabancası Rekorlu",
        "Tetikli Süzek Tabancası Rekorlu",
        "Tetikli Su Tabancası 1/2\" Lüks Rekorlu",
        "Tetikli Süzek Tabancası 1/2\" Lüks Rekorlu",
        // Image 3
        "3/4\" Lüks Rekorlu Süzek Tabanca",
        "Su Tabancası",
        "1/2\" Lüks Rekorlu Su Tabancası",
        "3/4\" Lüks Rekorlu Su Tabancası",
        // Image 4
        "Açılı Fıskiye / Elgo Modeli",
        "Açılı Fıskiye / Yerli Turuncu",
        "Açılı Fıskiye / Yerli Siyah",
        "İthal Açılı Metal Fıskiye",
        "Plastik Tarla Sulama Fıskiye",
        "Metal Tarla Sulama Fıskiye",
        "Kazıklı Açılı Fıskiye",
        "Açısız Çat Çat Fıskiye",
        "Açılı Plastik Tarla Sulama Fıskiye",
        "Hortum Tanburu",
        "Hortum Arabası / Cabbar",
        "Duvar Tipi Hortum Askısı",
        // Image 5
        "1/2\" Lüks Rekor",
        "3/4\" - 1/2\" Lüks Rekor",
        "PVC Bidon Musluğu",
        "Süzek Kafası",
        "Çift Taraflı Jak Adaptör",
        "3/4\" Jak Adaptörü",
        "1/2\" - 3/4\" - 1\" 2'li Jak Dağıtıcı",
        "1/2\" - 3/4\" - 1\" 4'lü Jak Dağıtıcı",
        "Metal Hortum Askısı",
        "Plastik Hortum Askısı",
        "Ayarlı Lans Seti",
        "Fide Kazığı Plastik"
    ];

    const normalizeString = (str) => {
        if (!str) return "";
        return str.toLowerCase().replace(/['"”’\-\s\/]/g, '').trim();
    };
    
    let sequenceCards = [];
    let remainingCards = [];
    
    // Extract sequence cards
    for (let c of uniqueCards) {
        let nName = normalizeString(c.name);
        let foundIndex = -1;
        for (let i = 0; i < imageSequence.length; i++) {
            let sName = normalizeString(imageSequence[i]);
            if (nName === sName || nName.includes(sName) || sName.includes(nName)) {
                foundIndex = i;
                break;
            }
        }
        
        if (foundIndex !== -1) {
            c.seqIndex = foundIndex;
            sequenceCards.push(c);
        } else {
            remainingCards.push(c);
        }
    }
    
    // Sort sequence cards explicitly by the imageSequence array
    sequenceCards.sort((a, b) => a.seqIndex - b.seqIndex);

    // Now, build final list.
    // Top part from remainingCards until "Tetikli Süzek Tabancası Jaklı"
    let topCards = [];
    let bottomCards = [];
    let foundAnchor = false;
    
    for (let i = 0; i < remainingCards.length; i++) {
        let c = remainingCards[i];
        let nName = normalizeString(c.name);
        
        if (!foundAnchor) {
            topCards.push(c);
            // Insert El Süzeği after Jumbo El Süzeği
            if (nName.includes('jumboelsze') || nName.includes('jumboelsüze')) {
                topCards.push({ name: 'El Süzeği', html: elSuzegiHtml });
            }
            if (nName.includes('tetikliszektabancasjakl') || nName.includes('tetiklisüzektabancasıjakl')) {
                foundAnchor = true;
            }
        } else {
            bottomCards.push(c);
        }
    }

    finalOrderedCards = [...topCards, ...sequenceCards, ...bottomCards];

    let newHtml = header + finalOrderedCards.map(c => c.html).join('') + footer;
    fs.writeFileSync('bahce_edit.html', newHtml);

    const dataCode = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(newHtml, 'utf8').toString('base64');
    const newDataCode = dataCode.replace(routeRegex, (match, p1, p2, p3) => p1 + newBase64 + p3);
    fs.writeFileSync('data.js', newDataCode);

    console.log("Restructured ordering perfectly according to instructions.");
} catch (e) {
    console.error(e);
}

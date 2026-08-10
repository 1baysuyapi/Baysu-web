const fs = require('fs');

const data = {
    'ayarli-hortum-eki.html': [
        { kod: '156', ebat: '1/2" Ayarlı Hortum Eki', koli: '400', ambalaj: '25', fiyat: '40.00' },
        { kod: '157', ebat: '3/4" Ayarlı Hortum Eki', koli: '250', ambalaj: '25', fiyat: '85.00' },
        { kod: '158', ebat: '1" Ayarlı Hortum Eki', koli: '150', ambalaj: '10', fiyat: '135.00' }
    ],
    'ayarli-hortum-te.html': [
        { kod: '159', ebat: '1/2" Ayarlı Hortum TE', koli: '150', ambalaj: '25', fiyat: '95.00' },
        { kod: '160', ebat: 'Ayarlı Hortum TE', koli: '120', ambalaj: '15', fiyat: '120.00' },
        { kod: '161', ebat: '3/4" Ayarlı Hortum TE', koli: '120', ambalaj: '15', fiyat: '120.00' }
    ],
    'hortum-eki.html': [
        { kod: '113', ebat: '1/2" Hortum Eki', koli: '1600', ambalaj: '100', fiyat: '4.80' },
        { kod: '114', ebat: '5/8" Hortum Eki', koli: '1200', ambalaj: '100', fiyat: '7.50' },
        { kod: '115', ebat: '3/4" Hortum Eki', koli: '750', ambalaj: '50', fiyat: '11.00' },
        { kod: '116', ebat: '1" Hortum Eki', koli: '440', ambalaj: '40', fiyat: '16.50' },
        { kod: '117', ebat: '1•1/4" Hortum Eki', koli: '270', ambalaj: '15', fiyat: '25.50' },
        { kod: '118', ebat: '1•1/2" Hortum Eki', koli: '168', ambalaj: '12', fiyat: '37.00' },
        { kod: '119', ebat: '2" Hortum Eki', koli: '90', ambalaj: '10', fiyat: '48.00' },
        { kod: '120', ebat: '2•1/2" Hortum Eki', koli: '60', ambalaj: '5', fiyat: '110.00' }
    ],
    'hortum-reduksiyonu.html': [
        { kod: '165', ebat: 'Hortum Rediksiyonu', koli: '1250', ambalaj: '25', fiyat: '10.00' },
        { kod: '166', ebat: 'Hortum Rediksiyonu', koli: '1250', ambalaj: '25', fiyat: '16.00' },
        { kod: '167', ebat: 'Hortum Rediksiyonu', koli: '650', ambalaj: '25', fiyat: '22.00' },
        { kod: '168', ebat: 'Hortum Rediksiyonu', koli: '700', ambalaj: '25', fiyat: '22.00' },
        { kod: '169', ebat: 'Hortum Rediksiyonu', koli: '400', ambalaj: '25', fiyat: '25.00' },
        { kod: '170', ebat: 'Hortum Rediksiyonu', koli: '210', ambalaj: '15', fiyat: '66.00' },
        { kod: '171', ebat: 'Hortum Rediksiyonu', koli: '210', ambalaj: '15', fiyat: '85.00' },
        { kod: '347', ebat: 'Hortum Rediksiyonu', koli: '350', ambalaj: '25', fiyat: '50.00' }
    ],
    'hortum-te.html': [
        { kod: '104', ebat: '1/2" • 5/8" Hortum TE', koli: '600', ambalaj: '50', fiyat: '19.00' },
        { kod: '105', ebat: '3/4" Hortum TE', koli: '250', ambalaj: '25', fiyat: '38.00' },
        { kod: '106', ebat: '1" Hortum TE', koli: '300', ambalaj: '25', fiyat: '38.00' },
        { kod: '107', ebat: '1•1/4" Hortum TE', koli: '120', ambalaj: '10', fiyat: '60.00' },
        { kod: '108', ebat: '1•1/2" Hortum TE', koli: '100', ambalaj: '10', fiyat: '82.00' },
        { kod: '109', ebat: '2" Hortum TE', koli: '50', ambalaj: '5', fiyat: '125.00' },
        { kod: '110', ebat: '1" • 1/2" • 1" Hortum TE', koli: '350', ambalaj: '25', fiyat: '38.00' },
        { kod: '345', ebat: '1/2" Hortum Rekoru', koli: '-', ambalaj: '50', fiyat: '16.00' }
    ]
};

for (const file in data) {
    let html = fs.readFileSync(file, 'utf8');
    const items = data[file];
    
    let rowsHtml = '';
    items.forEach(item => {
        let nameParam = encodeURIComponent(item.ebat);
        rowsHtml += `
                        <tr>
                            <td><strong>${item.kod}</strong></td>
                            <td><span class="ebat-pill">${item.ebat}</span></td>
                            <td>${item.ambalaj}</td>
                            <td>${item.koli}</td>
                            <td class="price-val">${item.fiyat} ₺</td>
                            <td>
                                <div class="qty-controls">
                                    <button class="qty-btn" onclick="let inp=this.nextElementSibling; let v=parseInt(inp.value)||0; if(v>1)inp.value=v-1;">-</button>
                                    <input type="text" class="qty-input" value="1">
                                    <button class="qty-btn" onclick="let inp=this.previousElementSibling; let v=parseInt(inp.value)||0; inp.value=v+1;">+</button>
                                </div>
                            </td>
                            <td>
                                <a href="https://wa.me/905533973603?text=Merhaba,%20Baysu%20Yap%C4%B1%20web%20sitenizden%20${item.kod}%20kodlu%20${nameParam}%20%C3%BCr%C3%BCn%C3%BCnden%20sipari%C5%9F%20vermek%20istiyorum." 
                                   target="_blank" class="add-btn">
                                    Siparişe Ekle
                                </a>
                            </td>
                        </tr>`;
    });
    
    html = html.replace(/<tr>\s*<td colspan="7"[^>]*>Fiyat ve ölçü bilgileri yakında eklenecektir\.\.\.<\/td>\s*<\/tr>/, rowsHtml);
    fs.writeFileSync(file, html);
    console.log('Filled data for ' + file);
}

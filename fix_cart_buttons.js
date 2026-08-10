const fs = require('fs');

const files = [
    'ayarli-hortum-eki.html',
    'ayarli-hortum-te.html',
    'hortum-eki.html',
    'hortum-reduksiyonu.html',
    'hortum-te.html'
];

const replacement = `<button class="add-btn" type="button" onclick="
    var row = this.closest('tr');
    var code = row.cells[0].innerText.trim();
    var ebat = row.cells[1].innerText.trim();
    var priceStr = row.cells[4].innerText.trim().replace('₺', '').replace(',', '.').trim();
    var price = parseFloat(priceStr);
    var q = parseInt(row.querySelector('.qty-input').value) || 1;
    var name = document.querySelector('.product-title').innerText.trim() + ' (' + ebat + ') - Kod: ' + code;
    if(window.addToCart){
        for(var i=0;i<q;i++) window.addToCart(name, price, code, '-');
        alert(q + ' adet sepete eklendi!');
    } else {
        alert('Sepet sistemi hazır değil');
    }
">
    <i class="fas fa-shopping-cart" style="margin-right: 5px;"></i> Sepete Ekle
</button>`;

for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace all matching whatsapp add-btn links inside the table
    // Regex matches the a tag block specifically in the table cell
    const regex = /<a href="https:\/\/wa\.me[^>]+>\s*Siparişe Ekle\s*<\/a>/g;
    html = html.replace(regex, replacement);
    
    fs.writeFileSync(file, html);
    console.log('Fixed ' + file);
}

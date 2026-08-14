const fs = require('fs');

let html = fs.readFileSync('kuresel-vana.html', 'utf8');

// Change Title
html = html.replace(/PP KÜRESEL VANA/g, 'KÜRESEL VANALAR (PVC & PP)');
html = html.replace(/PP Küresel Vana/g, 'Küresel Vana (PVC & PP)');
html = html.replace(/Küresel Vana \(PVC & PP\)\.png/g, 'pp-kuresel-vana.png'); // Fix image src back

const items = [
    { code: '285', ebat: '1/2"', name: 'PVC Küresel Vana', price: '70.00', koli: '250', ambalaj: '-' },
    { code: '286', ebat: '3/4"', name: 'PVC Küresel Vana', price: '98.00', koli: '150', ambalaj: '-' },
    { code: '407', ebat: '1"', name: 'PP Küresel Vana', price: '100.00', koli: '90', ambalaj: '-' },
    { code: '408', ebat: '1 1/4"', name: 'PP Küresel Vana', price: '135.00', koli: '60', ambalaj: '-' },
    { code: '409', ebat: '1 1/2"', name: 'PP Küresel Vana', price: '170.00', koli: '50', ambalaj: '-' },
    { code: '410', ebat: '2"', name: 'PP Küresel Vana', price: '240.00', koli: '30', ambalaj: '-' },
    { code: '411', ebat: '2 1/2"', name: 'PP Küresel Vana', price: '550.00', koli: '14', ambalaj: '-' },
    { code: '412', ebat: '3"', name: 'PP Küresel Vana', price: '740.00', koli: '8', ambalaj: '-' }
];

let newTbody = '<tbody>\n';
items.forEach(item => {
    newTbody += `
                        <tr>
                            <td><strong>${item.code}</strong></td>
                            <td><span class="ebat-pill">${item.ebat} <br><small style="font-size: 10px; color: #666;">${item.name.replace('Küresel Vana', '')}</small></span></td>
                            <td>${item.ambalaj}</td>
                            <td>${item.koli}</td>
                            <td class="price-val">${item.price} ₺</td>
                            <td>
                                <div class="qty-controls">
                                    <button class="qty-btn" onclick="let inp=this.nextElementSibling; let v=parseInt(inp.value)||0; if(v>1)inp.value=v-1;">-</button>
                                    <input type="text" class="qty-input" value="1">
                                    <button class="qty-btn" onclick="let inp=this.previousElementSibling; let v=parseInt(inp.value)||0; inp.value=v+1;">+</button>
                                </div>
                            </td>
                            <td>
                                <button class="add-btn" type="button" onclick="
    var row = this.closest('tr');
    var code = row.cells[0].innerText.trim();
    var ebat = row.cells[1].innerText.trim();
    var priceStr = row.cells[4].innerText.trim().replace('₺', '').replace(',', '.').trim();
    var price = parseFloat(priceStr);
    var q = parseInt(row.querySelector('.qty-input').value) || 1;
    var name = '${item.ebat} ${item.name}';
    if(window.addToCart){
        for(var i=0;i<q;i++) window.addToCart(name, price, code, '-');
        alert(q + ' adet sepete eklendi!');
    } else {
        alert('Sepet sistemi hazır değil');
    }
">
    <i class="fas fa-shopping-cart" style="margin-right: 5px;"></i> Sepete Ekle
</button>
                            </td>
                        </tr>
`;
});
newTbody += '                    </tbody>';

const tbodyRegex = /<tbody>[\s\S]*?<\/tbody>/;
if (tbodyRegex.test(html)) {
    html = html.replace(tbodyRegex, newTbody);
}

// Make sure image src is correct!
html = html.replace(/src="[^"]*pp-kuresel-vana.png"/g, 'src="pp-kuresel-vana.png"');
html = html.replace(/src="PP Küresel Vana.png"/g, 'src="pp-kuresel-vana.png"');


fs.writeFileSync('kuresel-vana.html', html);
console.log("kuresel-vana.html updated with table data!");

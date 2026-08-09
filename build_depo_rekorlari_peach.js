const fs = require('fs');

const htmlContent = `
<div class="category-header" style="display:flex; align-items:center; gap:15px; padding: 20px;">
    <button class="back-btn" onclick="window.history.back()" style="background:none; border:none; color:#1d374f; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:5px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Geri
    </button>
    <h2 style="color:#1d374f; margin:0;">Depo Rekorları</h2>
</div>

<style>
.grouped-products-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 20px;
    background: #fdfdfd;
}
.product-group-card {
    display: flex;
    flex-direction: row;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #708090;
}
.group-image-col {
    flex: 0 0 250px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #708090;
    background: #ffffff;
}
.group-image-col img {
    max-width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: contain;
    margin-bottom: 15px;
}
.group-image-col h3 {
    margin: 0;
    color: #1d374f;
    font-size: 1.1rem;
    text-align: center;
    font-weight: bold;
}
.group-table-col {
    flex: 1;
    overflow-x: auto;
}

/* THE PEACH TABLE */
.peach-table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    color: #1d374f;
    text-align: center;
    border: none;
}
.peach-table th, .peach-table td {
    padding: 12px 10px;
    border: 1px solid #708090;
    vertical-align: middle;
}
.peach-table th {
    background-color: #e5aa94;
    font-weight: bold;
    font-size: 15px;
}
/* Striped rows */
.peach-table tbody tr:nth-child(odd) {
    background-color: #ffffff;
}
.peach-table tbody tr:nth-child(even) {
    background-color: #e5aa94;
}

.fiyat-text {
    font-weight: bold;
}

/* STEPPER */
.qty-stepper {
    display: inline-flex;
    align-items: center;
    border: 1px solid #708090;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    height: 30px;
}
.stepper-btn {
    background: #f8f9fa;
    color: #1d374f;
    border: none;
    width: 30px;
    height: 100%;
    cursor: pointer;
    font-weight: bold;
}
.stepper-btn.minus { border-right: 1px solid #708090; }
.stepper-btn.plus { border-left: 1px solid #708090; }
.qty-stepper input {
    width: 40px;
    height: 100%;
    border: none;
    text-align: center;
    font-weight: bold;
    color: #1d374f;
    background: transparent;
    -moz-appearance: textfield;
}
.qty-stepper input::-webkit-outer-spin-button,
.qty-stepper input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* CART BTN */
.cart-btn {
    background-color: #1d374f;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-weight: bold;
    font-size: 13px;
    cursor: pointer;
    transition: 0.2s;
    white-space: nowrap;
}
.cart-btn:hover {
    background-color: #102130;
}

@media (max-width: 768px) {
    .product-group-card {
        flex-direction: column;
    }
    .group-image-col {
        border-right: none;
        border-bottom: 1px solid #708090;
    }
}
</style>

<div class="grouped-products-container">

    <!-- GROUP 1 -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/cift_tarafli_depo_rekoru.png" alt="Çift Taraflı Depo Rekoru">
            <h3>Çift Taraflı Depo Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table class="peach-table">
                <thead>
                    <tr><th>Kod</th><th>Ebat (mm)</th><th>Ambalaj</th><th>Fiyat</th><th>Miktar</th><th>İşlem</th></tr>
                </thead>
                <tbody id="group1-body"></tbody>
            </table>
        </div>
    </div>

    <!-- GROUP 2 -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/depo_rekoru_ters_dis.png" alt="Depo Rekoru (Ters Diş)">
            <h3>Depo Rekoru (Ters Diş)</h3>
        </div>
        <div class="group-table-col">
            <table class="peach-table">
                <thead>
                    <tr><th>Kod</th><th>Ebat (mm)</th><th>Ambalaj</th><th>Fiyat</th><th>Miktar</th><th>İşlem</th></tr>
                </thead>
                <tbody id="group2-body"></tbody>
            </table>
        </div>
    </div>

    <!-- GROUP 3 -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/sintine_rekoru_ters_dis.png" alt="Sintine Rekoru (Ters Diş)">
            <h3>Sintine Rekoru (Ters Diş)</h3>
        </div>
        <div class="group-table-col">
            <table class="peach-table">
                <thead>
                    <tr><th>Kod</th><th>Ebat (mm)</th><th>Ambalaj</th><th>Fiyat</th><th>Miktar</th><th>İşlem</th></tr>
                </thead>
                <tbody id="group3-body"></tbody>
            </table>
        </div>
    </div>

    <!-- GROUP 4 -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/pvc_hortum_rekoru.png" alt="PVC Hortum Rekoru">
            <h3>PVC Hortum Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table class="peach-table">
                <thead>
                    <tr><th>Kod</th><th>Ebat (mm)</th><th>Ambalaj</th><th>Fiyat</th><th>Miktar</th><th>İşlem</th></tr>
                </thead>
                <tbody id="group4-body"></tbody>
            </table>
        </div>
    </div>

    <!-- GROUP 5 -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/galvanizli_hortum_rekoru.png" alt="Galvanizli Hortum Rekoru">
            <h3>Galvanizli Hortum Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table class="peach-table">
                <thead>
                    <tr><th>Kod</th><th>Ebat (mm)</th><th>Ambalaj</th><th>Fiyat</th><th>Miktar</th><th>İşlem</th></tr>
                </thead>
                <tbody id="group5-body"></tbody>
            </table>
        </div>
    </div>

    <!-- GROUP 6 -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/ozel_depo_rekoru.png" alt="Özel Depo Rekoru">
            <h3>Özel Depo Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table class="peach-table">
                <thead>
                    <tr><th>Kod</th><th>Ebat (mm)</th><th>Ambalaj</th><th>Fiyat</th><th>Miktar</th><th>İşlem</th></tr>
                </thead>
                <tbody id="group6-body"></tbody>
            </table>
        </div>
    </div>

</div>

<script>
const grp1 = [
    {kod:'326', ebat:'1/2"', fiyat:'65.00', koli:'-'},
    {kod:'327', ebat:'3/4"', fiyat:'72.00', koli:'-'},
    {kod:'328', ebat:'1"', fiyat:'78.00', koli:'-'}
];
const grp2 = [
    {kod:'275', ebat:'1/2"', fiyat:'83.00', koli:'400'},
    {kod:'276', ebat:'3/4"', fiyat:'83.00', koli:'400'},
    {kod:'277', ebat:'1"', fiyat:'90.00', koli:'250'},
    {kod:'278', ebat:'1 1/4"', fiyat:'135.00', koli:'125'},
    {kod:'279', ebat:'1 1/2"', fiyat:'150.00', koli:'125'},
    {kod:'280', ebat:'2"', fiyat:'185.00', koli:'75'},
    {kod:'281', ebat:'3"', fiyat:'420.00', koli:'25'},
    {kod:'282', ebat:'4"', fiyat:'540.00', koli:'18'}
];
const grp3 = [
    {kod:'236', ebat:'3/4"', fiyat:'80.00', koli:'350'},
    {kod:'237', ebat:'1"', fiyat:'80.00', koli:'200'},
    {kod:'238', ebat:'1 1/4"', fiyat:'115.00', koli:'125'},
    {kod:'239', ebat:'1 1/2"', fiyat:'130.00', koli:'125'}
];
const grp4 = [
    {kod:'241', ebat:'1/2"', fiyat:'13.00', koli:'1250'},
    {kod:'242', ebat:'3/4"', fiyat:'14.00', koli:'1000'},
    {kod:'243', ebat:'1"', fiyat:'27.50', koli:'500'},
    {kod:'244', ebat:'1 1/4"', fiyat:'32.00', koli:'300'},
    {kod:'245', ebat:'1 1/2"', fiyat:'40.00', koli:'200'},
    {kod:'246', ebat:'2"', fiyat:'67.00', koli:'120'},
    {kod:'247', ebat:'2 1/2"', fiyat:'90.00', koli:'75'},
    {kod:'248', ebat:'3"', fiyat:'145.00', koli:'40'},
    {kod:'249', ebat:'4"', fiyat:'200.00', koli:'25'}
];
const grp5 = [
    {kod:'251', ebat:'1/2"', fiyat:'70.00', koli:'500'},
    {kod:'252', ebat:'3/4"', fiyat:'80.00', koli:'300'},
    {kod:'253', ebat:'1"', fiyat:'95.00', koli:'200'},
    {kod:'254', ebat:'1 1/4"', fiyat:'110.00', koli:'100'},
    {kod:'255', ebat:'1 1/2"', fiyat:'130.00', koli:'100'},
    {kod:'256', ebat:'2"', fiyat:'175.00', koli:'60'},
    {kod:'257', ebat:'2 1/2"', fiyat:'215.00', koli:'30'},
    {kod:'258', ebat:'3"', fiyat:'320.00', koli:'24'},
    {kod:'259', ebat:'4"', fiyat:'530.00', koli:'30'}
];
const grp6 = [
    {kod:'318', ebat:'1/2"', fiyat:'65.00', koli:'200'},
    {kod:'319', ebat:'3/4"', fiyat:'65.00', koli:'200'},
    {kod:'320', ebat:'1"', fiyat:'65.00', koli:'200'},
    {kod:'321', ebat:'1 1/4"', fiyat:'65.00', koli:'180'},
    {kod:'322', ebat:'1 1/2"', fiyat:'65.00', koli:'160'},
    {kod:'323', ebat:'2"', fiyat:'65.00', koli:'150'},
    {kod:'324', ebat:'2 1/2" (l)', fiyat:'220.00', koli:'-'},
    {kod:'325', ebat:'3" (l)', fiyat:'235.00', koli:'-'}
];

function renderTable(groupArr, tbodyId, namePrefix) {
    const tbody = document.getElementById(tbodyId);
    if(!tbody) return;
    
    let html = '';
    groupArr.forEach(item => {
        let fmtFiyat = item.fiyat.replace('.', ',') + ' TL';
        html += \`<tr>
            <td>\${item.kod}</td>
            <td>\${item.ebat}</td>
            <td>\${item.koli}</td>
            <td class="fiyat-text">\${fmtFiyat}</td>
            <td>
                <div class="qty-stepper" onclick="event.stopPropagation()">
                    <button type="button" class="stepper-btn minus" onclick="stepQty('qty-\${item.kod}', -1)">-</button>
                    <input type="number" id="qty-\${item.kod}" value="1" min="1">
                    <button type="button" class="stepper-btn plus" onclick="stepQty('qty-\${item.kod}', 1)">+</button>
                </div>
            </td>
            <td>
                <button class="cart-btn" type="button" onclick="addToCartMulti('\${namePrefix} \${item.ebat.replace(/"/g, '&quot;')}', \${item.fiyat}, '\${item.kod}', '\${item.koli}', 'qty-\${item.kod}')">
                    Sepete Ekle
                </button>
            </td>
        </tr>\`;
    });
    tbody.innerHTML = html;
}

setTimeout(() => {
    renderTable(grp1, 'group1-body', 'Çift Taraflı Depo Rekoru');
    renderTable(grp2, 'group2-body', 'Depo Rekoru Ters Diş');
    renderTable(grp3, 'group3-body', 'Sintine Rekoru Ters Diş');
    renderTable(grp4, 'group4-body', 'PVC Hortum Rekoru');
    renderTable(grp5, 'group5-body', 'Galvanizli Hortum Rekoru');
    renderTable(grp6, 'group6-body', 'Özel Depo Rekoru');
}, 0);

window.stepQty = function(inputId, step) {
    const inp = document.getElementById(inputId);
    if(inp) {
        let val = parseInt(inp.value, 10) || 1;
        val += step;
        if(val < 1) val = 1;
        inp.value = val;
    }
};

window.addToCartMulti = function(name, price, code, box, inputId) {
    const qtyInput = document.getElementById(inputId);
    let qty = 1;
    if (qtyInput && qtyInput.value) {
        qty = parseInt(qtyInput.value, 10) || 1;
    }
    
    if (typeof window.addToCart === 'function') {
        for (let i = 0; i < qty; i++) {
            window.addToCart(name, price, code, box);
        }
        alert(qty + " adet sepete eklendi!");
    } else {
        alert("Sepet sistemi hazır değil!");
    }
};
</script>
`;

fs.writeFileSync('depo_rekorlari.html', htmlContent);
console.log("depo_rekorlari.html recreated with EXACT PEACH layout.");

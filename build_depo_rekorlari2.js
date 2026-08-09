const fs = require('fs');

const htmlContent = `
<div class="category-header">
    <button class="back-btn" onclick="window.history.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Geri
    </button>
    <h2>Depo Rekorlar</h2>
</div>

<style>
.grouped-products-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 20px 0;
}
.product-group-card {
    display: flex;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    overflow: hidden;
    border: 1px solid #eaeaea;
}
.group-image-col {
    flex: 0 0 250px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-right: 1px solid #eaeaea;
}
.group-image-col img {
    max-width: 100%;
    height: auto;
    max-height: 220px;
    object-fit: contain;
    margin-bottom: 20px;
}
.group-image-col h3 {
    margin: 0;
    color: #0a3d7c;
    font-size: 1.2rem;
    text-align: center;
    font-weight: 700;
}
.group-table-col {
    flex: 1;
    overflow-x: auto;
}
.premium-table {
    width: 100%;
    border-collapse: collapse;
    font-family: inherit;
}
.premium-table thead {
    background-color: #0a3d7c;
    color: #ffffff;
}
.premium-table th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}
.premium-table td {
    padding: 16px 20px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
}
.premium-table tbody tr:nth-child(even) {
    background-color: #fafbfc;
}
.premium-table tbody tr:hover {
    background-color: #f1f6fa;
}

/* EBAT PILL */
.ebat-pill {
    display: inline-block;
    border: 1.5px solid #cce0ff;
    background-color: #f0f7ff;
    color: #0a3d7c;
    border-radius: 20px;
    padding: 6px 16px;
    font-weight: 700;
    font-size: 14px;
    white-space: nowrap;
}

/* KOLI TEXT */
.koli-text {
    color: #666;
    font-weight: 600;
    font-size: 14px;
}

/* FIYAT TEXT */
.fiyat-text {
    color: #0a3d7c;
    font-weight: 800;
    font-size: 16px;
    white-space: nowrap;
}

/* STEPPER */
.qty-stepper {
    display: inline-flex;
    align-items: center;
    border: 1px solid #ced4da;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
}
.stepper-btn {
    background: #f8f9fa;
    color: #0a3d7c;
    border: none;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    transition: background 0.2s;
}
.stepper-btn:hover {
    background: #e9ecef;
}
.stepper-btn.minus { border-right: 1px solid #ced4da; }
.stepper-btn.plus { border-left: 1px solid #ced4da; }
.qty-stepper input {
    width: 45px;
    height: 32px;
    border: none;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    color: #333;
    -moz-appearance: textfield;
}
.qty-stepper input::-webkit-outer-spin-button,
.qty-stepper input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* ADD TO CART BTN */
.cart-btn {
    background-color: #0a3d7c;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 18px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s, transform 0.1s;
    box-shadow: 0 2px 4px rgba(10, 61, 124, 0.2);
    white-space: nowrap;
}
.cart-btn:hover {
    background-color: #082d5e;
}
.cart-btn:active {
    transform: scale(0.97);
}
.cart-btn svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
}

@media (max-width: 768px) {
    .product-group-card {
        flex-direction: column;
    }
    .group-image-col {
        flex: auto;
        border-right: none;
        border-bottom: 1px solid #eaeaea;
        padding: 20px;
    }
    .premium-table th, .premium-table td {
        padding: 12px 10px;
    }
}
</style>

<div class="grouped-products-container">

    <!-- GROUP 1: ift Tarafl Depo Rekoru -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/cift_tarafli_depo_rekoru.png" alt="ift Tarafl Depo Rekoru">
            <h3>ift Tarafl Depo Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table class="premium-table">
                <thead>
                    <tr>
                        <th>EBAT</th>
                        <th>KOD & KOLI ADEDI</th>
                        <th>FYAT (TL)</th>
                        <th>MKTAR</th>
                        <th>LEM</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="ebat-pill">1/2"</span></td>
                        <td><span class="koli-text">Kod: 326 (Koli: -)</span></td>
                        <td><span class="fiyat-text">65,00 TL</span></td>
                        <td>
                            <div class="qty-stepper">
                                <button class="stepper-btn minus" onclick="stepQty('qty-326', -1)">-</button>
                                <input type="number" id="qty-326" value="1" min="1">
                                <button class="stepper-btn plus" onclick="stepQty('qty-326', 1)">+</button>
                            </div>
                        </td>
                        <td>
                            <button class="cart-btn" onclick="addToCartMulti('ift Tarafl Depo Rekoru 1/2&quot;', 65.00, '326', '-', 'qty-326')">
                                <svg viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                                Sepete Ekle
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td><span class="ebat-pill">3/4"</span></td>
                        <td><span class="koli-text">Kod: 327 (Koli: -)</span></td>
                        <td><span class="fiyat-text">72,00 TL</span></td>
                        <td>
                            <div class="qty-stepper">
                                <button class="stepper-btn minus" onclick="stepQty('qty-327', -1)">-</button>
                                <input type="number" id="qty-327" value="1" min="1">
                                <button class="stepper-btn plus" onclick="stepQty('qty-327', 1)">+</button>
                            </div>
                        </td>
                        <td>
                            <button class="cart-btn" onclick="addToCartMulti('ift Tarafl Depo Rekoru 3/4&quot;', 72.00, '327', '-', 'qty-327')">
                                <svg viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                                Sepete Ekle
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td><span class="ebat-pill">1"</span></td>
                        <td><span class="koli-text">Kod: 328 (Koli: -)</span></td>
                        <td><span class="fiyat-text">78,00 TL</span></td>
                        <td>
                            <div class="qty-stepper">
                                <button class="stepper-btn minus" onclick="stepQty('qty-328', -1)">-</button>
                                <input type="number" id="qty-328" value="1" min="1">
                                <button class="stepper-btn plus" onclick="stepQty('qty-328', 1)">+</button>
                            </div>
                        </td>
                        <td>
                            <button class="cart-btn" onclick="addToCartMulti('ift Tarafl Depo Rekoru 1&quot;', 78.00, '328', '-', 'qty-328')">
                                <svg viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                                Sepete Ekle
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- GROUP 2: Depo Rekoru - Ters Di -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/depo_rekoru_ters_dis.png" alt="Depo Rekoru Ters Di">
            <h3>Depo Rekoru (Ters Di)</h3>
        </div>
        <div class="group-table-col">
            <table class="premium-table">
                <thead>
                    <tr><th>EBAT</th><th>KOD & KOLI ADEDI</th><th>FYAT (TL)</th><th>MKTAR</th><th>LEM</th></tr>
                </thead>
                <tbody id="group2-body">
                </tbody>
            </table>
        </div>
    </div>

    <!-- GROUP 3: Sintine Rekoru - Ters Di -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/sintine_rekoru_ters_dis.png" alt="Sintine Rekoru Ters Di">
            <h3>Sintine Rekoru (Ters Di)</h3>
        </div>
        <div class="group-table-col">
            <table class="premium-table">
                <thead>
                    <tr><th>EBAT</th><th>KOD & KOLI ADEDI</th><th>FYAT (TL)</th><th>MKTAR</th><th>LEM</th></tr>
                </thead>
                <tbody id="group3-body">
                </tbody>
            </table>
        </div>
    </div>

    <!-- GROUP 4: PVC Hortum Rekoru -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/pvc_hortum_rekoru.png" alt="PVC Hortum Rekoru">
            <h3>PVC Hortum Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table class="premium-table">
                <thead>
                    <tr><th>EBAT</th><th>KOD & KOLI ADEDI</th><th>FYAT (TL)</th><th>MKTAR</th><th>LEM</th></tr>
                </thead>
                <tbody id="group4-body">
                </tbody>
            </table>
        </div>
    </div>

    <!-- GROUP 5: Galvanizli Hortum Rekoru -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/galvanizli_hortum_rekoru.png" alt="Galvanizli Hortum Rekoru">
            <h3>Galvanizli Hortum Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table class="premium-table">
                <thead>
                    <tr><th>EBAT</th><th>KOD & KOLI ADEDI</th><th>FYAT (TL)</th><th>MKTAR</th><th>LEM</th></tr>
                </thead>
                <tbody id="group5-body">
                </tbody>
            </table>
        </div>
    </div>

    <!-- GROUP 6: zel Depo Rekoru -->
    <div class="product-group-card">
        <div class="group-image-col">
            <img src="resimler/depo_rekorlari/ozel_depo_rekoru.png" alt="zel Depo Rekoru">
            <h3>zel Depo Rekoru</h3>
        </div>
        <div class="group-table-col">
            <table class="premium-table">
                <thead>
                    <tr><th>EBAT</th><th>KOD & KOLI ADEDI</th><th>FYAT (TL)</th><th>MKTAR</th><th>LEM</th></tr>
                </thead>
                <tbody id="group6-body">
                </tbody>
            </table>
        </div>
    </div>

</div>

<script>
// Data arrays
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

const svgIcon = '<svg viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>';

function renderTable(groupArr, tbodyId, namePrefix) {
    const tbody = document.getElementById(tbodyId);
    if(!tbody) return;
    
    let html = '';
    groupArr.forEach(item => {
        let fmtFiyat = item.fiyat.replace('.', ',') + ' TL';
        html += \`<tr>
            <td><span class="ebat-pill">\${item.ebat}</span></td>
            <td><span class="koli-text">Kod: \${item.kod} (Koli: \${item.koli})</span></td>
            <td><span class="fiyat-text">\${fmtFiyat}</span></td>
            <td>
                <div class="qty-stepper">
                    <button class="stepper-btn minus" onclick="stepQty('qty-\${item.kod}', -1)">-</button>
                    <input type="number" id="qty-\${item.kod}" value="1" min="1">
                    <button class="stepper-btn plus" onclick="stepQty('qty-\${item.kod}', 1)">+</button>
                </div>
            </td>
            <td>
                <button class="cart-btn" onclick="addToCartMulti('\${namePrefix} \${item.ebat.replace(/"/g, '&quot;')}', \${item.fiyat}, '\${item.kod}', '\${item.koli}', 'qty-\${item.kod}')">
                    \${svgIcon} Sepete Ekle
                </button>
            </td>
        </tr>\`;
    });
    tbody.innerHTML = html;
}

// Ensure DOM is ready, though this script is at the bottom of the snippet
setTimeout(() => {
    renderTable(grp2, 'group2-body', 'Depo Rekoru Ters Di');
    renderTable(grp3, 'group3-body', 'Sintine Rekoru Ters Di');
    renderTable(grp4, 'group4-body', 'PVC Hortum Rekoru');
    renderTable(grp5, 'group5-body', 'Galvanizli Hortum Rekoru');
    renderTable(grp6, 'group6-body', 'zel Depo Rekoru');
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
        
        const alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.right = '20px';
        alertBox.style.background = '#0a3d7c';
        alertBox.style.color = 'white';
        alertBox.style.padding = '15px 25px';
        alertBox.style.borderRadius = '5px';
        alertBox.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
        alertBox.style.zIndex = '999999';
        alertBox.innerHTML = \`\${qty} adet '\${name}' sepete eklendi!\`;
        document.body.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 2500);
    } else {
        alert("Sepet sistemi hazr deil!");
    }
};
</script>
`;

fs.writeFileSync('depo_rekorlari.html', htmlContent);
console.log("depo_rekorlari.html created.");

const fs = require('fs');
let js = fs.readFileSync('cart.js', 'utf8');

const oldBtn = `<button class="history-order-btn" id="openHistoryBtn" style="background: #334155; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.9rem; margin-top: 10px; transition: 0.2s;"><i class="fas fa-history"></i> Geçmiş Siparişlerim</button>`;
js = js.replace(oldBtn, '');

const newBtn = `<button class="history-order-btn" id="openHistoryBtn" style="background: #1E293B; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: 700; width: 90%; margin: 15px auto 5px auto; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: 0.2s;"><i class="fas fa-history"></i> GEÇMİŞ SİPARİŞLERİM</button>`;

const target = `<div class="cart-timestamp-bar">`;
if (js.includes(target)) {
    js = js.replace(target, newBtn + '\\n                ' + target);
    fs.writeFileSync('cart.js', js);
    console.log('Successfully moved history button');
} else {
    console.log('Target not found');
}

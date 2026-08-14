const fs = require('fs');
let js = fs.readFileSync('cart.js', 'utf8');

const targetToRemove = '<button class=\\"history-order-btn\\" id=\\"openHistoryBtn\\" style=\\"background: #334155; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.9rem; margin-top: 10px; transition: 0.2s;\\"><i class=\\"fas fa-history\\"></i> Geçmiş Siparişlerim</button>';

if (js.includes(targetToRemove)) {
    js = js.replace(targetToRemove, '');
} else {
    // maybe try unescaped
    const target2 = '<button class="history-order-btn" id="openHistoryBtn" style="background: #334155; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.9rem; margin-top: 10px; transition: 0.2s;"><i class="fas fa-history"></i> Geçmiş Siparişlerim</button>';
    js = js.replace(target2, '');
}

const newBtn = '\\n" + "                    <button class=\\"history-order-btn\\" id=\\"openHistoryBtn\\" style=\\"background: #1E293B; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: 700; width: 100%; margin-bottom: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: 0.2s;\\"><i class=\\"fas fa-history\\"></i> GEÇMİŞ SİPARİŞLERİM</button>" + "';

const targetToInsert = '                <div class=\\"cart-timestamp-bar\\">';

if (js.includes(targetToInsert)) {
    js = js.replace(targetToInsert, newBtn + '\\n' + targetToInsert);
    fs.writeFileSync('cart.js', js);
    console.log('Successfully moved history button to top');
} else {
    console.log('Target not found for insertion');
}

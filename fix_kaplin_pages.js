const fs = require('fs');

// Map of filenames to their correct product names and categories
const kaplinProducts = {
    'mavi-disi-kaplin.html': { name: 'Mavi Seri Dişi Kaplin', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavidisi.png' },
    'mavi-erkek-kaplin.html': { name: 'Mavi Seri Erkek Kaplin', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-erkek-kaplin.png' },
    'mavi-dirsek-kaplin.html': { name: 'Mavi Seri Dirsek Kaplin', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-dirsek-kaplin.png' },
    'mavi-disi-dirsek.html': { name: 'Mavi Seri Dişi Dirsek', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-disi-dirsek.png' },
    'mavi-disi-te.html': { name: 'Mavi Seri Dişi Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-disi-te.png' },
    'mavi-erkek-dirsek.html': { name: 'Mavi Seri Erkek Dirsek', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-erkek-dirsek.png' },
    'mavi-erkek-te.html': { name: 'Mavi Seri Erkek Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-erkek-te.png' },
    'mavi-manson.html': { name: 'Mavi Seri Manşon', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-manson.png' },
    'mavi-reduksiyon.html': { name: 'Mavi Seri Redüksiyon', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-reduksiyon.png' },
    'mavi-reduksiyon-te.html': { name: 'Mavi Seri Redüksiyon Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-reduksiyon-te.png' },
    'mavi-tapa.html': { name: 'Mavi Seri Tapa', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-tapa.png' },
    'mavi-te.html': { name: 'Mavi Seri Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Mavi Seri', img: 'mavi-te.png' },
    'siyah-disi.html': { name: 'Siyah Seri Dişi Kaplin', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-seri-disi.png' },
    'siyah-erkek-kaplin.html': { name: 'Siyah Seri Erkek Kaplin', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-seri-erkek.png' },
    'siyah-dirsek.html': { name: 'Siyah Seri Dirsek Kaplin', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-seri-dirsek.png' },
    'siyah-disi-dirsek.html': { name: 'Siyah Seri Dişi Dirsek', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-seri-disi-dirsek.png' },
    'siyah-disi-te.html': { name: 'Siyah Seri Dişi Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-seri-disi-te.png' },
    'siyah-erkek-dirsek.html': { name: 'Siyah Seri Erkek Dirsek', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-seri-erkek-dirsek.png' },
    'siyah-erkek-te.html': { name: 'Siyah Seri Erkek Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-seri-erkek-te.png' },
    'siyah-manson.html': { name: 'Siyah Seri Manşon', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-seri-manson.png' },
    'siyah-reduksiyon.html': { name: 'Siyah Seri Redüksiyon', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-reduksiyon.png' },
    'siyah-reduksiyon-te.html': { name: 'Siyah Seri Redüksiyon Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-reduksiyon-te.png' },
    'siyah-tapa.html': { name: 'Siyah Seri Tapa', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-seri-tapa.png' },
    'siyah-te.html': { name: 'Siyah Seri Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Siyah Seri', img: 'siyah-te.png' },
    'kilitli-dirsek.html': { name: 'Kilitli Bağlantı Dirsek', category: 'Kaplinler ve Ek Parçaları', sub: 'Kilitli Bağlantı', img: 'kilitli-dirsek.png' },
    'kilitli-erkek-adaptor.html': { name: 'Kilitli Bağlantı Erkek Adaptör', category: 'Kaplinler ve Ek Parçaları', sub: 'Kilitli Bağlantı', img: 'kilitli-erkek-adaptor.png' },
    'kilitli-erkek-dirsek.html': { name: 'Kilitli Bağlantı Erkek Dirsek', category: 'Kaplinler ve Ek Parçaları', sub: 'Kilitli Bağlantı', img: 'kilitli-erkek-dirsek.png' },
    'kilitli-erkek-te.html': { name: 'Kilitli Bağlantı Erkek Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Kilitli Bağlantı', img: 'kilitli-erkek-te.png' },
    'kilitli-reduksiyon-dirsek.html': { name: 'Kilitli Bağlantı Redüksiyon Dirsek', category: 'Kaplinler ve Ek Parçaları', sub: 'Kilitli Bağlantı', img: 'kilitli-reduksiyon-dirsek.png' },
    'kilitli-te.html': { name: 'Kilitli Bağlantı Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Kilitli Bağlantı', img: 'kilitli-te.png' },
    'nipelli-disi-dirsek.html': { name: 'Nipelli Dişi Dirsek', category: 'Kaplinler ve Ek Parçaları', sub: 'Nipelli Seri', img: 'nipelli-disi-dirsek.png' },
    'nipelli-disi-priz-kolye.html': { name: 'Nipelli Dişi Priz Kolye', category: 'Kaplinler ve Ek Parçaları', sub: 'Nipelli Seri', img: 'nipelli-disi-priz-kolye.png' },
    'nipelli-erkek-priz-kolye.html': { name: 'Nipelli Erkek Priz Kolye', category: 'Kaplinler ve Ek Parçaları', sub: 'Nipelli Seri', img: 'nipelli-erkek-priz-kolye.png' },
    'nipelli-erkek-te.html': { name: 'Nipelli Erkek Te', category: 'Kaplinler ve Ek Parçaları', sub: 'Nipelli Seri', img: 'nipelli-erkek-te.png' },
    'disli-disi-dirsek.html': { name: 'Dişli Dişi Dirsek', category: 'Kaplinler ve Ek Parçaları', sub: 'Dişli Seri', img: 'disli-disi-dirsek.png' },
    'disli-disi-nipel.html': { name: 'Dişli Dişi Nipel', category: 'Kaplinler ve Ek Parçaları', sub: 'Dişli Seri', img: 'disli-disi-nipel.png' },
    'disli-disi-reduksiyon-dirsek.html': { name: 'Dişli Dişi Redüksiyon Dirsek', category: 'Kaplinler ve Ek Parçaları', sub: 'Dişli Seri', img: 'disli-disi-reduksiyon-dirsek.png' },
    'abot-ustu-kaplin-dagitici.html': { name: 'Abotüstü Kaplin Dağıtıcı', category: 'Kaplinler ve Ek Parçaları', sub: 'Diğer', img: 'abot-ustu-kaplin-dagitici.png' },
    'kaplin-disi-vana.html': { name: 'Kaplin Dişi Vana', category: 'Kaplinler ve Ek Parçaları', sub: 'Vanalar', img: 'kaplin-disi-vana.png' },
    'kaplin-erkek-vana.html': { name: 'Kaplin Erkek Vana', category: 'Kaplinler ve Ek Parçaları', sub: 'Vanalar', img: 'kaplin-erkek-vana.png' },
    'kaplin-sikma-anahtari.html': { name: 'Kaplin Sıkma Anahtarı', category: 'Kaplinler ve Ek Parçaları', sub: 'Aksesuar', img: 'kaplin-sikma-anahtari.png' },
    'o-ring.html': { name: 'O-Ring', category: 'Kaplinler ve Ek Parçaları', sub: 'Conta/Ring', img: 'o-ring.png' },
    'priz-kolye.html': { name: 'Priz Kolye', category: 'Kaplinler ve Ek Parçaları', sub: 'Priz Kolye', img: 'priz-kolye.png' },
    'erkek-disli-kor-tapa.html': { name: 'Erkek Dişli Kör Tapa', category: 'Kaplinler ve Ek Parçaları', sub: 'Dişli Seri', img: 'erkek-disli-kor-tapa.png' },
};

let fixedKaplin = 0;
Object.entries(kaplinProducts).forEach(([filename, info]) => {
    if (!fs.existsSync(filename)) return;
    
    let html = fs.readFileSync(filename, 'utf8');
    let changed = false;
    
    // Fix <title> tag
    const titleRegex = /<title>[^<]+<\/title>/;
    const newTitle = `<title>${info.name} - BAYSU YAPI VE SULAMA MALZEMELERİ</title>`;
    if (html.match(titleRegex) && !html.includes(newTitle)) {
        html = html.replace(titleRegex, newTitle);
        changed = true;
    }
    
    // Fix category text: "Kaplinler ve Ek Parçaları - Mavi Seri" -> correct category
    const catRegex = /<div class="product-category">([^<]+)<\/div>/;
    const newCat = `<div class="product-category">${info.category} - ${info.sub}</div>`;
    const catMatch = html.match(catRegex);
    if (catMatch && catMatch[0] !== newCat) {
        html = html.replace(catRegex, newCat);
        changed = true;
    }
    
    // Fix product title: <h1 class="product-title">Mavi Dişi</h1> -> correct name
    const h1Regex = /<h1 class="product-title">[^<]+<\/h1>/;
    const newH1 = `<h1 class="product-title">${info.name}</h1>`;
    if (html.match(h1Regex) && !html.includes(newH1)) {
        html = html.replace(h1Regex, newH1);
        changed = true;
    }
    
    // Fix features box text
    const featRegex = /Mavi Dişi Kaplin, polietilen[^<]+/;
    const featMatch = html.match(featRegex);
    if (featMatch) {
        const newFeat = `${info.name}, polietilen (PE) borular için yüksek kaliteli bağlantı elemanıdır. Dayanıklı polipropilen (PP) malzemeden üretilmiş olup, basınca ve darbelere karşı dirençlidir. PN16 basınç sınıfı ile güvenilir performans sunar.`;
        html = html.replace(featRegex, newFeat);
        changed = true;
    }
    
    // Also fix any other hardcoded "Mavi Dişi Kaplin" references in features
    const featRegex2 = /Mavi Dişi Kaplinin özellikleri/gi;
    if (html.match(featRegex2)) {
        html = html.replace(featRegex2, `${info.name} Özellikleri`);
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(filename, html);
        fixedKaplin++;
        console.log(`Fixed: ${filename} -> ${info.name}`);
    }
});

console.log(`\nTotal Kaplin pages fixed: ${fixedKaplin}`);

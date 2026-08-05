const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\\\Users\\\\kopya\\\\Pictures\\\\ÜZÜMCÜ\\\\Bahçe Ekipmanları';
let products = JSON.parse(fs.readFileSync('extracted_products.json', 'utf8'));
const imageFiles = fs.readdirSync(srcDir).filter(f => f.toLowerCase().endsWith('.png'));

const usedImages = new Set();
products.forEach(p => {
    const imgName = p.actualImageFile || (p.image ? p.image + '.png' : '');
    if (imgName) usedImages.add(imgName);
});

const unusedImages = imageFiles.filter(f => !usedImages.has(f));

unusedImages.forEach(f => {
    let displayName = path.basename(f, '.png');
    // Replace "1-2" with "1/2" but only for numbers
    displayName = displayName.replace(/(\d)-(\d)/g, '$1/$2');
    // Also replace the right double quote with standard quote if needed, 
    // or just leave it as is for the name since it's just a display name.
    
    products.push({
        code: '-',
        name: displayName,
        searchName: displayName.toLowerCase(),
        price: '-',
        box: '-',
        pack: '-',
        image: path.basename(f, '.png'),
        actualImageFile: f
    });
});

fs.writeFileSync('extracted_products.json', JSON.stringify(products, null, 2), 'utf8');
console.log('Successfully added ' + unusedImages.length + ' missing products.');

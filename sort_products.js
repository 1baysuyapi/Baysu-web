const fs = require('fs');

const orderText = fs.readFileSync('product_sorting_order.txt', 'utf8');
const orderLines = orderText.split('\n').map(l => l.trim()).filter(l => l);

const products = JSON.parse(fs.readFileSync('extracted_products.json', 'utf8'));

function normalize(str) {
    return str.toLowerCase().replace(/[\"”\/\-’' ]/g, '');
}

const sortedProducts = [];
const usedIndices = new Set();

orderLines.forEach(line => {
    const normLine = normalize(line);
    const index = products.findIndex((p, i) => !usedIndices.has(i) && normalize(p.name) === normLine);
    if (index !== -1) {
        sortedProducts.push(products[index]);
        usedIndices.add(index);
    } else {
        console.log("WARNING: Could not find product for line: " + line);
    }
});

products.forEach((p, i) => {
    if (!usedIndices.has(i)) {
        sortedProducts.push(p);
    }
});

fs.writeFileSync('extracted_products.json', JSON.stringify(sortedProducts, null, 2), 'utf8');
console.log('Successfully sorted products.');

const fs = require('fs');
let products = JSON.parse(fs.readFileSync('extracted_products.json', 'utf8'));

const perfTable = [
  { bar: "2,1", m: "12,5", lh: "570" },
  { bar: "2,8", m: "12,8", lh: "635" },
  { bar: "3,5", m: "13,1", lh: "725" },
  { bar: "4,2", m: "13,1", lh: "795" }
];

products.forEach(p => {
  if (['148', '149', '439', '153'].includes(p.code)) {
    p.performanceTable = perfTable;
  }
});

fs.writeFileSync('extracted_products.json', JSON.stringify(products, null, 2), 'utf8');
console.log('Added performance table to specific products.');

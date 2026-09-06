const fs = require('fs');

const dataJs = fs.readFileSync('data.js', 'utf8');
const regex = /"([^"]+)":"(PC[^"]+)"/g;
let match;
let count = 0;

while ((match = regex.exec(dataJs)) !== null) {
  const filename = match[1];
  const b64 = match[2];
  
  if (!fs.existsSync(filename)) {
    const decodedHTML = Buffer.from(b64, 'base64').toString('utf8');
    fs.writeFileSync(filename, decodedHTML);
    count++;
    console.log('Created missing file:', filename);
  }
}

console.log('Total newly decoded files:', count);

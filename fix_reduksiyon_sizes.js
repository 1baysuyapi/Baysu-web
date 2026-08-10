const fs = require('fs');

let html = fs.readFileSync('hortum-reduksiyonu.html', 'utf8');

const mapping = {
    '165': '3/4" &bull; 1/2"',
    '166': '3/4" &bull; 5/8"',
    '167': '1" &bull; 1/2" &bull; 5/8"',
    '168': '1" &bull; 3/4"',
    '169': '1 1/4" &bull; 1"',
    '170': '1 1/2" &bull; 1 1/4"',
    '171': '2" &bull; 1 1/2"',
    '347': '1 1/2" &bull; 5/8" &bull; 1/2"'
};

for (const [code, size] of Object.entries(mapping)) {
    // Find the row for this code and replace its "Standart" with the correct size
    const regex = new RegExp(`(<td><strong>${code}<\\/strong><\\/td>\\s*<td><span class="ebat-pill">)Standart(<\\/span><\\/td>)`);
    html = html.replace(regex, `$1${size}$2`);
}

fs.writeFileSync('hortum-reduksiyonu.html', html);
console.log('Fixed sizes in hortum-reduksiyonu.html');

const fs = require('fs');

const renames = {
    '1-2” Jak Ekleme.png': '1-2-jak-ekleme.png',
    '1-2” Jak Rekoru.png': '1-2-jak-rekoru.png',
    '1-2” Stoplu Jak Ekleme.png': '1-2-stoplu-jak-ekleme.png',
    '3-4” Jak Ekleme.png': '3-4-jak-ekleme.png',
    '3-4” Jak Rekoru.png': '3-4-jak-rekoru.png',
    '3-4” Stoplu Jak Ekleme.png': '3-4-stoplu-jak-ekleme.png',
    '3-4”   1-2” Jak Rekoru.png': '3-4-1-2-jak-rekoru.png',
    'Batarya Jak Rekoru.png': 'batarya-jak-rekoru.png',
    'Mix Batarya Jak Rekoru.png': 'mix-batarya-jak-rekoru.png',
    'Batarya Hortum Rekoru.png': 'batarya-hortum-rekoru.png',
    'Mix Batarya Hortum Rekoru.png': 'mix-batarya-hortum-rekoru.png',
    'Otomatik Kelepçeli Musluk Bağlantısı.png': 'otomatik-kelepseli-musluk-baglantisi.png',
    'PP Küresel Vana .png': 'pp-kuresel-vana-real.png'
};

// Rename files on disk
const files = fs.readdirSync('.');
for (const file of files) {
    if (file.endsWith('.png')) {
        for (const [oldName, newName] of Object.entries(renames)) {
            if (file === oldName) {
                fs.renameSync(file, newName);
                console.log('Renamed', file, 'to', newName);
            }
        }
    }
}

// Now update all HTML files to point to the new image names
// Because the previous script injected src="1-2" Jak Ekleme.png", we can use a regex to match the broken src attributes
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix the broken HTML tags caused by double quotes
    // e.g. <img src="1-2" Jak Ekleme.png" alt="1/2" Jak Ekleme">
    // Since there are multiple variations, let's just replace them one by one.
    
    const replacements = [
        ['src="1-2" Jak Ekleme.png"', 'src="1-2-jak-ekleme.png"'],
        ['src="1-2" Jak Rekoru.png"', 'src="1-2-jak-rekoru.png"'],
        ['src="1-2" Stoplu Jak Ekleme.png"', 'src="1-2-stoplu-jak-ekleme.png"'],
        ['src="3-4" Jak Ekleme.png"', 'src="3-4-jak-ekleme.png"'],
        ['src="3-4" Jak Rekoru.png"', 'src="3-4-jak-rekoru.png"'],
        ['src="3-4" Stoplu Jak Ekleme.png"', 'src="3-4-stoplu-jak-ekleme.png"'],
        ['src="3-4"   1-2" Jak Rekoru.png"', 'src="3-4-1-2-jak-rekoru.png"'],
        ['src="Batarya Jak Rekoru.png"', 'src="batarya-jak-rekoru.png"'],
        ['src="Mix Batarya Jak Rekoru.png"', 'src="mix-batarya-jak-rekoru.png"'],
        ['src="Batarya Hortum Rekoru.png"', 'src="batarya-hortum-rekoru.png"'],
        ['src="Mix Batarya Hortum Rekoru.png"', 'src="mix-batarya-hortum-rekoru.png"'],
        ['src="Otomatik Kelepçeli Musluk Bağlantısı.png"', 'src="otomatik-kelepseli-musluk-baglantisi.png"'],
        ['src="PP%20K%C3%BCresel%20Vana%20.png"', 'src="pp-kuresel-vana-real.png"']
    ];

    for (const [oldStr, newStr] of replacements) {
        if (html.includes(oldStr)) {
            html = html.split(oldStr).join(newStr);
            changed = true;
        }
    }
    
    // Fix broken alt attributes like alt="1/2" Jak Ekleme"
    const altReplacements = [
        ['alt="1/2" Jak Ekleme"', 'alt="1/2 Jak Ekleme"'],
        ['alt="1/2" Jak Rekoru"', 'alt="1/2 Jak Rekoru"'],
        ['alt="1/2" Stoplu Jak Ekleme"', 'alt="1/2 Stoplu Jak Ekleme"'],
        ['alt="3/4" Jak Ekleme"', 'alt="3/4 Jak Ekleme"'],
        ['alt="3/4" Jak Rekoru"', 'alt="3/4 Jak Rekoru"'],
        ['alt="3/4" Stoplu Jak Ekleme"', 'alt="3/4 Stoplu Jak Ekleme"'],
        ['alt="3/4" - 1/2" Jak Rekoru"', 'alt="3/4 - 1/2 Jak Rekoru"']
    ];
    for (const [oldStr, newStr] of altReplacements) {
        if (html.includes(oldStr)) {
            html = html.split(oldStr).join(newStr);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, html);
        console.log('Fixed images in', file);
    }
}

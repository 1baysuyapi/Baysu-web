const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix the broken HTML tags caused by double quotes and forward slashes
    // e.g. <img src="1/2" Jak Ekleme.png" alt="1/2 Jak Ekleme">
    
    const replacements = [
        ['src="1/2" Jak Ekleme.png"', 'src="1-2-jak-ekleme.png"'],
        ['src="1/2" Jak Rekoru.png"', 'src="1-2-jak-rekoru.png"'],
        ['src="1/2" Stoplu Jak Ekleme.png"', 'src="1-2-stoplu-jak-ekleme.png"'],
        ['src="3/4" Jak Ekleme.png"', 'src="3-4-jak-ekleme.png"'],
        ['src="3/4" Jak Rekoru.png"', 'src="3-4-jak-rekoru.png"'],
        ['src="3/4" Stoplu Jak Ekleme.png"', 'src="3-4-stoplu-jak-ekleme.png"'],
        ['src="3/4" - 1/2" Jak Rekoru.png"', 'src="3-4-1-2-jak-rekoru.png"'],
        ['src="Batarya Jak Rekoru.png"', 'src="batarya-jak-rekoru.png"'],
        ['src="Mix Batarya Jak Rekoru.png"', 'src="mix-batarya-jak-rekoru.png"'],
        ['src="Batarya Hortum Rekoru.png"', 'src="batarya-hortum-rekoru.png"'],
        ['src="Mix Batarya Hortum Rekoru.png"', 'src="mix-batarya-hortum-rekoru.png"'],
        ['src="Otomatik Kelepçeli Musluk Bağlantısı.png"', 'src="otomatik-kelepseli-musluk-baglantisi.png"'],
        // Also check if they exist with hyphen just in case
        ['src="1-2" Jak Ekleme.png"', 'src="1-2-jak-ekleme.png"'],
        ['src="1-2" Jak Rekoru.png"', 'src="1-2-jak-rekoru.png"'],
        ['src="1-2" Stoplu Jak Ekleme.png"', 'src="1-2-stoplu-jak-ekleme.png"'],
        ['src="3-4" Jak Ekleme.png"', 'src="3-4-jak-ekleme.png"'],
        ['src="3-4" Jak Rekoru.png"', 'src="3-4-jak-rekoru.png"'],
        ['src="3-4" Stoplu Jak Ekleme.png"', 'src="3-4-stoplu-jak-ekleme.png"'],
        ['src="3-4" - 1-2" Jak Rekoru.png"', 'src="3-4-1-2-jak-rekoru.png"']
    ];

    for (const [oldStr, newStr] of replacements) {
        if (html.includes(oldStr)) {
            html = html.split(oldStr).join(newStr);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, html);
        console.log('Fixed images correctly in', file);
    }
}

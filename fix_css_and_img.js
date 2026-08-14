const fs = require('fs');

const files = [
    'kuresel-vana.html',
    'batarya-jak-rekoru.html',
    'mix-batarya-jak-rekoru.html',
    'batarya-hortum-rekoru.html',
    'mix-batarya-hortum-rekoru.html',
    'otomatik-kelepseli-musluk-baglantisi.html',
    '1-2-jak-ekleme.html',
    '3-4-jak-ekleme.html',
    '3-4-jak-rekoru.html',
    '1-2-jak-rekoru.html',
    '3-4-1-2-jak-rekoru.html',
    '1-2-stoplu-jak-ekleme.html',
    '3-4-stoplu-jak-ekleme.html'
];

const cssLink = '    <link rel="stylesheet" href="extracted_styles.css?v=1029">\n';

for (let file of files) {
    if (fs.existsSync(file)) {
        let html = fs.readFileSync(file, 'utf8');
        
        // Add extracted_styles.css if not present
        if (!html.includes('extracted_styles.css')) {
            html = html.replace('</title>\n', '</title>\n' + cssLink);
        }

        // For kuresel-vana.html, fix the image
        if (file === 'kuresel-vana.html') {
            html = html.replace(/src="pp-kuresel-vana\.png"/g, 'src="PP%20K%C3%BCresel%20Vana%20.png"');
            html = html.replace(/src="PP Küresel Vana.png"/g, 'src="PP%20K%C3%BCresel%20Vana%20.png"');
            html = html.replace(/src="PP%20K%C3%BCresel%20Vana\.png"/g, 'src="PP%20K%C3%BCresel%20Vana%20.png"'); // In case of previous partial fix
        }

        fs.writeFileSync(file, html);
        console.log('Fixed ' + file);
    }
}

const fs = require('fs');

const pages = [
    'ayarli-hortum-eki.html',
    'ayarli-hortum-te.html',
    'hortum-eki.html',
    'hortum-reduksiyonu.html',
    'hortum-te.html'
];

for (const file of pages) {
    if (fs.existsSync(file)) {
        let html = fs.readFileSync(file, 'utf8');
        
        // Match the <span class="ebat-pill">...</span>
        // We want to remove the product name part.
        // e.g. "1/2&quot; Ayarlı Hortum Eki" -> "1/2&quot;"
        // "1/2&quot; • 5/8&quot; Hortum TE" -> "1/2&quot; • 5/8&quot;"
        
        html = html.replace(/<span class="ebat-pill">([^<]+)<\/span>/g, (match, p1) => {
            // Remove the product names from the string
            let newEbat = p1
                .replace(/Ayarlı Hortum Eki/g, '')
                .replace(/Ayarlı Hortum TE/g, '')
                .replace(/Hortum Eki/g, '')
                .replace(/Hortum Rediksiyonu/g, '')
                .replace(/Hortum Redüksiyonu/g, '')
                .replace(/Hortum TE/g, '')
                .replace(/Hortum Rekoru/g, '')
                .trim();
                
            if (newEbat === '') {
                newEbat = 'Standart'; // Fallback if it becomes empty
            }
            
            return `<span class="ebat-pill">${newEbat}</span>`;
        });
        
        fs.writeFileSync(file, html);
        console.log('Fixed Ebat in ' + file);
    }
}

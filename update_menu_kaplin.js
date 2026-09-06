const fs = require('fs');
const newMenu = `                <li class="category-item">
                    <a href="/musluk-jaki-ve-rekorlari" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                        <div class="category-header">
                            <h3>Musluk Jakı Ve Rekorları</h3>
                        </div>
                    </a>
                </li>`;
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    const startMatch = html.indexOf('<h3>Musluk Jakı Ve Rekorları <span class="arrow-icon">&#9658;</span></h3>');
    if (startMatch > -1) {
        const startLi = html.lastIndexOf('<li class="category-item">', startMatch);
        const endLi = html.indexOf('</li>', startMatch) + 5;
        if (startLi > -1 && endLi > -1) {
            const block = html.substring(startLi, endLi);
            if (!block.includes('/musluk-jaki-ve-rekorlari')) {
                html = html.substring(0, startLi) + newMenu + html.substring(endLi);
                fs.writeFileSync(file, html);
                console.log('Updated menu in', file);
            }
        }
    }
}

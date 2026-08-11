const fs = require('fs');

const d = fs.readFileSync('data.js', 'utf8');

const regex = /"bahce-ekipmanlari\.html"\s*:\s*"([^"]+)"/;
const m = regex.exec(d);

if (m) {
    let html = Buffer.from(m[1], 'base64').toString('utf8');
    
    const oldCss = `            .product-card:hover {
                z-index: 10;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                border-color: var(--border-color);
                box-shadow: none;
            }
            .product-card:hover .card-hover-details {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
                z-index: 10;
            }`;

    const newCss = `            @media (hover: hover) {
                .product-card:hover {
                    z-index: 10;
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                    border-color: var(--border-color);
                    box-shadow: none;
                }
                .product-card:hover .card-hover-details {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                    z-index: 10;
                }
            }
            .product-card.card-active {
                z-index: 10;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                border-color: var(--border-color);
                box-shadow: none;
            }
            .product-card.card-active .card-hover-details {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
                z-index: 10;
            }`;

    if (html.includes('.product-card:hover {')) {
        html = html.replace(oldCss, newCss);
        const newBase64 = Buffer.from(html, 'utf8').toString('base64');
        const newD = d.replace(m[1], newBase64);
        fs.writeFileSync('data.js', newD);
        console.log('Successfully patched bahce-ekipmanlari.html CSS');
    } else {
        console.log('Could not find oldCss in bahce-ekipmanlari.html');
    }
}

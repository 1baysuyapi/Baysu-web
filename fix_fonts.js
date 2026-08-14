const fs = require('fs');

// REVERT INDEX.HTML
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('.nav-links a {\\n            color: rgba(255, 255, 255, 0.9);\\n            font-weight: 600;\\n            font-size: 18px;', '.nav-links a {\\n            color: rgba(255, 255, 255, 0.9);\\n            font-weight: 600;\\n            font-size: 15px;');
html = html.replace('.main-category-item h3 {\\n            margin: 0;\\n            font-size: 1.3rem;', '.main-category-item h3 {\\n            margin: 0;\\n            font-size: 1.05rem;');
html = html.replace('.category-item h3 {\\n            margin: 0;\\n            font-size: 1.15rem;', '.category-item h3 {\\n            margin: 0;\\n            font-size: 0.95rem;');
html = html.replace('.product-list li a {\\n            display: block;\\n            padding: 10px 50px;\\n            color: #475569;\\n            font-size: 1.1rem;', '.product-list li a {\\n            display: block;\\n            padding: 10px 50px;\\n            color: #475569;\\n            font-size: 0.9rem;');

const mobileCssHtml = `
        /* Mobile Only Font Scaling (Touch Devices) */
        @media (pointer: coarse) {
            .nav-links a { font-size: 18px !important; }
            .main-category-item h3 { font-size: 1.3rem !important; }
            .category-item h3 { font-size: 1.15rem !important; }
            .product-list li a { font-size: 1.1rem !important; }
        }
`;
html = html.replace('</style>', mobileCssHtml + '</style>');
fs.writeFileSync('index.html', html);


// REVERT EXTRACTED_STYLES.CSS
let css = fs.readFileSync('extracted_styles.css', 'utf8');
css = css.replace('.main-category-header h3 {\\n            margin: 0 !important;\\n            font-size: 1.15rem !important;', '.main-category-header h3 {\\n            margin: 0 !important;\\n            font-size: 0.95rem !important;');
css = css.replace('.category-header h3 {\\n            margin: 0 !important;\\n            font-size: 1.1rem !important;', '.category-header h3 {\\n            margin: 0 !important;\\n            font-size: 0.9rem !important;');
css = css.replace('.product-list li a {\\n            display: block !important;\\n            padding: 6px 25px !important;\\n            color: #334155 !important;\\n            font-size: 16px !important;', '.product-list li a {\\n            display: block !important;\\n            padding: 6px 25px !important;\\n            color: #334155 !important;\\n            font-size: 13px !important;');
css = css.replace('.nav-links a {\\n            color: #FFFFFF !important;\\n            font-weight: 700 !important;\\n            font-size: 18px !important;', '.nav-links a {\\n            color: #FFFFFF !important;\\n            font-weight: 700 !important;\\n            font-size: 15px !important;');

const mobileCssExtracted = `
/* Mobile Only Font Scaling (Touch Devices) */
@media (pointer: coarse) {
    .nav-links a { font-size: 18px !important; }
    .main-category-header h3 { font-size: 1.15rem !important; }
    .category-header h3 { font-size: 1.1rem !important; }
    .product-list li a { font-size: 16px !important; }
}
`;
css = css + '\\n' + mobileCssExtracted;
fs.writeFileSync('extracted_styles.css', css);

console.log('Reverted desktop fonts and added mobile-only fonts.');

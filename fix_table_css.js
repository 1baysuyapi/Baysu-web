const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// The bad CSS:
// .table-responsive, table {
//     display: block;
//     ...
// }

// Replace `.table-responsive, table {` with `.table-responsive {`
indexHtml = indexHtml.replace(/\.table-responsive,\s*table\s*\{/g, '.table-responsive {');

// Also, let's inject a CSS rule to guarantee tables display as tables, just in case
const fixCss = `
        table {
            display: table !important;
            width: 100% !important;
        }
`;
indexHtml = indexHtml.replace(/<\/style>/, fixCss + '\n    </style>');

// Bump cache buster
indexHtml = indexHtml.replace(/data\.js\?v=\d+/, 'data.js?v=' + Date.now());

fs.writeFileSync('index.html', indexHtml);
console.log('Fixed table display block issue in index.html');

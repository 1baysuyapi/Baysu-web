const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Fix header-main z-index so search dropdown goes over nav-bar
html = html.replace('.header-main {\n            background-color: #ffffff;\n            box-shadow: 0 4px 20px rgba(0,0,0,0.05);\n            position: relative;\n            z-index: 1000;\n        }', '.header-main {\n            background-color: #ffffff;\n            box-shadow: 0 4px 20px rgba(0,0,0,0.05);\n            position: relative;\n            z-index: 1005; /* MUST be higher than nav-bar (1000) so search results overlay it */\n        }');

// Also boost search-results z-index just to be safe
html = html.replace('z-index: 1000;\n            display: none;\n            max-height: 400px;\n            overflow-y: auto;', 'z-index: 999999;\n            display: none;\n            max-height: 400px;\n            overflow-y: auto;');

// And since we found caching might be an issue, let's bump the cache busters again
html = html.replace('site-engine.js?v3=', 'site-engine.js?v4=');
html = html.replace('extracted_styles.css?v4=', 'extracted_styles.css?v5=');
html = html.replace('data.js?v=1786404319875', 'data.js?v=1786404319876');

fs.writeFileSync('index.html', html);
console.log("Fixed z-index!");

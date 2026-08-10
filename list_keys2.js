const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');

const m = {};
const w = { PAGE_DATA: {} };
global.window = w;
try {
    eval(code);
} catch (e) {
    console.error("Eval failed", e);
}

const routes = w.PAGE_DATA;
for (const key in routes) {
    console.log(key);
}

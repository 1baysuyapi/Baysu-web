const fs = require('fs');
const txt = fs.readFileSync('data.js', 'utf8');

const parseCode = (code) => {
    const obj = {};
    const lines = code.split('\n');
    for (let line of lines) {
        let match = line.match(/^\s*"([^"]+)"\s*:\s*"([^"]+)",?\s*$/);
        if (match) {
            obj[match[1]] = true;
        }
    }
    return obj;
};

const obj = parseCode(txt);
console.log("Total keys:", Object.keys(obj).length);
console.log("Kaplin related keys:", Object.keys(obj).filter(k => k.includes('kaplin')));

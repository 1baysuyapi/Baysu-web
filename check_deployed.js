const fs = require('fs');
const d = fs.readFileSync('data_downloaded.js', 'utf8');
const m = /"depo-rekorlari\.html"\s*:\s*"([^"]+)"/.exec(d);
if(m) {
    console.log(Buffer.from(m[1], 'base64').toString('utf8').substring(0, 500));
} else {
    console.log("depo-rekorlari.html not found in data_downloaded.js");
}

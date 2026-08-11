const fs = require('fs');
const d = fs.readFileSync('data.js', 'utf8');

const route = '/ayarli-hortum-eki';
const regex = new RegExp(`"${route}"\\s*:\\s*"([^"]+)"`);
const match = regex.exec(d);

if (match) {
    console.log('Found!');
    try {
        const html = Buffer.from(match[1], 'base64').toString('utf8');
        console.log('Starts with:', html.substring(0, 100));
        console.log(html.indexOf('<main>') > -1 ? 'Has <main>' : 'No <main>');
    } catch(e) {
        console.log('Error decoding');
    }
} else {
    console.log('Not found');
}

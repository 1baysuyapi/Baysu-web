const fs = require('fs');

const lines = fs.readFileSync('C:\\Users\\kopya\\.gemini\\antigravity\\brain\\5b65de7e-3520-43cc-aea5-0c5df34631d3\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');

for (let line of lines) {
    if (!line.trim()) continue;
    try {
        const parsed = JSON.parse(line);
        if (parsed.type === 'MODEL_RESPONSE' && parsed.content && parsed.content.includes('1/2" Ayarl')) {
            console.log(parsed.content.replace(/\\n/g, '\n'));
        }
    } catch (e) {}
}

const { execSync } = require('child_process');
const fs = require('fs');

try {
    const gitCmd = '"C:\\Program Files\\Microsoft Visual Studio\\18\\Community\\Common7\\IDE\\CommonExtensions\\Microsoft\\TeamFoundation\\Team Explorer\\Git\\cmd\\git.exe"';
    
    // Capture as buffer to preserve raw UTF-8 encoding
    const oldBuffer = execSync(`${gitCmd} show d2f57f3:data.js`, { maxBuffer: 50 * 1024 * 1024 });
    const oldText = oldBuffer.toString('utf8');
    
    let currentText = fs.readFileSync('data.js', 'utf8');

    const parseCode = (code) => {
        const obj = {};
        const lines = code.split('\n');
        for (let line of lines) {
            let match = line.match(/^\s*"([^"]+)"\s*:\s*"([^"]+)",?\s*$/);
            if (match) {
                obj[match[1]] = match[2];
            }
        }
        return obj;
    };

    const currentObj = parseCode(currentText);
    const oldObj = parseCode(oldText);

    const categoriesToRestore = [
        'kaplin', 'mavi', 'siyah', 'kilitli', 'priz-kolye', 'nipel', 'dirsek', 'vana', 'te', 'manson', 'tapa', 'reduksiyon', 'abot-ustu', 'disi-', 'erkek-', 'disli-', 'kanalli-', 'ozel-depo', 'sintine', 'pvc-', 'rainbird', 'klepe', 'tabanca', 'o-ring', 'hortum-rekor', 'hortum-ekipman', 'cikis-mini'
    ];

    let mergedObj = { ...currentObj };

    for (const key of Object.keys(oldObj)) {
        if (key.includes('index') || key.includes('bahce') || key.includes('admin') || key.includes('hakkimda')) {
            continue;
        }

        const isTarget = categoriesToRestore.some(cat => key.includes(cat));
        
        if (isTarget) {
            mergedObj[key] = oldObj[key];
        }
    }

    let newCode = "const pagesData = {\n";
    for (const key of Object.keys(mergedObj)) {
        newCode += `    "${key}": "${mergedObj[key]}",\n`;
    }
    newCode += "};\n";

    fs.writeFileSync('data.js', newCode);
    console.log('Saved to data.js');
} catch (e) {
    console.error(e);
}

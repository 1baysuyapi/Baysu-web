const fs = require('fs');
const path = require('path');

const sourceDir = "C:\\Users\\kopya\\Pictures\\ÜZÜMCÜ\\Depo Rekorları";
const destDir = path.join(__dirname, "resimler", "depo_rekorlari");

const fileMap = {
    "Çift Taraflı Depo Rekoru.png": "cift_tarafli_depo_rekoru.png",
    "Depo Rekoru.png": "depo_rekoru_ters_dis.png",
    "Sintine.png": "sintine_rekoru_ters_dis.png",
    "PVC Hortum Rekoru.png": "pvc_hortum_rekoru.png",
    "Galvanizli Hortum Rekoru.png": "galvanizli_hortum_rekoru.png",
    "Özel Depo Rekoru.png": "ozel_depo_rekoru.png"
};

for (const [srcName, destName] of Object.entries(fileMap)) {
    const srcPath = path.join(sourceDir, srcName);
    const destPath = path.join(destDir, destName);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcName} -> ${destName}`);
    } else {
        console.error(`Source not found: ${srcPath}`);
    }
}

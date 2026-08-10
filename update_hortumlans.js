const fs = require('fs');

try {
    // Copy the images
    const img1_src = "C:\\Users\\kopya\\.gemini\\antigravity\\brain\\cec9ad03-69a3-400e-b131-17f3064bf4cc\\.user_uploaded\\media_1786199382941.png";
    const img1_dest = "resimler/bahce_ekipmanlari/Hortum_Lansi_1-2_5-8.png";
    fs.copyFileSync(img1_src, img1_dest);

    const img2_src = "C:\\Users\\kopya\\.gemini\\antigravity\\brain\\cec9ad03-69a3-400e-b131-17f3064bf4cc\\.user_uploaded\\media_1786199424613.png";
    const img2_dest = "resimler/bahce_ekipmanlari/Hortum_Lansi_3-4_1.png";
    fs.copyFileSync(img2_src, img2_dest);

    // Update HTML
    let html = fs.readFileSync('bahce_edit.html', 'utf8');

    html = html.replace(
        /(data-name="Hortum Lans[ı]\s*1\/2(?:&quot;|")\s*-\s*5\/8(?:&quot;|")"[^>]*>[\s\S]*?)<img[^>]*>/i,
        '$1<img src="resimler/bahce_ekipmanlari/Hortum_Lansi_1-2_5-8.png" alt="1/2 - 5/8 Hortum Lansı" onerror="this.src=\'resimler/placeholder.png\'">'
    );

    html = html.replace(
        /(data-name="Hortum Lans[ı]\s*3\/4(?:&quot;|")\s*-\s*1(?:&quot;|")"[^>]*>[\s\S]*?)<img[^>]*>/i,
        '$1<img src="resimler/bahce_ekipmanlari/Hortum_Lansi_3-4_1.png" alt="3/4 - 1 Hortum Lansı" onerror="this.src=\'resimler/placeholder.png\'">'
    );

    fs.writeFileSync('bahce_edit.html', html);

    // Update data.js
    const dataCode = fs.readFileSync('data.js', 'utf8');
    const routeRegex = /("bahce-ekipmanlari\.html":\s*")([^"]+)(")/;
    const newBase64 = Buffer.from(html, 'utf8').toString('base64');
    const newDataCode = dataCode.replace(routeRegex, (match, p1, p2, p3) => p1 + newBase64 + p3);
    fs.writeFileSync('data.js', newDataCode);

    console.log("Hortum Lansı images updated successfully.");
} catch (e) {
    console.error(e);
}

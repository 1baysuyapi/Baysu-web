$categories = @(
    @{ DirName = "bahce-ekipmanlari"; Title = "Bahçe Ekipmanları"; BaseCode = 129 },
    @{ DirName = "depo-rekorlari"; Title = "Depo Rekorları"; BaseCode = 200 },
    @{ DirName = "hortum-ek-parcalari"; Title = "Hortum Ek Parçaları"; BaseCode = 300 },
    @{ DirName = "musluk-jaki"; Title = "Musluk Jakı Ve Rekorları"; BaseCode = 400 }
)

foreach ($cat in $categories) {
    $dirName = $cat.DirName
    $title = $cat.Title
    $currentCode = $cat.BaseCode
    
    $imagesDir = Join-Path -Path "images/bahce" -ChildPath $dirName
    if (-not (Test-Path $imagesDir)) {
        Write-Host "Directory not found: $imagesDir"
        continue
    }
    
    $files = Get-ChildItem -Path $imagesDir -File | Where-Object { $_.Extension -match "\.(png|jpg|jpeg)$" } | Sort-Object Name
    
    $html = @"
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$title - BAYRAKÇI SULAMA VE YAPI MALZEMELERİ</title>
<script src="security.js"></script>
<script src="data.js?v=1019"></script>
<script src="site-engine.js?v=1019"></script>
<style>
/* Grid Styles */
.image-product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    padding: 20px;
}
.image-product-card {
    border: 1px solid #dce4ec;
    border-radius: 8px;
    background: #fff;
    position: relative;
    overflow: visible;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.image-product-card:hover {
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    border-color: #92b0d2;
    z-index: 10;
}
.ipc-code {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #003f88;
    color: #fff;
    font-weight: bold;
    font-size: 13px;
    padding: 4px 8px;
    border-radius: 4px;
    z-index: 2;
}
.ipc-img-container {
    height: 220px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 8px 8px 0 0;
}
.ipc-img-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
.ipc-bottom {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #dce4ec;
    background: #fff;
    border-radius: 0 0 8px 8px;
    position: relative;
    z-index: 3;
}
.ipc-title {
    padding: 15px;
    font-size: 15px;
    font-weight: 800;
    color: #1a202c;
}
.ipc-details {
    display: none;
    flex-direction: column;
    background: #f8fbff;
    border-radius: 0 0 8px 8px;
    padding-bottom: 15px;
    border: 1px solid #92b0d2;
    border-top: none;
    margin: 0 -1px -1px -1px;
}
.image-product-card:hover .ipc-bottom {
    position: absolute;
    top: 220px;
    left: -1px;
    right: -1px;
    border-color: #92b0d2;
    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}
.image-product-card:hover .ipc-details {
    display: flex;
}
.ipc-price-bar {
    background: #f0f7ff;
    color: #003f88;
    font-size: 17px;
    font-weight: 900;
    text-align: center;
    padding: 12px;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 10px;
}
.ipc-info-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 15px;
    font-size: 14px;
    color: #4a5568;
    font-weight: 600;
}
.ipc-info-row strong {
    color: #1a202c;
    font-weight: 800;
}
.ipc-action-row {
    display: flex;
    padding: 15px 15px 0 15px;
    gap: 10px;
}
.ipc-qty-selector {
    display: flex;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
    height: 38px;
    width: 85px;
    background: #f8fafc;
}
.ipc-qty-btn {
    background: transparent;
    border: none;
    color: #003f88;
    font-weight: 900;
    font-size: 16px;
    width: 30px;
    cursor: pointer;
}
.ipc-qty-btn:hover {
    background: #e2e8f0;
}
.ipc-qty-input {
    width: 25px;
    border: none;
    background: transparent;
    text-align: center;
    font-weight: 800;
    font-size: 15px;
    color: #1a202c;
    -moz-appearance: textfield;
}
.ipc-qty-input::-webkit-outer-spin-button,
.ipc-qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.ipc-add-btn {
    flex: 1;
    background: #004595;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background 0.2s;
}
.ipc-add-btn:hover {
    background: #002d62;
}
</style>
<script>
function changeIpcQty(btn, delta) {
    const input = btn.parentElement.querySelector('.ipc-qty-input');
    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    input.value = val;
}
function getIpcQty(btn) {
    const input = btn.parentElement.parentElement.querySelector('.ipc-qty-input');
    return parseInt(input.value) || 1;
}
</script>
</head>
<body oncontextmenu="return false;" onselectstart="return false;" ondragstart="return false;">

    <main class="page-content">
        <div class="breadcrumb">
            <a href="index.html">Ana Sayfa</a> &gt; <span>Bahçe Sulama Sistemleri</span> &gt; <span>$title</span>
        </div>

        <section class="products-section">
            <h1 class="section-title">$title</h1>
            <div class="image-product-grid">
"@

    foreach ($file in $files) {
        $productName = $file.BaseName
        $fileNameEncoded = [System.Uri]::EscapeDataString($file.Name)
        $imgUrlEncoded = "images/bahce/$dirName/$fileNameEncoded"
        
        $price = "50.00"
        $koli = 100
        $ambalaj = "Paket"
        
        $productNameEscaped = $productName -replace "'", "\'"
        
        $html += @"
                <div class="image-product-card">
                    <div class="ipc-code">$currentCode</div>
                    <div class="ipc-img-container">
                        <img src="$imgUrlEncoded" alt="$productName" loading="lazy">
                    </div>
                    <div class="ipc-bottom">
                        <div class="ipc-title">$productName</div>
                        <div class="ipc-details">
                            <div class="ipc-price-bar">$price ₺</div>
                            <div class="ipc-info-row">
                                <span>Koli Adedi:</span>
                                <strong>$koli</strong>
                            </div>
                            <div class="ipc-info-row">
                                <span>Ambalaj:</span>
                                <strong>$ambalaj</strong>
                            </div>
                            
                            <div class="ipc-action-row">
                                <div class="ipc-qty-selector">
                                    <button class="ipc-qty-btn minus" onclick="changeIpcQty(this, -1)">-</button>
                                    <input type="number" value="1" min="1" class="ipc-qty-input">
                                    <button class="ipc-qty-btn plus" onclick="changeIpcQty(this, 1)">+</button>
                                </div>
                                <button class="ipc-add-btn" onclick="if(window.baysuAddToCartImageProduct) window.baysuAddToCartImageProduct('Ü$currentCode', '$productNameEscaped', $price, $koli, '$ambalaj', getIpcQty(this))">
                                    <i class="fas fa-shopping-cart"></i> Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
"@
        $currentCode++
    }

    $html += @"
            </div>
        </section>
    </main>

</body>
</html>
"@

    $outPath = "$dirName.html"
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $outPath), $html, [System.Text.Encoding]::UTF8)
    Write-Host "Generated $outPath with $($files.Count) products."
}

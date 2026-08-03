$html = Get-Content bahce_extracted.html -Raw -Encoding UTF8

# 1. Fix Product Card Overflow
$html = $html -replace 'overflow:\s*hidden;\s*(/\*\s*product-card\s*\*/)?\s*(?=margin-bottom|})', 'overflow: visible;'
$html = $html -replace 'position:\s*relative;\s*overflow:\s*hidden;', "position: relative;`r`n        overflow: visible;"

# 2. Fix cart-action-row margin
$html = $html -replace 'margin-bottom:\s*5px;', 'margin-bottom: 0px;'
# Add z-index to btn-add-to-cart to make sure it's clickable
$html = $html -replace '\.btn-add-to-cart \{', ".btn-add-to-cart { z-index: 5; position: relative;"


# 3. Restructure Hero Section
# We need to insert the new hero section right after the <style> tag ends
$newHeroHtml = @"
    <div class="page-header" style="text-align: center; margin: 30px 0 15px 0;">
        <h1 style="font-size: 2.8rem; color: #004797; margin-bottom: 10px; font-weight: 800; letter-spacing: -0.5px;">Bahçe Ekipmanları</h1>
        <p style="font-size: 1.15rem; color: #475569; max-width: 800px; margin: 0 auto;">Bahçenizin ihtiyacı olan en kaliteli sulama ekipmanları, el süzekleri, vana kutuları ve can suyu vanaları tek bir yerde.</p>
    </div>

    <div class="hero-slider-container" style="position: relative; width: 100%; height: 400px; border-radius: 12px; overflow: hidden; margin: 25px 0 45px 0; box-shadow: 0 15px 35px rgba(0,0,0,0.15);">
        <div class="hero-slider" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;">
            <div class="hero-slide" style="background-image: url('https://images.unsplash.com/photo-1585320806297-9794b3e4ce88?auto=format&fit=crop&q=80'); animation-delay: 0s;"></div>
            <div class="hero-slide" style="background-image: url('https://images.unsplash.com/photo-1416879598555-220b332bc6e7?auto=format&fit=crop&q=80'); animation-delay: 4s;"></div>
            <div class="hero-slide" style="background-image: url('https://images.unsplash.com/photo-1592424001815-5188f615555c?auto=format&fit=crop&q=80'); animation-delay: 8s;"></div>
            <div class="hero-slide" style="background-image: url('https://images.unsplash.com/photo-1558904541-efa843a96f0f?auto=format&fit=crop&q=80'); animation-delay: 12s;"></div>
        </div>
    </div>
"@

# Replace the old hero banner and its CSS
$html = $html -replace '(?s)\.hero-banner\s*\{.*?\}', ''
$html = $html -replace '(?s)\.hero-banner::before\s*\{.*?\}', ''
$html = $html -replace '(?s)<div class="hero-banner">.*?</div>', $newHeroHtml

# 4. Make sure animation keyframes are robust
$newSliderCSS = @"
    .hero-slide {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        background-size: cover;
        background-position: center;
        animation: slide-fade 16s infinite;
    }
    @keyframes slide-fade {
        0%, 100% { opacity: 0; }
        5%, 25% { opacity: 1; }
        30% { opacity: 0; }
    }
"@
# Append new CSS
$html = $html -replace '(?s)</style>', "`r`n$newSliderCSS`r`n</style>"

Set-Content -Path bahce_extracted.html -Value $html -Encoding UTF8
Write-Host "bahce_extracted.html updated successfully."

# Now rebuild the payload and update data.js
$newBytes = [System.Text.Encoding]::UTF8.GetBytes($html)
$newB64 = [System.Convert]::ToBase64String($newBytes)

$c = Get-Content data.js -Raw -Encoding UTF8
$finalJs = $c.Substring(0, $c.IndexOf('{')) + ($c.Substring($c.IndexOf('{'), $c.LastIndexOf('}') - $c.IndexOf('{') + 1) -replace '"bahce-ekipmanlari\.html"\s*:\s*"[^"]*"', "`"bahce-ekipmanlari.html`": `"$newB64`"") + $c.Substring($c.LastIndexOf('}') + 1)

Set-Content -Path "data.js" -Value $finalJs -Encoding UTF8
Write-Host "Updated data.js with layout fixes!"

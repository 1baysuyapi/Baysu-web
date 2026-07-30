$css = Get-Content 'cart.css' -Raw -Encoding UTF8

# Fix the 320px width for product image (from baysu-new-product-layout-css)
$css = $css -replace 'flex: 0 0 320px !important;', 'flex: none !important;'
$css = $css -replace 'width: 320px !important;', 'width: 100% !important;'

# Ensure product image is centered in baysu-new-product-layout-css
$css = $css -replace 'position: sticky !important;', 'display: flex !important; justify-content: center !important; align-items: center !important;'
$css = $css -replace 'top: 100px !important;', ''

# Fix the 38% width for landscape media query (from baysu-final-bulletproof-css)
$css = $css -replace 'flex: 0 0 38% !important;', 'flex: none !important;'
$css = $css -replace 'width: 38% !important;', 'width: 100% !important;'
$css = $css -replace 'max-width: 38% !important;', 'max-width: 100% !important;'

# Ensure the product-info is 100% width in landscape
$css = $css -replace 'flex: 1 1 55% !important;', 'flex: none !important; width: 100% !important;'

Set-Content 'cart.css' -Value $css -Encoding UTF8
Write-Host "Fixed cart.css layout widths."

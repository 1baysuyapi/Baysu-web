$content = Get-Content 'cart.css' -Raw -Encoding UTF8
$content = $content -replace '(?s)<script.*?</script>', ''
Set-Content 'cart.css' -Value $content -Encoding UTF8
Write-Host "Removed all script tags from cart.css"

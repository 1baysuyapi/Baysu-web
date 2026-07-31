$content = Get-Content 'index.html' -Raw -Encoding UTF8
$content = $content -replace 'cart\.css\?v=\d+', 'cart.css?v=1017'
$content = $content -replace 'cart\.js\?v=\d+', 'cart.js?v=1017'
Set-Content 'index.html' -Value $content -Encoding UTF8
Write-Host "Updated cart.js and cart.css to v1017"

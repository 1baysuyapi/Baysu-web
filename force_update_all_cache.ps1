$htmlFiles = Get-ChildItem -Filter '*.html'
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace 'site-engine\.js\?v=\d+', 'site-engine.js?v=1019'
    $newContent = $newContent -replace 'data\.js\?v=\d+', 'data.js?v=1019'
    $newContent = $newContent -replace 'cart\.js\?v=\d+', 'cart.js?v=1019'
    Set-Content $file.FullName -Value $newContent -NoNewline
}
Write-Host "Updated all HTML files to v1019"

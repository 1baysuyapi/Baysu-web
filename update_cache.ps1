$htmlFiles = Get-ChildItem -Filter '*.html'
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $newContent = $content -replace 'data\.js\?v=\d+', 'data.js?v=1003'
    Set-Content $file.FullName -Value $newContent -Encoding UTF8
}
Write-Host "Updated data.js cache version in all HTML files."

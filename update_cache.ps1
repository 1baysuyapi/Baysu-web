$newVersion = "1017"
$files = @(
    "index.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace 'data\.js\?v=\d+', "data.js?v=$newVersion"
        $content = $content -replace 'cart\.js\?v=\d+', "cart.js?v=$newVersion"
        $content = $content -replace 'cart\.css\?v=\d+', "cart.css?v=$newVersion"
        $content = $content -replace 'site-engine\.js\?v=\d+', "site-engine.js?v=$newVersion"
        Set-Content -Path $file -Value $content -NoNewline
    }
}

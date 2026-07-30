$files = Get-ChildItem -Path . -Filter "*.html"
$count = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $newContent = $content -replace " defer></script>", "></script>"
    
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
        $count++
    }
}

Write-Host "Fixed $count files."

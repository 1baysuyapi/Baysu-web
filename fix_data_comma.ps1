$content = Get-Content 'data.js' -Raw
$content = $content -replace ',\s*\}', "`n};"
[System.IO.File]::WriteAllText('data.js', $content, [System.Text.Encoding]::UTF8)
Write-Host "Fixed trailing comma in data.js"

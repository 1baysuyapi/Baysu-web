$c = Get-Content 'data.js' -Raw
$c = $c -replace '\};\s*;\s*$', '};'
[System.IO.File]::WriteAllText('data.js', $c, [System.Text.Encoding]::UTF8)
Write-Host "Fixed double semicolon"

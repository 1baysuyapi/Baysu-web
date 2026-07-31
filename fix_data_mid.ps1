$c = Get-Content 'data.js' -Raw
$c = $c -replace "`r`n};`r`n", "`r`n,`r`n"
$c = $c -replace "`n};`n", "`n,`n"
[System.IO.File]::WriteAllText('data.js', $c, [System.Text.Encoding]::UTF8)
Write-Host "Fixed!"

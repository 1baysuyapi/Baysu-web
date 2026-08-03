$content = Get-Content data.js -Raw
$content.Substring(0, 150) | Write-Host

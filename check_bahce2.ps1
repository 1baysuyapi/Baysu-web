$content = Get-Content data.js -Raw
$content.Split("`"") | Where-Object { $_ -match 'bahce-ekipmanlari' } | Select-Object -First 5 | Write-Host

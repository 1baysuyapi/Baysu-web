$content = Get-Content data.js -Raw
if ($content -match 'bahce-ekipmanlari') {
    Write-Host 'Found bahce-ekipmanlari'
} else {
    Write-Host 'Not Found'
}

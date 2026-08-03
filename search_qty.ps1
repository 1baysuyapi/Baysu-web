$content = Get-Content data.js -Raw
if ($content -match 'incrementQty') {
    Write-Host 'incrementQty Found in data.js'
} else {
    Write-Host 'incrementQty Not Found in data.js'
}
if ($content -match 'decrementQty') {
    Write-Host 'decrementQty Found in data.js'
} else {
    Write-Host 'decrementQty Not Found in data.js'
}

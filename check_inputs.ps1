$content = Get-Content decoded_data.html -Raw
$matches = ([regex]'(?s)<div class="qty-stepper">.*?</div>').Matches($content)
$invalidCount = 0
foreach ($m in $matches) {
    $div = $m.Value
    if ($div -match 'incrementQty') {
        if (-not ($div -match '<input')) {
            Write-Host "Found missing input in div:"
            Write-Host $div
            $invalidCount++
        }
    }
}
Write-Host "Total invalid divs: $invalidCount"

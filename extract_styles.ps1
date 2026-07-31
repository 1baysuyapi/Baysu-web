$content = Get-Content 'build_bahce.ps1' -Raw
$start = $content.IndexOf('<style>')
$end = $content.IndexOf('</style>')
if ($start -ge 0 -and $end -gt $start) {
    $styles = $content.Substring($start + 7, $end - $start - 7)
    Add-Content -Path 'cart.css' -Value $styles
    Write-Host "Styles added to cart.css"
} else {
    Write-Host "Styles not found"
}

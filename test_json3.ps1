$content = Get-Content 'data.js' -Raw
$start = $content.IndexOf('{')
$end = $content.LastIndexOf('}')
$json = $content.Substring($start, $end - $start + 1)
try {
    $obj = ConvertFrom-Json $json
    Write-Host 'SUCCESS'
} catch {
    Write-Host 'ERROR'
    Write-Host $_.Exception.Message
}

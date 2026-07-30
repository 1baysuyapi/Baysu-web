$data = Get-Content 'data.js' -Raw
$match = [regex]::Match($data, '"mavi-erkek-kaplin\.html"\s*:\s*"([^"]+)"')
if ($match.Success) {
    $b64 = [System.Uri]::UnescapeDataString($match.Groups[1].Value)
    $bytes = [System.Convert]::FromBase64String($b64)
    $html = [System.Text.Encoding]::UTF8.GetString($bytes)
    Set-Content 'mavi_decoded.html' $html
    Write-Host 'Decoded'
} else {
    Write-Host 'Not found'
}

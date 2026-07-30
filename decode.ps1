$content = Get-Content 'data.js' -Raw -Encoding UTF8
if ($content -match '"mavi-disi-kaplin\.html":\s*"([^"]+)"') {
    $b64 = $matches[1]
    $bytes = [System.Convert]::FromBase64String($b64)
    $html = [System.Text.Encoding]::UTF8.GetString($bytes)
    Set-Content 'temp.html' -Value $html -Encoding UTF8
    Write-Host "Decoded temp.html"
}

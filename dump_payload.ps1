$dataJsContent = Get-Content "data.js" -Raw
$pattern = '("mavi-disi-kaplin.html"\s*:\s*")([^"]+)(")'
$match = [regex]::Match($dataJsContent, $pattern)
if ($match.Success) {
    $b64 = $match.Groups[2].Value
    $bytes = [System.Convert]::FromBase64String($b64)
    $html = [System.Text.Encoding]::UTF8.GetString($bytes)
    Set-Content -Path "test_payload.html" -Value $html -Encoding UTF8
    Write-Host "Payload dumped to test_payload.html"
} else {
    Write-Host "Could not find payload."
}

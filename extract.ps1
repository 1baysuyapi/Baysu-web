$dataJsContent = Get-Content 'data.js' -Raw -Encoding UTF8
$pattern = '("mavi-disi-kaplin\.html"\s*:\s*")([^"]+)(")'
$match = [regex]::Match($dataJsContent, $pattern)
if ($match.Success) {
    $b64 = $match.Groups[2].Value
    $bytes = [System.Convert]::FromBase64String($b64)
    $html = [System.Text.Encoding]::UTF8.GetString($bytes)
    Set-Content 'extracted.html' -Value $html -Encoding UTF8
}

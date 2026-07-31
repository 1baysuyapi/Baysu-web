$dataJsContent = Get-Content 'data.js' -Raw
$lines = $dataJsContent -split "`n"
foreach ($line in $lines) {
    if ($line -match '^\s*"([^"]+\.html)"\s*:\s*"([^"]+)"(,?)\s*$') {
        $b64 = $matches[2]
        $bytes = [System.Convert]::FromBase64String($b64)
        $html = [System.Text.Encoding]::UTF8.GetString($bytes)
        if ($html -match 'KAPLİNLER') {
            Write-Host "SUCCESS: Characters are correct."
        } elseif ($html -match 'KAPL') {
            Write-Host "FAILED: Found corrupted characters near KAPL."
        } else {
            Write-Host "Could not find KAPL string."
        }
        break
    }
}

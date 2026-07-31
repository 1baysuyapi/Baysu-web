$dataJsContent = Get-Content 'data.js' -Raw
$lines = $dataJsContent -split "`n"
foreach ($line in $lines) {
    if ($line -match '^\s*"([^"]+\.html)"\s*:\s*"([^"]+)"(,?)\s*$') {
        $b64 = $matches[2]
        $bytes = [System.Convert]::FromBase64String($b64)
        $html = [System.Text.Encoding]::UTF8.GetString($bytes)
        
        $matches = [regex]::Matches($html, 'KAPL.{0,30}')
        foreach ($m in $matches) {
            Write-Host $m.Value
        }
        break
    }
}

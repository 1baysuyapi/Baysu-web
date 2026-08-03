$content = Get-Content data.js -Raw
$content = $content -replace '^window\.PAGE_DATA\s*=\s*', ''
$content = $content -replace ';$', ''
$data = $content | ConvertFrom-Json
$output = ""
foreach ($key in $data.PSObject.Properties.Name) {
    $b64 = $data.$key
    try {
        $bytes = [Convert]::FromBase64String($b64)
        $html = [System.Text.Encoding]::UTF8.GetString($bytes)
        $output += "`n`n=== $key ===`n`n"
        $output += $html
    } catch { }
}
Set-Content -Path decoded_data.html -Value $output -Encoding UTF8

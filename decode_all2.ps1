$content = Get-Content data.js -Raw
$matches = ([regex]'(?s)"([^"]+\.html)"\s*:\s*"([^"]+)"').Matches($content)
$output = ""
foreach ($m in $matches) {
    $key = $m.Groups[1].Value
    $b64 = $m.Groups[2].Value
    try {
        $bytes = [Convert]::FromBase64String($b64)
        $html = [System.Text.Encoding]::UTF8.GetString($bytes)
        $output += "`n`n=== $key ===`n`n"
        $output += $html
    } catch {}
}
Set-Content -Path decoded_data.html -Value $output -Encoding UTF8

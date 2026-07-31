$c = Get-Content 'data.js' -Raw
$m = [regex]::Match($c, '"mavi-disi-kaplin\.html"\s*:\s*"([^"]+)"')
if ($m.Success) {
    $b64 = $m.Groups[1].Value
    $bytes = [System.Convert]::FromBase64String($b64)
    $html = [System.Text.Encoding]::UTF8.GetString($bytes)
    [System.IO.File]::WriteAllText('test_output.html', $html, [System.Text.Encoding]::UTF8)
    Write-Host "Wrote to test_output.html"
} else {
    Write-Host "Not found"
}

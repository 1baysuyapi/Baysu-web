$content = Get-Content 'data.js' -Raw
$m = [regex]::Match($content, '"mavi-disi-kaplin.html"\s*:\s*"([^"]+)"')
if ($m.Success) {
    $bytes = [System.Convert]::FromBase64String($m.Groups[1].Value)
    [System.IO.File]::WriteAllBytes("dump.html", $bytes)
    Write-Host "Dumped to dump.html"
}

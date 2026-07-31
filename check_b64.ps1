$content = Get-Content 'data.js' -Raw
$m = [regex]::Match($content, '"mavi-disi-kaplin.html"\s*:\s*"([^"]+)"')
if ($m.Success) {
    $html = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($m.Groups[1].Value))
    Write-Host "DECODED HTML LENGTH: $($html.Length)"
    Write-Host "FIRST 300 CHARS:"
    Write-Host $html.Substring(0, [Math]::Min(300, $html.Length))
    Write-Host "MAIN COUNT: $( ([regex]::Matches($html, '<main class="page-content">')).Count )"
    Write-Host "END MAIN COUNT: $( ([regex]::Matches($html, '</main>')).Count )"
} else {
    Write-Host "Not found"
}

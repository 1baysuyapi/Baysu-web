$c = Get-Content data.js -Raw -Encoding UTF8
$jsonStr = $c.Substring($c.IndexOf('{'), $c.LastIndexOf('}') - $c.IndexOf('{') + 1)
$obj = ConvertFrom-Json $jsonStr
$b64 = $obj.'bahce-ekipmanlari.html'
$bytes = [System.Convert]::FromBase64String($b64)
$html = [System.Text.Encoding]::UTF8.GetString($bytes)

if ($html -match 'onclick=') { 
    Write-Host 'Still has onclick!' 
} else { 
    Write-Host 'NO ONCLICK' 
}

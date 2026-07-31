$content = Get-Content 'data.js' -Raw
$start = $content.IndexOf('{')
$end = $content.LastIndexOf('}')
$json = $content.Substring($start, $end - $start + 1)
$lines = $json -split "`n"
$currentJson = "{"
for ($i = 1; $i -lt $lines.Count - 1; $i++) {
    $line = $lines[$i].Trim()
    if ($line.EndsWith(',')) {
        $testJson = "{" + $line.Substring(0, $line.Length - 1) + "}"
    } else {
        $testJson = "{" + $line + "}"
    }
    
    try {
        $obj = ConvertFrom-Json $testJson
    } catch {
        Write-Host "Error at line $($i + 1): $line"
        Write-Host $_.Exception.Message
        break
    }
}
Write-Host "Done"

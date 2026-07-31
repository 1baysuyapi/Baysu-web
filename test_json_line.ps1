$content = Get-Content 'data.js' -Raw
$content = $content -replace '^window\.PAGE_DATA\s*=\s*', ''
$content = $content -replace ';\s*$', ''

$lines = $content -split "`n"
$validJson = "{"
for ($i = 1; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($line.Trim() -eq "}") { break }
    
    $testJson = $validJson + "`n" + $line + "`n}"
    try {
        $null = ConvertFrom-Json $testJson
        $validJson += "`n" + $line
    } catch {
        Write-Host "ERROR ON LINE $($i + 1)"
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($line)
        Write-Host "Line byte length: $($bytes.Length)"
        Write-Host "Line starts with: $($line.Substring(0, [Math]::Min(20, $line.Length)))"
        break
    }
}

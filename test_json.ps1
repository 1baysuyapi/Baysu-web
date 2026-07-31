$content = Get-Content 'data.js' -Raw
$content = $content -replace '^window\.PAGE_DATA\s*=\s*', ''
$content = $content -replace ';\s*$', ''

try {
    $json = ConvertFrom-Json $content
    Write-Host "Parsed successfully. Keys: $($json.psobject.properties.name.Count)"
} catch {
    Write-Host "JSON Parse Error: $_"
}

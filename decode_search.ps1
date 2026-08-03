$content = Get-Content data.js -Raw
$content = $content -replace '^window\.PAGE_DATA\s*=\s*', ''
$content = $content -replace ';$', ''
$data = $content | ConvertFrom-Json
$found = $false
foreach ($key in $data.PSObject.Properties.Name) {
    $b64 = $data.$key
    try {
        $bytes = [Convert]::FromBase64String($b64)
        $html = [System.Text.Encoding]::UTF8.GetString($bytes)
        if ($html -match 'incrementQty') {
            Write-Host "Found incrementQty in $key"
            $found = $true
        }
    } catch {
        Write-Host "Failed to decode $key"
    }
}
if (-not $found) {
    Write-Host "incrementQty not found anywhere in decoded base64"
}

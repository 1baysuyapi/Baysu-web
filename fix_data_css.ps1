$ErrorActionPreference = 'Stop'

# Load data.js
$dataPath = "C:\Users\kopya\Documents\GitHub\Baysu-web\data.js"
$content = Get-Content $dataPath -Raw

# data.js starts with 'window.PAGE_DATA = ' and might end with ';'
$jsonStr = $content -replace '^window\.PAGE_DATA\s*=\s*', ''
$jsonStr = $jsonStr -replace ';\s*$', ''

# Convert from JSON to PowerShell object
$data = $jsonStr | ConvertFrom-Json

# Iterate and replace
$properties = $data.psobject.properties
foreach ($prop in $properties) {
    $base64 = $prop.Value
    
    # Decode base64 to string
    $bytes = [System.Convert]::FromBase64String($base64)
    $html = [System.Text.Encoding]::UTF8.GetString($bytes)
    
    # Perform regex replacements for CSS
    $html = $html -replace '(?s)@media\s*\(min-width:\s*769px\)\s*\{\s*\.nav-links\s*\{\s*display:\s*flex;\s*\}', '@media (min-width: 769px) { .nav-links { display: flex; width: 100%; justify-content: center; }'
    $html = $html -replace '(?s)\.nav-content\s*\{\s*justify-content:\s*space-between;\s*\}', '.nav-content { justify-content: center; }'
    
    # Re-encode to base64
    $newBytes = [System.Text.Encoding]::UTF8.GetBytes($html)
    $newBase64 = [System.Convert]::ToBase64String($newBytes)
    
    # Update property
    $prop.Value = $newBase64
}

# Convert back to JSON
$newJson = $data | ConvertTo-Json -Depth 100 -Compress
$finalContent = "window.PAGE_DATA = $newJson;"

# Write back to data.js
[System.IO.File]::WriteAllText($dataPath, $finalContent, [System.Text.Encoding]::UTF8)

Write-Host "Replaced CSS in data.js!"

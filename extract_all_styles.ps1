$content = Get-Content 'test_payload.html' -Raw -Encoding UTF8
$startIdx = $content.IndexOf('<style id="baysu-orig-ui-style">')
$endIdx = $content.IndexOf('</style>', $content.IndexOf('<style id="baysu-accordion-css">'))

$stylesText = $content.Substring($startIdx, $endIdx - $startIdx + 8)

# Strip out <style...> and </style> tags
$stylesText = $stylesText -replace '(?i)<style[^>]*>', ''
$stylesText = $stylesText -replace '(?i)</style>', ''

# Remove the flex-direction: row override for landscape desktop
$stylesText = $stylesText -replace 'flex-direction:\s*row\s*!important;', 'flex-direction: column !important;'

Set-Content 'extracted_styles.css' -Value $stylesText -Encoding UTF8
Write-Host "Extracted styles successfully."

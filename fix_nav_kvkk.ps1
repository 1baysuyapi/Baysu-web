$content = Get-Content 'cart.css' -Raw -Encoding UTF8

# Remove .nav-bar, .top-nav-bar, .nav-content blocks
$content = $content -replace '(?s)(?:/\*[^*]*\*+(?:[^/*][^*]*\*+)*/\s*)?\.nav-bar\s*\{[^}]*\}', ''
$content = $content -replace '(?s)(?:/\*[^*]*\*+(?:[^/*][^*]*\*+)*/\s*)?\.top-nav-bar\s*\{[^}]*\}', ''
$content = $content -replace '(?s)(?:/\*[^*]*\*+(?:[^/*][^*]*\*+)*/\s*)?\.nav-content\s*\{[^}]*\}', ''
$content = $content -replace '(?s)@media\s*\([^{]+\)\s*\{\s*\}', '' # clean up empty media queries

# Fix KVKK modal scrolling
$content = $content -replace '(\.kvkk-modal-content\s*\{[^}]*)(\})', "`$1    max-height: 80vh !important;`n    overflow-y: auto !important;`n`$2"

Set-Content 'cart.css' -Value $content -Encoding UTF8
Write-Host "Cleaned up nav styles and fixed KVKK scrolling in cart.css"

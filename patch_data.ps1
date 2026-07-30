$dataJsPath = "data.js"
$indexHtml = Get-Content "index.html" -Raw

# Extract the <header> and <nav> block from index.html
$headerRegex = [regex]'(?s)(<header class="header-main">.*?</nav>)'
$headerMatch = $headerRegex.Match($indexHtml)
if (!$headerMatch.Success) {
    Write-Host "Failed to find header/nav in index.html"
    exit 1
}
$newHeaderHtml = $headerMatch.Groups[1].Value

# Extract the CSS block from index.html (we want the part starting from .header-main)
$cssRegex = [regex]'(?s)(\.header-main \{.*?</style>)'
$cssMatch = $cssRegex.Match($indexHtml)
if (!$cssMatch.Success) {
    Write-Host "Failed to find new CSS in index.html"
    exit 1
}
# We don't include </style> in the replacement, we'll put it back
$newCssHtml = $cssMatch.Groups[1].Value.Replace("</style>", "")

Write-Host "Extracted new header and CSS."

# Read data.js
$dataJsContent = Get-Content $dataJsPath -Raw

# We need to replace the content for each product in data.js
$pattern = '("[\w-]+\.html"\s*:\s*")([^"]+)(")'
$count = 0

$newDataJsContent = [regex]::Replace($dataJsContent, $pattern, {
    param($match)
    
    $prefix = $match.Groups[1].Value
    $b64 = $match.Groups[2].Value
    $suffix = $match.Groups[3].Value
    
    try {
        $bytes = [System.Convert]::FromBase64String($b64)
        $html = [System.Text.Encoding]::UTF8.GetString($bytes)
        
        $modified = $false
        
        # Replace the header and nav (in the old product pages it was <header class="header-main">...</header> \n <div class="top-nav-bar">...</div> \n <nav class="nav-bar">...</nav>)
        $oldHeaderRegex = '(?s)<header class="header-main">.*?</nav>'
        if ($html -match $oldHeaderRegex) {
            $html = $html -replace $oldHeaderRegex, $newHeaderHtml
            $modified = $true
        }
        
        # Inject the new CSS before </style> in the first style block
        if ($modified -and $html -match '(?s)(<style>.*?)(</style>)') {
            # Make sure we haven't already injected it (by checking for .logo-wrapper)
            if ($html -notmatch '\.logo-wrapper \{') {
                $html = $html -replace '(?s)(<style>.*?)(</style>)', "`$1`n$newCssHtml`n`$2"
            }
        }
        
        if ($modified) {
            $newBytes = [System.Text.Encoding]::UTF8.GetBytes($html)
            $newB64 = [System.Convert]::ToBase64String($newBytes)
            $script:count++
            return "$prefix$newB64$suffix"
        }
    } catch {
        # ignore errors
    }
    
    return $match.Value
})

Set-Content -Path $dataJsPath -Value $newDataJsContent -NoNewline -Encoding UTF8
Write-Host "Patched $count pages in data.js."

$ErrorActionPreference = "Stop"

$indexContent = Get-Content 'index.html' -Raw -Encoding UTF8
$indexTop = $indexContent.Substring(0, $indexContent.IndexOf('<main class="page-content">') + 27)
$indexBottom = $indexContent.Substring($indexContent.IndexOf('</main>'))

$dataJsContent = Get-Content 'data.js' -Raw -Encoding UTF8

# Find all keys manually
$lines = $dataJsContent -split "`n"
$count = 0
$newLines = @()

foreach ($line in $lines) {
    if ($line -match '^\s*"([^"]+\.html)"\s*:\s*"([^"]+)"(,?)\s*$') {
        $key = $matches[1]
        $b64 = $matches[2]
        $comma = $matches[3]
        
        $bytes = [System.Convert]::FromBase64String($b64)
        $html = [System.Text.Encoding]::UTF8.GetString($bytes)
        
        $mainStart = $html.IndexOf('<main class="page-content">')
        if ($mainStart -eq -1) {
            $mainStart = $html.IndexOf('<main')
        }
        
        $mainEnd = $html.IndexOf('</main>')
        
        if ($mainStart -ge 0 -and $mainEnd -gt $mainStart) {
            $mainStartTagEnd = $html.IndexOf('>', $mainStart) + 1
            $mainContent = $html.Substring($mainStartTagEnd, $mainEnd - $mainStartTagEnd)
            
            # Remove old KVKK block if it exists
            $kvkkIndex = $mainContent.IndexOf('<div id="kvkkModalBackdrop"')
            if ($kvkkIndex -ge 0) {
                $mainContent = $mainContent.Substring(0, $kvkkIndex)
            }
            
            $newHtml = $indexTop + $mainContent + $indexBottom
            $newBytes = [System.Text.Encoding]::UTF8.GetBytes($newHtml)
            $newB64 = [System.Convert]::ToBase64String($newBytes)
            
            $newLines += '  "' + $key + '": "' + $newB64 + '"' + $comma
            $count++
            continue
        }
    }
    
    $newLines += $line
}

$finalContent = $newLines -join "`n"
Set-Content 'data.js' -Value $finalContent -Encoding UTF8
Write-Host "Rebuilt $count payloads in data.js using line matching."

$indexContent = Get-Content 'index.html' -Raw -Encoding UTF8
$indexTop = $indexContent.Substring(0, $indexContent.IndexOf('<main class="page-content">') + 27)
$indexBottom = $indexContent.Substring($indexContent.IndexOf('</main>'))

$dataJsContent = Get-Content 'data.js' -Raw -Encoding UTF8
$pattern = '("[^"]+\.html"\s*:\s*")([^"]+)(")'
$count = 0

$newDataJsContent = [regex]::Replace($dataJsContent, $pattern, {
    param($match)
    $b64 = $match.Groups[2].Value
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
        
        # Remove old KVKK block to avoid duplicates!
        $kvkkIndex = $mainContent.IndexOf('<div id="kvkkModalBackdrop"')
        if ($kvkkIndex -ge 0) {
            $mainContent = $mainContent.Substring(0, $kvkkIndex)
        }
        
        $newHtml = $indexTop + $mainContent + $indexBottom
        $newBytes = [System.Text.Encoding]::UTF8.GetBytes($newHtml)
        $newB64 = [System.Convert]::ToBase64String($newBytes)
        
        $count++
        return $match.Groups[1].Value + $newB64 + $match.Groups[3].Value
    }
    
    return $match.Value
})

Set-Content 'data.js' -Value $newDataJsContent -Encoding UTF8
Write-Host "Rebuilt $count payloads in data.js."

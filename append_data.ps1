$dataJsPath = Join-Path (Get-Location) 'data.js'
$dataJsContent = [System.IO.File]::ReadAllText($dataJsPath, [System.Text.Encoding]::UTF8)

$newFiles = @('bahce-ekipmanlari.html', 'depo-rekorlari.html', 'hortum-ek-parcalari.html', 'musluk-jaki.html')

$indexContent = [System.IO.File]::ReadAllText('index.html', [System.Text.Encoding]::UTF8)
$indexTop = $indexContent.Substring(0, $indexContent.IndexOf('<main class="page-content">') + 27)
$indexBottom = $indexContent.Substring($indexContent.IndexOf('</main>'))

$appendContent = ""

foreach ($file in $newFiles) {
    if ($dataJsContent -match "`"$file`"") {
        Write-Host "$file already in data.js, skipping append."
        continue
    }
    
    $fileContent = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
    $mainStart = $fileContent.IndexOf('<main class="page-content">')
    if ($mainStart -lt 0) { continue }
    $mainStartTagEnd = $mainStart + 27
    $mainEnd = $fileContent.IndexOf('</main>')
    
    $mainContent = $fileContent.Substring($mainStartTagEnd, $mainEnd - $mainStartTagEnd)
    $newHtml = $indexTop + $mainContent + $indexBottom
    
    $newBytes = [System.Text.Encoding]::UTF8.GetBytes($newHtml)
    $newB64 = [System.Convert]::ToBase64String($newBytes)
    
    $appendContent += "    `"$file`": `"$newB64`",`n"
}

if ($appendContent) {
    # Remove the last brace from data.js, append new keys, and re-close
    $dataJsContent = $dataJsContent.TrimEnd().TrimEnd('}')
    $dataJsContent += "`n" + $appendContent + "};`n"
    [System.IO.File]::WriteAllText($dataJsPath, $dataJsContent, [System.Text.Encoding]::UTF8)
    Write-Host "Appended new files to data.js"
} else {
    Write-Host "No new files to append."
}

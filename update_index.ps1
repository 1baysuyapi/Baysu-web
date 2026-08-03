$content = Get-Content index.html -Raw -Encoding UTF8
$content = $content -replace '\?v=1022', '?v=1023'
$content = $content -replace '\?v=1017', '?v=1023'
Set-Content index.html -Value $content -Encoding UTF8

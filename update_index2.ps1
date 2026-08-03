$content = Get-Content index.html -Raw -Encoding UTF8
$content = $content -replace '\?v=1023', '?v=1024'
Set-Content index.html -Value $content -Encoding UTF8

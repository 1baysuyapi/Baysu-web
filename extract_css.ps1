$content = Get-Content 'test_payload.html' -Raw -Encoding UTF8
$start = $content.IndexOf('<style id="baysu-table-screenshot-css">')
$end = $content.IndexOf('</style>', $start)
$css = $content.Substring($start + 39, $end - $start - 39)
Set-Content 'correct_css.txt' -Value $css -Encoding UTF8

$content = Get-Content cart.js -Raw -Encoding UTF8
$content = $content -replace '\bconst\b', 'var'
$content = $content -replace '\blet\b', 'var'
# Arrow function (item, i) => to function(item, i)
$content = $content -replace '\(item, i\) =>', 'function(item, i)'
$content = $content -replace '\(item, index\) =>', 'function(item, index)'
$content = $content -replace '\(item\) =>', 'function(item)'
$content = $content -replace 'document\.addEventListener\(''DOMContentLoaded'', \(\) => \{', "document.addEventListener('DOMContentLoaded', function() {"
$content = $content -replace 'document\.body\.addEventListener\(''click'', \(e\) => \{', "document.body.addEventListener('click', function(e) {"
$content = $content -replace 'setTimeout\(\(\) => \{', 'setTimeout(function() {'
Set-Content cart.js -Value $content -Encoding UTF8

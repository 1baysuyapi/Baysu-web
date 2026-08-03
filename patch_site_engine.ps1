$content = Get-Content site-engine.js -Raw -Encoding UTF8
$target = "                var rawHtml = decodeURIComponent(escape(atob(window.PAGE_DATA[path])));`n                var doc = new DOMParser().parseFromString(rawHtml, `"text/html`");"
$replacement = @"
                var base64Str = window.PAGE_DATA[path];
                var rawHtml = '';
                try {
                    var binStr = atob(base64Str);
                    var bytes = new Uint8Array(binStr.length);
                    for (var i = 0; i < binStr.length; i++) { bytes[i] = binStr.charCodeAt(i); }
                    rawHtml = new TextDecoder('utf-8').decode(bytes);
                } catch(e) {
                    rawHtml = decodeURIComponent(escape(atob(base64Str)));
                }
                var doc = new DOMParser().parseFromString(rawHtml, "text/html");
"@
$content = $content.Replace($target, $replacement)
Set-Content site-engine.js -Value $content -Encoding UTF8

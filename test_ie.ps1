$ie = New-Object -COM "InternetExplorer.Application"
$ie.Visible = $false
$path = (Resolve-Path "test_debug.html").Path
$ie.Navigate("file:///$path")
while ($ie.Busy -eq $true -or $ie.ReadyState -ne 4) { Start-Sleep -Milliseconds 100 }
Write-Host $ie.Document.body.innerHTML
$ie.Quit()

$text = [IO.File]::ReadAllText("apply_fixes.ps1")
$utf8WithBom = New-Object System.Text.UTF8Encoding($true)
[IO.File]::WriteAllText("apply_fixes.ps1", $text, $utf8WithBom)
Write-Host "BOM added to apply_fixes.ps1"

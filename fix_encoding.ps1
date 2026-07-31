$code = [System.IO.File]::ReadAllText('build_bahce.ps1', [System.Text.Encoding]::UTF8)
Invoke-Expression $code

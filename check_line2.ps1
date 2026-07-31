$line = (Get-Content data.js -TotalCount 2)[-1]
Write-Host "End of line 2:"
Write-Host $line.Substring([Math]::Max(0, $line.Length - 50))

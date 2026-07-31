$c = Get-Content 'data.js'
for ($i=0; $i -lt $c.Count; $i++) {
    $l = $c[$i]
    if ($l.Trim() -eq "") { continue }
    if ($l -eq "window.PAGE_DATA = {") { continue }
    if ($l -eq "};") { continue }
    
    $qCount = 0
    foreach ($char in $l.ToCharArray()) {
        if ($char -eq '"') { $qCount++ }
    }
    
    if ($qCount -ne 4) {
        Write-Host "Line $($i+1) has $qCount quotes: $($l.Substring(0, [Math]::Min(50, $l.Length)))"
    }
}
Write-Host "Done"

$content = Get-Content decoded_data.html -Raw
$matches = ([regex]'(?i)onclick="([^"]+)"').Matches($content)
$counts = @{}
foreach ($m in $matches) {
    $val = $m.Groups[1].Value
    if (-not $counts.ContainsKey($val)) { $counts[$val] = 0 }
    $counts[$val]++
}
$counts.GetEnumerator() | Sort-Object Value -Descending | Format-Table -AutoSize

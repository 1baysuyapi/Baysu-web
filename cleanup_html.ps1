$files = Get-ChildItem -Filter "*.html"
$keep = @("index.html", "admin.html", "test_debug.html", "test_manual.html", "test_decode.html", "test_output.html", "test_bahce.html", "test_index_decoded.html", "test_payload.html", "old_index.html", "old_index2.html", "old_index_commit.html", "old_index_utf8.html", "temp.html", "temp_script.html", "mavi_decoded.html")

foreach ($f in $files) {
    if ($keep -notcontains $f.Name) {
        Remove-Item $f.FullName -Force
        Write-Host "Deleted $($f.Name)"
    }
}
Write-Host "Cleanup done"

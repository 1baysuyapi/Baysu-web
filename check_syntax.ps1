try {
    $code = Get-Content cart.js -Raw
    # Simple check for matching braces/parentheses is hard in regex, 
    # but I can run JScript via cscript to check for syntax errors
    Set-Content -Path check_syntax.wsf -Value "<job><script language='JScript' src='cart.js'></script><script>WScript.Echo('Syntax OK');</script></job>"
    $output = cscript //nologo check_syntax.wsf
    Write-Host $output
} catch {
    Write-Host $_.Exception.Message
}

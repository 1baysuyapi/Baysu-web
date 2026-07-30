$css = Get-Content 'cart.css' -Raw -Encoding UTF8

$kvkkBlockIndex = $css.IndexOf('/* Modal and Utility Styles */')
if ($kvkkBlockIndex -ge 0) {
    # It exists, but I also need to remove the previous correct_css.txt I appended.
    # Where does my previous append start?
    $badAppend1 = $css.IndexOf('/* Product Detail Layout Styles */')
    $badAppend2 = $css.IndexOf('        .price-table {') # This is where correct_css.txt started
    
    if ($badAppend1 -ge 0) {
        $css = $css.Substring(0, $badAppend1)
    } elseif ($badAppend2 -ge 0) {
        $css = $css.Substring(0, $badAppend2)
    } else {
        $css = $css.Substring(0, $kvkkBlockIndex)
    }
}

$extractedCss = Get-Content 'extracted_styles.css' -Raw -Encoding UTF8

$kvkkCss = @"
/* Modal and Utility Styles */
.kvkk-modal-backdrop {
    display: none;
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100000;
    justify-content: center;
    align-items: center;
}
.kvkk-modal-backdrop.active {
    display: flex;
}
.kvkk-modal-content {
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    position: relative;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.kvkk-modal-close {
    position: absolute;
    top: 15px; right: 15px;
    font-size: 24px;
    cursor: pointer;
    color: #64748B;
}
"@

$finalCss = $css.Trim() + "`n`n" + $extractedCss.Trim() + "`n`n" + $kvkkCss
Set-Content 'cart.css' -Value $finalCss -Encoding UTF8
Write-Host "Rewrote cart.css with full extracted styles."

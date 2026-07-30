$css = Get-Content 'cart.css' -Raw -Encoding UTF8
$badBlockIndex = $css.IndexOf('/* Product Detail Layout Styles */')
if ($badBlockIndex -ge 0) {
    $css = $css.Substring(0, $badBlockIndex)
}

$correctCss = Get-Content 'correct_css.txt' -Raw -Encoding UTF8

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

$finalCss = $css + "`n`n" + $correctCss + "`n`n" + $kvkkCss
Set-Content 'cart.css' -Value $finalCss -Encoding UTF8
Write-Host "Updated cart.css successfully."

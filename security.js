(function () {
    // 1. Right Click Disable
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);

    // 2. Keyboard Shortcuts Block (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S)
    document.addEventListener('keydown', function (e) {
        if (
            e.keyCode === 123 ||
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67 || e.keyCode === 75 || e.keyCode === 69)) ||
            (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))
        ) {
            e.preventDefault();
            return false;
        }
    }, false);

    // 3. DevTools Open Detection via Dimension & Performance Difference
    var threshold = 160;
    function checkDevTools() {
        var widthDiff = window.outerWidth - window.innerWidth > threshold;
        var heightDiff = window.outerHeight - window.innerHeight > threshold;

        if (widthDiff || heightDiff) {
            blockPage();
        }
    }

    function blockPage() {
        if (document.body) {
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0F172A;color:#FFFFFF;font-family:sans-serif;font-weight:700;font-size:22px;text-align:center;padding:20px;">🔒 GÜVENLİK UYARISI: Kod ve Sayfa İnceleme Yetkiniz Bulunmamaktadır.</div>';
        }
    }

    // 4. Continuous Anti-Debugging & Console Clearing Trap
    setInterval(function () {
        (function () {
            return false;
        })
        ["constructor"]("debugger")
        ["call"]();
        console.clear();
        checkDevTools();
    }, 100);
})();

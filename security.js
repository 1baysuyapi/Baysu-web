(function () {
    // Detect mobile device
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // 1. Right Click Disable (Desktop only, don't break touch selection on mobile)
    document.addEventListener('contextmenu', function (e) {
        if (!isMobile) {
            e.preventDefault();
        }
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
})();

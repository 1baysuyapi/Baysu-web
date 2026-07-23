document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, false);

document.addEventListener('keydown', function (e) {
    if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
        (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))
    ) {
        e.preventDefault();
        return false;
    }
}, false);

setInterval(function () {
    (function () {
        return false;
    })
    ["constructor"]("debugger")
    ["call"]();
}, 200);

setInterval(function () {
    console.clear();
}, 500);

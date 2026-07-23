(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var dataElem = document.getElementById('pData');
        if (dataElem) {
            try {
                var b64 = dataElem.textContent || dataElem.innerText;
                var rawHtml = decodeURIComponent(escape(atob(b64.trim())));
                document.open();
                document.write(rawHtml);
                document.close();
            } catch (e) {
                console.error("Load error");
            }
        }
    });
})();

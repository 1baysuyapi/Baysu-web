(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var path = window.location.pathname.split('/').pop().toLowerCase();
        if (!path || path === '' || path === '/') {
            path = 'index.html';
        }
        if (window.PAGE_DATA && window.PAGE_DATA[path]) {
            try {
                var rawHtml = decodeURIComponent(escape(atob(window.PAGE_DATA[path])));
                document.open();
                document.write(rawHtml);
                document.close();
            } catch (e) {
                console.error(e);
            }
        }
    });
})();
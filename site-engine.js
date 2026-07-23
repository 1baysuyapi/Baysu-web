(function () {
    function logVisit(page) {
        try {
            var logs = JSON.parse(localStorage.getItem('baysu_visitor_logs') || '[]');
            var now = new Date();
            var timeStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR');
            var agentStr = navigator.userAgent.indexOf('Mobile') > -1 ? '📱 Mobil' : '💻 Masaüstü';
            
            logs.push({
                time: timeStr,
                page: page,
                agent: agentStr,
                session: sessionStorage.getItem('baysu_sid') || (function(){
                    var sid = Math.random().toString(36).substring(2);
                    sessionStorage.setItem('baysu_sid', sid);
                    return sid;
                })()
            });

            if (logs.length > 200) logs.shift();
            localStorage.setItem('baysu_visitor_logs', JSON.stringify(logs));
        } catch(e) {}
    }

    document.addEventListener('DOMContentLoaded', function () {
        var path = window.location.pathname.split('/').pop().toLowerCase();
        if (!path || path === '' || path === '/') {
            path = 'index.html';
        }
        logVisit(path);
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
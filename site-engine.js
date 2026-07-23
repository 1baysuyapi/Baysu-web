(function () {
    function logVisit(page) {
        try {
            var logs = JSON.parse(localStorage.getItem('baysu_visitor_logs') || '[]');
            var now = new Date();
            var timeStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR');
            var agentStr = navigator.userAgent.indexOf('Mobile') > -1 ? '📱 Mobil' : '💻 Masaüstü';
            var sid = sessionStorage.getItem('baysu_sid') || (function(){
                var id = Math.random().toString(36).substring(2);
                sessionStorage.setItem('baysu_sid', id);
                return id;
            })();

            var newEntry = {
                time: timeStr,
                page: page,
                agent: agentStr,
                ip: 'Sorgulanıyor...',
                location: 'Sorgulanıyor...',
                session: sid
            };

            logs.push(newEntry);
            if (logs.length > 200) logs.shift();
            var entryIndex = logs.length - 1;
            localStorage.setItem('baysu_visitor_logs', JSON.stringify(logs));

            // Fetch IP and Geolocation
            fetch('https://ipapi.co/json/')
                .then(function(res){ return res.json(); })
                .then(function(data){
                    if(data && data.ip){
                        logs[entryIndex].ip = data.ip;
                        logs[entryIndex].location = (data.city || 'Belirsiz') + ' / ' + (data.country_name || 'Türkiye');
                        localStorage.setItem('baysu_visitor_logs', JSON.stringify(logs));
                    }
                })
                .catch(function(){
                    logs[entryIndex].ip = 'Gizli / Proxy';
                    logs[entryIndex].location = 'Türkiye';
                    localStorage.setItem('baysu_visitor_logs', JSON.stringify(logs));
                });
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
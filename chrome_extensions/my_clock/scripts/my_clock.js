/**
 * Created by sky on 2017/2/16.
 */

(function() {
    var lastTime = 0;
    var vendors = ['webkit'];
    if (!window.requestAnimationFrame) {
        for(var x = 0; x < vendors.length; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        window.requestAnimationFrame = function(cb) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.666667 - (currTime - lastTime));
            var id = window.setTimeout(function() { cb(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

window.onload = function () {
    var clockPanel = document.getElementById('clock_panel'),
        __s = -1;
    
    function getDate() {
        var t = new Date(),
            Y, M, D, W, h, m, s;
        
        s = t.getSeconds();

        function getDay(t) {
            days = ['日', '一', '二', '三', '四', '五', '六'];
            day = t.getDay();
            return days[day];
        }

        if (__s === s) {
            return;
        }
        
        __s = s;
        
        clockPanel.innerHTML = 'Y年M月D日 h: m: s 星期W'.replace(/[YMDWhms]/g,function (match) {
            var m = null;
            switch (match) {
                case 'Y':
                    m = t.getFullYear();
                    break;
                case 'M':
                    m = t.getMonth() + 1;
                    break;
                case 'D':
                    m = t.getDate();
                    break;
                case 'W':
                    m =  getDay(t);
                    break;
                case 'h':
                    m = t.getHours();
                    break;
                case 'm':
                    m = t.getMinutes();
                    break;
                case 's':
                    m = s;
                    break;
            }

            return m;
        });

    }

    function animationFrame() {
        getDate();
        window.requestAnimationFrame(animationFrame);
    }
    window.requestAnimationFrame(animationFrame);
};
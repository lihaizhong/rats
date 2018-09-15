/**
 * Created by sky on 2017/5/11.
 */

window.onload = function () {
    var index = 0,
        // 上一张页面
        $$oldPage = "",
        // 当前页面
        $$currPage = "",
        // 获取滚动元素
        $$sliderWrap = document.getElementById('sliderWrap'),
        // -> 动画是否完成，如果完成，滚轮将继续执行，否则阻止滚轮事件
        isAniFinished = true,
        // 获取切换的页面的数量
        time = 1,
        pageLength = document.getElementsByClassName('tq-slider-page').length,
        resizeTimer, wheelTimer, pageHeight, lastAinFinishedTime, preWheelTime, curWheelTime = 0,
        EVENT_TRANSITION_END = "ontransitionend" in window ? "transitionend" : "webkittransitionend",
        EVENT_WHEEL = "onwheel" in window ? "wheel" : "mousewheel";

    // 获得页面高度（滚动页面时有效）
    function getPageHeight() {
        pageHeight = document.body.clientHeight;
    }

    function getLastAniFinishedTime() {
        return lastAinFinishedTime || Date.now();
    }

    function setLastAniFinishedTime() {
        lastAinFinishedTime = Date.now();
    }

    function animationStart() {
        isAniFinished = false;
    }

    function animationEnd() {
        isAniFinished = true;
    }

    function getIndexByHash() {
        // #issue safari 和 firefox 下  hash需要转码
        var hash = encodeURI(location.hash.split("#")[1]);
        if (hash) {
            document.querySelectorAll('.tq-slider-wrap .tq-slider-page')
                .forEach(function (v, i) {
                    if (v.dataset['id'] === hash) {
                        index = i;
                    }
                });
        }
    }
    // 滚轮、按钮
    function getIndexByOther(nextIndex) {
        index = nextIndex < 0 ? (pageLength - 1) : nextIndex % pageLength;
    }

    function setSliderWrapStyle(_prop_, _value_) {
        var list = ['webkit'], prop;

        for (var i = 0; i < list.length; i++) {
            prop = list[i] + _prop_.replace(/^\w/g, function($0) {
                    return $0.toUpperCase();
                });
            $$sliderWrap.style[prop] = _value_;
        }
    }

    /******  主要的操作函数  *******/

    // 切换页面动画开始前的设置
    function slider() {
        var $$arrowsClassList = document.querySelector('.tq-slider-down .tq-slider-arrows').classList;
        $$oldPage = document.querySelector('.tq-slider-wrap .page-current');
        $$currPage = document.querySelectorAll('.tq-slider-wrap .tq-slider-page').item(index);
        // 控制器状态变换
        document.querySelector('.tq-slider-control .active').classList.remove('active');
        document.querySelectorAll('.tq-slider-control li').item(index).classList.add('active');
        // 导引状态变化
        index == pageLength - 1 ? $$arrowsClassList.add('hidden') : $$arrowsClassList.remove('hidden');
        $$currPage.classList.add('page-current');
        // 主场景切换动画
        setSliderWrapStyle("transition", "all " + time + "s ease-out");
        setSliderWrapStyle("transform", "translate3d(0, -" + (pageHeight * index) + "px, 0)");
    }

    // 切换页面动画结束后的设置
    function animation() {
        $$oldPage && $$oldPage.classList.remove('page-current', 'page-active');
        $$currPage.classList.add('page-active');
        setTimeout(function () {
          animationEnd();
          setLastAniFinishedTime();
        }, 500);
    }

    /************ end ***********/

    /**
     *   初始化
     */
    (function() {
        setSliderWrapStyle("transform", "translate3d(0, 0, 0)");
        getPageHeight();
        getIndexByHash();
        slider();
        // 异步处理（否则动画可能阻塞）
        setTimeout(animation);
    })();

    /**
     *   事件绑定
     */

    // => 窗体尺寸变化
    window.addEventListener('resize', function() {
        if (resizeTimer) return;
        resizeTimer = setTimeout(function() {
            getPageHeight();
            resizeTimer = null;
        }, 600);
    });

    // =>   右侧锚点
    document.querySelectorAll('.tq-slider-control').item(0).addEventListener('click', function (e) {
        var target = e.target;

        document.querySelectorAll('.tq-slider-control li').forEach(function (t, i) {
            if (target === t) {
                if (!isAniFinished) return;
                animationStart();
                if (target.classList.contains('active')) return;
                index = i;
                slider();
            }
        });
    }, false);

    // => 动画结束触发事件
    $$sliderWrap.addEventListener(EVENT_TRANSITION_END, function(e) {
        // #issue 如果子元素也有动画，将持续触发父元素的该事件
        if (e.target === this) {
            animation();
        }
    }, false);

    // => 滚轮滚动触发事件
    window.addEventListener(EVENT_WHEEL, function(e) {
        /***********   #IMPORTANT  ***********/
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.defaultPrevented = true;

        // 处理到大部分滚轮事件，防止多次触发计时器解绑和绑定，导致动作延迟高
        if (!isAniFinished || (Date.now() - getLastAniFinishedTime() < 1000)) {
          slider();
          return false;
        }
        preWheelTime = curWheelTime;
        curWheelTime = Date.now();
        if (curWheelTime - preWheelTime < 30) {
          slider();
          return false;
        }

        /**************  END  ***************/

        animationStart();

        if (wheelTimer) {
            clearTimeout(wheelTimer);
            wheelTimer = null;
        }

        wheelTimer = setTimeout(function() {
            e.deltaY > 0 ? index++ : index--;
            getIndexByOther(index);
            slider();
            wheelTimer = null;
        });

    }, false);

    // => 点击向下箭头触发事件
    document.querySelector('.tq-slider-down').addEventListener('click', function () {
        if (!isAniFinished) return;
        animationStart();
        getIndexByOther(++index);
        slider();
    });
};

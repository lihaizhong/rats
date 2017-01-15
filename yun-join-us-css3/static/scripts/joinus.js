/**
 * Created by sky on 16/8/13.
 */

$(function () {
    var index = 0,
        // 上一张页面
        $oldPage = "",
        // 当前页面
        $currPage = "",
        // 获取滚动元素
        $$sliderWrap = document.getElementById('sliderWrap'),
        // -> 动画是否完成，如果完成，滚轮将继续执行，否则阻止滚轮事件
        isAniFinished  = true,
        // 获取切换的页面的数量
        time = 1,
        pageLength = $('.tq-slider-page').size(),
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

    function getIndexByHash() {
        // #issue safari 和 firefox 下  hash需要转码
        var hash = encodeURI(location.hash.split("#")[1]);
        if (hash) {
            $('.tq-slider-page', '.tq-slider-wrap').each(function () {
                if ($(this).data('id') == hash) {
                    index = $(this).index();
                    return false;
                }
            });
        }
    }

    function animationStart() {
        isAniFinished = false;
    }
    // 滚轮、按钮
    function getIndexByOther(nextIndex) {
        index = nextIndex < 0 ? (pageLength - 1) : nextIndex % pageLength;
    }

    function setSliderWrapStyle(_prop_, _value_) {
        var list = ['webkit'], prop;
        for (var i = 0; i < list.length; i++) {
            prop = list[i] + _prop_.replace(/^\w/g, function ($0) {
                    return $0.toUpperCase();
                });
            $$sliderWrap.style[prop] = _value_;
        }
    }

    /******  主要的操作函数  *******/

    // 切换页面动画开始前的设置
    function slider() {
        $oldPage = $('.page-current', '.tq-slider-wrap');
        $currPage = $('.tq-slider-page', '.tq-slider-wrap').eq(index);
        $('.active', '.tq-slider-control').removeClass('active');
        $('li', '.tq-slider-control').eq(index).addClass('active');
        if (index == pageLength - 1) {
            $('.tq-slider-arrows', '.tq-slider-down').addClass('hidden');
        } else {
            $('.tq-slider-arrows', '.tq-slider-down').removeClass('hidden');
        }
        $currPage.addClass('page-current');
        setSliderWrapStyle("transition", "all " + time +"s ease-out");
        setSliderWrapStyle("transform", "translate3d(0, -" + (pageHeight * index) + "px, 0)");
    }

    // 切换页面动画结束后的设置
    function animation() {
        if ($oldPage) {
            $oldPage.removeClass('page-current page-active');
        }

        $currPage.addClass('page-active');
        isAniFinished = true;
        lastAinFinishedTime = Date.now();
    }

    /************ end ***********/

    /**
     *   初始化
     */
    (function () {
        setSliderWrapStyle("transform", "translate3d(0, 0, 0)");
        getPageHeight();
        getIndexByHash();
        slider();
        // 异步处理（否则动画可能失效）
        setTimeout(animation);
    })();

    /**
     *   事件绑定
     */

    // => 窗体尺寸变化
    window.addEventListener('resize', function () {
        if (resizeTimer) return;
        resizeTimer = setTimeout(function () {
            getPageHeight();
            resizeTimer = null;
        }, 600);
    });

    // =>   右侧锚点
    $('.tq-slider-control').on('click', 'li', function () {
        if (!isAniFinished) return;
        animationStart();
        var $el = $(this);
        if ( $el.hasClass('active') ) return;
        index = $el.index();
        slider();
    });

    // => 动画结束触发事件
    $$sliderWrap.addEventListener(EVENT_TRANSITION_END, function (e) {
        // #issue 如果子元素也有动画，将持续触发父元素的该事件
        if (e.target  === this) {
            animation();
        }
    }, false);

    // => 滚轮滚动触发事件
    window.addEventListener(EVENT_WHEEL, function (e) {
        /***********   #IMPORTANT  ***********/

        // 处理到大部分滚轮事件，防止多次触发计时器解绑和绑定，导致动作延迟高
        if (!isAniFinished || (Date.now() - getLastAniFinishedTime() < 1000)) return;
        preWheelTime = curWheelTime;
        curWheelTime = Date.now();
        if (curWheelTime - preWheelTime < 30) return;

        /**************  END  ***************/

        animationStart();

        if (wheelTimer) {
            clearTimeout(wheelTimer);
            wheelTimer = null;
        }

        wheelTimer = setTimeout(function () {
            if (e.deltaY > 0) {
                getIndexByOther(++index);
            } else {
                getIndexByOther(--index);
            }
            slider();
            wheelTimer = null;
        });

    }, false);

    // => 点击向下箭头触发事件
    $('.tq-slider-down').click(function () {
        if (!isAniFinished) return;
        animationStart();
        getIndexByOther(++index);
        slider();
    });
});

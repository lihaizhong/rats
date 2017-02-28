(function($){
	$(window).load(function() {
		
		loading();
		//浏览器窗体改变时重新触发waterfall函数
		$(window).resize(waterfall);
		$(window).on('scroll', loading);
	});
})(jQuery);

/* 瀑布流布局 */
function waterfall() {
	var $boxs = $('.box'),
		cellWidth = $boxs.eq(0).outerWidth(),
		cols = Math.floor($(window).width()/cellWidth),
		ablums = []; // 相册
	//设置最外层边框的宽度
	$('.main').width(cols*cellWidth);

	//清除绝对定位
	$boxs.css("position", "static");

	// 遍历相框
	$boxs.each(function(index, elem) {
		var $this = $(this),
			colHeight = $this.outerHeight(),
			minHeight, minHIndex;
		// 判断单行相册数
		if (index < cols) {
			// 将相册依次排列（初始化状态）
			ablums[index] = colHeight;
		} else {
			// 将当前相册排列在最小相册列后面
			minHeight = Math.min.apply(null, ablums);
			minHIndex = $.inArray(minHeight, ablums);  // 通过指定的值找到数组中对应的索引$.inArray(value, array[, fromIndex]);
			$this.css ({
				"position" : "absolute",
				"top" : minHeight + "px",
				"left" : minHIndex*cellWidth + "px"
			});
			// 重新设置指定索引的高度值
			ablums[minHIndex] += colHeight;
		}
	});
}

/* 判断是否需要加载 */
function isLoading() {
	var domScrollTop = $(window).scrollTop() + $(window).height(),
		$boxs = $('.box'),
		lastBoxTop = $boxs.length ? $boxs.last().offset().top : 0;
	return domScrollTop > lastBoxTop ? true : false;
}

/* 请求数据加载图片 */
function loading() {
	if(isLoading) {
		var jsonData = {"data":[{"src":"images/23.jpg"}, {"src":"images/24.jpg"}, 
				{"src":"images/25.jpg"}, {"src":"images/26.jpg"}, {"src":"images/27.jpg"}, 
				{"src":"images/28.jpg"}, {"src":"images/29.jpg"}, {"src":"images/30.jpg"}, 
				{"src":"images/31.jpg"}, {"src":"images/32.jpg"}, {"src":"images/33.jpg"}, 
				{"src":"images/34.jpg"}, {"src":"images/35.jpg"}, {"src":"images/36.jpg"}, 
				{"src":"images/37.jpg"}]};

		var boxs = [],
			imageObj = new Image();	// 创建image对象
		// 遍历数组
		$.each(jsonData.data, function(key, value){
			var newBox = $('<div>').addClass("box"),
				newPic = $('<div>').addClass("pic").appendTo(newBox);

			$('<img>').attr("src", value.src).appendTo(newPic);
			boxs.push( newBox );
			imageObj.src = value.src;	// 图片预加载
		});

		// 图片预加载完成
		imageObj.onload = function () {
			$("#main").append(boxs);
			waterfall();
		}
	}
}
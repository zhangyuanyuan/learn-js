$(document).ready(function() {
	waterfall();
	$(window).on("scroll", function(e) {
		if (checkScrollSlide()) {
			var dataIn = {
				"data": [{
					"src": "26.jpg"
				}, {
					"src": "27.jpg"
				}, {
					"src": "28.jpg"
				}, {
					"src": "29.jpg"
				}, {
					"src": "30.jpg"
				}, {
					"src": "31.jpg"
				}, {
					"src": "32.jpg"
				}, {
					"src": "33.jpg"
				}, {
					"src": "34.jpg"
				}]
			};
			$.each(dataIn.data, function(key, item){
				var oBox = $("<div>").addClass("waterfall-box").appendTo($("#main"));
				var oPic = $("<div>").addClass("waterfall-pic").appendTo($(oBox));
				$("<img>").attr("src", "images/" + item.src).appendTo($(oPic));
			})
			waterfall();
		}
	})
})

function waterfall(parent, clsName) {
	var $boxs = $("#main>div");
	var w = $boxs.eq(0).outerWidth();
	var cols = Math.floor($(window).width() / w);
	$("#main").width(w * cols).css("margin", "0 auto");
	var hArr = [];
	$boxs.each(function(index, item) {
		if (index < cols) {
			hArr.push($(item).outerHeight());
		} else {
			var minH = Math.min.apply(null, hArr);
			var index = $.inArray(minH, hArr);
			$(item).css({
				"position": "absolute",
				"top": minH + "px",
				"left": index*w + "px"
			})
			hArr[index] += $(item).outerHeight();
		}
	});
}

//检测是否具备加载数据块的条件
function checkScrollSlide() {
	var $lastBox = $("#main>div").last();
	var lastBoxDis = $lastBox.offset().top + Math.floor($lastBox.height()/2);
	var scrollTop = $(window).scrollTop();
	var height = $(window).height();
	return (lastBoxDis < scrollTop + height) ? true : false;
}
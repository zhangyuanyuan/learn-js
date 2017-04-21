window.onload = function() {
	waterfall("main", "waterfall-box");
	window.onscroll = function() {
		if (checkScrollSlide("main", "waterfall-box")) {
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
			}
			for (var i = 0; i < dataIn.data.length; i++) {
				var oParent = document.getElementById("main");
				var oBox = document.createElement("div");
				oBox.className = "waterfall-box";
				oParent.appendChild(oBox);
				var oPic = document.createElement("div");
				oPic.className = "waterfall-pic";
				oBox.appendChild(oPic);
				var oImg = document.createElement("img");
				oImg.src = "images/" + dataIn.data[i].src;
				oPic.appendChild(oImg);
			}
			waterfall("main", "waterfall-box");
		}
	}
}

function waterfall(parent, clsName) {
	var oParent = document.getElementById(parent);
	var boxArr = getByClass(oParent, clsName);
	var oBoxWidth = boxArr[0].offsetWidth;
	var cols = Math.floor(document.documentElement.clientWidth / oBoxWidth);
	oParent.style.cssText = "width:" + oBoxWidth * cols + "px; margin: 0 auto";
	var hArr = [];
	for (var i = 0; i < boxArr.length; i++) {
		if (i < cols) {
			hArr.push(boxArr[i].offsetHeight);
		} else {
			var minH = Math.min.apply(null, hArr);
			var index = getMinHIndex(hArr, minH);
			boxArr[i].style.position = "absolute";
			boxArr[i].style.top = minH + "px";
			boxArr[i].style.left = index * oBoxWidth + "px";
			hArr[index] += boxArr[i].offsetHeight;
		}
	}
}

//通过Class找元素
function getByClass(parent, clsName) {
	var boxArr = [],
		oElements = parent.getElementsByTagName('*');
	for (var i = 0; i < oElements.length; i++) {
		if (oElements[i].className == clsName) {
			boxArr.push(oElements[i]);
		}
	}
	return boxArr;
}

function getMinHIndex(arr, val) {
	for (var i in arr) {
		if (arr[i] == val) {
			return i;
		}
	}
}

//检测是否具备加载数据块的条件
function checkScrollSlide(parent, clsName) {
	var oParent = document.getElementById(parent);
	var boxArr = getByClass(oParent, clsName);
	var lastBoxH = boxArr[boxArr.length - 1].offsetTop + Math.floor(boxArr[boxArr.length - 1].offsetHeight / 2);
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	var height = document.body.clientHeight || document.documentElement.clientHeight;
	return (lastBoxH < scrollTop + height) ? true : false;
}
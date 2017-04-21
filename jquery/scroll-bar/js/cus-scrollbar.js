var Scroll = {};
(function(win, doc, $) {
	function CusScrollBar(options) {
		this._init(options);
	}
	$.extend(CusScrollBar.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				scrollDir: "y",
				contentSelector: "",
				barSelector: "",
				sliderSelector: "",
				wheelStep: 10, //滚轮步长
				tabItemSelector: ".scroll-tab-item",
				tabActiveClass: "active",
				anchorSelector: ".anchor",
				correctSelector: ".correct-bot", //矫正选择器
				articleSelector: ".scroll-ol"
			}
			$.extend(true, self.options, options || {});
			self._initDomEvent();
			return self;
		},
		_initDomEvent: function() {
			var opts = this.options;
			this.$content = $(opts.contentSelector);
			this.$bar = opts.barSelector ? $(opts.barSelector) : this.$slider.parent();
			this.$slider = $(opts.sliderSelector);
			this.$tabItem = $(opts.tabItemSelector);
			this.$anchor = $(opts.anchorSelector);
			this.$correct = $(opts.correctSelector);
			this.$article = $(opts.articleSelector);
			this.$doc = $(doc);
			this._initArticleHeight()._initSliderDragEvent()._bindContScroll()._bindMouseWheel()._initTabvent();
		},
		//初始化文档高度
		_initArticleHeight: function() {
			var self = this,
				lastArticle = self.$article.last(),
				lastArticleHeight = lastArticle.height(),
				contentHeight = self.$content.height();
			if (lastArticleHeight < contentHeight) {
				self.$correct[0].style.height = contentHeight - lastArticleHeight - self.$anchor.outerHeight() + "px";
			}
			return self;
		},
		_initSliderDragEvent: function() {
			var self = this;
			var slider = this.$slider,
				sliderEl = slider[0];
			if (sliderEl) {
				var doc = this.$doc,
					dragStartPagePosition,
					dragStartScrollPosition,
					dragContentBarRate;

				function mousemoveHandler(e) {
					e.preventDefault();
					if (dragStartPagePosition == null) return;
					self.scrollTo(dragStartScrollPosition + (e.pageY - dragStartPagePosition) * dragContentBarRate);
				}
				slider.on("mousedown", function(e) {
					e.preventDefault();
					dragStartPagePosition = e.pageY;
					dragStartScrollPosition = self.$content[0].scrollTop;
					dragContentBarRate = self.getMaxScrollPosition() / self.getMaxSliderPosition();
					doc.on("mousemove.scroll", mousemoveHandler).on("mouseup.scroll", function(e) {
						doc.off(".scroll");
					});
				})
			}
			return self;
		},
		//监听内容的滚动，同步滑块的位置
		_bindContScroll: function() {
			var self = this;
			self.$content.on("scroll", function(e) {
				var sliderEl = self.$slider && self.$slider[0];
				if (sliderEl) {
					sliderEl.style.top = self.getSliderPosition() + "px";
				}
			});
			return self;
		},
		//监听滚轮事件
		_bindMouseWheel: function() {
			var self = this;
			self.$content.on("mousewheel DOMMouseScroll", function(e) {
				e.preventDefault();
				var oEv = e.originalEvent,
					wheelRange = oEv.wheelDelta ? -oEv.wheelDelta / 120 : (oEv.detail || 0) / 3;
				self.scrollTo(self.$content[0].scrollTop + wheelRange * self.options.wheelStep);
			});
			return self;
		},
		//初始化标签切换功能
		_initTabvent: function() {
			var self = this;
			self.$tabItem.on("click", function(e) {
				e.preventDefault();
				var index = $(this).index();
				self.changeTabSelect(index);
				self.scrollTo(self.$content[0].scrollTop + self.getAnchorPosition(index));
			});
			return self;
		},
		//切换标签
		changeTabSelect: function(index) {
			var self = this,
				tabActiveClass = self.options.tabActiveClass;
			return self.$tabItem.eq(index).addClass(tabActiveClass).siblings().removeClass(tabActiveClass);
		},
		//得到锚点的位置
		getAnchorPosition: function(index) {
			var self = this;
			return self.$anchor.eq(index).position().top;
		},
		//获取所有锚点的位置
		getAllAnchorPosition: function() {
			var self = this,
				allAnchorPosition = [];
			for (var i = 0; i < self.$anchor.length; i++) {
				allAnchorPosition.push(self.$content[0].scrollTop + self.getAnchorPosition(i));
			}
			return allAnchorPosition;
		},
		//内容可滚动的高度
		getMaxScrollPosition: function() {
			var self = this;
			return Math.max(self.$content.height(), self.$content[0].scrollHeight) - self.$content.height();
		},
		getMaxSliderPosition: function() {
			var self = this;
			return self.$bar.height() - self.$slider.height();
		},
		scrollTo: function(positionVal) {
			var self = this;
			var allAnchorPosition = self.getAllAnchorPosition();

			function getIndex(positionVal) {
				for (var i = allAnchorPosition.length - 1; i >= 0; i--) {
					if (positionVal >= allAnchorPosition[i]) {
						return i;
					}
				}
			}

			if (self.$tabItem.length == allAnchorPosition.length) {
				self.changeTabSelect(getIndex(positionVal));
			}
			self.$content.scrollTop(positionVal);
		},
		//计算滑块当前的位置
		getSliderPosition: function() {
			var self = this,
				maxSliderPosition = self.getMaxSliderPosition();
			return Math.min(maxSliderPosition, maxSliderPosition * self.$content[0].scrollTop / self.getMaxScrollPosition());
		}
	});
	Scroll.CusScrollBar = CusScrollBar;
})(window, document, jQuery);
;(function($){
    function PreLoad(imgs, options) {
        this.imgs = typeof imgs === "string" ? [imgs] : imgs;
        this.opts = $.extend(PreLoad.DEFAULTS, options);

        this._unordered();
    }
    PreLoad.DEFAULTS = {
        each:null,
        all:null
    }
    PreLoad.prototype._unordered = function(){
        var imgs = this.imgs,
            opts = this.opts,
            count = 0,
            len = imgs.length;
        $.each(imgs, function (i, src) {
            if (typeof src !== 'string') return;
            var imgObj = new Image();

            $(imgObj).on('load error', function () {
                opts.each && opts.each(count);
                if (count >= len - 1) {
                    opts.all && opts.all();
                }
                count++;
            })

            imgObj.src = src;
        })
    }
    $.extend({
        preload: function(imgs, options){
            new PreLoad(imgs, options);
        }
    })
})(jQuery);
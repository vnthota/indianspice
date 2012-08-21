var restCarousel = {
	carouselInterval: false,
	scrollOpts: {
		carousel: '#rest_carousel',
		list: '.thumbnails',
		item: '.carousel-control.thumbnail',
		active: 'active',
		listSize: 2
	},
	resizeOpts: {
		listSelector: '.thumbnails',
		carouselImageSelector: '.carousel-inner .item.active'
	},
	// fix for thumbnail alignment in fluid row
	fixThumbnailMargins: function () {
		var fullWidthClass = 'span12';
		$('.row-fluid .thumbnails').each(function () {
			var $thumbnails = $(this).children()
				, previousOffsetLeft = $thumbnails.first().offset().left
				, previousFullWidth = $thumbnails.first().hasClass(fullWidthClass);
			$thumbnails.each(function () {
				var $thumbnail = $(this)
					, offsetLeft = $thumbnail.offset().left
					, fullWidth = $thumbnail.hasClass(fullWidthClass);
				if (fullWidth || previousFullWidth || offsetLeft < previousOffsetLeft) {
					$thumbnail.css('margin-left', 0);
				}
				previousOffsetLeft = offsetLeft;
				previousFullWidth = fullWidth;
			});
		});
	},
	scrollThumbnails: function (options) {
		var defaults = {
				carousel: '#rest_carousel',
				list: '.thumbnails',
				item: '.carousel-control.thumbnail',
				active: 'active',
				parentTag: 'li',
				sizeCss: 'margin-bottom',
				carouselImage: '.carousel-inner .item',
				index: 0,
				listSize: 3,
				itemSize: 0,
				itemOffset: 0,
				animationTime: 1500
			},
			settings = $.extend({}, defaults, options);

		$(settings.item + '.' + settings.active).removeClass(settings.active);
		$(settings.item).eq(settings.index).addClass(settings.active);

		if (settings.itemSize === 0) {
			settings.itemSize = Math.floor($(settings.item).eq(0).parent(settings.parentTag).height()) +
				Math.floor(parseInt($(settings.item).eq(0).parent(settings.parentTag).css(settings.sizeCss)), 10);
		}
		if (settings.itemOffset === 0) {
			settings.itemOffset = Math.floor(settings.itemSize/2);
		}

		$(settings.list)
			.animate({
				scrollTop: (Math.floor(settings.index / settings.listSize) * settings.listSize * settings.itemSize - settings.itemOffset)
			}, settings.animationTime);
	},
	resizeThumbnailList: function (options) {
		var defaults = {
				listSelector: '.thumbnails',
				carouselImageSelector: '.carousel-inner .item.active',
				cssProperty: 'height'
			},
			settings = $.extend({}, defaults, options);
		$(settings.listSelector).css(settings.cssProperty, $(settings.carouselImageSelector).css(settings.cssProperty));
	}
};
$(function () {
	$('body').off('click.carousel.data-api');
	$('body').on('resize.carousel.thumbnails', function () {
		var resizeOpts = $.extend({}, restCarousel.scrollOpts, {
			itemSize: 0,
			itemOffset: 0,
			animationTime: 500
		});
		restCarousel.resizeThumbnailList(restCarousel.resizeOpts);
		restCarousel.scrollThumbnails(resizeOpts);
	});
	$(window).on('resize', function () {
		$('body').trigger('resize.carousel.thumbnails');
	});

	$('#rest_carousel').carousel({'interval': restCarousel.carouselInterval});
	$('#rest_carousel').on('slid', function (e) {
		var slidOpts = $.extend({}, restCarousel.scrollOpts, {
			index: $(this).find('.active').index()
		});
		restCarousel.scrollThumbnails(slidOpts);
	});

	$('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
		var $this = $(this), href, index
			, $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
			, options = $.isNumeric($this.data('slide')) ?
				+($this.data('slide')) :
				!$target.data('modal') && $.extend({}, $target.data(), $this.data());

		$target.carousel(options);
		e.preventDefault();
	});

	restCarousel.resizeThumbnailList(restCarousel.resizeOpts);
	restCarousel.fixThumbnailMargins();
	restCarousel.scrollThumbnails($.extend({}, restCarousel.scrollOpts, { animationTime:100 }));
});
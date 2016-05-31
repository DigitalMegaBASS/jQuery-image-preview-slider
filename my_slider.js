// DOM template for this plugin must be this way:
// <div id="galleryID">
// 	<a href="souuce of origin image"><img src="source of little image"></a>
//  <a href="souuce of origin image"><img src="source of little image"></a>
// </div>

jQuery(document).ready(function($) {
	// Set Main Parameters
	var galleryId = 'gallery1'; //Set your's gallery containing div id property (e.g. Name)
	var autoPlay = true; //true or false
	var autoPlayInterval = 5000; //5000 is default, set your value
	var pauseOnHover = true; //true or false
	var animationStyle = 'slide';//fade or slide
	var singleSlide = false; //true or false depending whether you want to show thumbnail images or bullets
	var fullSizeImagePreview = true; // enable ZOOM button
	var touchFriendly = false; // enable swype on images (requires jQuery mobile library)

	//Primary DOM manipulation
	if (singleSlide == true) {
		$('#'+galleryId+' a').wrapAll('<div class="bullets-img"></div>');
	} else {
		$('#'+galleryId+' a').wrapAll('<div class="small-img"></div>');
	}
	$('#'+galleryId).prepend('<div id="big-img"><a href="#" class="arrow-prev"><i class="fa fa-chevron-left left"></i></a><img src="#" width="100%"><a href="#" class="arrow-next"><i class="fa fa-chevron-right right"></i></a><div class="zoom-button"><p>ZOOM</p></div></div>');
	//First slide activation
	$('.small-img a:first').addClass('active-slide');
	$('#big-img img').attr('src', $('.small-img a[class="active-slide"]').attr('href'));
	
	//--arrow navigation--//
	function nextSlide(idToChange){
		var currentImg = $('.small-img a[class="active-slide"]');
		var nextImg = currentImg.next();
		if (nextImg.length == 0) {
			nextImg = $('.small-img a:first');
		}
		currentImg.removeClass('active-slide');
		nextImg.addClass('active-slide');
		if (animationStyle == 'fade') {
			$('#'+idToChange+' img').animate({opacity: 0},300, function() {
				$(this).attr('src', $(nextImg).attr('href'));
			});
			$('#'+idToChange+' img').animate({opacity: 1},300);
		} else if (animationStyle == 'slide') {
			$('#'+idToChange+' img').animate({right: 500},300, function() {
				$(this).attr('src', $(nextImg).attr('href')).attr('style', 'right:-500px');
			});
	// 		$('#'+idToChange+' img').css({transform: 'translateX(-700px)',transition: 'transform 0.5s ease'});
	// 		setTimeout(function(){
	// 			$('#'+idToChange+' img').attr('src', $(nextImg).attr('href')).css('transform', 'translateX(700px)');
	// 		}, 1500);
	// 		setTimeout(function(){
	// 			$('#'+idToChange+' img').css({transform: 'translateX(0px)',transition: 'transform 0.5s ease'});
	// 		}, 2600);
			$('#'+idToChange+' img').animate({right: 0},300);		
		};
	};

	function prevSlide(idToChange){
		var currentImg = $('.small-img a[class="active-slide"]');
		var nextImg = currentImg.prev();
		if (nextImg.length == 0) {
			nextImg = $('.small-img a:last');
		};
		currentImg.removeClass('active-slide');
		nextImg.addClass('active-slide');
		if (animationStyle == 'fade') {
			$('#'+idToChange+' img').animate({opacity: 0},300, function() {
				$(this).attr('src', $(nextImg).attr('href'));
			});
			$('#'+idToChange+' img').animate({opacity: 1},300);
		} else if (animationStyle == 'slide') {
			$('#'+idToChange+' img').animate({right: -500},300, function() {
				$(this).attr('src', $(nextImg).attr('href')).attr('style', 'right:500px');
			});
			$('#'+idToChange+' img').animate({right: 0},300);
		};
	}

	$('.arrow-next').on('click', function(e) {
		e.preventDefault();
		nextSlide('big-img');
	});

	$('.arrow-prev').on('click', function(e) {
		e.preventDefault();
		prevSlide('big-img');
	});

	//Actions for swype events
	if (touchFriendly == true) {
		$('#big-img img').on('swipeleft', function() {
			nextSlide('big-img');
		});

		$('#big-img img').on('swiperight', function() {
			prevSlide('big-img');
		});
	}

	// -- on litle image click reaction -- //
	$('.small-img a').on('click', function(e) {
		e.preventDefault();
		$('.small-img a[class="active-slide"]').removeClass('active-slide');
		$(this).addClass('active-slide');
		$('#big-img img').animate({opacity: 0},300, function() {
			$(this).attr('src', $('.small-img a[class="active-slide').attr('href'));
		});
		$('#big-img img').animate({opacity: 1},300);
		if (autoPlay == true && pauseOnHover == true) {
			clearTimeout(sliderInterval);
			clearTimeout(recursiveInterval);
		}
	});

	$("#gallery1").css('display', 'flex');

	// AutoPlay function
	var sliderInterval;
	var recursiveInterval;
	if (autoPlay == true) {
			sliderInterval = setTimeout(function timerTick() {
			nextSlide('big-img');
			recursiveInterval = setTimeout(timerTick, autoPlayInterval);
		}, autoPlayInterval);

	};
		// Pause on hover function
		$('#big-img img, .arrow-prev, .arrow-next, #bigImgZoom').mouseover(function() {
			if (autoPlay == true && pauseOnHover == true) {
				clearTimeout(sliderInterval);
				clearTimeout(recursiveInterval);
			}
		})
		$('#big-img img, .arrow-prev, .arrow-next, #bigImgZoom').mouseout(function() {
			if (autoPlay == true && pauseOnHover == true) {
				sliderInterval = setTimeout(function timerTick() {
					nextSlide('big-img');
					recursiveInterval = setTimeout(timerTick, autoPlayInterval);
				}, autoPlayInterval);
			};
		});



	// -- ZOOM-vs-FLASH --(fullscreen overlay picture preview) //
	if (fullSizeImagePreview == true) {
		$('.zoom-button, #big-img img').on('click', function() {
			clearTimeout(sliderInterval);
			clearTimeout(recursiveInterval);
			var currentImg = $('.small-img a[class="active-slide"]');
			var imgLink = currentImg.attr('href');
			$('body').append('<div class="thumbnail-fullscreen-preview"><div class="zoom-img-wrap"><div class="zoom-close-button"><i class="fa fa-times"></i></div><div id="bigImgZoom"><a href="#" class="arrow-prev"><i class="fa fa-chevron-left left"></i></a><img src="'+imgLink+'" width="100%"><a href="#" class="arrow-next"><i class="fa fa-chevron-right right"></i></a></div></div><div>');
			$('.thumbnail-fullscreen-preview').animate({opacity: 1},400);

			$('body').on('click.zoom-button', '.arrow-next', function(e) {e.preventDefault();nextSlide('bigImgZoom')});
			$('body').on('click.zoom-button', '.arrow-prev', function(e) {e.preventDefault();prevSlide('bigImgZoom')});
		});	
		$('body').on('click', '.zoom-close-button', function() {
			$('.thumbnail-fullscreen-preview').fadeOut('500');
			setTimeout("$('.thumbnail-fullscreen-preview').remove()", 500);
			$('body').off(".zoom-button");
			sliderInterval = setTimeout(function timerTick() {
				nextSlide('big-img');
				recursiveInterval = setTimeout(timerTick, autoPlayInterval);
			}, autoPlayInterval);
		});
		//This event is for overlay click removal
		// $('body').on('click', '.thumbnail-fullscreen-preview', function() {
		// 	$('.thumbnail-fullscreen-preview').fadeOut('500').setTimeout("$(this).remove()", 400);
		// });
	};

});
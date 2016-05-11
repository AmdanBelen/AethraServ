

(function($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1140px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 320px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 250);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on mobile.
			skel.on('+mobile -mobile', function() {
				$.prioritize(
					'.important\\28 mobile\\29',
					skel.breakpoint('mobile').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly();

	});

	$.fn.is_on_screen = function() {
   		var win = $(window);

    	var viewport = {
        	top : win.scrollTop(),
        	left : win.scrollLeft()
   		};
    	viewport.right = viewport.left + win.width();
    	viewport.bottom = viewport.top + win.height();

    	var bounds = this.offset();
    	bounds.right = bounds.left + this.outerWidth();
    	bounds.bottom = bounds.top + this.outerHeight();

    	return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

	};

	$(document).ready(function(){
		if( $('.nav').length > 0 ) { 
			var stretchyNavs = $('.nav'); 
			stretchyNavs.each(function(){
				var stretchyNav = $(this), stretchyNavTrigger = stretchyNav.find('.nav-trigger');
				stretchyNavTrigger.on('click', function(event){
					//event.preventDefault();
					stretchyNav.toggleClass('nav-is-visible');
				});
			});
			//$(document).on('click', function(event){console.log(event);( !$(event.target).parent('.nav').length) && stretchyNavs.removeClass('nav-is-visible')});
		}
	});
		
	$(function() {
     	var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/"));
        $("nav ul li a").each(function(){
          	if($(this).attr("href") == pgurl || $(this).attr("href") == '' )
				$(this).addClass("current");
     	})
     	
	});
    var CurrentScroll = 0;
	$(window).scroll(function(){ 
		var NextScroll = $(this).scrollTop();
		if (NextScroll > CurrentScroll){
			if( $('.nav.nav-is-visible').length > 0 ) {
				if(! $('.nav.nav-is-visible').is_on_screen() )
					$('.nav.nav-is-visible').toggleClass('nav-is-visible');
			}
		}
     	CurrentScroll = NextScroll; 
});
	


})(jQuery);
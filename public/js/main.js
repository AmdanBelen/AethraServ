/*
	Photon by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

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
	$(document).ready(function(){
		if( $('nav').length > 0 ) { 
			var stretchyNavs = $('.nav'); 
			stretchyNavs.each(function(){
				var stretchyNav = $(this), stretchyNavTrigger = stretchyNav.find('.nav-trigger');
				stretchyNavTrigger.on('click', function(event){
					//event.preventDefault();
					stretchyNav.toggleClass('nav-is-visible');
				});
			});
		$(document).on('click', function(event){( !$(event.target).is('.nav-trigger') && !$(event.target).is('.nav-trigger span') ) && stretchyNavs.removeClass('nav-is-visible')});}});
		
	$(function() {
     var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/"));
     $("nav ul li a").each(function(){
          if($(this).attr("href") == pgurl || $(this).attr("href") == '' )
			$(this).addClass("current");
     })
});

})(jQuery);
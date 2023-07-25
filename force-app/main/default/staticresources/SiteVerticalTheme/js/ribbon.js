var ribbon = (function($) {
	var $ribbonContainer = $('#iribbon-container'),
		$ribbonDetail = $('#iribbon-detail'),
		$ribbonButton = $('#iribbon-title'),
		$ribbonLinks = $ribbonDetail.find('a'),
		$body = $('body.bi-ribbon'),
		ribbonDetailOriginalHeight = $ribbonDetail.height() + 'px',
		ribbonContainerOriginalHeight = $ribbonContainer.offset().top + $ribbonContainer.height() + 'px',
		ribbonContainerTopPosition = parseInt($ribbonContainer.css('min-height'), 10) + $ribbonContainer.offset().top + 'px',
		ribbonContainerHiddenTopPosition = $ribbonContainer.offset().top,
		animationDuration = 400;

	var ret = {
		init: function() {

			if( $ribbonContainer.length == 0 ) { return; }

			// hide the ribbon and set the tabindex so that hidden links can't receive focus until visible
			toggleRibbon(animationDuration);

			$ribbonButton.on('click', function(){
				toggleRibbon(animationDuration);
			});

			// if user shift-tabs back out of the ribbon controls then hide the ribbon
			$ribbonLinks.first().on('keydown', function(e) {
				// if 'Shift + Tab' pressed = tabbing backwards
				if (e.shiftKey && e.keyCode == 9) {
					toggleRibbon(animationDuration);
				}
			});

			// if user tabs out of the last of the ribbon links then hide the ribbon
			$ribbonLinks.last().on('keydown', function(e) {
				// if 'Shift + Tab' pressed = tabbing backwards
				if (e.shiftKey && e.keyCode == 9) {
					return;
				} else if (e.keyCode == 9) { // if 'Tab' only pressed = tabbing forwards
					toggleRibbon(animationDuration);
				}
			});

			// Add scroll-hiding of ribbon
			$(window).scroll(function() {

				var delayMillis = 250;

		        // Delay for when dependant picklist change picklist values
		        setTimeout(function() {
					if ($(this).scrollTop()>0)
					{
						if( $ribbonButton.hasClass('active') ) {
							toggleRibbon(10);
						}
						//$body.css('margin-top', ribbonContainerHiddenTopPosition);
					}
					else
					{
						$body.css('margin-top', ribbonContainerTopPosition);
					}
		        }, delayMillis);

			});
		}
	};

	function toggleRibbon(animationSpeed) {

		// console.log('ribbonDetailOriginalHeight : ' + ribbonDetailOriginalHeight);
		// console.log('ribbonContainerOriginalHeight : ' + ribbonContainerOriginalHeight);
		// console.log('$ribbonContainer.height()  : ' + $ribbonContainer.height() );
		// console.log('$ribbonContainer.offset().top : ' + $ribbonContainer.offset().top);
		// console.log('$ribbonDetail.height()  : ' + $ribbonDetail.height() );
		// console.log('$ribbonDetail.height()  : ' + $ribbonDetail.height() );


		if($ribbonDetail.height() > 0) {
			$ribbonDetail.animate({height: '0'}, {queue: false, duration: animationSpeed});
			$body.animate({'margin-top': ribbonContainerTopPosition}, {queue: false, duration: animationSpeed});
			$ribbonLinks.attr('tabindex', -1);
			$ribbonButton.removeClass('active');
		}
		else {

			// open it
			$ribbonDetail.animate( { height: ribbonDetailOriginalHeight }, { queue: false, duration: animationDuration } );
			$body.animate( { 'margin-top': ribbonContainerOriginalHeight }, { queue: false, duration: animationDuration } );

			$ribbonLinks.attr('tabindex', 0);

			// toggle button image position
			$ribbonButton.addClass('active');
		}
	}

	return ret;
})(jQuery);

jQuery(document).ready(function() {
	ribbon.init();
});

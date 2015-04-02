jQuery(document).ready(function ($) {
    $('.cd-single-point').each(function () {
        "use strict";
        var $point = $(this),
            $target = $($point.data("cd-target")),
            pointLocation,
            targetLocation,
            targetWidth,
            targetHeight,
            newPosition = {};

        if ($target.length > 0) {
            $target = $target.first();
            targetLocation = $target.offset();
            targetWidth = $target.outerWidth(false);
            targetHeight = $target.outerHeight(false);

            newPosition = targetLocation;

            pointLocation = $point.data("cd-point-location").split(" ");
            pointLocation.forEach(function (val) {
                switch (val) {
                    case "left":
                        // do nothing, already set.
                        break;
                    case "center":
                        newPosition.left += targetWidth / 2;
                        break;
                    case "right":
                        newPosition.left += targetWidth;
                        break;

                    case "top":
                        // do nothing, already set.
                        break;
                    case "middle":
                        newPosition.top += targetHeight / 2;
                        break;
                    case "bottom":
                        newPosition.top += targetHeight;
                        break;
                }
            });

            $point.offset(newPosition);

            $point.children('a').on('click', function () {
                var selectedPoint = $(this).parent('div');
                if (selectedPoint.hasClass('is-open')) {
                    selectedPoint.removeClass('is-open').addClass('visited');
                } else {
                    selectedPoint.addClass('is-open').siblings('.cd-single-point.is-open').removeClass('is-open').addClass('visited');
                }
            });
        }
    });

	//close interest point description
	$('.cd-close-info').on('click', function(event){
		event.preventDefault();
		$(this).parents('.cd-single-point').eq(0).removeClass('is-open').addClass('visited');
	});
});
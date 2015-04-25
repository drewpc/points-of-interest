/*jslint browser: true*/
/*global $, jQuery, alert, eventie */

(function(window) {
    function poiDefinition() {

        function PointOfInterest(pointElement, options) {
            "use strict";
            var poi = this;

            poi.point = $(pointElement);
            poi.target = null;
            poi.targetRefreshCount = 0;
            poi.options = $.extend(true, {}, poi.options, options);
            poi._init();
        }

// defaults for plugin options
        PointOfInterest.prototype.options = {
            selectors: {
                'singlePointClass': 'cd-single-point',
                'closeClass': 'cd-close-info',
                'moreInfoClass': 'cd-more-info',
                'openClass': 'is-open',
                'visitedClass': 'visited'
            },
            dataValues: {
                'target': 'cd-target',
                'pointLocation': 'cd-point-location'
            },
            pointLocation: "right top",
            waitForImageLoad: true,
            autoShowPoints: true,
            targetRefreshInterval: 10 // in milliseconds
        };

// main plugin logic
        PointOfInterest.prototype._init = function () {
            "use strict";
            var poi = this,
                target = $(poi.point.data(poi.options.dataValues.target));

            if (target.length > 0) {
                poi.target = target.first();

                poi.setPointLocation();
                poi.registerPointEvents();
            }
        };

        PointOfInterest.prototype.setPointLocation = function () {
            "use strict";
            var poi = this,
                imgs,
                targetLocation,
                pointLocation,
                pointLocationWords,
                zIndex;

            if (poi.target === null || poi.point === null) {
                return;
            } else {
                targetLocation = poi.target.offset();
                pointLocation = poi.point.offset();
                pointLocationWords = poi.point.data(poi.options.dataValues.pointLocation).split(" ");
            }

            targetLocation.width = poi.target.outerWidth(false);
            targetLocation.height = poi.target.outerHeight(false);

            if (poi.options.waitForImageLoad === true) {
                imgs = poi.target.find('img');
                if ((targetLocation.width === 0 || targetLocation.height === 0) &&
                    imgs.length > 0 &&
                    poi.targetRefreshCount < 5) {

                    poi.targetRefreshCount++;
                    setTimeout(poi.setPointLocation.bind(poi), poi.options.targetRefreshInterval);
                    return;
                }
            }

            pointLocation.left = targetLocation.left;
            pointLocation.top = targetLocation.top;
            pointLocation.width = poi.point.outerWidth(false);
            pointLocation.height = poi.point.outerHeight(false);

            $.each(pointLocationWords, function (index, val) {
                switch (val) {
                    case "left":
                        // do nothing, already set.
                        break;
                    case "center":
                        pointLocation.left += targetLocation.width / 2;
                        break;
                    case "right":
                        pointLocation.left += targetLocation.width;
                        break;

                    case "top":
                        // do nothing, already set.
                        break;
                    case "middle":
                        pointLocation.top += targetLocation.height / 2;
                        break;
                    case "bottom":
                        pointLocation.top += targetLocation.height;
                        break;
                }
            });

            pointLocation.left -= pointLocation.width / 2;
            pointLocation.top -= pointLocation.height / 2;

            poi.point.offset({
                left: pointLocation.left,
                top: pointLocation.top
            });

            if (poi.target.css('position') === 'fixed') {
                poi.point.css('position', 'fixed');
            }

            zIndex = poi.target.css('z-index');
            if (zIndex === "auto") {
                zIndex = 30000;
            } else {
                zIndex = parseInt(zIndex) + 1;
            }
            poi.point.css('z-index', zIndex);

            if (poi.options.autoShowPoints === true) {
                poi.show();
            }
        };

        PointOfInterest.prototype.hide = function () {
            "use strict";
            var poi = this;

            if (poi.point !== null) {
                poi.point.hide();
            }
        };

        PointOfInterest.prototype.show = function () {
            "use strict";
            var poi = this;

            if (poi.point !== null && poi.target !== null && poi.target.is(':visible')) {
                poi.point.show();
            }
        };

        PointOfInterest.prototype.registerPointEvents = function () {
            "use strict";
            var poi = this;

            if (poi.point !== null) {
                $(window).on('resize', poi.setPointLocation.bind(poi));
                poi.target.on('resize drag', poi.setPointLocation.bind(poi));
                poi.point.on('poi.set-point-location', poi.setPointLocation.bind(poi));
                poi.point.children('a').on('click', poi.pointOpenEvent.bind(poi));
                poi.point.find('.' + poi.options.selectors.closeClass).on('click', poi.pointCloseEvent.bind(poi));
            }
        };

        PointOfInterest.prototype.pointOpenEvent = function (event) {
            "use strict";
            var poi = this;

            if (poi.point !== null) {
                if (poi.point.hasClass(poi.options.selectors.openClass)) {
                    poi.point.removeClass(poi.options.selectors.openClass)
                        .addClass(poi.options.selectors.visitedClass);
                } else {
                    poi.point.addClass(poi.options.selectors.openClass)
                        .siblings('.' + poi.options.selectors.singlePointClass + '.' + poi.options.selectors.openClass)
                        .removeClass(poi.options.selectors.openClass)
                        .addClass(poi.options.selectors.visitedClass);
                }
            }
        };

        PointOfInterest.prototype.pointCloseEvent = function (event) {
            "use strict";
            var poi = this;

            event.preventDefault();

            if (poi.point !== null) {
                poi.point.switchClass(poi.options.selectors.openClass, poi.options.selectors.visitedClass);
            }
        };

        $.bridget('pointOfInterest', PointOfInterest);
        return PointOfInterest;
    }


    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], poiDefinition);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = poiDefinition();
    } else {
        // browser global
        window.PointOfInterest = poiDefinition();
    }

})(window);

/**
 * Bridget makes jQuery widgets
 * v1.1.0
 * MIT license
 */

( function( window ) {



// -------------------------- utils -------------------------- //

var slice = Array.prototype.slice;

function noop() {}

// -------------------------- definition -------------------------- //

function defineBridget( $ ) {

// bail if no jQuery
if ( !$ ) {
  return;
}

// -------------------------- addOptionMethod -------------------------- //

/**
 * adds option method -> $().plugin('option', {...})
 * @param {Function} PluginClass - constructor class
 */
function addOptionMethod( PluginClass ) {
  // don't overwrite original option method
  if ( PluginClass.prototype.option ) {
    return;
  }

  // option setter
  PluginClass.prototype.option = function( opts ) {
    // bail out if not an object
    if ( !$.isPlainObject( opts ) ){
      return;
    }
    this.options = $.extend( true, this.options, opts );
  };
}

// -------------------------- plugin bridge -------------------------- //

// helper function for logging errors
// $.error breaks jQuery chaining
var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

/**
 * jQuery plugin bridge, access methods like $elem.plugin('method')
 * @param {String} namespace - plugin name
 * @param {Function} PluginClass - constructor class
 */
function bridge( namespace, PluginClass ) {
  // add to jQuery fn namespace
  $.fn[ namespace ] = function( options ) {
    if ( typeof options === 'string' ) {
      // call plugin method when first argument is a string
      // get arguments for method
      var args = slice.call( arguments, 1 );

      for ( var i=0, len = this.length; i < len; i++ ) {
        var elem = this[i];
        var instance = $.data( elem, namespace );
        if ( !instance ) {
          logError( "cannot call methods on " + namespace + " prior to initialization; " +
            "attempted to call '" + options + "'" );
          continue;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
          logError( "no such method '" + options + "' for " + namespace + " instance" );
          continue;
        }

        // trigger method with arguments
        var returnValue = instance[ options ].apply( instance, args );

        // break look and return first value if provided
        if ( returnValue !== undefined ) {
          return returnValue;
        }
      }
      // return this if no return value
      return this;
    } else {
      return this.each( function() {
        var instance = $.data( this, namespace );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init();
        } else {
          // initialize new instance
          instance = new PluginClass( this, options );
          $.data( this, namespace, instance );
        }
      });
    }
  };

}

// -------------------------- bridget -------------------------- //

/**
 * converts a Prototypical class into a proper jQuery plugin
 *   the class must have a ._init method
 * @param {String} namespace - plugin name, used in $().pluginName
 * @param {Function} PluginClass - constructor class
 */
$.bridget = function( namespace, PluginClass ) {
  addOptionMethod( PluginClass );
  bridge( namespace, PluginClass );
};

return $.bridget;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'node_modules/jquery-bridget/jquery.bridget.js',[ 'jquery' ], defineBridget );
} else if ( typeof exports === 'object' ) {
  defineBridget( require('jquery') );
} else {
  // get jquery from browser global
  defineBridget( window.jQuery );
}

})( window );

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
                pointLocationWords;

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

            if (poi.point !== null) {
                poi.point.show();
            }
        };

        PointOfInterest.prototype.registerPointEvents = function () {
            "use strict";
            var poi = this;

            if (poi.point !== null) {
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
        define('js/points-of-interest.js',[], poiDefinition);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = poiDefinition();
    } else {
        // browser global
        window.PointOfInterest = poiDefinition();
    }

})(window);


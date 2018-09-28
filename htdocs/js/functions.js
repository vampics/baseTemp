/**
 * author Christopher Blum
 *    - based on the idea of Remy Sharp, http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 *    - forked from http://github.com/zuk/jquery.inview/
 */
(function (factory) {
    if (typeof define == 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var inviewObjects = [], viewportSize, viewportOffset,
        d = document, w = window, documentElement = d.documentElement, timer;

    $.event.special.inview = {
        add: function(data) {
            inviewObjects.push({ data: data, $element: $(this), element: this });
            // Use setInterval in order to also make sure this captures elements within
            // "overflow:scroll" elements or elements that appeared in the dom tree due to
            // dom manipulation and reflow
            // old: $(window).scroll(checkInView);
            //
            // By the way, iOS (iPad, iPhone, ...) seems to not execute, or at least delays
            // intervals while the user scrolls. Therefore the inview event might fire a bit late there
            //
            // Don't waste cycles with an interval until we get at least one element that
            // has bound to the inview event.
            if (!timer && inviewObjects.length) {
                timer = setInterval(checkInView, 250);
            }
        },

        remove: function(data) {
            for (var i=0; i<inviewObjects.length; i++) {
                var inviewObject = inviewObjects[i];
                if (inviewObject.element === this && inviewObject.data.guid === data.guid) {
                    inviewObjects.splice(i, 1);
                    break;
                }
            }

            // Clear interval when we no longer have any elements listening
            if (!inviewObjects.length) {
                clearInterval(timer);
                timer = null;
            }
        }
    };

    function getViewportSize() {
        var mode, domObject, size = { height: w.innerHeight, width: w.innerWidth };

        // if this is correct then return it. iPad has compat Mode, so will
        // go into check clientHeight/clientWidth (which has the wrong value).
        if (!size.height) {
            mode = d.compatMode;
            if (mode || !$.support.boxModel) { // IE, Gecko
                domObject = mode === 'CSS1Compat' ?
                    documentElement : // Standards
                    d.body; // Quirks
                size = {
                    height: domObject.clientHeight,
                    width:  domObject.clientWidth
                };
            }
        }

        return size;
    }

    function getViewportOffset() {
        return {
            top:  w.pageYOffset || documentElement.scrollTop   || d.body.scrollTop,
            left: w.pageXOffset || documentElement.scrollLeft  || d.body.scrollLeft
        };
    }

    function checkInView() {
        if (!inviewObjects.length) {
            return;
        }

        var i = 0, $elements = $.map(inviewObjects, function(inviewObject) {
            var selector  = inviewObject.data.selector,
                $element  = inviewObject.$element;
            return selector ? $element.find(selector) : $element;
        });

        viewportSize   = viewportSize   || getViewportSize();
        viewportOffset = viewportOffset || getViewportOffset();

        for (; i<inviewObjects.length; i++) {
            // Ignore elements that are not in the DOM tree
            if (!$.contains(documentElement, $elements[i][0])) {
                continue;
            }

            var $element      = $($elements[i]),
                elementSize   = { height: $element[0].offsetHeight, width: $element[0].offsetWidth },
                elementOffset = $element.offset(),
                inView        = $element.data('inview');

            // Don't ask me why because I haven't figured out yet:
            // viewportOffset and viewportSize are sometimes suddenly null in Firefox 5.
            // Even though it sounds weird:
            // It seems that the execution of this function is interferred by the onresize/onscroll event
            // where viewportOffset and viewportSize are unset
            if (!viewportOffset || !viewportSize) {
                return;
            }

            if (elementOffset.top + elementSize.height > viewportOffset.top &&
                elementOffset.top < viewportOffset.top + viewportSize.height &&
                elementOffset.left + elementSize.width > viewportOffset.left &&
                elementOffset.left < viewportOffset.left + viewportSize.width) {
                if (!inView) {
                    $element.data('inview', true).trigger('inview', [true]);
                }
            } else if (inView) {
                $element.data('inview', false).trigger('inview', [false]);
            }
        }
    }

    $(w).on("scroll resize scrollstop", function() {
        viewportSize = viewportOffset = null;
    });

    // IE < 9 scrolls to focused elements without firing the "scroll" event
    if (!documentElement.addEventListener && documentElement.attachEvent) {
        documentElement.attachEvent("onfocusin", function() {
            viewportOffset = null;
        });
    }
}));

/*!
 * imagesLoaded PACKAGED v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
    // universal module definition
    /* jshint strict: false */ /* globals define, module, window */
    if ( typeof define == 'function' && define.amd ) {
        // AMD - RequireJS
        define( 'ev-emitter/ev-emitter',factory );
    } else if ( typeof module == 'object' && module.exports ) {
        // CommonJS - Browserify, Webpack
        module.exports = factory();
    } else {
        // Browser globals
        global.EvEmitter = factory();
    }

}( typeof window != 'undefined' ? window : this, function() {



    function EvEmitter() {}

    var proto = EvEmitter.prototype;

    proto.on = function( eventName, listener ) {
        if ( !eventName || !listener ) {
            return;
        }
        // set events hash
        var events = this._events = this._events || {};
        // set listeners array
        var listeners = events[ eventName ] = events[ eventName ] || [];
        // only add once
        if ( listeners.indexOf( listener ) == -1 ) {
            listeners.push( listener );
        }

        return this;
    };

    proto.once = function( eventName, listener ) {
        if ( !eventName || !listener ) {
            return;
        }
        // add event
        this.on( eventName, listener );
        // set once flag
        // set onceEvents hash
        var onceEvents = this._onceEvents = this._onceEvents || {};
        // set onceListeners object
        var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
        // set flag
        onceListeners[ listener ] = true;

        return this;
    };

    proto.off = function( eventName, listener ) {
        var listeners = this._events && this._events[ eventName ];
        if ( !listeners || !listeners.length ) {
            return;
        }
        var index = listeners.indexOf( listener );
        if ( index != -1 ) {
            listeners.splice( index, 1 );
        }

        return this;
    };

    proto.emitEvent = function( eventName, args ) {
        var listeners = this._events && this._events[ eventName ];
        if ( !listeners || !listeners.length ) {
            return;
        }
        // copy over to avoid interference if .off() in listener
        listeners = listeners.slice(0);
        args = args || [];
        // once stuff
        var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

        for ( var i=0; i < listeners.length; i++ ) {
            var listener = listeners[i]
            var isOnce = onceListeners && onceListeners[ listener ];
            if ( isOnce ) {
                // remove listener
                // remove before trigger to prevent recursion
                this.off( eventName, listener );
                // unset once flag
                delete onceListeners[ listener ];
            }
            // trigger listener
            listener.apply( this, args );
        }

        return this;
    };

    proto.allOff = function() {
        delete this._events;
        delete this._onceEvents;
    };

    return EvEmitter;

}));

/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 'use strict';
    // universal module definition

    /*global define: false, module: false, require: false */

    if ( typeof define == 'function' && define.amd ) {
        // AMD
        define( [
            'ev-emitter/ev-emitter'
        ], function( EvEmitter ) {
            return factory( window, EvEmitter );
        });
    } else if ( typeof module == 'object' && module.exports ) {
        // CommonJS
        module.exports = factory(
            window,
            require('ev-emitter')
        );
    } else {
        // browser global
        window.imagesLoaded = factory(
            window,
            window.EvEmitter
        );
    }

})( typeof window !== 'undefined' ? window : this,

// --------------------------  factory -------------------------- //

    function factory( window, EvEmitter ) {



        var $ = window.jQuery;
        var console = window.console;

// -------------------------- helpers -------------------------- //

// extend objects
        function extend( a, b ) {
            for ( var prop in b ) {
                a[ prop ] = b[ prop ];
            }
            return a;
        }

        var arraySlice = Array.prototype.slice;

// turn element or nodeList into an array
        function makeArray( obj ) {
            if ( Array.isArray( obj ) ) {
                // use object if already an array
                return obj;
            }

            var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
            if ( isArrayLike ) {
                // convert nodeList to array
                return arraySlice.call( obj );
            }

            // array of single index
            return [ obj ];
        }

// -------------------------- imagesLoaded -------------------------- //

        /**
         * @param {Array, Element, NodeList, String} elem
         * @param {Object or Function} options - if function, use as callback
         * @param {Function} onAlways - callback function
         */
        function ImagesLoaded( elem, options, onAlways ) {
            // coerce ImagesLoaded() without new, to be new ImagesLoaded()
            if ( !( this instanceof ImagesLoaded ) ) {
                return new ImagesLoaded( elem, options, onAlways );
            }
            // use elem as selector string
            var queryElem = elem;
            if ( typeof elem == 'string' ) {
                queryElem = document.querySelectorAll( elem );
            }
            // bail if bad element
            if ( !queryElem ) {
                console.error( 'Bad element for imagesLoaded ' + ( queryElem || elem ) );
                return;
            }

            this.elements = makeArray( queryElem );
            this.options = extend( {}, this.options );
            // shift arguments if no options set
            if ( typeof options == 'function' ) {
                onAlways = options;
            } else {
                extend( this.options, options );
            }

            if ( onAlways ) {
                this.on( 'always', onAlways );
            }

            this.getImages();

            if ( $ ) {
                // add jQuery Deferred object
                this.jqDeferred = new $.Deferred();
            }

            // HACK check async to allow time to bind listeners
            setTimeout( this.check.bind( this ) );
        }

        ImagesLoaded.prototype = Object.create( EvEmitter.prototype );

        ImagesLoaded.prototype.options = {};

        ImagesLoaded.prototype.getImages = function() {
            this.images = [];

            // filter & find items if we have an item selector
            this.elements.forEach( this.addElementImages, this );
        };

        /**
         * @param {Node} element
         */
        ImagesLoaded.prototype.addElementImages = function( elem ) {
            // filter siblings
            if ( elem.nodeName == 'IMG' ) {
                this.addImage( elem );
            }
            // get background image on element
            if ( this.options.background === true ) {
                this.addElementBackgroundImages( elem );
            }

            // find children
            // no non-element nodes, #143
            var nodeType = elem.nodeType;
            if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
                return;
            }
            var childImgs = elem.querySelectorAll('img');
            // concat childElems to filterFound array
            for ( var i=0; i < childImgs.length; i++ ) {
                var img = childImgs[i];
                this.addImage( img );
            }

            // get child background images
            if ( typeof this.options.background == 'string' ) {
                var children = elem.querySelectorAll( this.options.background );
                for ( i=0; i < children.length; i++ ) {
                    var child = children[i];
                    this.addElementBackgroundImages( child );
                }
            }
        };

        var elementNodeTypes = {
            1: true,
            9: true,
            11: true
        };

        ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
            var style = getComputedStyle( elem );
            if ( !style ) {
                // Firefox returns null if in a hidden iframe https://bugzil.la/548397
                return;
            }
            // get url inside url("...")
            var reURL = /url\((['"])?(.*?)\1\)/gi;
            var matches = reURL.exec( style.backgroundImage );
            while ( matches !== null ) {
                var url = matches && matches[2];
                if ( url ) {
                    this.addBackground( url, elem );
                }
                matches = reURL.exec( style.backgroundImage );
            }
        };

        /**
         * @param {Image} img
         */
        ImagesLoaded.prototype.addImage = function( img ) {
            var loadingImage = new LoadingImage( img );
            this.images.push( loadingImage );
        };

        ImagesLoaded.prototype.addBackground = function( url, elem ) {
            var background = new Background( url, elem );
            this.images.push( background );
        };

        ImagesLoaded.prototype.check = function() {
            var _this = this;
            this.progressedCount = 0;
            this.hasAnyBroken = false;
            // complete if no images
            if ( !this.images.length ) {
                this.complete();
                return;
            }

            function onProgress( image, elem, message ) {
                // HACK - Chrome triggers event before object properties have changed. #83
                setTimeout( function() {
                    _this.progress( image, elem, message );
                });
            }

            this.images.forEach( function( loadingImage ) {
                loadingImage.once( 'progress', onProgress );
                loadingImage.check();
            });
        };

        ImagesLoaded.prototype.progress = function( image, elem, message ) {
            this.progressedCount++;
            this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
            // progress event
            this.emitEvent( 'progress', [ this, image, elem ] );
            if ( this.jqDeferred && this.jqDeferred.notify ) {
                this.jqDeferred.notify( this, image );
            }
            // check if completed
            if ( this.progressedCount == this.images.length ) {
                this.complete();
            }

            if ( this.options.debug && console ) {
                console.log( 'progress: ' + message, image, elem );
            }
        };

        ImagesLoaded.prototype.complete = function() {
            var eventName = this.hasAnyBroken ? 'fail' : 'done';
            this.isComplete = true;
            this.emitEvent( eventName, [ this ] );
            this.emitEvent( 'always', [ this ] );
            if ( this.jqDeferred ) {
                var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
                this.jqDeferred[ jqMethod ]( this );
            }
        };

// --------------------------  -------------------------- //

        function LoadingImage( img ) {
            this.img = img;
        }

        LoadingImage.prototype = Object.create( EvEmitter.prototype );

        LoadingImage.prototype.check = function() {
            // If complete is true and browser supports natural sizes,
            // try to check for image status manually.
            var isComplete = this.getIsImageComplete();
            if ( isComplete ) {
                // report based on naturalWidth
                this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
                return;
            }

            // If none of the checks above matched, simulate loading on detached element.
            this.proxyImage = new Image();
            this.proxyImage.addEventListener( 'load', this );
            this.proxyImage.addEventListener( 'error', this );
            // bind to image as well for Firefox. #191
            this.img.addEventListener( 'load', this );
            this.img.addEventListener( 'error', this );
            this.proxyImage.src = this.img.src;
        };

        LoadingImage.prototype.getIsImageComplete = function() {
            // check for non-zero, non-undefined naturalWidth
            // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
            return this.img.complete && this.img.naturalWidth;
        };

        LoadingImage.prototype.confirm = function( isLoaded, message ) {
            this.isLoaded = isLoaded;
            this.emitEvent( 'progress', [ this, this.img, message ] );
        };

// ----- events ----- //

// trigger specified handler for event type
        LoadingImage.prototype.handleEvent = function( event ) {
            var method = 'on' + event.type;
            if ( this[ method ] ) {
                this[ method ]( event );
            }
        };

        LoadingImage.prototype.onload = function() {
            this.confirm( true, 'onload' );
            this.unbindEvents();
        };

        LoadingImage.prototype.onerror = function() {
            this.confirm( false, 'onerror' );
            this.unbindEvents();
        };

        LoadingImage.prototype.unbindEvents = function() {
            this.proxyImage.removeEventListener( 'load', this );
            this.proxyImage.removeEventListener( 'error', this );
            this.img.removeEventListener( 'load', this );
            this.img.removeEventListener( 'error', this );
        };

// -------------------------- Background -------------------------- //

        function Background( url, element ) {
            this.url = url;
            this.element = element;
            this.img = new Image();
        }

// inherit LoadingImage prototype
        Background.prototype = Object.create( LoadingImage.prototype );

        Background.prototype.check = function() {
            this.img.addEventListener( 'load', this );
            this.img.addEventListener( 'error', this );
            this.img.src = this.url;
            // check if image is already complete
            var isComplete = this.getIsImageComplete();
            if ( isComplete ) {
                this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
                this.unbindEvents();
            }
        };

        Background.prototype.unbindEvents = function() {
            this.img.removeEventListener( 'load', this );
            this.img.removeEventListener( 'error', this );
        };

        Background.prototype.confirm = function( isLoaded, message ) {
            this.isLoaded = isLoaded;
            this.emitEvent( 'progress', [ this, this.element, message ] );
        };

// -------------------------- jQuery -------------------------- //

        ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
            jQuery = jQuery || window.jQuery;
            if ( !jQuery ) {
                return;
            }
            // set local variable
            $ = jQuery;
            // $().imagesLoaded()
            $.fn.imagesLoaded = function( options, callback ) {
                var instance = new ImagesLoaded( this, options, callback );
                return instance.jqDeferred.promise( $(this) );
            };
        };
// try making plugin
        ImagesLoaded.makeJQueryPlugin();

// --------------------------  -------------------------- //

        return ImagesLoaded;

    });


/*!
 *         ,/
 *       ,'/
 *     ,' /
 *   ,'  /_____,
 * .'____    ,'
 *      /  ,'
 *     / ,'
 *    /,'
 *   /'
 *
 * Selectric ϟ v1.13.0 (Aug 22 2017) - http://lcdsantos.github.io/jQuery-Selectric/
 *
 * Copyright (c) 2017 Leonardo Santos; MIT License
 *
 */

(function(factory) {
  /* global define */
  /* istanbul ignore next */
  if ( typeof define === 'function' && define.amd ) {
    define(['jquery'], factory);
  } else if ( typeof module === 'object' && module.exports ) {
    // Node/CommonJS
    module.exports = function( root, jQuery ) {
      if ( jQuery === undefined ) {
        if ( typeof window !== 'undefined' ) {
          jQuery = require('jquery');
        } else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
  'use strict';

  var $doc = $(document);
  var $win = $(window);

  var pluginName = 'selectric';
  var classList = 'Input Items Open Disabled TempShow HideSelect Wrapper Focus Hover Responsive Above Below Scroll Group GroupLabel';
  var eventNamespaceSuffix = '.sl';

  var chars = ['a', 'e', 'i', 'o', 'u', 'n', 'c', 'y'];
  var diacritics = [
    /[\xE0-\xE5]/g, // a
    /[\xE8-\xEB]/g, // e
    /[\xEC-\xEF]/g, // i
    /[\xF2-\xF6]/g, // o
    /[\xF9-\xFC]/g, // u
    /[\xF1]/g,      // n
    /[\xE7]/g,      // c
    /[\xFD-\xFF]/g  // y
  ];

  /**
   * Create an instance of Selectric
   *
   * @constructor
   * @param {Node} element - The &lt;select&gt; element
   * @param {object}  opts - Options
   */
  var Selectric = function(element, opts) {
    var _this = this;

    _this.element = element;
    _this.$element = $(element);

    _this.state = {
      multiple       : !!_this.$element.attr('multiple'),
      enabled        : false,
      opened         : false,
      currValue      : -1,
      selectedIdx    : -1,
      highlightedIdx : -1
    };

    _this.eventTriggers = {
      open    : _this.open,
      close   : _this.close,
      destroy : _this.destroy,
      refresh : _this.refresh,
      init    : _this.init
    };

    _this.init(opts);
  };

  Selectric.prototype = {
    utils: {
      /**
       * Detect mobile browser
       *
       * @return {boolean}
       */
      isMobile: function() {
        return /android|ip(hone|od|ad)/i.test(navigator.userAgent);
      },

      /**
       * Escape especial characters in string (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
       *
       * @param  {string} str - The string to be escaped
       * @return {string}       The string with the special characters escaped
       */
      escapeRegExp: function(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
      },

      /**
       * Replace diacritics
       *
       * @param  {string} str - The string to replace the diacritics
       * @return {string}       The string with diacritics replaced with ascii characters
       */
      replaceDiacritics: function(str) {
        var k = diacritics.length;

        while (k--) {
          str = str.toLowerCase().replace(diacritics[k], chars[k]);
        }

        return str;
      },

      /**
       * Format string
       * https://gist.github.com/atesgoral/984375
       *
       * @param  {string} f - String to be formated
       * @return {string}     String formated
       */
      format: function(f) {
        var a = arguments; // store outer arguments
        return ('' + f) // force format specifier to String
          .replace( // replace tokens in format specifier
            /\{(?:(\d+)|(\w+))\}/g, // match {token} references
            function(
              s, // the matched string (ignored)
              i, // an argument index
              p // a property name
            ) {
              return p && a[1] // if property name and first argument exist
                ? a[1][p] // return property from first argument
                : a[i]; // assume argument index and return i-th argument
            });
      },

      /**
       * Get the next enabled item in the options list.
       *
       * @param  {object} selectItems - The options object.
       * @param  {number}    selected - Index of the currently selected option.
       * @return {object}               The next enabled item.
       */
      nextEnabledItem: function(selectItems, selected) {
        while ( selectItems[ selected = (selected + 1) % selectItems.length ].disabled ) {
          // empty
        }
        return selected;
      },

      /**
       * Get the previous enabled item in the options list.
       *
       * @param  {object} selectItems - The options object.
       * @param  {number}    selected - Index of the currently selected option.
       * @return {object}               The previous enabled item.
       */
      previousEnabledItem: function(selectItems, selected) {
        while ( selectItems[ selected = (selected > 0 ? selected : selectItems.length) - 1 ].disabled ) {
          // empty
        }
        return selected;
      },

      /**
       * Transform camelCase string to dash-case.
       *
       * @param  {string} str - The camelCased string.
       * @return {string}       The string transformed to dash-case.
       */
      toDash: function(str) {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      },

      /**
       * Calls the events registered with function name.
       *
       * @param {string}    fn - The name of the function.
       * @param {number} scope - Scope that should be set on the function.
       */
      triggerCallback: function(fn, scope) {
        var elm = scope.element;
        var func = scope.options['on' + fn];
        var args = [elm].concat([].slice.call(arguments).slice(1));

        if ( $.isFunction(func) ) {
          func.apply(elm, args);
        }

        $(elm).trigger(pluginName + '-' + this.toDash(fn), args);
      },

      /**
       * Transform array list to concatenated string and remove empty values
       * @param  {array} arr - Class list
       * @return {string}      Concatenated string
       */
      arrayToClassname: function(arr) {
        var newArr = $.grep(arr, function(item) {
          return !!item;
        });

        return $.trim(newArr.join(' '));
      }
    },

    /** Initializes */
    init: function(opts) {
      var _this = this;

      // Set options
      _this.options = $.extend(true, {}, $.fn[pluginName].defaults, _this.options, opts);

      _this.utils.triggerCallback('BeforeInit', _this);

      // Preserve data
      _this.destroy(true);

      // Disable on mobile browsers
      if ( _this.options.disableOnMobile && _this.utils.isMobile() ) {
        _this.disableOnMobile = true;
        return;
      }

      // Get classes
      _this.classes = _this.getClassNames();

      // Create elements
      var input              = $('<input/>', { 'class': _this.classes.input, 'readonly': _this.utils.isMobile() });
      var items              = $('<div/>',   { 'class': _this.classes.items, 'tabindex': -1 });
      var itemsScroll        = $('<div/>',   { 'class': _this.classes.scroll });
      var wrapper            = $('<div/>',   { 'class': _this.classes.prefix, 'html': _this.options.arrowButtonMarkup });
      var label              = $('<span/>',  { 'class': 'label' });
      var outerWrapper       = _this.$element.wrap('<div/>').parent().append(wrapper.prepend(label), items, input);
      var hideSelectWrapper  = $('<div/>',   { 'class': _this.classes.hideselect });

      _this.elements = {
        input        : input,
        items        : items,
        itemsScroll  : itemsScroll,
        wrapper      : wrapper,
        label        : label,
        outerWrapper : outerWrapper
      };

      if ( _this.options.nativeOnMobile && _this.utils.isMobile() ) {
        _this.elements.input = undefined;
        hideSelectWrapper.addClass(_this.classes.prefix + '-is-native');

        _this.$element.on('change', function() {
          _this.refresh();
        });
      }

      _this.$element
        .on(_this.eventTriggers)
        .wrap(hideSelectWrapper);

      _this.originalTabindex = _this.$element.prop('tabindex');
      _this.$element.prop('tabindex', -1);

      _this.populate();
      _this.activate();

      _this.utils.triggerCallback('Init', _this);
    },

    /** Activates the plugin */
    activate: function() {
      var _this = this;
      var hiddenChildren = _this.elements.items.closest(':visible').children(':hidden').addClass(_this.classes.tempshow);
      var originalWidth = _this.$element.width();

      hiddenChildren.removeClass(_this.classes.tempshow);

      _this.utils.triggerCallback('BeforeActivate', _this);

      _this.elements.outerWrapper.prop('class',
        _this.utils.arrayToClassname([
          _this.classes.wrapper,
          _this.$element.prop('class').replace(/\S+/g, _this.classes.prefix + '-$&'),
          _this.options.responsive ? _this.classes.responsive : ''
        ])
      );

      if ( _this.options.inheritOriginalWidth && originalWidth > 0 ) {
        _this.elements.outerWrapper.width(originalWidth);
      }

      _this.unbindEvents();

      if ( !_this.$element.prop('disabled') ) {
        _this.state.enabled = true;

        // Not disabled, so... Removing disabled class
        _this.elements.outerWrapper.removeClass(_this.classes.disabled);

        // Remove styles from items box
        // Fix incorrect height when refreshed is triggered with fewer options
        _this.$li = _this.elements.items.removeAttr('style').find('li');

        _this.bindEvents();
      } else {
        _this.elements.outerWrapper.addClass(_this.classes.disabled);

        if ( _this.elements.input ) {
          _this.elements.input.prop('disabled', true);
        }
      }

      _this.utils.triggerCallback('Activate', _this);
    },

    /**
     * Generate classNames for elements
     *
     * @return {object} Classes object
     */
    getClassNames: function() {
      var _this = this;
      var customClass = _this.options.customClass;
      var classesObj = {};

      $.each(classList.split(' '), function(i, currClass) {
        var c = customClass.prefix + currClass;
        classesObj[currClass.toLowerCase()] = customClass.camelCase ? c : _this.utils.toDash(c);
      });

      classesObj.prefix = customClass.prefix;

      return classesObj;
    },

    /** Set the label text */
    setLabel: function() {
      var _this = this;
      var labelBuilder = _this.options.labelBuilder;

      if ( _this.state.multiple ) {
        // Make sure currentValues is an array
        var currentValues = $.isArray(_this.state.currValue) ? _this.state.currValue : [_this.state.currValue];
        // I'm not happy with this, but currentValues can be an empty
        // array and we need to fallback to the default option.
        currentValues = currentValues.length === 0 ? [0] : currentValues;

        var labelMarkup = $.map(currentValues, function(value) {
          return $.grep(_this.lookupItems, function(item) {
            return item.index === value;
          })[0]; // we don't want nested arrays here
        });

        labelMarkup = $.grep(labelMarkup, function(item) {
          // Hide default (please choose) if more then one element were selected.
          // If no option value were given value is set to option text by default
          if ( labelMarkup.length > 1 || labelMarkup.length === 0 ) {
            return $.trim(item.value) !== '';
          }
          return item;
        });

        labelMarkup = $.map(labelMarkup, function(item) {
          return $.isFunction(labelBuilder)
            ? labelBuilder(item)
            : _this.utils.format(labelBuilder, item);
        });

        // Limit the amount of selected values shown in label
        if ( _this.options.multiple.maxLabelEntries ) {
          if ( labelMarkup.length >= _this.options.multiple.maxLabelEntries + 1 ) {
            labelMarkup = labelMarkup.slice(0, _this.options.multiple.maxLabelEntries);
            labelMarkup.push(
              $.isFunction(labelBuilder)
                ? labelBuilder({ text: '...' })
                : _this.utils.format(labelBuilder, { text: '...' }));
          } else {
            labelMarkup.slice(labelMarkup.length - 1);
          }
        }
        _this.elements.label.html(labelMarkup.join(_this.options.multiple.separator));

      } else {
        var currItem = _this.lookupItems[_this.state.currValue];

        _this.elements.label.html(
          $.isFunction(labelBuilder)
            ? labelBuilder(currItem)
            : _this.utils.format(labelBuilder, currItem)
        );
      }
    },

    /** Get and save the available options */
    populate: function() {
      var _this = this;
      var $options = _this.$element.children();
      var $justOptions = _this.$element.find('option');
      var $selected = $justOptions.filter(':selected');
      var selectedIndex = $justOptions.index($selected);
      var currIndex = 0;
      var emptyValue = (_this.state.multiple ? [] : 0);

      if ( $selected.length > 1 && _this.state.multiple ) {
        selectedIndex = [];
        $selected.each(function() {
          selectedIndex.push($(this).index());
        });
      }

      _this.state.currValue = (~selectedIndex ? selectedIndex : emptyValue);
      _this.state.selectedIdx = _this.state.currValue;
      _this.state.highlightedIdx = _this.state.currValue;
      _this.items = [];
      _this.lookupItems = [];

      if ( $options.length ) {
        // Build options markup
        $options.each(function(i) {
          var $elm = $(this);

          if ( $elm.is('optgroup') ) {

            var optionsGroup = {
              element       : $elm,
              label         : $elm.prop('label'),
              groupDisabled : $elm.prop('disabled'),
              items         : []
            };

            $elm.children().each(function(i) {
              var $elm = $(this);

              optionsGroup.items[i] = _this.getItemData(currIndex, $elm, optionsGroup.groupDisabled || $elm.prop('disabled'));

              _this.lookupItems[currIndex] = optionsGroup.items[i];

              currIndex++;
            });

            _this.items[i] = optionsGroup;

          } else {

            _this.items[i] = _this.getItemData(currIndex, $elm, $elm.prop('disabled'));

            _this.lookupItems[currIndex] = _this.items[i];

            currIndex++;

          }
        });

        _this.setLabel();
        _this.elements.items.append( _this.elements.itemsScroll.html( _this.getItemsMarkup(_this.items) ) );
      }
    },

    /**
     * Generate items object data
     * @param  {integer} index      - Current item index
     * @param  {node}    $elm       - Current element node
     * @param  {boolean} isDisabled - Current element disabled state
     * @return {object}               Item object
     */
    getItemData: function(index, $elm, isDisabled) {
      var _this = this;

      return {
        index     : index,
        element   : $elm,
        value     : $elm.val(),
        className : $elm.prop('class'),
        text      : $elm.html(),
        slug      : $.trim(_this.utils.replaceDiacritics($elm.html())),
        alt       : $elm.attr('data-alt'),
        selected  : $elm.prop('selected'),
        disabled  : isDisabled
      };
    },

    /**
     * Generate options markup
     *
     * @param  {object} items - Object containing all available options
     * @return {string}         HTML for the options box
     */
    getItemsMarkup: function(items) {
      var _this = this;
      var markup = '<ul>';

      if ( $.isFunction(_this.options.listBuilder) && _this.options.listBuilder ) {
        items = _this.options.listBuilder(items);
      }

      $.each(items, function(i, elm) {
        if ( elm.label !== undefined ) {

          markup += _this.utils.format('<ul class="{1}"><li class="{2}">{3}</li>',
            _this.utils.arrayToClassname([
              _this.classes.group,
              elm.groupDisabled ? 'disabled' : '',
              elm.element.prop('class')
            ]),
            _this.classes.grouplabel,
            elm.element.prop('label')
          );

          $.each(elm.items, function(i, elm) {
            markup += _this.getItemMarkup(elm.index, elm);
          });

          markup += '</ul>';

        } else {

          markup += _this.getItemMarkup(elm.index, elm);

        }
      });

      return markup + '</ul>';
    },

    /**
     * Generate every option markup
     *
     * @param  {number} index    - Index of current item
     * @param  {object} itemData - Current item
     * @return {string}            HTML for the option
     */
    getItemMarkup: function(index, itemData) {
      var _this = this;
      var itemBuilder = _this.options.optionsItemBuilder;
      // limit access to item data to provide a simple interface
      // to most relevant options.
      var filteredItemData = {
        value: itemData.value,
        text : itemData.text,
        slug : itemData.slug,
        index: itemData.index
      };

      return _this.utils.format('<li data-index="{1}" class="{2}">{3}</li>',
        index,
        _this.utils.arrayToClassname([
          itemData.className,
          index === _this.items.length - 1  ? 'last'     : '',
          itemData.disabled                 ? 'disabled' : '',
          itemData.selected                 ? 'selected' : ''
        ]),
        $.isFunction(itemBuilder)
          ? _this.utils.format(itemBuilder(itemData, this.$element, index), itemData)
          : _this.utils.format(itemBuilder, filteredItemData)
      );
    },

    /** Remove events on the elements */
    unbindEvents: function() {
      var _this = this;

      _this.elements.wrapper
        .add(_this.$element)
        .add(_this.elements.outerWrapper)
        .add(_this.elements.input)
        .off(eventNamespaceSuffix);
    },

    /** Bind events on the elements */
    bindEvents: function() {
      var _this = this;

      _this.elements.outerWrapper.on('mouseenter' + eventNamespaceSuffix + ' mouseleave' + eventNamespaceSuffix, function(e) {
        $(this).toggleClass(_this.classes.hover, e.type === 'mouseenter');

        // Delay close effect when openOnHover is true
        if ( _this.options.openOnHover ) {
          clearTimeout(_this.closeTimer);

          if ( e.type === 'mouseleave' ) {
            _this.closeTimer = setTimeout($.proxy(_this.close, _this), _this.options.hoverIntentTimeout);
          } else {
            _this.open();
          }
        }
      });

      // Toggle open/close
      _this.elements.wrapper.on('click' + eventNamespaceSuffix, function(e) {
        _this.state.opened ? _this.close() : _this.open(e);
      });

      // Translate original element focus event to dummy input.
      // Disabled on mobile devices because the default option list isn't
      // shown due the fact that hidden input gets focused
      if ( !(_this.options.nativeOnMobile && _this.utils.isMobile()) ) {
        _this.$element.on('focus' + eventNamespaceSuffix, function() {
          _this.elements.input.focus();
        });

        _this.elements.input
          .prop({ tabindex: _this.originalTabindex, disabled: false })
          .on('keydown' + eventNamespaceSuffix, $.proxy(_this.handleKeys, _this))
          .on('focusin' + eventNamespaceSuffix, function(e) {
            _this.elements.outerWrapper.addClass(_this.classes.focus);

            // Prevent the flicker when focusing out and back again in the browser window
            _this.elements.input.one('blur', function() {
              _this.elements.input.blur();
            });

            if ( _this.options.openOnFocus && !_this.state.opened ) {
              _this.open(e);
            }
          })
          .on('focusout' + eventNamespaceSuffix, function() {
            _this.elements.outerWrapper.removeClass(_this.classes.focus);
          })
          .on('input propertychange', function() {
            var val = _this.elements.input.val();
            var searchRegExp = new RegExp('^' + _this.utils.escapeRegExp(val), 'i');

            // Clear search
            clearTimeout(_this.resetStr);
            _this.resetStr = setTimeout(function() {
              _this.elements.input.val('');
            }, _this.options.keySearchTimeout);

            if ( val.length ) {
              // Search in select options
              $.each(_this.items, function(i, elm) {
                if (elm.disabled) {
                  return;
                }
                if (searchRegExp.test(elm.text) || searchRegExp.test(elm.slug)) {
                  _this.highlight(i);
                  return;
                }
                if (!elm.alt) {
                  return;
                }
                var altItems = elm.alt.split('|');
                for (var ai = 0; ai < altItems.length; ai++) {
                  if (!altItems[ai]) {
                    break;
                  }
                  if (searchRegExp.test(altItems[ai].trim())) {
                    _this.highlight(i);
                    return;
                  }
                }
              });
            }
          });
      }

      _this.$li.on({
        // Prevent <input> blur on Chrome
        mousedown: function(e) {
          e.preventDefault();
          e.stopPropagation();
        },
        click: function() {
          _this.select($(this).data('index'));

          // Chrome doesn't close options box if select is wrapped with a label
          // We need to 'return false' to avoid that
          return false;
        }
      });
    },

    /**
     * Behavior when keyboard keys is pressed
     *
     * @param {object} e - Event object
     */
    handleKeys: function(e) {
      var _this = this;
      var key = e.which;
      var keys = _this.options.keys;

      var isPrevKey = $.inArray(key, keys.previous) > -1;
      var isNextKey = $.inArray(key, keys.next) > -1;
      var isSelectKey = $.inArray(key, keys.select) > -1;
      var isOpenKey = $.inArray(key, keys.open) > -1;
      var idx = _this.state.highlightedIdx;
      var isFirstOrLastItem = (isPrevKey && idx === 0) || (isNextKey && (idx + 1) === _this.items.length);
      var goToItem = 0;

      // Enter / Space
      if ( key === 13 || key === 32 ) {
        e.preventDefault();
      }

      // If it's a directional key
      if ( isPrevKey || isNextKey ) {
        if ( !_this.options.allowWrap && isFirstOrLastItem ) {
          return;
        }

        if ( isPrevKey ) {
          goToItem = _this.utils.previousEnabledItem(_this.lookupItems, idx);
        }

        if ( isNextKey ) {
          goToItem = _this.utils.nextEnabledItem(_this.lookupItems, idx);
        }

        _this.highlight(goToItem);
      }

      // Tab / Enter / ESC
      if ( isSelectKey && _this.state.opened ) {
        _this.select(idx);

        if ( !_this.state.multiple || !_this.options.multiple.keepMenuOpen ) {
          _this.close();
        }

        return;
      }

      // Space / Enter / Left / Up / Right / Down
      if ( isOpenKey && !_this.state.opened ) {
        _this.open();
      }
    },

    /** Update the items object */
    refresh: function() {
      var _this = this;

      _this.populate();
      _this.activate();
      _this.utils.triggerCallback('Refresh', _this);
    },

    /** Set options box width/height */
    setOptionsDimensions: function() {
      var _this = this;

      // Calculate options box height
      // Set a temporary class on the hidden parent of the element
      var hiddenChildren = _this.elements.items.closest(':visible').children(':hidden').addClass(_this.classes.tempshow);
      var maxHeight = _this.options.maxHeight;
      var itemsWidth = _this.elements.items.outerWidth();
      var wrapperWidth = _this.elements.wrapper.outerWidth() - (itemsWidth - _this.elements.items.width());

      // Set the dimensions, minimum is wrapper width, expand for long items if option is true
      if ( !_this.options.expandToItemText || wrapperWidth > itemsWidth ) {
        _this.finalWidth = wrapperWidth;
      } else {
        // Make sure the scrollbar width is included
        _this.elements.items.css('overflow', 'scroll');

        // Set a really long width for _this.elements.outerWrapper
        _this.elements.outerWrapper.width(9e4);
        _this.finalWidth = _this.elements.items.width();
        // Set scroll bar to auto
        _this.elements.items.css('overflow', '');
        _this.elements.outerWrapper.width('');
      }

      _this.elements.items.width(_this.finalWidth).height() > maxHeight && _this.elements.items.height(maxHeight);

      // Remove the temporary class
      hiddenChildren.removeClass(_this.classes.tempshow);
    },

    /** Detect if the options box is inside the window */
    isInViewport: function() {
      var _this = this;

      if (_this.options.forceRenderAbove === true) {
        _this.elements.outerWrapper.addClass(_this.classes.above);
      } else if (_this.options.forceRenderBelow === true) {
        _this.elements.outerWrapper.addClass(_this.classes.below);
      } else {
        var scrollTop = $win.scrollTop();
        var winHeight = $win.height();
        var uiPosX = _this.elements.outerWrapper.offset().top;
        var uiHeight = _this.elements.outerWrapper.outerHeight();

        var fitsDown = (uiPosX + uiHeight + _this.itemsHeight) <= (scrollTop + winHeight);
        var fitsAbove = (uiPosX - _this.itemsHeight) > scrollTop;

        // If it does not fit below, only render it
        // above it fit's there.
        // It's acceptable that the user needs to
        // scroll the viewport to see the cut off UI
        var renderAbove = !fitsDown && fitsAbove;
        var renderBelow = !renderAbove;

        _this.elements.outerWrapper.toggleClass(_this.classes.above, renderAbove);
        _this.elements.outerWrapper.toggleClass(_this.classes.below, renderBelow);
      }
    },

    /**
     * Detect if currently selected option is visible and scroll the options box to show it
     *
     * @param {Number|Array} index - Index of the selected items
     */
    detectItemVisibility: function(index) {
      var _this = this;
      var $filteredLi = _this.$li.filter('[data-index]');

      if ( _this.state.multiple ) {
        // If index is an array, we can assume a multiple select and we
        // want to scroll to the uppermost selected item!
        // Math.min.apply(Math, index) returns the lowest entry in an Array.
        index = ($.isArray(index) && index.length === 0) ? 0 : index;
        index = $.isArray(index) ? Math.min.apply(Math, index) : index;
      }

      var liHeight = $filteredLi.eq(index).outerHeight();
      var liTop = $filteredLi[index].offsetTop;
      var itemsScrollTop = _this.elements.itemsScroll.scrollTop();
      var scrollT = liTop + liHeight * 2;

      _this.elements.itemsScroll.scrollTop(
        scrollT > itemsScrollTop + _this.itemsHeight ? scrollT - _this.itemsHeight :
          liTop - liHeight < itemsScrollTop ? liTop - liHeight :
            itemsScrollTop
      );
    },

    /**
     * Open the select options box
     *
     * @param {Event} e - Event
     */
    open: function(e) {
      var _this = this;

      if ( _this.options.nativeOnMobile && _this.utils.isMobile()) {
        return false;
      }

      _this.utils.triggerCallback('BeforeOpen', _this);

      if ( e ) {
        e.preventDefault();
        if (_this.options.stopPropagation) {
          e.stopPropagation();
        }
      }

      if ( _this.state.enabled ) {
        _this.setOptionsDimensions();

        // Find any other opened instances of select and close it
        $('.' + _this.classes.hideselect, '.' + _this.classes.open).children()[pluginName]('close');

        _this.state.opened = true;
        _this.itemsHeight = _this.elements.items.outerHeight();
        _this.itemsInnerHeight = _this.elements.items.height();

        // Toggle options box visibility
        _this.elements.outerWrapper.addClass(_this.classes.open);

        // Give dummy input focus
        _this.elements.input.val('');
        if ( e && e.type !== 'focusin' ) {
          _this.elements.input.focus();
        }

        // Delayed binds events on Document to make label clicks work
        setTimeout(function() {
          $doc
            .on('click' + eventNamespaceSuffix, $.proxy(_this.close, _this))
            .on('scroll' + eventNamespaceSuffix, $.proxy(_this.isInViewport, _this));
        }, 1);

        _this.isInViewport();

        // Prevent window scroll when using mouse wheel inside items box
        if ( _this.options.preventWindowScroll ) {
          /* istanbul ignore next */
          $doc.on('mousewheel' + eventNamespaceSuffix + ' DOMMouseScroll' + eventNamespaceSuffix, '.' + _this.classes.scroll, function(e) {
            var orgEvent = e.originalEvent;
            var scrollTop = $(this).scrollTop();
            var deltaY = 0;

            if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1; }
            if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;  }
            if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY; }
            if ( 'deltaY'      in orgEvent ) { deltaY = orgEvent.deltaY * -1; }

            if ( scrollTop === (this.scrollHeight - _this.itemsInnerHeight) && deltaY < 0 || scrollTop === 0 && deltaY > 0 ) {
              e.preventDefault();
            }
          });
        }

        _this.detectItemVisibility(_this.state.selectedIdx);

        _this.highlight(_this.state.multiple ? -1 : _this.state.selectedIdx);

        _this.utils.triggerCallback('Open', _this);
      }
    },

    /** Close the select options box */
    close: function() {
      var _this = this;

      _this.utils.triggerCallback('BeforeClose', _this);

      // Remove custom events on document
      $doc.off(eventNamespaceSuffix);

      // Remove visible class to hide options box
      _this.elements.outerWrapper.removeClass(_this.classes.open);

      _this.state.opened = false;

      _this.utils.triggerCallback('Close', _this);
    },

    /** Select current option and change the label */
    change: function() {
      var _this = this;

      _this.utils.triggerCallback('BeforeChange', _this);

      if ( _this.state.multiple ) {
        // Reset old selected
        $.each(_this.lookupItems, function(idx) {
          _this.lookupItems[idx].selected = false;
          _this.$element.find('option').prop('selected', false);
        });

        // Set new selected
        $.each(_this.state.selectedIdx, function(idx, value) {
          _this.lookupItems[value].selected = true;
          _this.$element.find('option').eq(value).prop('selected', true);
        });

        _this.state.currValue = _this.state.selectedIdx;

        _this.setLabel();

        _this.utils.triggerCallback('Change', _this);
      } else if ( _this.state.currValue !== _this.state.selectedIdx ) {
        // Apply changed value to original select
        _this.$element
          .prop('selectedIndex', _this.state.currValue = _this.state.selectedIdx)
          .data('value', _this.lookupItems[_this.state.selectedIdx].text);

        // Change label text
        _this.setLabel();

        _this.utils.triggerCallback('Change', _this);
      }
    },

    /**
     * Highlight option
     * @param {number} index - Index of the options that will be highlighted
     */
    highlight: function(index) {
      var _this = this;
      var $filteredLi = _this.$li.filter('[data-index]').removeClass('highlighted');

      _this.utils.triggerCallback('BeforeHighlight', _this);

      // Parameter index is required and should not be a disabled item
      if ( index === undefined || index === -1 || _this.lookupItems[index].disabled ) {
        return;
      }

      $filteredLi
        .eq(_this.state.highlightedIdx = index)
        .addClass('highlighted');

      _this.detectItemVisibility(index);

      _this.utils.triggerCallback('Highlight', _this);
    },

    /**
     * Select option
     *
     * @param {number} index - Index of the option that will be selected
     */
    select: function(index) {
      var _this = this;
      var $filteredLi = _this.$li.filter('[data-index]');

      _this.utils.triggerCallback('BeforeSelect', _this, index);

      // Parameter index is required and should not be a disabled item
      if ( index === undefined || index === -1 || _this.lookupItems[index].disabled ) {
        return;
      }

      if ( _this.state.multiple ) {
        // Make sure selectedIdx is an array
        _this.state.selectedIdx = $.isArray(_this.state.selectedIdx) ? _this.state.selectedIdx : [_this.state.selectedIdx];

        var hasSelectedIndex = $.inArray(index, _this.state.selectedIdx);
        if ( hasSelectedIndex !== -1 ) {
          _this.state.selectedIdx.splice(hasSelectedIndex, 1);
        } else {
          _this.state.selectedIdx.push(index);
        }

        $filteredLi
          .removeClass('selected')
          .filter(function(index) {
            return $.inArray(index, _this.state.selectedIdx) !== -1;
          })
          .addClass('selected');
      } else {
        $filteredLi
          .removeClass('selected')
          .eq(_this.state.selectedIdx = index)
          .addClass('selected');
      }

      if ( !_this.state.multiple || !_this.options.multiple.keepMenuOpen ) {
        _this.close();
      }

      _this.change();

      _this.utils.triggerCallback('Select', _this, index);
    },

    /**
     * Unbind and remove
     *
     * @param {boolean} preserveData - Check if the data on the element should be removed too
     */
    destroy: function(preserveData) {
      var _this = this;

      if ( _this.state && _this.state.enabled ) {
        _this.elements.items.add(_this.elements.wrapper).add(_this.elements.input).remove();

        if ( !preserveData ) {
          _this.$element.removeData(pluginName).removeData('value');
        }

        _this.$element.prop('tabindex', _this.originalTabindex).off(eventNamespaceSuffix).off(_this.eventTriggers).unwrap().unwrap();

        _this.state.enabled = false;
      }
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(args) {
    return this.each(function() {
      var data = $.data(this, pluginName);

      if ( data && !data.disableOnMobile ) {
        (typeof args === 'string' && data[args]) ? data[args]() : data.init(args);
      } else {
        $.data(this, pluginName, new Selectric(this, args));
      }
    });
  };

  /**
   * Default plugin options
   *
   * @type {object}
   */
  $.fn[pluginName].defaults = {
    onChange             : function(elm) { $(elm).change(); },
    maxHeight            : 300,
    keySearchTimeout     : 500,
    arrowButtonMarkup    : '<b class="button">&#x25be;</b>',
    disableOnMobile      : false,
    nativeOnMobile       : true,
    openOnFocus          : true,
    openOnHover          : false,
    hoverIntentTimeout   : 500,
    expandToItemText     : false,
    responsive           : false,
    preventWindowScroll  : true,
    inheritOriginalWidth : false,
    allowWrap            : true,
    forceRenderAbove     : false,
    forceRenderBelow     : false,
    stopPropagation      : true,
    optionsItemBuilder   : '{text}', // function(itemData, element, index)
    labelBuilder         : '{text}', // function(currItem)
    listBuilder          : false,    // function(items)
    keys                 : {
      previous : [37, 38],                 // Left / Up
      next     : [39, 40],                 // Right / Down
      select   : [9, 13, 27],              // Tab / Enter / Escape
      open     : [13, 32, 37, 38, 39, 40], // Enter / Space / Left / Up / Right / Down
      close    : [9, 27]                   // Tab / Escape
    },
    customClass          : {
      prefix: pluginName,
      camelCase: false
    },
    multiple              : {
      separator: ', ',
      keepMenuOpen: true,
      maxLabelEntries: false
    }
  };
}));

/**
 * Base JS
 *
 * @author Tobias Wöstmann
 */

let baseVars;

let baseClass;

const base = {

    /**
     * declarate global base vars
     * */
    vars: {

        $windowRoot:                $('html, body'),

        /**
         * declarate vars for the module loader
         * */
        $modulesRoot:               $('body'),
        modules:                    {},
        modulesTrigger:             'data-js',

        /**
         * automatically updated window width and height vars
         * */
        windowWidth:                0,
        windowHeight:               0,

        /**
         * automatically updated document width and height vars
         * */
        documentWidth:              0,
        documentHeight:             0,

        /**
         * path to external js ressources from webroot
         * */
        vendorBasePath:             '/js/libs/',

        /**
         * grid and mediaquerys from the styles.css
         * */
        grid:                       0,
        mediaquerys:                [],

        /**
         * list of attributtes for helper functions
         * */
        helperAttributes: {

            scrollToTrigger:        '*[data-auto-scrolltop]',
            autoSubmitTrigger:      '*[data-auto-submit]',
            autoLinkTrigger:        '*[data-auto-link]'

        }

    },

    init () {

        /**
         * set var for the vars object
         * */
        baseVars = this.vars;

        /**
         * set var for the base class
         * */
        baseClass = new Base();

        /**
         * set the mediaquery array
         * */
        this.mediaquerys.set();

        /**
         * set the grid int
         * */
        this.grid.set();

        /**
         * set the documents measures
         * */
        this.measurement.set();

        /**
         * trigger resize for the documents measures
         * */
        this.measurement.trigger();

        /**
         * load all inital modules
         * */
        this.modules.init();

        /**
         * wait for finish the resize to Trigger event
         * */
        this.slowResize.trigger();

        /**
         * init helper functions
         * */
        this.helper.init();

    },

    mediaquerys: {

        set ()  {

            /**
             * get the mediaquerys from the base class
             * */
            baseVars.mediaquerys = baseClass.mediaquerys;
        }

    },

    grid: {

        set () {

            /**
             * get the grid from the base class
             * */
            baseVars.grid = baseClass.grid;
        }

    },

    measurement: {

        set () {

            /**
             * get the documents measures from the base class
             * */
            baseVars.windowWidth = baseClass.windowWidth;
            baseVars.windowHeight = baseClass.windowHeight;
            baseVars.documentWidth = baseClass.documentWidth;
            baseVars.documentHeight = baseClass.documentHeight;

        },

        trigger () {

            /**
             * trigger windows resize
             * */
            $( window ).resize(function() {

                /**
                 * set the documents measures
                 * */
                base.measurement.set();

            });

        },

    },

    modules: {

        init () {

            /**
             * get all modules to load
             * */
            base.modules.get();

            /**
             * set all modules to load
             * */
            base.modules.set();

        },

        get () {

            /**
             * save the module object in a baseVar instance
             * */
            baseVars.modules = baseClass.getModules();

        },

        set () {

            /**
             * set all modules in the modules baseVar instance
             * */
            Base.setModules(baseVars.modules);

        }

    },

    slowResize: {

        trigger () {

            /**
             * set timer for waiting
             * */
            let resizeFinishTimer;

            $(window).on("resize",() => {

                /**
                 * reset the timer everytime
                 * */
                if (resizeFinishTimer) { clearTimeout(resizeFinishTimer) }

                /**
                 * trigger the slowResize when its finish
                 * */
                resizeFinishTimer = setTimeout(() => { $(document).trigger("resized") }, 20);

            });

        }

    },

    /**
     * Helper functions
     * */

    helper: {

        /**
         * init all helper functions
         * */
        init () {

            base.helper.autoScrollTop();

            base.helper.autoSubmit();

            base.helper.autoLink();
        },

        /**
         * helper for a smooth scroll animation to the top postion
         * */
        autoScrollTop () {

            $(baseVars.helperAttributes.scrollToTrigger).on("click", (event) => {

                event.preventDefault();

                baseClass.scrollTo();

            });

        },

        /**
         * helper for a automatic form submit when a triggered input are changing
         * */
        autoSubmit () {

            $(baseVars.helperAttributes.autoSubmitTrigger).on("change", (event) => {

                $(event.currentTarget).closest("form").submit();

            });

        },

        /**
         * helper for a automatic forwarding when a triggered input are changing
         * */
        autoLink () {

            $(baseVars.helperAttributes.autoLinkTrigger).on("change", (event) => {

                window.location = $(event.currentTarget).attr("data-auto-link");

            });

        }

    }
    
};
/**
 * BaseTemp JS Framework
 *
 * ES6 JS Framework with dynamic function initialisation
 * @version 2.0
 * @author Tobias Wöstmann
 * @link https://github.com/vampics/baseTemp/
 */

/**
 * loading framework after document is ready
 * */

$(() => {

    ui.init();

});

/**
 * set load trigger for functions in document ready
 * */

$(window).on("load",() => {

    $(document).trigger("DOMLoaded");

});

/**
 * declarate ui object with all base js
 * */

const ui = {

    init: () => {

        base.init();

    }
};

/**
 * declarate modules object with all js it requires on active page
 * */

const modules = {

};

/**
 * BaseTemp JS Framework - Base Class
 *
 * @author Tobias Wöstmann
 */

class Base {

    constructor () {

        /**
         * Root jquery object to find all module trigger
         */
        this.$modulesRoot           = $('body');

        /**
         * phrase to find and trigger the module
         * loader in the $modulesRoot
         */
        this.modulesTrigger         = 'data-js';

        /**
         * highest postion for scroll to the top
         */
        this.scrollTopPosition      = '0px';

        /**
         * smooth scroll animation speed
         */
        this.scrollAnimationSpeed   = 300;

    }

    /**
     * Find all modules in the $ object.
     * Return a object with all modules they should load.
     *
     * @return object
     */
    getModules($root = this.$modulesRoot) {

        let modulesStorage = {};
        let modulesTrigger = this.modulesTrigger;

        $root.find('*['+ modulesTrigger +']').each((index, module) => {

            let selectedmodule = $(module).attr(modulesTrigger);

            if (typeof selectedmodule !== 'undefined') {

                if (typeof modulesStorage[selectedmodule] === 'undefined') {

                    modulesStorage[selectedmodule] = selectedmodule;
                }

            }

        });

        return modulesStorage;

    }

    /**
     * Get lal modules to load and start the init function of it
     * Throw console info when a module not found in js
     *
     */
    static setModules(modulesStorage) {

        for(let key in modulesStorage) {

            if (modulesStorage.hasOwnProperty(key)) {

                if (typeof modules[modulesStorage[key]] !== 'undefined') {

                    modules[modulesStorage[key]].init();

                } else {

                    console.info('Module "' + modulesStorage[key] + '" not found');

                }
            }
        }

    }

    /**
     * Get window width with chrome fix
     *
     * @return int
     */
    get windowWidth() {
        return parseInt(window.outerWidth) === 0 ? $(window).width() : window.outerWidth;
    }

    /**
     * Get window height with chrome fix
     *
     * @return int
     */
    get windowHeight() {
        return parseInt(window.outerHeight) === 0 ?$(window).height() : window.outerHeight;
    }

    /**
     * Get document width
     *
     * @return int
     */
    get documentWidth() {
        return $( document ).width();
    }

    /**
     * Get document height
     *
     * @return int
     */
    get documentHeight() {
        return $( document ).height();
    }

    /**
     * Associative mediaquery array extracted from the hidden before element of the body
     *
     * @return array
     */

    get mediaquerys() {

        let mediaquerys = [];

        /**
         * get the string of mediaquerys, substring it and split it to loop all results
         */

        $.each(window.getComputedStyle(document.body, ":before").getPropertyValue('content').slice(0, -1).substring(1).split(","), ( index, mediaquery ) => {

            /**
             * split the single mediaquery to set a associative array
             */
            mediaquery = mediaquery.split(":");

            /**
             * add to array only if doesnt exist
             */
            if (mediaquery.length > 1) {
                mediaquerys[mediaquery[0]] = mediaquery[1].slice(0, -2);
            }

        });

        return mediaquerys;

    }

    /**
     * Grid count extracted from the hidden after element of the body
     *
     * @return int
     */

    get grid() {

        return parseInt(window.getComputedStyle(document.body, ":after").getPropertyValue('content').replace(/"/g, ''));

    }

    /**
     * Smooth scroll-to function.
     *
     */
    scrollTo(scrollTopPosition = this.scrollTopPosition) {

        /**
         * Stop Scroll Event when user is scrolling
         *
         */
        $(baseVars.$windowRoot).on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", () => {

            $(baseVars.$windowRoot).stop();

        });

        /**
         * Animate a smotth scroll to defined postion
         *
         */
        $(baseVars.$windowRoot).animate({ scrollTop: scrollTopPosition }, this.scrollAnimationSpeed, 'swing', () => {

            $(baseVars.$windowRoot).off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");

        });

    }

}
/**
 * Accordion Module
 *
 * @author Tobias Wöstmann
 */

let acc;

let accVars;

modules.accordion = {

    vars: {
        moduleQuery:                    '*[data-js=accordion]',
        moduleTriggerQuery:             '*[data-accordion-trigger]',
        moduleContentQuery:             '*[data-accordion-content]',
        moduleAnimationSpeed:            300,
        moduleActiveClass:              'active',
        $accordions:                     {}
    },

    init () {

        /**
         * save module shorthand
         * */
        acc = this;

        /**
         * save shorthand for the accordion vars
         * */
        accVars = this.vars;

        /**
         * set on click event trigger
         * */
        this.eventTrigger();

    },

    eventTrigger () {

        /**
         * bind click event to moduleTriggerQuery in moduleQuery
         * */
        $(document).on("click", accVars.moduleQuery + ' ' + accVars.moduleTriggerQuery, (event) => {

            this.eventHandler(event, event.currentTarget);

        });

    },

    eventHandler (event, accordionQuery) {

        event.preventDefault();

        /**
         * save all accordions on active site
         * */
        accVars.$accordions = $(accVars.moduleQuery);

        /**
         * save event accordion
         * */
        let $accordion = $(accordionQuery).closest(accVars.moduleQuery);

        /**
         * class status
         * */
        let accordionHasClass = $accordion.hasClass(accVars.moduleActiveClass);

        /**
         * close all accordions
         * */
        this.close();

        /**
         * check if the event accordion
         * is open/active
         * */
        if (!accordionHasClass) {

            this.open($accordion);

        }

    },

    open ($accordion) {

        /**
         * add the active class and
         * slide down the content with an animation
         * */
        $accordion.addClass(accVars.moduleActiveClass).find(accVars.moduleContentQuery).slideDown(accVars.moduleAnimationSpeed);

    },

    close () {

        /**
         * cycle all accordions
         * */
        accVars.$accordions.each( (index, accordionQuery) => {

            /**
             * remove the active class and
             * slide up the content with an animation
             * */
            $(accordionQuery).removeClass(accVars.moduleActiveClass).find(accVars.moduleContentQuery).slideUp(accVars.moduleAnimationSpeed);

        });

    }

};
/**
 * Equalheight Module
 *
 * @author Tobias Wöstmann
 */

let eh;

let ehVars;

modules.equalheight = {

    vars: {
        moduleQuery:                    '*[data-js=equalheight]',
        moduleChildNodeQuery:           '*[data-equalheight-element]',
        fallbackDesktopMediaquery:      'mw',

        optionBreakpointAttr:           'data-equalheight-option-breakpoint',
        optionMobileAttr:               'data-equalheight-option-mobile',
        optionRowAttr:                  'data-equalheight-option-row'
    },

    init () {

        /**
         * save module shorthand
         * */
        eh = this;

        /**
         * save shorthand for the equalheight vars
         * */
        ehVars = this.vars;

        /**
         * start script inital
         * */
        this.find.parentNodes();

        /**
         * trigger when its complete loaded and when its finished to resize
         * */
        $(document).on("DOMLoaded resized", () => {
            this.find.parentNodes();
        });

    },

    find: {

        parentNodes () {

            $(ehVars.moduleQuery).each((index, moduleQuery) => {

                /**
                 * Save instance
                 */
                let $module = $(moduleQuery);

                /**
                 * Get all childs of the module to set eh
                 */
                let $moduleChildNodes = this.childNodes($module);

                /**
                 * Set options - return false when mobile option false and mobile viewport active
                 */
                return eh.setOptions($module,$moduleChildNodes);

            });

        },

        childNodes ($module) {

            /**
             * Find and return all child nodes with attribute as jquery object
             */
            return $module.find(ehVars.moduleChildNodeQuery);

        },

    },

    setOptions ($module,$moduleChildNodes) {

        /**
         * Get all options from the parent attribute
         */
        let moduleOptionBreakpoint      = ($module.attr(ehVars.optionBreakpointAttr) || ehVars.fallbackDesktopMediaquery);
        let moduleOptionMobile          = ($module.attr(ehVars.optionMobileAttr) === "true");
        let moduleOptionRow             = ($module.attr(ehVars.optionRowAttr) === "true");

        /**
         * Check if mobile option is true, otherwise stop the script.
         * Compare mobile indicator with the module option breakpoint
         */
        if (!moduleOptionMobile && baseVars.mediaquerys[moduleOptionBreakpoint] > baseVars.windowWidth) {

            this.resetNodes($moduleChildNodes);

            return false;
        }

        /**
         * When row option true ... calculate rows.
         */
        if (moduleOptionRow){

            this.splitNodesPerRow($moduleChildNodes);

        }else{

            /**
             * set equal height without rows
             */
            this.setEqualHeight($moduleChildNodes);

        }

        return true;

    },

    splitNodesPerRow: function($equalHeightElements){

        /**
         * declarate row/rows array and inital row postion
         */
        let rows            = [];
        let row             = [];
        let rowPostion      = 0;

        /**
         * give each element same height
         * to build correct rows
         */
        $equalHeightElements.css("height","2px");

        /**
         * cycle all equal height elements to split the rows
         */
        $equalHeightElements.each((index, equalHeightElementQuery) => {

            /**
             * check if the element top postion
             * not like the previous
             */
            if ($(equalHeightElementQuery).offset().top !== rowPostion) {

                /**
                 * set the new row position
                 */
                rowPostion = $(equalHeightElementQuery).offset().top;

                /**
                 * check if active row not empty
                 */
                if (row.length > 0) {

                    /**
                     * then push it as new row in rows
                     * and start new row
                     */
                    rows.push(row);
                    row = [];
                }

            }

            /**
             * push the equalHeightElement in the row
             */
            row.push(equalHeightElementQuery);

        });

        /**
         * only when row not empty, push
         * the last row in array
         */
        if (row.length > 0) {
            rows.push(row);
        }

        /**
         * reset all nodes
         */
        this.resetNodes($equalHeightElements);


        /**
         * cycle all rows
         */
        $.each(rows, (index, rowArray) => {

            /**
             * make all equalheight elements in
             * row to array and set the equal height
             * function
             */
            this.setEqualHeight( $($.map(rowArray, $equalHeightElementsInRow => $.makeArray($equalHeightElementsInRow))));

        });

        $(document).trigger("DOMFinished");

    },

    setEqualHeight: function($equalHeightElements) {

        /**
         * reset each module cycle with height 0
         */
        let highestHeight = 0;

        /**
         * reset all nodes
         */
        this.resetNodes($equalHeightElements);

        /**
         * cycle all child nodes to get the highest box
         */
        $equalHeightElements.each((index, equalHeightElementQuery) => {

            /**
             * if highestHeight lower than the current box
             * height and overide highestHeight
             */
            if (highestHeight < Math.ceil($(equalHeightElementQuery).outerHeight())) {

                highestHeight = Math.ceil($(equalHeightElementQuery).outerHeight());

            }

        });

        /**
         * set the highest height
         * to all nodes
         */
        $equalHeightElements.css("height", highestHeight);

    },

    resetNodes ($equalHeightElement) {
        $equalHeightElement.css("height","auto");
    }

};
/**
 * Formvalidation Module
 *
 * @author Tobias Wöstmann
 */

let fv;

let fvVars;

let fvValidate;

let fvAction;

let fvErrors;

modules.formvalidation = {

	vars: {
		moduleQuery:                    '*[data-js=formvalidation]',

		errorClass:                     'error',
		errorMessageAttribute:          "data-lang-message",
		errorMessageQuery:              ".status.error",
		errorMessageClass:              "status error",
		errorMessage:                   "Bitte prüfen Sie Ihre Eingaben!",
		errorElementToInsertBeforeQuery:".element",

		validateEmptyFieldAttribute:    'data-validation-required',
		validateZipFieldAttribute:      'data-validation-zip',
		validateEmailFieldAttribute:    'data-validation-email',
		validateLengthAttribute:        'data-validation-length',

		textinputQuery:                 "input[type=text], input[type=date], input[type=email], input[type=password], input[type=number], input[type=search], input[type=time], input[type=url], input[type=tel]",
		textareaQuery:                  "textarea",
		selectboxQuery:                 "*[data-js=selectbox]",
		checkboxQuery:                  ".checkbox input",
		radioboxQuery:                  ".radiobox input",

		selectBoxSelectedAttribute:     "data-selectbox-selected",

		/**
		 * module storage vars
		 * */
		state:                          [],
		thisActiveElement:              '',
		scrollTo:                       9000000,
		errors:                         [],

	},

	init () {

		/**
		 * save module shorthand
		 * */
		fv = this;

		/**
		 * save shorthand for the formvalidation vars
		 * */
		fvVars = this.vars;

		/**
		 * save shorthand for the formvalidation validations
		 * */
		fvValidate = this.validate;

		/**
		 * save shorthand for the formvalidation actions
		 * */
		fvAction = this.action;

		/**
		 * save shorthand for the formvalidation error array
		 * */
		fvErrors = fvVars.errors;

		/**
		 * bind submit event
		 * */
		this.bindSubmit();

	},

	bindSubmit () {

		/**
		 * trigger submit event of the form
		 * */

		$(fvVars.moduleQuery).on('submit', (event) => {

			/**
			 * set active form
			 * */
			fvVars.thisActiveForm = $(event.currentTarget);

			/**
			 * reset all errors
			 * */
			fvAction.resetErrors();

			/**
			 * check the form
			 * */
			return this.action.checkFormSubmit();

		});

	},

	typecases: {

		textinput () {

			let checkingPassed = true;

			/**
			 * cycle all queryed text input form elements
			 * */
			fvVars.thisActiveForm.find(fvVars.textinputQuery).each( (index, inputQuery) => {

				/**
				 * assign input element
				 * */
				let $checkingInput = $(inputQuery);

				/**
				 * remove error class
				 * */
				$checkingInput.removeClass(fvVars.errorClass);


				/**
				 * check if it the element is visible
				 * */
				if($checkingInput.is(':visible')) {


					/**
					 * check if the input are empty
					 * */
					if ($checkingInput.is("[" + fvVars.validateEmptyFieldAttribute + "]")) {

						if (!fvValidate.emptyField($checkingInput.val())) {

							/**
							 * if not passed, throw error
							 * */
							checkingPassed = fvAction.setError($checkingInput);

						}

					}

					/**
					 * check if the input are a german zip code
					 * */
					if ($checkingInput.is("[" + fvVars.validateZipFieldAttribute + "]")) {

						if (!fvValidate.zipField($checkingInput.val())) {

							/**
							 * if not passed, throw error
							 * */
							checkingPassed = fvAction.setError($checkingInput);

						}

					}

					/**
					 * check if the input are a e-mail
					 * */
					if ($checkingInput.is("[" + fvVars.validateEmailFieldAttribute + "]")) {

						console.log(fvValidate.emailField($checkingInput.val()));

						if (!fvValidate.emailField($checkingInput.val())) {

							/**
							 * if not passed, throw error
							 * */
							checkingPassed = fvAction.setError($checkingInput);

						}

					}

					/**
					 * check if the input has a minimal length
					 * */
					if ($checkingInput.is("[" + fvVars.validateLengthAttribute + "]")) {

						if (!fvValidate.length($checkingInput.val(),$checkingInput.attr('data-min'))) {

							/**
							 * if not passed, throw error
							 * */
							checkingPassed = fvAction.setError($checkingInput);

						}

					}

				}

			});

			return checkingPassed;

		},

		textarea () {

			let checkingPassed = true;

			/**
			 * cycle all queryed textarea form elements
			 * */
			fvVars.thisActiveForm.find(fvVars.textareaQuery).each( (index, inputQuery) => {

				/**
				 * assign input element
				 * */
				let $checkingInput = $(inputQuery);

				/**
				 * remove error class
				 * */
				$checkingInput.removeClass(fvVars.errorClass);


				/**
				 * check if it the element is visible
				 * */
				if($checkingInput.is(':visible')) {

					/**
					 * check if the input are empty
					 * */
					if ($checkingInput.is("[" + fvVars.validateEmptyFieldAttribute + "]")) {

						if (!fvValidate.emptyField($checkingInput.val())) {

							/**
							 * if not passed, throw error
							 * */
							checkingPassed = fvAction.setError($checkingInput);

						}

					}

					/**
					 * check if the input has a minimal length
					 * */
					if ($checkingInput.is("[" + fvVars.validateLengthAttribute + "]")) {

						if (!fvValidate.length($checkingInput.val(),$checkingInput.attr('data-min'))) {

							/**
							 * if not passed, throw error
							 * */
							checkingPassed = fvAction.setError($checkingInput);

						}

					}

				}

			});

			return checkingPassed;

		},

		selectbox () {

			let checkingPassed = true;

			/**
			 * cycle all queryed select elements
			 * */
			fvVars.thisActiveForm.find(fvVars.selectboxQuery).each( (index, inputQuery) => {

				/**
				 * assign select element
				 * */
				let $checkingComponent = $(inputQuery);

				/**
				 * remove error class
				 * */
				$checkingComponent.removeClass(fvVars.errorClass);

				/**
				 * check if it the element is visible
				 * */
				if($checkingComponent.is(':visible')) {

					/**
					 * check if the input are empty
					 * */
					if ($checkingComponent.find("select").is("[" + fvVars.validateEmptyFieldAttribute + "]")) {

						if (!fvValidate.emptySelectbox($checkingComponent)) {

							/**
							 * if not passed, throw error
							 * */
							checkingPassed = fvAction.setError($checkingComponent);

						}

					}

				}

			});

			return checkingPassed;

		},

		checkbox () {

			let checkingPassed = true;

			/**
			 * cycle all queryed text input form elements
			 * */
			fvVars.thisActiveForm.find(fvVars.checkboxQuery).each( (index, inputQuery) => {

				/**
				 * assign input element
				 * */
				let $checkingComponent = $(inputQuery).parent().parent();
				let $checkinginput = $(inputQuery);

				/**
				 * remove error class
				 * */
				$checkingComponent.removeClass(fvVars.errorClass);

				/**
				 * check if it the element is visible
				 * */
				if($checkingComponent.is(':visible')) {

					/**
					 * check if the input are empty
					 * */
					if ($checkinginput.is("[" + fvVars.validateEmptyFieldAttribute + "]")) {

						if (!fvValidate.emptyCheckbox($checkinginput)) {

							/**
							 * if not passed, throw error
							 * */
							checkingPassed = fvAction.setError($checkingComponent);

						}

					}

				}

			});

			return checkingPassed;

		},

		radiobox () {

			let checkingPassed = true;

			/**
			 * cycle all queryed text input form elements
			 * */
			fvVars.thisActiveForm.find(fvVars.radioboxQuery).each( (index, inputQuery) => {

				/**
				 * assign input element
				 * */
				let $checkingComponent = $(inputQuery).parent().parent();
				let $checkinginput = $(inputQuery);

				/**
				 * remove error class
				 * */
				$checkingComponent.removeClass(fvVars.errorClass);

				/**
				 * check if it the element is visible
				 * */
				if($checkingComponent.is(':visible')) {

					/**
					 * check if the input are empty
					 * */
					if ($checkinginput.is("[" + fvVars.validateEmptyFieldAttribute + "]")) {

						if (!fvValidate.emptyRadiobox($checkinginput)) {

							/**
							 * if not passed, throw error
							 * */
							checkingPassed = fvAction.setError($checkingComponent);

						}

					}

				}

			});

			return checkingPassed;

		},

	},

	action: {

		checkFormSubmit () {

			let checkingPassed = true;

			/**
			 * cycle all typecases to test all
			 * form elements
			 * */
			$.each(fv.typecases, (key, typecase) => {

				/**
				 * if the test fails set passed to false
				 * */
				if (!typecase()) {
					checkingPassed = false;
				}

			});

			/**
			 * if the test fails display errors and scroll
			 * to postion of first cuased error
			 * */
			if (!checkingPassed) {

				baseClass.scrollTo(fvVars.scrollTo + "px");

				fvAction.displayErrors();

			}

			return checkingPassed;

		},

		setError ($checkedFormElement) {

			/**
			 * add error styling to the element
			 * */
			$checkedFormElement.addClass(fvVars.errorClass);

			/**
			 * set scroll postion
			 * */
			fvAction.windowScrollToCalculation(parseInt($checkedFormElement.offset().top));

			/**
			 * load optional error message
			 * */
			let errorMessage = $checkedFormElement.attr(fvVars.errorMessageAttribute);

			/**
			 * check if individual error
			 * message exist
			 * */
			if (errorMessage === undefined || errorMessage === null) {
				errorMessage = fvVars.errorMessage;
			}

			/**
			 * push error message in array
			 * when it didnt exist
			 * */
			if (fvErrors.indexOf("- " + errorMessage) === -1){
				fvErrors.push("- " + errorMessage);
			}

			/**
			 * return false to prevent submit
			 * */
			return false;
		},

		windowScrollToCalculation (errorElementTopPosition) {

			/**
			 * get the vertical center fo the site
			 * */
			let siteCenter = parseInt(baseVars.windowHeight) / 2;

			/**
			 * get position off the highest element that caused a error.
			 * check saved scroll positon > the postion of the error element
			 * and set it to 0 when the the element is in the highest viewport
			 * */
			if (fvVars.scrollTo > errorElementTopPosition) {

				if (errorElementTopPosition < siteCenter) {

					errorElementTopPosition = 0;

				}else{

					errorElementTopPosition = errorElementTopPosition - siteCenter;
				}

				/**
				 * overide scroll top postion
				 * */
				fvVars.scrollTo = errorElementTopPosition;
			}

		},

		resetErrors () {

			/**
			 * remove the error message box
			 * */
			$(fvVars.errorMessageQuery).remove();

			/**
			 * clear error array
			 * */
			fvErrors = [];

		},

		displayErrors () {

			/**
			 * build error box with all
			 * saved error messages from the
			 * fvErrors error
			 * */
			let errorBox = `<div class="${fvVars.errorMessageClass}">`;

			$.each( fvErrors, (key, errorMessage) => {

				errorBox += `<p>${ errorMessage }<br></p>`;

			});

			errorBox += `</div>`;

			/**
			 * get the first element from the
			 * errorElementToInsertBefore query
			 * */

			let $elementToInsert =  $(fvVars.errorElementToInsertBeforeQuery).first();

			/**
			 * insert error in DOM
			 * */

			$(errorBox).insertBefore($elementToInsert);

		}

	},

	validate: {

		emptyField (stValue) {

			return fvValidate.length(stValue,1);

		},

		emptySelectbox ($selectbox) {

			return $selectbox.is(`[${fvVars.selectBoxSelectedAttribute}]`);

		},

		emptyCheckbox ($checkbox) {

			return $checkbox.prop('checked');

		},

		emptyRadiobox ($radiobox) {

			return $("input[name='" + $radiobox.attr("name") + "']").is(':checked');

		},

		zipField (zip) {

			zip = jQuery.trim(zip);
			let reg = /^[0-9]{4,5}$/;
			return reg.test(zip);

		},

		emailField (email) {
			email = jQuery.trim(email);
			let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
			return reg.test(email);
		},

		length (stValue, length = 1) {

			stValue = jQuery.trim( stValue );
			return stValue.length >= length;

		}

	}

};
/**
 * Modalbox Module
 *
 * @author Tobias Wöstmann
 */

let mob;

let mobVars;

modules.modalbox = {

    vars: {
        moduleQuery:                    '*[data-js=modalbox]',
        modalIdTriggerAttribute:        'data-modalbox',
        modalIdAttribute:               'data-modalbox-name',
        rootAppendingQuery:             'body',
        $activeModalbox:                '',
        animationSpeed:                 300,
    },

    init () {

        /**
         * save module shorthand
         * */
        mob = this;

        /**
         * save shorthand for the modalbox vars
         * */
        mobVars = this.vars;

        /**
         * set on click event trigger
         * */
        this.eventTrigger();

    },

    eventTrigger () {

        /**
         * bind click event to moduleQuery
         * */
        $(document).on("click", mobVars.moduleQuery, (event) => {

            this.eventHandler(event, event.currentTarget);

        });

    },

    eventHandler (event, modalboxQuery) {

        event.stopPropagation();

        event.preventDefault();

        /**
         * prepare modalbox to open it
         * */
        this.build($(modalboxQuery));

        /**
         * open new builded modalbox
         * */
        this.open();

    },

    build ($modalboxParent) {

        /**
         * find modalbox template and clone it
         * */
        let $modalboxChild = $("*[" + mobVars.modalIdAttribute + "='" + $modalboxParent.attr(mobVars.modalIdTriggerAttribute) +"']").clone();

        /**
         * append the cloned $ object to the root element
         * */
        $(mobVars.rootAppendingQuery).append($modalboxChild);

        /**
         * find element in new DOM and save it
         * */
        mobVars.$activeModalbox = $(mobVars.rootAppendingQuery).find( "> *[" + mobVars.modalIdAttribute + "]");

    },

    open () {


        /**
         * display the modalbox with animation
         * */
        mobVars.$activeModalbox.css("display","block").animate(
            {
                opacity: 1
            },
            mobVars.animationSpeed
        );

        /**
         * set fastclick fix for iOS to remove
         * the delay
         * */
        $("html").css("cursor", "pointer");

        /**
         * bind the click outside closing
         * */
        $(document).on("click.modalbox", (clickEvent) => {

            this.bindClickToClose(clickEvent);

        });

    },

    bindClickToClose (event) {

        /**
         * check if the modal are visible
         * */
        if(mobVars.$activeModalbox.is(":visible")) {

            /**
             * check if the clicked element
             * in the modalbox layer
             * */
            if ($(event.target).closest("*[" + mobVars.modalIdAttribute + "]").length === 0) {

                this.close();

            }

        }

    },

    close () {

        /**
         * unset fastclick fix for iOS to remove
         * the delay
         * */
        $("html").css("cursor", "default");

        /**
         * deactivate the click event
         * */
        $(document).off("click.modalbox");

        /**
         * hide the modalbox with animation
         * */
        mobVars.$activeModalbox.animate(
            {
                opacity: 0
            },
            mobVars.animationSpeed,
            () => {

                mobVars.$activeModalbox.css("display","none");
                this.destroy();

            });

    },

    destroy () {

        /**
         * removed the cloned modalbox
         * */
        mobVars.$activeModalbox.remove();

    }

};
/**
 * Selectbox Module
 *
 * @author Tobias Wöstmann
 */

let sb;

let sbVars;

modules.selectbox = {

    vars: {
        moduleQuery:                    '*[data-js=selectbox]',
        selectboxListQuery:             '.selectric-items',
        placeholderQuery:               '.disabled.selected',
        selectedAttribute:              'data-selectbox-selected',
        errorSelectboxClass:            'error',
    },

    init () {

        /**
         * save module shorthand
         * */
        sb = this;

        /**
         * save shorthand for the selectbox vars
         * */
        sbVars = this.vars;

        /**
         * bind a change event for native users
         * */
        this.bindChange();

        /**
         * init selectric libary
         * */
        $(sbVars.moduleQuery).find('select').selectric({
            responsive: true,
            onInit (selectboxQuery) {

                /**
                 * outsourced event action for after init event
                 * */
                sb.events.onInit(selectboxQuery);

            },
            onChange (selectboxQuery) {

                /**
                 * trigger  manually a change on the select box
                 * */
                $(selectboxQuery).trigger("change");

            },

        });

    },

    bindChange () {

        $(sbVars.moduleQuery).find('select').on("change", (event) => {

            /**
             * outsourced event action for change event
             * */
            sb.events.onChange(event.currentTarget);

        });

    },

    events: {

        onInit (selectboxQuery) {

            /**
             * save the active list as var
             * */
            let $selectboxList = sb.getSelectboxList(selectboxQuery);

            /**
             * remove the placeholder list item from
             * the builded list.
             * */
            if ($selectboxList.find(sbVars.placeholderQuery).length > 0) {

                $selectboxList.find(sbVars.placeholderQuery).remove();

            }else{

                /**
                 * set flag for a validation that an item is selected
                 * */
                sb.setSelectedAttribute(selectboxQuery);

            }

        },

        onChange (selectboxQuery) {

            /**
             * remove error flag when selectbox are changed
             * */
            $(selectboxQuery).closest(sbVars.moduleQuery).removeClass(sbVars.errorSelectboxClass);

            /**
             * set flag for a validation that an item selected
             * */
            sb.setSelectedAttribute(selectboxQuery);

        },

    },

    getSelectboxList (selectboxQuery) {

        /**
         * return the active list as jquery object
         * */
        return $(selectboxQuery).closest(sbVars.moduleQuery).find(sbVars.selectboxListQuery);

    },

    setSelectedAttribute (selectboxQuery) {

        /**
         * set flag for a validation that an item selected
         * */
        $(selectboxQuery).closest(sbVars.moduleQuery).attr(sbVars.selectedAttribute,true);

    }

};
/**
 * Slider Module
 *
 * @author Tobias Wöstmann
 */

let sl;

let slVars;

modules.slider = {

    vars: {
        moduleQuery:                    '*[data-js=slider]',
        scriptPath:                     base.vars.vendorBasePath + "slider.js",

        options:                        {},
        optionPrevButton:               '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 169.3 94"><polygon points="84.9 78.8 10.3 4.1 3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 "></polygon><polygon points="3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 84.9 78.8 10.3 4.1 "></polygon></svg></button>',
        optionNextButton:               '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 169.3 94"><polygon points="84.9 78.8 10.3 4.1 3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 "></polygon><polygon points="3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 84.9 78.8 10.3 4.1 "></polygon></svg></button>'
    },

    init () {

        /**
         * save module shorthand
         * */
        sl = this;

        /**
         * save shorthand for the accordion vars
         * */
        slVars = this.vars;

        /**
         * set on click event trigger
         * */
        this.getLibary();

    },

    getLibary () {

        $.getScript( slVars.scriptPath, () => {

            /**
             * Start slider Script inital
             * */
            this.getModules();

        });

    },

    getModules () {

        /**
         * cycle each slider module
         * */
        $(slVars.moduleQuery).each((index, moduleQuery) => {

            /**
             * save slider module instance options
             * */
            this.saveSliderSettings($(moduleQuery));

            /**
             * start slider module instance
             * */
            this.startSlider($(moduleQuery));

            /**
             * trigger slider module events
             * */
            this.triggerSliderEvents($(moduleQuery));

        });

    },
    
    saveSliderSettings ($slider) {

        /**
         * create option object for slick method
         * */
        slVars.options = {};

        /**
         * define standard options
         * */
        slVars.options.infinite = true;
        slVars.options.mobileFirst = true;
        slVars.options.responsive = [];

        /**
         * define all changeable options via attribute for basic load.
         * "" defines no viewport for basic loading
         * */
        this.getSliderSettings($slider,slVars.options,"");

        /**
         * loop all mediaquerys
         * */
        for (let viewport in base.vars.mediaquerys){
            if (baseVars.mediaquerys.hasOwnProperty(viewport)) {

                /**
                 * skip 0px mediaquery
                 * */
                if (parseInt(baseVars.mediaquerys[viewport]) > 0) {

                    /**
                     * create breakpoint object for mediaquery
                     * */
                    let breakpoint = {};

                    /**
                     * define breakpoint size and create settings object
                     * */
                    breakpoint.breakpoint = parseInt(baseVars.mediaquerys[viewport]) - 1;
                    breakpoint.settings = {};

                    /**
                     *  define all changeable options via attribute for mediaquery.
                     *  -viewport defines the medaiquery suffix for attribute
                     * */
                    this.getSliderSettings($slider,breakpoint.settings,"-" + viewport);

                    /**
                     *  only push in object when breakpoint has options
                     * */
                    if (!jQuery.isEmptyObject(breakpoint.settings)) {
                        slVars.options.responsive.push(breakpoint);
                    }

                }
            }
        }

    },

    getSliderSettings ($slider,optionLevel,viewport){

        /**
         * html for other previous arrow
         * */
        if (viewport === "" || $slider.is("[data-prevArrow" + viewport + "]")) {
            optionLevel.prevArrow = $slider.attr("data-prevArrow" + viewport) || slVars.optionPrevButton;
        }

        /**
         * html for other next arrow
         * */
        if (viewport === "" || $slider.is("[data-nextArrow" + viewport + "]")) {
            optionLevel.nextArrow = $slider.attr("data-nextArrow" + viewport) || slVars.optionNextButton;
        }

        /**
         * html for a connection to an other slider
         * */
        if (viewport === "" || $slider.is("[data-asNavFor" + viewport + "]")) {
            optionLevel.asNavFor = $slider.attr("data-asNavFor" + viewport) || null;
        }
        /**
         * Enables variable Width of slides.
         * */
        // Enables variable Width of slides.
        if (viewport === "" || $slider.is("[data-variableWidth" + viewport + "]")) {
            optionLevel.variableWidth = ($slider.attr("data-variableWidth" + viewport) === "true");
        }

        /**
         * Enables draggable slides.
         * */
        if (viewport === "" || $slider.is("[data-draggable" + viewport + "]")) {
            optionLevel.draggable = ($slider.attr("data-draggable" + viewport) === "true");
        }

        /**
         * set focus on select
         * */
        if (viewport === "" || $slider.is("[data-focusOnSelect" + viewport + "]")) {
            optionLevel.focusOnSelect = $slider.attr("data-focusOnSelect" + viewport) === "true";
        }

        /**
         * change slide animation to fade
         * */
        if (viewport === "" || $slider.is("[data-fade" + viewport + "]")) {
            optionLevel.fade = $slider.attr("data-fade" + viewport) === "true";
        }

        /**
         *  # of slides to show
         * */
        if (viewport === "" || $slider.is("[data-slidesToShow" + viewport + "]")) {
            optionLevel.slidesToShow = parseInt($slider.attr("data-slidesToShow" + viewport)) || 1;
        }

        /**
         * Enables adaptive height for single slide horizontal carousels.
         * */
        if (viewport === "" || $slider.is("[data-adaptiveHeight" + viewport + "]")) {
            optionLevel.adaptiveHeight = ($slider.attr("data-adaptiveHeight" + viewport) === "true");
        }

        /**
         * Show dot indicators
         * */
        if (viewport === "" || $slider.is("[data-dots" + viewport + "]")) {
            optionLevel.dots = ($slider.attr("data-dots" + viewport) === "true");
        }

        /**
         * Slide animation speed
         * */
        if (viewport === "" || $slider.is("[data-speed" + viewport + "]")) {
            optionLevel.speed = $slider.attr("data-speed" + viewport) || "300";
        }

        /**
         * Enables centered view with partial prev/next slides.
         * Use with odd numbered slidesToShow counts.
         * */
        if (viewport === "" || $slider.is("[data-centerMode" + viewport + "]")) {
            optionLevel.centerMode = ($slider.attr("data-centerMode" + viewport) === "true");
        }

        /**
         * Enables Autoplay
         * */
        if (viewport === "" || $slider.is("[data-autoplay" + viewport + "]")) {
            optionLevel.autoplay = ($slider.attr("data-autoplay" + viewport) === "true");
        }

        /**
         * Autoplay Speed in milliseconds
         * */
        if (viewport === "" || $slider.is("[data-autoplaySpeed" + viewport + "]")) {
            optionLevel.autoplaySpeed = $slider.attr("data-autoplaySpeed" + viewport);
        }

        /**
         * Show prev/next Arrows
         * */
        if (viewport === "" || $slider.is("[data-arrows" + viewport + "]")) {
            optionLevel.arrows = ($slider.attr("data-arrows" + viewport) === "true");
        }

		/**
		 * Vertical slide mode
		 * */
		if (viewport === "" || $slider.is("[data-vertical" + viewport + "]")) {
			optionLevel.vertical = ($slider.attr("data-vertical" + viewport) === "true");
		}

    },

    startSlider ($slider) {

        /**
         * start libary and set the options
         * */
        $slider.slick(slVars.options);

    },

    triggerSliderEvents ($slider) {

        /**
         * trigger a event when slider is finished
         * */
        $slider.on('init', () => {

            $(document).trigger("sliderLoaded");
            $(document).trigger("DOMFinished");

        });

    }


};
///////////////////////////////////////////////////////
///                 BASE JS                         ///
///////////////////////////////////////////////////////

var base = {

    ///////////////////////////////////////////////////////
    ///               INIT BASE MODULES                 ///
    ///////////////////////////////////////////////////////
    init: function() {

        this.getAllMediaQuerys();
        this.getGrid();
        this.getSizes();
        this.loadModules.locate($("body"));
        this.recalculate.triggerResize();
        this.autosubmit();
        this.autolink();
        this.fastclick();
        this.fastclickFix();
        this.scrollToTop();

    },

    vars: {
        windowRoot: $('html, body'),

        windowWidth: 0,
        windowHeight: 0,

        documentWidth: 0,
        documentHeight: 0,

        vendorBasePath: '/js/libs/',

        isTouchDevice: (window.navigator.msMaxTouchPoints || ('ontouchstart' in document.documentElement)),
        grid: '',
        mediaquerys: []

    },

    ///////////////////////////////////////////////////////
    ///        INIT ALL MODULES NEEDED ON PAGE          ///
    ///////////////////////////////////////////////////////
    loadModules: {
        locate: function(main) {
            var allModulesToLoad = {};
            main.find('*[data-js]').each(function() {
                var selectedmodule = $(this).data('js');
                if (typeof selectedmodule !== 'undefined') {
                    if (typeof allModulesToLoad[selectedmodule] === 'undefined') {
                        allModulesToLoad[selectedmodule] = selectedmodule;
                    }
                }
            });
            base.loadModules.startModules(allModulesToLoad);

        },

        startModules: function(allModulesToLoad) {
            for(var key in allModulesToLoad) {
                if (allModulesToLoad.hasOwnProperty(key)) {
                    if (typeof modules[allModulesToLoad[key]] !== 'undefined') {
                        modules[allModulesToLoad[key]].init();
                    } else {
                        console.log('Module "' + allModulesToLoad[key] + '" not found');
                    }
                }
            }
        }
    },

    getSizes: function() {

        base.recalculate.windowWidth();
        base.recalculate.windowHeight();
        base.recalculate.documentWidth();
        base.recalculate.documentHeight();

    },

    ///////////////////////////////////////////////////////
    ///      CALCULATE NEW VARS AFTER INTERACTION       ///
    ///////////////////////////////////////////////////////

    recalculate: {
        triggerResize: function() {
            $( window ).resize(function() {
                base.recalculate.windowWidth();
                base.recalculate.windowHeight();
                base.recalculate.documentWidth();
                base.recalculate.documentHeight();
            });
        },

        windowWidth: function() {

            var windowWidth = window.outerWidth;

            if (parseInt(windowWidth) === 0) {
                windowWidth = $(window).width();
            }

            base.vars.windowWidth = windowWidth;
        },

        windowHeight: function() {
            var windowHeight = window.outerHeight;

            if (parseInt(windowHeight) === 0) {
                windowHeight = $(window).height();
            }

            base.vars.windowHeight = windowHeight;
        },

        documentWidth: function() {
            base.vars.documentWidth = $( document ).width();
        },

        documentHeight: function() {
            base.vars.documentHeight = $( document ).height();
        }

    },

    getAllMediaQuerys: function() {

        var unsortedmediaquerystring = window.getComputedStyle(document.body, ":before").getPropertyValue('content').slice(0, -1).substring(1).split(",");

        $.each(unsortedmediaquerystring, function( index, mediaquery ) {

            mediaquery = mediaquery.split(":");

            if (mediaquery.length > 1) {
                base.vars.mediaquerys[mediaquery[0]] = mediaquery[1].slice(0, -2);
            }

        });

    },

    getGrid: function() {

        base.vars.grid = window.getComputedStyle(document.body, ":after").getPropertyValue('content');

    },

    ///////////////////////////////////////////////////////
    ///        CENTRAL SMOOTH SCROLLTO FUNCTION         ///
    ///////////////////////////////////////////////////////

    scrollTo: function(finishScrollPos) {

        var page = base.vars.windowRoot;

        page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
            page.stop();
        });

        page.animate({ scrollTop: finishScrollPos }, 500, 'swing', function(){
            page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
        });

    },

    scrollToTop: function() {

        $("a.toTop").click(function( event ) {

            event.preventDefault();

            base.scrollTo("0px");

        });

    },

    ///////////////////////////////////////////////////////
    ///                INIT FASTCLICK                   ///
    ///////////////////////////////////////////////////////

    fastclick: function() {
        $(function() {
            FastClick.attach(document.body);
        });
    },

    fastclickFix: function() {

        $('label').on("click",function(event) {

            if (event.target.nodeName != "A") {

                var input = $(this).find("input");

                if (input.attr("type") == "radio") {

                    event.stopPropagation();
                    event.preventDefault();

                    input.prop("checked", true);
                    input.trigger("change");

                } else if (input.attr("type") == "checkbox") {

                    event.stopPropagation();
                    event.preventDefault();

                    if (input.prop('checked') === false) {

                        input.prop('checked', true);

                    } else {

                        input.prop('checked', false);

                    }

                    input.trigger("change");

                }

            }

        });

    },

    ///////////////////////////////////////////////////////
    ///          AUTOSUBMIT FORM WHEN CHANGE            ///
    ///////////////////////////////////////////////////////

    autosubmit: function() {
        $('*[data-auto-submit]').change(function() {
            $(this).closest("form").submit();
        });
    },

    autolink: function() {
        $('*[data-auto-link]').change(function() {
            window.location = $(this).attr("data-auto-link");
        });
    },


};


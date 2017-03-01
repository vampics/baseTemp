///////////////////////////////////////////////////////
///                 BASE JS                         ///
///////////////////////////////////////////////////////

var base = {

    ///////////////////////////////////////////////////////
    ///               INIT BASE MODULES                 ///
    ///////////////////////////////////////////////////////
    init: function() {

        this.getAllMediaQuerys();
        this.loadModules.locate();
        this.recalculate.triggerResize();
        this.autosubmit();
        this.fastclick();
        this.fastclickIosFix();
        this.scrollToTop();

    },

    vars: {
        windowRoot: $('html, body'),

        windowWidth: $(window).width(),
        windowHeight: $(window).height(),

        documentWidth: $(document).width(),
        documentHeight: $(document).height(),

        isTouchDevice: (window.navigator.msMaxTouchPoints || ('ontouchstart' in document.documentElement)),
        mediaquerys: []

    },

    ///////////////////////////////////////////////////////
    ///        INIT ALL MODULES NEEDED ON PAGE          ///
    ///////////////////////////////////////////////////////
    loadModules: {
        locate: function() {
            var main = $("body");
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
            base.vars.windowWidth = $( window ).width();
        },

        windowHeight: function() {
            base.vars.windowHeight = $( window ).height();
        },

        documentWidth: function() {
            base.vars.documentWidth = $( document ).width();
        },

        documentHeight: function() {
            base.vars.documentHeight = $( document ).height();
        }

    },

    getAllMediaQuerys: function() {

        var unsortedmediaquerystring = window.getComputedStyle(document.body, ":before").getPropertyValue('content').slice(0, -2).substring(2).split(",");

        $.each(unsortedmediaquerystring, function( index, mediaquery ) {

            mediaquery = mediaquery.split(":");
            base.vars.mediaquerys[mediaquery[0]] = mediaquery[1].slice(0, -2);

        });

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

    fastclickIosFix: function() {

        if (this.vars.isTouchDevice) {

            $('label').click(function() {

                var input = $(this).find("input");
                if (input.attr("type") == "radio") {
                    input.prop("checked", true);
                }else if (input.attr("type") == "checkbox") {
                    if (input.prop("checked")) {
                        input.prop("checked", false);
                    }else{
                        input.prop("checked", true);
                    }
                }else{
                    input.trigger("click");
                }

            });

        }

    },

    ///////////////////////////////////////////////////////
    ///          AUTOSUBMIT FORM WHEN CHANGE            ///
    ///////////////////////////////////////////////////////

    autosubmit: function() {
        $('*[data-auto-submit]').change(function() {
            $(this).closest("form").submit();
        });
    }


};


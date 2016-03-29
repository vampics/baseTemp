///////////////////////////////////////////////////////
///                 BASE JS                         ///
///////////////////////////////////////////////////////

var base = {

    ///////////////////////////////////////////////////////
    ///               INIT BASE MODULES                 ///
    ///////////////////////////////////////////////////////
    init: function() {

        this.loadModules.locate();
        this.recalculate.triggerResize();
        this.IeModernizers.init();
        this.autosubmit();
        this.fastclick();
        this.fastclickIosFix();


    },

    vars: {
        windowRoot: $('html, body'),
        windowWidth: $( window ).width(),
        windowHeight: $( window ).height(),
        isTouchDevice: (window.navigator.msMaxTouchPoints || ('ontouchstart' in document.documentElement)),
        breakpointMedium: 768
    },

    ///////////////////////////////////////////////////////
    ///        INIT ALL MODULES NEEDED ON PAGE          ///
    ///////////////////////////////////////////////////////
    loadModules: {
        locate: function() {
            var main = $("body").find('main');
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
    ///          INIT MODERNZIER FOR IE 8 & 9           ///
    ///////////////////////////////////////////////////////
    IeModernizers: {

        init: function() {
            var html = $('html');
            if (html.hasClass('ie8') || html.hasClass('ie9')) {
                base.IeModernizers.modulePlaceholder();
                base.IeModernizers.modulePie();
            }
        },

        modulePlaceholder: function() {
            $('input, textarea').placeholder();
        },

        modulePie: function() {
            $(function() {
                if (window.PIE) {
                    $('.rounded').each(function() {
                        PIE.attach(this);
                    });
                }
            });
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
            });
        },

        windowWidth: function() {
            base.vars.windowWidth = $( window ).width();
        },

        windowHeight: function() {
            base.vars.windowHeight = $( window ).height();
        }

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


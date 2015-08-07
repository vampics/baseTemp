///////////////////////////////////////////////////////
///                 BASE JS                         ///
///////////////////////////////////////////////////////

var base = {

    ///////////////////////////////////////////////////////
    ///               INIT BASE MODULES                 ///
    ///////////////////////////////////////////////////////
    init: function() {

        base.loadModules.locate();
        base.recalculate.triggerResize();

    },

    vars: {
        windowWidth: $( window ).width(),
        breakpointMedium: 768
    },

    ///////////////////////////////////////////////////////
    ///        INIT ALL MODULES NEEDED ON PAGE          ///
    ///////////////////////////////////////////////////////
    loadModules: {

        locate: function() {

            var main = config.vars.body().find("> main");

            var allModulesToLoad = {};
            main.find("*[data-js]").each(function() {
                var selectedmodule = $(this).attr("data-js");
                if (typeof selectedmodule != 'undefined') {
                    if (!allModulesToLoad[selectedmodule]) {
                        allModulesToLoad[selectedmodule] = selectedmodule;
                    }
                }
            });
            base.loadModules.startmodules(allModulesToLoad);
        },

        startmodules: function(allModulesToLoad) {
            for(var key in allModulesToLoad) {
                var moduleToLoad = allModulesToLoad[key];
                modules[moduleToLoad].init();
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
            });
        },

        windowWidth: function() {
            base.vars.windowWidth = $( window ).width();
        }

    }

};


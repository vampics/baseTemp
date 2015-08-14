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
            var main = config.vars.body().find('main');
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
            });
        },

        windowWidth: function() {
            base.vars.windowWidth = $( window ).width();
        }

    }

};


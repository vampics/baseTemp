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

    init: () => {

        /**
         * set var for the vars object
         * */
        baseVars = base.vars;

        /**
         * set var for the base class
         * */
        baseClass = new Base();

        /**
         * set the mediaquery array
         * */
        base.mediaquerys.set();

        /**
         * set the grid int
         * */
        base.grid.set();

        /**
         * set the documents measures
         * */
        base.measurement.set();

        /**
         * trigger resize for the documents measures
         * */
        base.measurement.trigger();

        /**
         * load all inital modules
         * */
        base.modules.init();

        /**
         * wait for finish the resize to Trigger event
         * */
        base.slowResize.trigger();

        /**
         * init helper functions
         * */
        base.helper.init();

    },

    mediaquerys: {

        set: () => {

            /**
             * get the mediaquerys from the base class
             * */
            baseVars.mediaquerys = baseClass.mediaquerys;
        }

    },

    grid: {

        set: () => {

            /**
             * get the grid from the base class
             * */
            baseVars.grid = baseClass.grid;
        }

    },

    measurement: {

        set: () => {

            /**
             * get the documents measures from the base class
             * */
            baseVars.windowWidth = baseClass.windowWidth;
            baseVars.windowHeight = baseClass.windowHeight;
            baseVars.documentWidth = baseClass.documentWidth;
            baseVars.documentHeight = baseClass.documentHeight;

        },

        trigger: () => {

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

        init: () => {

            /**
             * get all modules to load
             * */
            base.modules.get();

            /**
             * set all modules to load
             * */
            base.modules.set();

        },

        get: () => {

            /**
             * save the module object in a baseVar instance
             * */
            baseVars.modules = baseClass.getModules();

        },

        set: () => {

            /**
             * set all modules in the modules baseVar instance
             * */
            Base.setModules(baseVars.modules);

        }

    },

    slowResize: {

        trigger: () => {

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
                resizeFinishTimer = setTimeout(() => { $(document).trigger("slowResize") }, 20);

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
        init() {

            base.helper.autoScrollTop();

            base.helper.autoSubmit();

            base.helper.autoLink();
        },

        /**
         * helper for a smooth scroll animation to the top postion
         * */
        autoScrollTop: () => {

            $(baseVars.helperAttributes.scrollToTrigger).on("click", (event) => {

                event.preventDefault();

                baseClass.scrollTo();

            });

        },

        /**
         * helper for a automatic form submit when a triggered input are changing
         * */
        autoSubmit: () => {

            $(baseVars.helperAttributes.autoSubmitTrigger).on("change", (event) => {

                $(event.currentTarget).closest("form").submit();

            });

        },

        /**
         * helper for a automatic forwarding when a triggered input are changing
         * */
        autoLink: () => {

            $(baseVars.helperAttributes.autoLinkTrigger).on("change", (event) => {

                window.location = $(event.currentTarget).attr("data-auto-link");

            });

        }

    }
    
};
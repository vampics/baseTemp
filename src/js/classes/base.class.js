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
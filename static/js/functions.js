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

        new base();

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

class base {

    constructor () {

        this.windowRoot = $('html, body');
        this.vendorBasePath = '/js/libs/';

    }

    get mediaquerys() {

        let unsortedmediaquerystring = window.getComputedStyle(document.body, ":before").getPropertyValue('content').slice(0, -1).substring(1).split(",");

        $.each(unsortedmediaquerystring, ( index, mediaquery ) => {

            mediaquery = mediaquery.split(":");

            if (mediaquery.length > 1) {
                base.vars.mediaquerys[mediaquery[0]] = mediaquery[1].slice(0, -2);
            }

        });


        return 1111;
    }


}
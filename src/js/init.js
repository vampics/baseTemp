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

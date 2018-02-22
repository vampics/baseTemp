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
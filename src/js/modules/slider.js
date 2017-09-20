///////////////////////////////////////////////////////
///                   SLIDER JS                     ///
///////////////////////////////////////////////////////

var sl;
var slGlobals;

modules.slider = {

    globals: {
        parentElement:      '*[data-js=slider]',
        scriptPath:         base.vars.vendorBasePath + "slider.js",

        options:            {},
        optionPrevButton:   '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 169.3 94"><polygon points="84.9 78.8 10.3 4.1 3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 "></polygon><polygon points="3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 84.9 78.8 10.3 4.1 "></polygon></svg></button>',
        optionNextButton:   '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 169.3 94"><polygon points="84.9 78.8 10.3 4.1 3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 "></polygon><polygon points="3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 84.9 78.8 10.3 4.1 "></polygon></svg></button>'
    },

    init: function() {

        sl = this;
        slGlobals = this.globals;

        // Get the slick slide libary
        sl.getLibary();

    },

    getLibary: function() {

        $.getScript( slGlobals.scriptPath, function() {

            // Start SL Script normally
            sl.getModules();

        });

    },

    getModules: function() {

        // cycle each slider module
        $(slGlobals.parentElement).each(function(){

            // save slider module instance options
            sl.saveSliderSettings($(this));

            // start slider module instance
            sl.startSlider($(this));

            // trigger slider module events
            sl.triggerSliderEvents($(this));

        });

    },

    saveSliderSettings: function(slider) {

        // create option object for slick method
        slGlobals.options = {};

        // define standard options
        slGlobals.options.infinite = true;
        slGlobals.options.mobileFirst = true;
        slGlobals.options.responsive = [];

        // define all changeable options via attribute for basic load. "" defines no viewport for basic loading
        sl.getSliderSettings(slider,slGlobals.options,"");

        // loop all mediaquerys
        for (var viewport in base.vars.mediaquerys){
            if (base.vars.mediaquerys.hasOwnProperty(viewport)) {

                // skip 0px mediaquery
                if (parseInt(base.vars.mediaquerys[viewport]) > 0) {

                    // create breakpoint object for mediaquery
                    var breakpoint = {};

                    // define breakpoint size and create settings object
                    breakpoint.breakpoint = parseInt(base.vars.mediaquerys[viewport]);
                    breakpoint.settings = {};

                    // define all changeable options via attribute for mediaquery. -viewport defines the medaiquery suffix for attribute
                    sl.getSliderSettings(slider,breakpoint.settings,"-" + viewport);

                    // only push in object when breakpoint has options
                    if (!jQuery.isEmptyObject(breakpoint.settings)) {
                        slGlobals.options.responsive.push(breakpoint);
                    }

                }
            }
        }

    },

    getSliderSettings: function(slider,optionLevel,viewport){

        // html for other previous arrow
        if (viewport === "" || slider.is("[data-prevArrow" + viewport + "]")) {
            optionLevel.prevArrow = slider.attr("data-prevArrow" + viewport) || slGlobals.optionPrevButton;
        }

        // html for other next arrow
        if (viewport === "" || slider.is("[data-nextArrow" + viewport + "]")) {
            optionLevel.nextArrow = slider.attr("data-nextArrow" + viewport) || slGlobals.optionNextButton;
        }

        // # of slides to show
        if (viewport === "" || slider.is("[data-slidesToShow" + viewport + "]")) {
            optionLevel.slidesToShow = slider.attr("data-slidesToShow" + viewport) || "1";
        }

        // Enables adaptive height for single slide horizontal carousels.
        if (viewport === "" || slider.is("[data-adaptiveHeight" + viewport + "]")) {
            optionLevel.adaptiveHeight = (slider.attr("data-adaptiveHeight" + viewport) === "true");
        }

        // Show dot indicators
        if (viewport === "" || slider.is("[data-dots" + viewport + "]")) {
            optionLevel.dots = (slider.attr("data-dots" + viewport) === "true");
        }

        // Slide animation speed
        if (viewport === "" || slider.is("[data-speed" + viewport + "]")) {
            optionLevel.speed = slider.attr("data-speed" + viewport) || "300";
        }

        // Enables centered view with partial prev/next slides. Use with odd numbered slidesToShow counts.
        if (viewport === "" || slider.is("[data-centerMode" + viewport + "]")) {
            optionLevel.centerMode = (slider.attr("data-centerMode" + viewport) === "true");
        }

        // Enables Autoplay
        if (viewport === "" || slider.is("[data-autoplay" + viewport + "]")) {
            optionLevel.autoplay = (slider.attr("data-autoplay" + viewport) === "true");
        }

        // Autoplay Speed in milliseconds
        if (viewport === "" || slider.is("[data-autoplaySpeed" + viewport + "]")) {
            optionLevel.autoplaySpeed = slider.attr("data-autoplaySpeed" + viewport);
        }

        // Show prev/next Arrows
        if (viewport === "" || slider.is("[data-arrows" + viewport + "]")) {
            optionLevel.arrows = (slider.attr("data-arrows" + viewport) === "true");
        }

    },

    startSlider: function(slider) {

        // start libary and set the options
        slider.slick(slGlobals.options);

    },

    triggerSliderEvents: function(slider) {

        // trigger a event when slider is finished
        slider.on('init', function(){

            $(document).trigger("sliderLoaded");

        });

    }

};


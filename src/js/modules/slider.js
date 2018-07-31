/**
 * Slider Module
 *
 * @author Tobias Wöstmann
 */

let sl;

let slVars;

modules.slider = {

    vars: {
        moduleQuery:                    '*[data-js=slider]',
        scriptPath:                     base.vars.vendorBasePath + "slider.js",

        options:                        {},
        optionPrevButton:               '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 169.3 94"><polygon points="84.9 78.8 10.3 4.1 3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 "></polygon><polygon points="3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 84.9 78.8 10.3 4.1 "></polygon></svg></button>',
        optionNextButton:               '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 169.3 94"><polygon points="84.9 78.8 10.3 4.1 3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 "></polygon><polygon points="3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 84.9 78.8 10.3 4.1 "></polygon></svg></button>'
    },

    init () {

        /**
         * save module shorthand
         * */
        sl = this;

        /**
         * save shorthand for the accordion vars
         * */
        slVars = this.vars;

        /**
         * set on click event trigger
         * */
        this.getLibary();

    },

    getLibary () {

        $.getScript( slVars.scriptPath, () => {

            /**
             * Start slider Script inital
             * */
            this.getModules();

        });

    },

    getModules () {

        /**
         * cycle each slider module
         * */
        $(slVars.moduleQuery).each((index, moduleQuery) => {

            /**
             * save slider module instance options
             * */
            this.saveSliderSettings($(moduleQuery));

            /**
             * start slider module instance
             * */
            this.startSlider($(moduleQuery));

            /**
             * trigger slider module events
             * */
            this.triggerSliderEvents($(moduleQuery));

        });

    },
    
    saveSliderSettings ($slider) {

        /**
         * create option object for slick method
         * */
        slVars.options = {};

        /**
         * define standard options
         * */
        slVars.options.infinite = true;
        slVars.options.mobileFirst = true;
        slVars.options.responsive = [];

        /**
         * define all changeable options via attribute for basic load.
         * "" defines no viewport for basic loading
         * */
        this.getSliderSettings($slider,slVars.options,"");

        /**
         * loop all mediaquerys
         * */
        for (let viewport in base.vars.mediaquerys){
            if (baseVars.mediaquerys.hasOwnProperty(viewport)) {

                /**
                 * skip 0px mediaquery
                 * */
                if (parseInt(baseVars.mediaquerys[viewport]) > 0) {

                    /**
                     * create breakpoint object for mediaquery
                     * */
                    let breakpoint = {};

                    /**
                     * define breakpoint size and create settings object
                     * */
                    breakpoint.breakpoint = parseInt(baseVars.mediaquerys[viewport]) - 1;
                    breakpoint.settings = {};

                    /**
                     *  define all changeable options via attribute for mediaquery.
                     *  -viewport defines the medaiquery suffix for attribute
                     * */
                    this.getSliderSettings($slider,breakpoint.settings,"-" + viewport);

                    /**
                     *  only push in object when breakpoint has options
                     * */
                    if (!jQuery.isEmptyObject(breakpoint.settings)) {
                        slVars.options.responsive.push(breakpoint);
                    }

                }
            }
        }

    },

    getSliderSettings ($slider,optionLevel,viewport){

        /**
         * html for other previous arrow
         * */
        if (viewport === "" || $slider.is("[data-prevArrow" + viewport + "]")) {
            optionLevel.prevArrow = $slider.attr("data-prevArrow" + viewport) || slVars.optionPrevButton;
        }

        /**
         * html for other next arrow
         * */
        if (viewport === "" || $slider.is("[data-nextArrow" + viewport + "]")) {
            optionLevel.nextArrow = $slider.attr("data-nextArrow" + viewport) || slVars.optionNextButton;
        }

        /**
         * html for a connection to an other slider
         * */
        if (viewport === "" || $slider.is("[data-asNavFor" + viewport + "]")) {
            optionLevel.asNavFor = $slider.attr("data-asNavFor" + viewport) || null;
        }
        /**
         * Enables variable Width of slides.
         * */
        // Enables variable Width of slides.
        if (viewport === "" || $slider.is("[data-variableWidth" + viewport + "]")) {
            optionLevel.variableWidth = ($slider.attr("data-variableWidth" + viewport) === "true");
        }

        /**
         * Enables draggable slides.
         * */
        if (viewport === "" || $slider.is("[data-draggable" + viewport + "]")) {
            optionLevel.draggable = ($slider.attr("data-draggable" + viewport) === "true");
        }

        /**
         * set focus on select
         * */
        if (viewport === "" || $slider.is("[data-focusOnSelect" + viewport + "]")) {
            optionLevel.focusOnSelect = $slider.attr("data-focusOnSelect" + viewport) === "true";
        }

        /**
         * change slide animation to fade
         * */
        if (viewport === "" || $slider.is("[data-fade" + viewport + "]")) {
            optionLevel.fade = $slider.attr("data-fade" + viewport) === "true";
        }

        /**
         *  # of slides to show
         * */
        if (viewport === "" || $slider.is("[data-slidesToShow" + viewport + "]")) {
            optionLevel.slidesToShow = parseInt($slider.attr("data-slidesToShow" + viewport)) || 1;
        }

        /**
         * Enables adaptive height for single slide horizontal carousels.
         * */
        if (viewport === "" || $slider.is("[data-adaptiveHeight" + viewport + "]")) {
            optionLevel.adaptiveHeight = ($slider.attr("data-adaptiveHeight" + viewport) === "true");
        }

        /**
         * Show dot indicators
         * */
        if (viewport === "" || $slider.is("[data-dots" + viewport + "]")) {
            optionLevel.dots = ($slider.attr("data-dots" + viewport) === "true");
        }

        /**
         * Slide animation speed
         * */
        if (viewport === "" || $slider.is("[data-speed" + viewport + "]")) {
            optionLevel.speed = $slider.attr("data-speed" + viewport) || "300";
        }

        /**
         * Enables centered view with partial prev/next slides.
         * Use with odd numbered slidesToShow counts.
         * */
        if (viewport === "" || $slider.is("[data-centerMode" + viewport + "]")) {
            optionLevel.centerMode = ($slider.attr("data-centerMode" + viewport) === "true");
        }

        /**
         * Enables Autoplay
         * */
        if (viewport === "" || $slider.is("[data-autoplay" + viewport + "]")) {
            optionLevel.autoplay = ($slider.attr("data-autoplay" + viewport) === "true");
        }

        /**
         * Autoplay Speed in milliseconds
         * */
        if (viewport === "" || $slider.is("[data-autoplaySpeed" + viewport + "]")) {
            optionLevel.autoplaySpeed = $slider.attr("data-autoplaySpeed" + viewport);
        }

        /**
         * Show prev/next Arrows
         * */
        if (viewport === "" || $slider.is("[data-arrows" + viewport + "]")) {
            optionLevel.arrows = ($slider.attr("data-arrows" + viewport) === "true");
        }

		/**
		 * Vertical slide mode
		 * */
		if (viewport === "" || $slider.is("[data-vertical" + viewport + "]")) {
			optionLevel.vertical = ($slider.attr("data-vertical" + viewport) === "true");
		}

    },

    startSlider ($slider) {

        /**
         * start libary and set the options
         * */
        $slider.slick(slVars.options);

    },

    triggerSliderEvents ($slider) {

        /**
         * trigger a event when slider is finished
         * */
        $slider.on('init', () => {

            $(document).trigger("sliderLoaded");
            $(document).trigger("DOMFinished");

        });

    }


};
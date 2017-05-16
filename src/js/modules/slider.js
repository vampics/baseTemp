///////////////////////////////////////////////////////
///                   SLIDER JS                     ///
///////////////////////////////////////////////////////

modules.slider = {

    init: function() {

        this.getLibary();

    },

    getLibary: function() {

        var module = this;
        var detailgallery = $("*[data-js=slider]");
        var settings = [];

        settings['arrows'] = (detailgallery.attr("data-arrows") === "true");
        settings['dots'] = (detailgallery.attr("data-dots") === "true");
        settings['centermode'] = (detailgallery.attr("data-centermode") === "true");
        settings['speed'] = detailgallery.attr("data-speed");
        settings['autoplay'] = (detailgallery.attr("data-autoplay") === "true");
        settings['autoplayspeed'] = detailgallery.attr("data-autoplayspeed");
        settings['show'] = detailgallery.attr("data-show");

        $.getScript( base.vars.vendorBasePath + "slider.js", function() {

            module.startScript(detailgallery,settings)

        });

    },

    startScript: function(detailgallery,settings) {

        detailgallery.slick({
            prevArrow:'<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 169.3 94"><polygon points="84.9 78.8 10.3 4.1 3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 "></polygon><polygon class="st0" points="3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 84.9 78.8 10.3 4.1 "></polygon></svg></button>',
            nextArrow:'<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 169.3 94"><polygon points="84.9 78.8 10.3 4.1 3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 "></polygon><polygon class="st0" points="3.8 11.2 81.7 89.7 88.2 89.7 166 11.2 159.5 4.4 84.9 78.8 10.3 4.1 "></polygon></svg></button>',
            infinite: true,
            speed: settings.speed,
            centerMode: settings.centermode,
            slidesToShow: settings.show,
            autoplay: settings.autoplay,
            autoplaySpeed: settings.autoplayspeed,
            dots: settings.dots,
            arrows: settings.arrows
        });


    }

};


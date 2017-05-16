///////////////////////////////////////////////////////
///               EQUAL HEIGHT JS                   ///
///////////////////////////////////////////////////////

modules.equalheight = {

    init: function() {

        var me = this;

        var equalheight = $('*[data-js=equalheight]');

        equalheight.each(function(){

            var elements = $(this).find('*[data-equalheight-element]');
            var mobile = $(this).attr('data-equalheight-mobile') === "true";
            var intervalCheckForHeight;

            if (mobile) {

                me.setElementsToEqualHeight(me,elements);
                intervalCheckForHeight = setInterval(function(){me.setElementsToEqualHeight(me,elements)}, 500);

            }else{

                if (base.vars.mediaquerys.mw <= base.vars.windowWidth) {

                    me.setElementsToEqualHeight(me,elements);
                    intervalCheckForHeight = setInterval(function(){me.setElementsToEqualHeight(me,elements)}, 500);

                }

            }

            setTimeout( function(){ clearInterval(intervalCheckForHeight) }, 2500);

            $(window).on("resize", function(){


                if (mobile) {

                    me.setElementsToEqualHeight(me,elements);

                }else{

                    if (base.vars.mediaquerys.mw <= base.vars.windowWidth) {

                        me.setElementsToEqualHeight(me,elements);

                    }else{

                        me.resetElements(me,elements);

                    }

                }

            });

        });

    },

    setElementsToEqualHeight: function(me,elements) {

        var highestHeight = 0;

        me.resetElements(me,elements);

        elements.each(function(){

            if (highestHeight < Math.ceil($(this).outerHeight())) {

                highestHeight = Math.ceil($(this).outerHeight())

            }

        });

        elements.css("height",highestHeight);

    },

    resetElements: function(me,elements) {

        elements.css("height","auto");

    }
};


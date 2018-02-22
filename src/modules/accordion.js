///////////////////////////////////////////////////////
///                 ACCORDION JS                    ///
///////////////////////////////////////////////////////

modules.accordion = {

    init: function() {
        var me = this;
        var accordions = $('*[data-js=accordion]');

        accordions.on("click", "> a", function(event){

            me.eventHandler(me,event,$(this),accordions);

        });

    },

    eventHandler: function(me,event,link,accordions) {

        event.preventDefault();

        var isActive = link.parent().hasClass("active");

        me.close(accordions);

        if (!isActive) {
            me.open(link);
        }

    },

    open: function(link) {

        link.parent().addClass("active").find(">div").slideDown(300);

    },

    close: function(accordions) {

        accordions.each(function(){

            $(this).removeClass("active").find(">div").slideUp(300);

        });

    }

};


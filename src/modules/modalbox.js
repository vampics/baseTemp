///////////////////////////////////////////////////////
///                 MODALBOX JS                     ///
///////////////////////////////////////////////////////

modules.modalbox = {

    init: function() {

        var me = this;
        var modalboxLink = $('*[data-js=modalbox]');

        modalboxLink.on("click", function(event){

            me.open(me,event,$(this));

        });

    },

    open: function(me,event,element) {

        event.stopPropagation();
        event.preventDefault();

        var modalbox = $("[data-modalbox-name='" + element.attr("data-modalbox") +"']");

        modalbox.css("display","block").animate({opacity: 1},210);

        $(document).on("click.modalbox", function(event2) {
            me.bindClickToClose(me,event2,modalbox);
        });

    },

    bindClickToClose: function (me,event,modalbox) {

        if(modalbox.is(":visible")) {

            if ($(event.target).hasClass("modalbox")) {
                me.close(modalbox);
            }

        }

    },

    close: function(modalbox) {

        $(document).off("click.modalbox");

        modalbox.animate({opacity: 0},210, function() {

            $(this).css("display","none");

        });

    }

};


///////////////////////////////////////////////////////
///                    INIT JS                      ///
///////////////////////////////////////////////////////

$(document).ready(function() {

    ui.init();

});

$(window).on("load", function() {

    $(document).trigger("DOMLoaded");

});


///////////////////////////////////////////////////////
///               INIT ALL MODULES                  ///
///////////////////////////////////////////////////////

var ui = {

    init: function() {

        base.init();
        header.init();

    }

}
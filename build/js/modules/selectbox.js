///////////////////////////////////////////////////////
///                 SELECTBOX JS                    ///
///////////////////////////////////////////////////////

modules.selectbox = {

    ///////////////////////////////////////////////////////
    ///              INIT SELECTBOX MODULES             ///
    ///////////////////////////////////////////////////////
    init: function() {

        this.getLibary();

    },

    getLibary: function() {

        var module = this;

        $.getScript( "/js/libs/selectbox.js", function() {

            module.startScript();

        });

    },

    startScript: function() {
        $('.selectbox').find("select").selectBoxIt({
            autoWidth: false,
            showEffect: "slideDown",
            showEffectSpeed: 150,
            hideEffect: "slideUp",
            hideEffectSpeed: 150,
            showFirstOption: false
        });
    }

};


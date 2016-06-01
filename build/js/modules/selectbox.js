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

        var selectbox = $('.selectbox');

        selectbox.find("select").selectBoxIt({
            autoWidth: false,
            downArrowIcon: "icon-down-open-big",
            showEffect: "slideDown",
            showEffectSpeed: 150,
            hideEffect: "slideUp",
            hideEffectSpeed: 150,
            showFirstOption: false
        });

        if (selectbox.find(".selectboxit-text").html() != selectbox.find("select").find("option:first-child").html()) {
            selectbox.find(".selectboxit-btn").addClass("selected");
        }

        selectbox.find("select").bind({
            "changed": function(ev, obj) {
                $(obj.dropdown).addClass("selected");
            }
        });

    }

};


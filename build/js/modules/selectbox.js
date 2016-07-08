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

        $.each(selectbox, function() {

            var SelectBoxOptions;
            var EffectSpeed = 150;
            var downArrowIcon = "icon-down-open-big";

            if ($(this).hasClass("showfirstoption")) {

                SelectBoxOptions = {
                    autoWidth: false,
                    downArrowIcon: downArrowIcon,
                    showEffect: "slideDown",
                    showEffectSpeed: EffectSpeed,
                    hideEffect: "slideUp",
                    hideEffectSpeed: EffectSpeed
                };

                $(this).find(".selectboxit-btn").addClass("selected");

            } else {

                SelectBoxOptions = {
                    autoWidth: false,
                    downArrowIcon: downArrowIcon,
                    showEffect: "slideDown",
                    showEffectSpeed: EffectSpeed,
                    hideEffect: "slideUp",
                    hideEffectSpeed: EffectSpeed,
                    showFirstOption: false
                };

                if ($(this).find(".selectboxit-text").html() != $(this).find("select").find("option:first-child").html()) {
                    $(this).find(".selectboxit-btn").addClass("selected");
                }

            }

            $(this).find("select").selectBoxIt(SelectBoxOptions);


        });

        selectbox.find("select").bind({
            "changed": function(ev, obj) {

                $(obj.dropdown).addClass("selected");

            }
        });

    }

};


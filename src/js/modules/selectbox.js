///////////////////////////////////////////////////////
///                 SELECTBOX JS                    ///
///////////////////////////////////////////////////////

modules.selectbox = {

    init: function() {

        this.getLibary();

    },

    getLibary: function() {

        var module = this;

        $.getScript( base.vars.vendorBasePath + "selectbox.js", function() {

            module.startScript();

            module.bindEvent();

        });

    },

    startScript: function() {

        var selectbox = $('.selectbox');

        $.each(selectbox, function() {

            var SelectBoxOptions;
            var EffectSpeed = 150;

            SelectBoxOptions = {
                autoWidth: false,
                showEffect: "slideDown",
                showEffectSpeed: EffectSpeed,
                hideEffect: "slideUp",
                hideEffectSpeed: EffectSpeed
            };

            if (!$(this).hasClass("showfirstoption")) {

                SelectBoxOptions["showFirstOption"] = false;

            }

            $(this).find("select").selectBoxIt(SelectBoxOptions);

            if (!$(this).hasClass("showfirstoption")) {

                if ($(this).find(".selectboxit-text").html() != $(this).find("select").find("option:first-child").html()) {
                    $(this).find(".selectboxit-btn").addClass("selected");
                }

            } else {

                $(this).find(".selectboxit-btn").addClass("selected");

            }


        });

    },

    bindEvent: function() {

        var selectbox = $('.selectbox');

        selectbox.find("select").bind({
            "changed": function(ev, obj) {

                $(obj.dropdown).addClass("selected");

            }
        });

    }

};


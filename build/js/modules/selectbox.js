///////////////////////////////////////////////////////
///               OWN SELECTBOX JS                  ///
///////////////////////////////////////////////////////

modules.selectbox = {

    ///////////////////////////////////////////////////////
    ///              INIT SELECTBOX MODULES             ///
    ///////////////////////////////////////////////////////
    init: function() {

        modules.selectbox.toggle.bindClick();
        modules.selectbox.change.bindClick();

    },

    vars: {
        selector: $(".selectbox"),
        isTouchDevice: (window.navigator.msMaxTouchPoints || ('ontouchstart' in document.documentElement)),
        autoSuggestTimeOut: '',
        autoSuggestText: ''
    },

    toggle: {

        bindClick: function () {

            if (modules.selectbox.vars.isTouchDevice) {

                modules.selectbox.vars.selector.addClass("touch").find("select").change(function () {

                    $(this).parent().parent().find(">span:first-child").html($(this).parent().find("option[value='"+$(this).val()+"']").text());

                });

            }else{
                modules.selectbox.vars.selector.find(">span").unbind().fastClick(function () {

                    var selectbox = $(this).parent();
                    var list = selectbox.find("ul");

                    if (list.is(':visible')) {
                        modules.selectbox.toggle.close(list);
                    } else {
                        modules.selectbox.toggle.close(modules.selectbox.vars.selector.find("ul"));
                        modules.selectbox.toggle.open(list);
                    }

                });
            }

        },

        bindClickOutside: function (event,selectbox,list) {

            if(!$(event.target).closest(selectbox.parent()).length) {
                if(selectbox.is(":visible")) {
                    modules.selectbox.toggle.close(list);
                }
            }

        },

        setKeyUp: function (event,list) {
            if (event.which == '13') {
                if (list.find("li.active").length > 0) {
                    modules.selectbox.change.setValue(list.find("li.active"));
                    modules.selectbox.toggle.close(list);
                }
            }else{
                var char = String.fromCharCode(event.which);
                if (char.match(/[a-zA-Z\.]/)){
                    clearTimeout(modules.selectbox.vars.autoSuggestTimeOut);
                    modules.selectbox.vars.autoSuggestText += char;
                    var substringlength = modules.selectbox.vars.autoSuggestText.length;
                    list.find("li").removeClass("active").each(function() {
                        var firstLetter = $(this).html().substr(0, substringlength);
                        if (modules.selectbox.vars.autoSuggestText.toLowerCase() == firstLetter.toLowerCase()) {
                            $(this).addClass("active");
                            list.animate({ scrollTop: ($(this).position().top)}, 180);
                            return false;
                        }
                    });
                    $( ".selectbox" ).mousemove(function() {
                        list.find("li").removeClass("active");
                        modules.selectbox.vars.autoSuggestText = '';
                    });

                    modules.selectbox.vars.autoSuggestTimeOut = setTimeout(function(){
                        modules.selectbox.vars.autoSuggestText = '';
                    }, 400);
                }
            }
        },

        open: function (selectbox) {

            selectbox.slideDown(80);
            selectbox.parent().find(">span").addClass("active");
            $(document).on("keyup.selectbox", function(event) {modules.selectbox.toggle.setKeyUp(event,selectbox)}).on("click.selectbox", function(event) { modules.selectbox.toggle.bindClickOutside(event,selectbox.parent(),selectbox)});

        },

        close: function (selectbox) {

            selectbox.slideUp(80);
            selectbox.parent().find(">span").removeClass("active");
            $(document).off("keyup.selectbox").off("click.selectbox");

        }

    },

    change: {

        bindClick: function () {

            $(".selectbox").find("li").unbind().fastClick(function () {

                modules.selectbox.change.setValue($(this));
                modules.selectbox.toggle.close($(this).parent());

            });

            $(".selectbox").find("li").unbind().fastClick(function () {

                modules.selectbox.change.setValue($(this));
                modules.selectbox.toggle.close($(this).parent());

            });



        },

        setValue: function (selected) {

            var newValue = selected.html();
            selected.parent().parent().find(">span:first-child").html(newValue);

            var attr;
            attr = selected.attr('data-value');
            selected.parent().parent().find(">select").val(attr);

        }

    }

};


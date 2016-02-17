///////////////////////////////////////////////////////
///               OWN SELECTBOX JS                  ///
///////////////////////////////////////////////////////

// EXAMPLE
//<div class="selectbox" data-js="selectbox">
//<span class="icon-right-open-big">Bitte wählen</span>
//<ul>
//<li data-value="Herr">Herr</li>
//<li data-value="Frau">Frau</li>
//</ul>
//<label tabindex="4">
//<select name="title">
//<option></option>
//<option value="Herr">Herr</option>
//<option value="Frau">Frau</option>
//</select>
//</label>
//</div>


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

                    $(this).parent().parent().find("li[data-value='"+$(this).val()+"']").trigger("click");

                });

            }else{

                modules.selectbox.vars.selector.find(">span").unbind().click(function () {

                    modules.selectbox.toggle.starttoggle($(this));

                });

            }

        },

        starttoggle: function (element) {

            var selectbox = element.parent();
            var list = selectbox.find("ul");

            if (list.is(':visible')) {
                modules.selectbox.toggle.close(list);
            } else {
                modules.selectbox.toggle.close(modules.selectbox.vars.selector.find("ul"));
                modules.selectbox.toggle.open(list);
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
                //On Enter
                if (list.find("li.active").length > 0) {
                    modules.selectbox.change.setClick(list.find("li.active"));
                }

            }else if ( event.which == '38' || event.which == '40' ) {
                var activeList = list.find("li.active");
                if ( event.which == '38') {
                    if (activeList.length > 0) {
                        //On KeyUp
                        if (activeList.prev("li").length > 0) {
                            activeList.removeClass("active").prev("li").addClass("active");
                        }
                    }
                }else{
                    if (activeList.length <= 0) {
                        //On KeyDown First
                        list.find("li:first-child").addClass("active");
                    }else{
                        //On KeyDown
                        if (activeList.next("li").length > 0) {
                            activeList.removeClass("active").next("li").addClass("active");
                        }
                    }
                }

            }else if ( event.which == '27') {
                //On ESC
                if (list.is(':visible')) {
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

                    $(document).on("mousemove.selectbox", function() {
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

            selectbox.slideDown(50);
            selectbox.parent().find(">span").addClass("active");
            $(document).on("keyup.selectbox", function(event) {modules.selectbox.toggle.setKeyUp(event,selectbox)}).on("click.selectbox", function(event) { modules.selectbox.toggle.bindClickOutside(event,selectbox.parent(),selectbox)});

        },

        close: function (selectbox) {

            selectbox.slideUp(50);
            selectbox.parent().find(">span").removeClass("active");
            $(document).off("keyup.selectbox").off("click.selectbox").off("mousemove.selectbox");;

        }

    },

    change: {

        bindClick: function () {

            $(".selectbox").find("li").unbind().click(function () {
                modules.selectbox.change.setClick($(this));
            });

        },


        setClick: function (selected) {

            modules.selectbox.change.setValue(selected);
            modules.selectbox.toggle.close(selected.parent());

        },

        setValue: function (selected) {

            var newValue = selected.html();
            selected.parent().find("li").removeClass("active");
            selected.addClass("active");
            selected.parent().parent().find(">span:first-child").html(newValue);

            if (!modules.selectbox.vars.isTouchDevice) {
                var attr;
                attr = selected.attr('data-value');
                selected.parent().parent().find("select").val(attr);
            }

        }

    }

};


///////////////////////////////////////////////////////
///                 SELECTBOX JS                    ///
///////////////////////////////////////////////////////

modules.selectbox = {

    ///////////////////////////////////////////////////////
    ///              INIT SELECTBOX MODULES             ///
    ///////////////////////////////////////////////////////
    init: function() {

        this.activateLibary();

    },

    activateLibary: function() {

        $('.selectbox').not(".native").find("select").selectBoxIt({
            autoWidth: false
        });

    }




};


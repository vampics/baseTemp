///////////////////////////////////////////////////////
///                 SELECTBOX JS                    ///
///////////////////////////////////////////////////////

modules.selectbox = {

    ///////////////////////////////////////////////////////
    ///              INIT SELECTBOX MODULES             ///
    ///////////////////////////////////////////////////////
    init: function() {

        this.initLibary();

    },

    initLibary: function() {

        $('.selectbox').not(".native").find("select").selectBoxIt({
            autoWidth: false
        });

    }




};


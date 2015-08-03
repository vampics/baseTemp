///////////////////////////////////////////////////////
///                CONFIGURATION JS                 ///
///////////////////////////////////////////////////////

var config = {

    vars: {

        body: function() { return $("body") },

        header: function() { return $("body").find("main > header") },

        footer: function() { return $("body").find("> footer") },

        mobilenavigation: function() { return $("body").find("#mobilemenue") },

        navigation: function() { return $("nav#navigation") }
    }

}
///////////////////////////////////////////////////////
///               EQUAL HEIGHT JS                   ///
///////////////////////////////////////////////////////

var eh;
var ehGlobals;

modules.equalheight = {

    globals: {
        parentElement:      '*[data-js=equalheight]',
        childElements:      '*[data-equalheight-element]',
        waitOnResizeTimer:   10,
        desktopMediaQuery:   'mw',

        optionMobileAttr:    'data-equalheight-option-mobile',
        optionRowAttr:       'data-equalheight-option-row'
    },

    init: function() {

        eh = this;
        ehGlobals = this.globals;

        // Start EH Script normally
        eh.findAllParentNodes();

        // Start EH Script when DOM ist complete loaded
        $(document).on("DOMLoaded", function(){
            eh.findAllParentNodes();
        });

        // Start EH Script when Resizing is finished
        var waitOnResize;
        $(window).on("resize", function(){

            clearTimeout(waitOnResize);

            waitOnResize = setTimeout(function(){
                eh.findAllParentNodes();
            }, ehGlobals.waitOnResizeTimer);

        });

    },

    findAllParentNodes: function(){

        $(ehGlobals.parentElement).each(function(){

            // Save instance
            var module             = $(this);

            // Get all childs of the module to set eh
            var moduleChildNodes = eh.findAllChildNodes(module);

            // Set options - return false when mobile option false and mobile viewport active
            return eh.setOptions(module,moduleChildNodes);

        });

    },

    setOptions: function(module,moduleChildNodes) {

        // Get options
        var moduleOptionMobile = (module.attr(ehGlobals.optionMobileAttr) === "true");
        var moduleOptionRow    = (module.attr(ehGlobals.optionRowAttr) === "true");

        // When mobile option false, reset elements & stop script.
        if (!moduleOptionMobile && base.vars.mediaquerys[ehGlobals.desktopMediaQuery] > base.vars.windowWidth) {
            eh.resetChildNodes(moduleChildNodes);
            return false;
        }

        // When row option true ... calculate rows.
        if (moduleOptionRow){

            eh.splitNodesPerRow(moduleChildNodes);

        }else{

            // set equal height without rows
            eh.setChildNodesToEqualHeight(moduleChildNodes);

        }

        return true;

    },

    findAllChildNodes: function(module){
        return module.find(ehGlobals.childElements);
    },

    splitNodesPerRow: function(nodes){

        var rows = [];
        var row = [];
        var rowValue = 0;

        // cycle each element
        nodes.each(function(){

            // if element top postion not like the previous
            if ($(this).offset().top != rowValue) {

                //set new row offset postion
                rowValue = $(this).offset().top;

                //if row not empty
                if (row.length > 0) {

                    //push row in array
                    rows.push(row);
                    row = [];
                }
            }

            //push element in row
            row.push(this);

        });

        //only when row not empty, push last row in array
        if (row.length > 0) {
            rows.push(row);
        }

        $.each(rows, function( index, rowArray ) {

            // set equal height with rows
            eh.setChildNodesToEqualHeight($($.map(rowArray, function(element){return $.makeArray(element);})));

        });

    },

    setChildNodesToEqualHeight: function(nodes) {

        // start ech cycle with 0
        var highestHeight = 0;

        // reset all elements
        eh.resetChildNodes(nodes);

        // cycle all elements to get the highest box
        nodes.each(function(){

            // if highestHeight lower than the current box height, overide highestHeight
            if (highestHeight < Math.ceil($(this).outerHeight())) {

                highestHeight = Math.ceil($(this).outerHeight());

            }

        });

        //set height to all boxes
        nodes.css("height",highestHeight);

    },

    resetChildNodes: function(nodes) {
        nodes.css("height","auto");
    }
};


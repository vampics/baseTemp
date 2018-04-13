/**
 * Equalheight Module
 *
 * @author Tobias Wöstmann
 */

let eh;

let ehVars;

modules.equalheight = {

    vars: {
        moduleQuery:                    '*[data-js=equalheight]',
        moduleChildNodeQuery:           '*[data-equalheight-element]',
        fallbackDesktopMediaquery:      'mw',

        optionBreakpointAttr:           'data-equalheight-option-breakpoint',
        optionMobileAttr:               'data-equalheight-option-mobile',
        optionRowAttr:                  'data-equalheight-option-row'
    },

    init () {

        /**
         * save module shorthand
         * */
        eh = this;

        /**
         * save shorthand for the equalheight vars
         * */
        ehVars = this.vars;

        /**
         * start script inital
         * */
        this.find.parentNodes();

        /**
         * trigger when its complete loaded and when its finished to resize
         * */
        $(document).on("DOMLoaded resized", () => {
            this.find.parentNodes();
        });

    },

    find: {

        parentNodes () {

            $(ehVars.moduleQuery).each((index, moduleQuery) => {

                /**
                 * Save instance
                 */
                let $module = $(moduleQuery);

                /**
                 * Get all childs of the module to set eh
                 */
                let $moduleChildNodes = this.childNodes($module);

                /**
                 * Set options - return false when mobile option false and mobile viewport active
                 */
                return eh.setOptions($module,$moduleChildNodes);

            });

        },

        childNodes ($module) {

            /**
             * Find and return all child nodes with attribute as jquery object
             */
            return $module.find(ehVars.moduleChildNodeQuery);

        },

    },

    setOptions ($module,$moduleChildNodes) {

        /**
         * Get all options from the parent attribute
         */
        let moduleOptionBreakpoint      = ($module.attr(ehVars.optionBreakpointAttr) || ehVars.fallbackDesktopMediaquery);
        let moduleOptionMobile          = ($module.attr(ehVars.optionMobileAttr) === "true");
        let moduleOptionRow             = ($module.attr(ehVars.optionRowAttr) === "true");

        /**
         * Check if mobile option is true, otherwise stop the script.
         * Compare mobile indicator with the module option breakpoint
         */
        if (!moduleOptionMobile && baseVars.mediaquerys[moduleOptionBreakpoint] > baseVars.windowWidth) {

            this.resetNodes($moduleChildNodes);

            return false;
        }

        /**
         * When row option true ... calculate rows.
         */
        if (moduleOptionRow){

            this.splitNodesPerRow($moduleChildNodes);

        }else{

            /**
             * set equal height without rows
             */
            this.setEqualHeight($moduleChildNodes);

        }

        return true;

    },

    splitNodesPerRow: function($equalHeightElements){

        /**
         * declarate row/rows array and inital row postion
         */
        let rows            = [];
        let row             = [];
        let rowPostion      = 0;

        /**
         * give each element same height
         * to build correct rows
         */
        $equalHeightElements.css("height","2px");

        /**
         * cycle all equal height elements to split the rows
         */
        $equalHeightElements.each((index, equalHeightElementQuery) => {

            /**
             * check if the element top postion
             * not like the previous
             */
            if ($(equalHeightElementQuery).offset().top !== rowPostion) {

                /**
                 * set the new row position
                 */
                rowPostion = $(equalHeightElementQuery).offset().top;

                /**
                 * check if active row not empty
                 */
                if (row.length > 0) {

                    /**
                     * then push it as new row in rows
                     * and start new row
                     */
                    rows.push(row);
                    row = [];
                }

            }

            /**
             * push the equalHeightElement in the row
             */
            row.push(equalHeightElementQuery);

        });

        /**
         * only when row not empty, push
         * the last row in array
         */
        if (row.length > 0) {
            rows.push(row);
        }

        /**
         * reset all nodes
         */
        this.resetNodes($equalHeightElements);


        /**
         * cycle all rows
         */
        $.each(rows, (index, rowArray) => {

            /**
             * make all equalheight elements in
             * row to array and set the equal height
             * function
             */
            this.setEqualHeight( $($.map(rowArray, $equalHeightElementsInRow => $.makeArray($equalHeightElementsInRow))));

        });

        $(document).trigger("DOMFinished");

    },

    setEqualHeight: function($equalHeightElements) {

        /**
         * reset each module cycle with height 0
         */
        let highestHeight = 0;

        /**
         * reset all nodes
         */
        this.resetNodes($equalHeightElements);

        /**
         * cycle all child nodes to get the highest box
         */
        $equalHeightElements.each((index, equalHeightElementQuery) => {

            /**
             * if highestHeight lower than the current box
             * height and overide highestHeight
             */
            if (highestHeight < Math.ceil($(equalHeightElementQuery).outerHeight())) {

                highestHeight = Math.ceil($(equalHeightElementQuery).outerHeight());

            }

        });

        /**
         * set the highest height
         * to all nodes
         */
        $equalHeightElements.css("height", highestHeight);

    },

    resetNodes ($equalHeightElement) {
        $equalHeightElement.css("height","auto");
    }

};
/**
 * Selectbox Module
 *
 * @author Tobias Wöstmann
 */

let sb;

let sbVars;

modules.selectbox = {

    vars: {
        moduleQuery:                    '*[data-js=selectbox]',
        selectboxListQuery:             '.selectric-items',
        placeholderQuery:               '.disabled.selected',
        selectedAttribute:              'data-selectbox-selected',
    },

    init () {

        /**
         * save module shorthand
         * */
        sb = this;

        /**
         * save shorthand for the selectbox vars
         * */
        sbVars = this.vars;

        /**
         * bind a change event for native users
         * */
        this.bindChange();

        /**
         * init selectric libary
         * */
        $(sbVars.moduleQuery).find('select').selectric({
            responsive: true,
            onInit (selectboxQuery) {

                /**
                 * outsourced event action for after init event
                 * */
                sb.events.onInit(selectboxQuery);

            },
            onChange (selectboxQuery) {

                /**
                 * trigger  manually a change on the select box
                 * */
                $(selectboxQuery).trigger("change");

            },

        });

    },

    bindChange () {

        $(sbVars.moduleQuery).find('select').on("change", (event) => {

            /**
             * outsourced event action for change event
             * */
            sb.events.onChange(event.currentTarget);

        });

    },

    events: {

        onInit (selectboxQuery) {

            /**
             * save the active list as var
             * */
            let $selectboxList = sb.getSelectboxList(selectboxQuery);

            /**
             * remove the placeholder list item from
             * the builded list.
             * */
            if ($selectboxList.find(sbVars.placeholderQuery).length > 0) {

                $selectboxList.find(sbVars.placeholderQuery).remove();

            }else{

                /**
                 * set flag for a validation that an item is selected
                 * */
                sb.setSelectedAttribute(selectboxQuery);

            }

        },

        onChange (selectboxQuery) {

            /**
             * set flag for a validation that an item selected
             * */
            sb.setSelectedAttribute(selectboxQuery);

        },

    },

    getSelectboxList (selectboxQuery) {

        /**
         * return the active list as jquery object
         * */
        return $(selectboxQuery).closest(sbVars.moduleQuery).find(sbVars.selectboxListQuery);

    },

    setSelectedAttribute (selectboxQuery) {

        /**
         * set flag for a validation that an item selected
         * */
        $(selectboxQuery).closest(sbVars.moduleQuery).attr(sbVars.selectedAttribute,true);

    }

};
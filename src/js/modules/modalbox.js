/**
 * Modalbox Module
 *
 * @author Tobias Wöstmann
 */

let mob;

let mobVars;

modules.modalbox = {

    vars: {
        moduleQuery:                    '*[data-js=modalbox]',
        modalIdTriggerAttribute:        'data-modalbox',
        modalIdAttribute:               'data-modalbox-name',
        rootAppendingQuery:             'body',
        $activeModalbox:                '',
        animationSpeed:                 300,
    },

    init () {

        /**
         * save module shorthand
         * */
        mob = this;

        /**
         * save shorthand for the modalbox vars
         * */
        mobVars = this.vars;

        /**
         * set on click event trigger
         * */
        this.eventTrigger();

    },

    eventTrigger () {

        /**
         * bind click event to moduleQuery
         * */
        $(document).on("click", mobVars.moduleQuery, (event) => {

            this.eventHandler(event, event.currentTarget);

        });

    },

    eventHandler (event, modalboxQuery) {

        event.stopPropagation();

        event.preventDefault();

        /**
         * prepare modalbox to open it
         * */
        this.build($(modalboxQuery));

        /**
         * open new builded modalbox
         * */
        this.open();

    },

    build ($modalboxParent) {

        /**
         * find modalbox template and clone it
         * */
        let $modalboxChild = $("*[" + mobVars.modalIdAttribute + "='" + $modalboxParent.attr(mobVars.modalIdTriggerAttribute) +"']").clone();

        /**
         * append the cloned $ object to the root element
         * */
        $(mobVars.rootAppendingQuery).append($modalboxChild);

        /**
         * find element in new DOM and save it
         * */
        mobVars.$activeModalbox = $(mobVars.rootAppendingQuery).find( "> *[" + mobVars.modalIdAttribute + "]");

    },

    open () {


        /**
         * display the modalbox with animation
         * */
        mobVars.$activeModalbox.css("display","block").animate(
            {
                opacity: 1
            },
            mobVars.animationSpeed
        );

        /**
         * set fastclick fix for iOS to remove
         * the delay
         * */
        $("html").css("cursor", "pointer");

        /**
         * bind the click outside closing
         * */
        $(document).on("click.modalbox", (clickEvent) => {

            this.bindClickToClose(clickEvent);

        });

    },

    bindClickToClose (event) {

        /**
         * check if the modal are visible
         * */
        if(mobVars.$activeModalbox.is(":visible")) {

            /**
             * check if the clicked element
             * in the modalbox layer
             * */
            if ($(event.target).closest("*[" + mobVars.modalIdAttribute + "]").length === 0) {

                this.close();

            }

        }

    },

    close () {

        /**
         * unset fastclick fix for iOS to remove
         * the delay
         * */
        $("html").css("cursor", "default");

        /**
         * deactivate the click event
         * */
        $(document).off("click.modalbox");

        /**
         * hide the modalbox with animation
         * */
        mobVars.$activeModalbox.animate(
            {
                opacity: 0
            },
            mobVars.animationSpeed,
            () => {

                mobVars.$activeModalbox.css("display","none");
                this.destroy();

            });

    },

    destroy () {

        /**
         * removed the cloned modalbox
         * */
        mobVars.$activeModalbox.remove();

    }

};
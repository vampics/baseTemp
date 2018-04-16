/**
 * Accordion Module
 *
 * @author Tobias Wöstmann
 */

let acc;

let accVars;

modules.accordion = {

    vars: {
        moduleQuery:                    '*[data-js=accordion]',
        moduleTriggerQuery:             '*[data-accordion-trigger]',
        moduleContentQuery:             '*[data-accordion-content]',
        moduleAnimationSpeed:            300,
        moduleActiveClass:              'active',
        $accordions:                     {}
    },

    init () {

        /**
         * save module shorthand
         * */
        acc = this;

        /**
         * save shorthand for the accordion vars
         * */
        accVars = this.vars;

        /**
         * set on click event trigger
         * */
        this.eventTrigger();

    },

    eventTrigger () {

        /**
         * bind click event to moduleTriggerQuery in moduleQuery
         * */
        $(document).on("click", accVars.moduleQuery + ' ' + accVars.moduleTriggerQuery, (event) => {

            this.eventHandler(event, event.currentTarget);

        });

    },

    eventHandler (event, accordionQuery) {

        event.preventDefault();

        /**
         * save all accordions on active site
         * */
        accVars.$accordions = $(accVars.moduleQuery);

        /**
         * save event accordion
         * */
        let $accordion = $(accordionQuery).closest(accVars.moduleQuery);

        /**
         * class status
         * */
        let accordionHasClass = $accordion.hasClass(accVars.moduleActiveClass);

        /**
         * close all accordions
         * */
        this.close();

        /**
         * check if the event accordion
         * is open/active
         * */
        if (!accordionHasClass) {

            this.open($accordion);

        }

    },

    open ($accordion) {

        /**
         * add the active class and
         * slide down the content with an animation
         * */
        $accordion.addClass(accVars.moduleActiveClass).find(accVars.moduleContentQuery).slideDown(accVars.moduleAnimationSpeed);

    },

    close () {

        /**
         * cycle all accordions
         * */
        accVars.$accordions.each( (index, accordionQuery) => {

            /**
             * remove the active class and
             * slide up the content with an animation
             * */
            $(accordionQuery).removeClass(accVars.moduleActiveClass).find(accVars.moduleContentQuery).slideUp(accVars.moduleAnimationSpeed);

        });

    }

};
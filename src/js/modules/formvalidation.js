/**
 * Formvalidation Module
 *
 * @author Tobias Wöstmann
 */

let fv;

let fvVars;

let fvValidate;

let fvAction;

let fvErrors;

modules.formvalidation = {

    vars: {
        moduleQuery:                    '*[data-js=formvalidation]',

        errorClass:                     'error',
        errorMessageAttribute:          "data-lang-message",
        errorMessageQuery:              ".status.error",
        errorMessageClass:              "status error",
        errorMessage:                   "Bitte prüfen Sie Ihre Eingaben!",
        errorElementToInsertBeforeQuery:".element",

        validateEmptyFieldAttribute:    'data-validation-required',
        validateZipFieldAttribute:      'data-validation-zip',
        validateEmailFieldAttribute:    'data-validation-email',
        validateLengthAttribute:        'data-validation-length',

        textinputQuery:                 "input[type=text], input[type=date], input[type=email], input[type=password], input[type=number], input[type=search], input[type=time], input[type=url], input[type=tel]",
        textareaQuery:                  "textarea",
        selectboxQuery:                 "*[data-js=selectbox]",
        checkboxQuery:                  ".checkbox input",
        radioboxQuery:                  ".radiobox input",

        selectBoxSelectedAttribute:     "data-selectbox-selected",

        /**
         * module storage vars
         * */
        state:                          [],
        thisActiveElement:              '',
        scrollTo:                       9000000,
        errors:                         [],

    },

    init () {

        /**
         * save module shorthand
         * */
        fv = this;

        /**
         * save shorthand for the formvalidation vars
         * */
        fvVars = this.vars;

        /**
         * save shorthand for the formvalidation validations
         * */
        fvValidate = this.validate;

        /**
         * save shorthand for the formvalidation actions
         * */
        fvAction = this.action;

        /**
         * save shorthand for the formvalidation error array
         * */
        fvErrors = fvVars.errors;

        /**
         * bind submit event
         * */
        this.bindSubmit();

    },

    bindSubmit () {

        /**
         * trigger submit event of the form
         * */

        $(fvVars.moduleQuery).on('submit', (event) => {

            /**
             * set active form
             * */
            fvVars.thisActiveForm = $(event.currentTarget);

            /**
             * reset all errors
             * */
            fvAction.resetErrors();

            /**
             * check the form
             * */
            return this.action.checkFormSubmit();

        });

    },

    typecases: {

        textinput () {

            let checkingPassed = true;

            /**
             * cycle all queryed text input form elements
             * */
            fvVars.thisActiveForm.find(fvVars.textinputQuery).each( (index, inputQuery) => {

                /**
                 * assign input element
                 * */
                let $checkingInput = $(inputQuery);

                /**
                 * remove error class
                 * */
                $checkingInput.removeClass(fvVars.errorClass);


                /**
                 * check if it the element is visible
                 * */
                if($checkingInput.is(':visible')) {


                    /**
                     * check if the input are empty
                     * */
                    if ($checkingInput.is("[" + fvVars.validateEmptyFieldAttribute + "]")) {

                        if (!fvValidate.emptyField($checkingInput.val())) {

                            /**
                             * if not passed, throw error
                             * */
                            checkingPassed = fvAction.setError($checkingInput);

                        }

                    }

                    /**
                     * check if the input are a german zip code
                     * */
                    if ($checkingInput.hasClass(fvVars.validateZipFieldAttribute)) {

                        if (!fvValidate.zipField($checkingInput.val())) {

                            /**
                             * if not passed, throw error
                             * */
                            checkingPassed = fvAction.setError($checkingInput);

                        }

                    }

                    /**
                     * check if the input are a e-mail
                     * */
                    if ($checkingInput.hasClass(fvVars.validateEmailFieldAttribute)) {

                        if (!fvValidate.emailField($checkingInput.val())) {

                            /**
                             * if not passed, throw error
                             * */
                            checkingPassed = fvAction.setError($checkingInput);

                        }

                    }

                    /**
                     * check if the input has a minimal length
                     * */
                    if ($checkingInput.hasClass(fvVars.validateLengthAttribute)) {

                        if (!fvValidate.length($checkingInput.val(),$checkingInput.attr('data-min'))) {

                            /**
                             * if not passed, throw error
                             * */
                            checkingPassed = fvAction.setError($checkingInput);

                        }

                    }

                }

            });

            return checkingPassed;

        },

        textarea () {

            let checkingPassed = true;

            /**
             * cycle all queryed textarea form elements
             * */
            fvVars.thisActiveForm.find(fvVars.textareaQuery).each( (index, inputQuery) => {

                /**
                 * assign input element
                 * */
                let $checkingInput = $(inputQuery);

                /**
                 * remove error class
                 * */
                $checkingInput.removeClass(fvVars.errorClass);


                /**
                 * check if it the element is visible
                 * */
                if($checkingInput.is(':visible')) {

                    /**
                     * check if the input are empty
                     * */
                    if ($checkingInput.is("[" + fvVars.validateEmptyFieldAttribute + "]")) {

                        if (!fvValidate.emptyField($checkingInput.val())) {

                            /**
                             * if not passed, throw error
                             * */
                            checkingPassed = fvAction.setError($checkingInput);

                        }

                    }

                    /**
                     * check if the input has a minimal length
                     * */
                    if ($checkingInput.hasClass(fvVars.validateLengthAttribute)) {

                        if (!fvValidate.length($checkingInput.val(),$checkingInput.attr('data-min'))) {

                            /**
                             * if not passed, throw error
                             * */
                            checkingPassed = fvAction.setError($checkingInput);

                        }

                    }

                }

            });

            return checkingPassed;

        },

        selectbox () {

            let checkingPassed = true;

            /**
             * cycle all queryed select elements
             * */
            fvVars.thisActiveForm.find(fvVars.selectboxQuery).each( (index, inputQuery) => {

                /**
                 * assign select element
                 * */
                let $checkingComponent = $(inputQuery);

                /**
                 * remove error class
                 * */
                $checkingComponent.removeClass(fvVars.errorClass);

                /**
                 * check if it the element is visible
                 * */
                if($checkingComponent.is(':visible')) {

                    /**
                     * check if the input are empty
                     * */
                    if ($checkingComponent.find("select").is("[" + fvVars.validateEmptyFieldAttribute + "]")) {

                        if (!fvValidate.emptySelectbox($checkingComponent)) {

                            /**
                             * if not passed, throw error
                             * */
                            checkingPassed = fvAction.setError($checkingComponent);

                        }

                    }

                }

            });

            return checkingPassed;

        },

        checkbox () {

            let checkingPassed = true;

            /**
             * cycle all queryed text input form elements
             * */
            fvVars.thisActiveForm.find(fvVars.checkboxQuery).each( (index, inputQuery) => {

                /**
                 * assign input element
                 * */
                let $checkingComponent = $(inputQuery).parent().parent();
                let $checkinginput = $(inputQuery);

                /**
                 * remove error class
                 * */
                $checkingComponent.removeClass(fvVars.errorClass);

                /**
                 * check if it the element is visible
                 * */
                if($checkingComponent.is(':visible')) {

                    /**
                     * check if the input are empty
                     * */
                    if ($checkinginput.is("[" + fvVars.validateEmptyFieldAttribute + "]")) {

                        if (!fvValidate.emptyCheckbox($checkinginput)) {

                            /**
                             * if not passed, throw error
                             * */
                            checkingPassed = fvAction.setError($checkingComponent);

                        }

                    }

                }

            });

            return checkingPassed;

        },

        radiobox () {

            let checkingPassed = true;

            /**
             * cycle all queryed text input form elements
             * */
            fvVars.thisActiveForm.find(fvVars.radioboxQuery).each( (index, inputQuery) => {

                /**
                 * assign input element
                 * */
                let $checkingComponent = $(inputQuery).parent().parent();
                let $checkinginput = $(inputQuery);

                /**
                 * remove error class
                 * */
                $checkingComponent.removeClass(fvVars.errorClass);

                /**
                 * check if it the element is visible
                 * */
                if($checkingComponent.is(':visible')) {

                    /**
                     * check if the input are empty
                     * */
                    if ($checkinginput.is("[" + fvVars.validateEmptyFieldAttribute + "]")) {

                        if (!fvValidate.emptyRadiobox($checkinginput)) {

                            /**
                             * if not passed, throw error
                             * */
                            checkingPassed = fvAction.setError($checkingComponent);

                        }

                    }

                }

            });

            return checkingPassed;

        },

    },

    action: {

        checkFormSubmit () {

            let checkingPassed = true;

            /**
             * cycle all typecases to test all
             * form elements
             * */
            $.each(fv.typecases, (key, typecase) => {

                /**
                 * if the test fails set passed to false
                 * */
                if (!typecase()) {
                    checkingPassed = false;
                }

            });

            /**
             * if the test fails display errors and scroll
             * to postion of first cuased error
             * */
            if (!checkingPassed) {

                baseClass.scrollTo(fvVars.scrollTo + "px");

                fvAction.displayErrors();

            }

            return checkingPassed;

        },

        setError ($checkedFormElement) {

            /**
             * add error styling to the element
             * */
            $checkedFormElement.addClass(fvVars.errorClass);

            /**
             * set scroll postion
             * */
            fvAction.windowScrollToCalculation(parseInt($checkedFormElement.offset().top));

            /**
             * load optional error message
             * */
            let errorMessage = $checkedFormElement.attr(fvVars.errorMessageAttribute);

            /**
             * check if individual error
             * message exist
             * */
            if (errorMessage === undefined || errorMessage === null) {
                errorMessage = fvVars.errorMessage;
            }

            /**
             * push error message in array
             * when it didnt exist
             * */
            if (fvErrors.indexOf("- " + errorMessage) === -1){
                fvErrors.push("- " + errorMessage);
            }

            /**
             * return false to prevent submit
             * */
            return false;
        },

        windowScrollToCalculation (errorElementTopPosition) {

            /**
             * get the vertical center fo the site
             * */
            let siteCenter = parseInt(baseVars.windowHeight) / 2;

            /**
             * get position off the highest element that caused a error.
             * check saved scroll positon > the postion of the error element
             * and set it to 0 when the the element is in the highest viewport
             * */
            if (fvVars.scrollTo > errorElementTopPosition) {

                if (errorElementTopPosition < siteCenter) {

                    errorElementTopPosition = 0;

                }else{

                    errorElementTopPosition = errorElementTopPosition - siteCenter;
                }

                /**
                 * overide scroll top postion
                 * */
                fvVars.scrollTo = errorElementTopPosition;
            }

        },

        resetErrors () {

            /**
             * remove the error message box
             * */
            $(fvVars.errorMessageQuery).remove();

            /**
             * clear error array
             * */
            fvErrors = [];

        },

        displayErrors () {

            /**
             * build error box with all
             * saved error messages from the
             * fvErrors error
             * */
            let errorBox = `<div class="${fvVars.errorMessageClass}">`;

            $.each( fvErrors, (key, errorMessage) => {

                errorBox += `<p>${ errorMessage }<br></p>`;

            });

            errorBox += `</div>`;

            /**
             * get the first element from the
             * errorElementToInsertBefore query
             * */

            let $elementToInsert =  $(fvVars.errorElementToInsertBeforeQuery).first();

            /**
             * insert error in DOM
             * */

            $(errorBox).insertBefore($elementToInsert);

        }

    },

    validate: {

        emptyField (stValue) {

            return fvValidate.length(stValue,1);

        },

        emptySelectbox ($selectbox) {

            return $selectbox.is(`[${fvVars.selectBoxSelectedAttribute}]`);

        },

        emptyCheckbox ($checkbox) {

            return $checkbox.prop('checked');

        },

        emptyRadiobox ($radiobox) {

            return $("input[name='" + $radiobox.attr("name") + "']").is(':checked');

        },

        zipField (zip) {

            zip = jQuery.trim(zip);
            let reg = /^[0-9]{4,5}$/;
            return reg.test(zip);

        },

        emailField (email) {
            email = jQuery.trim(email);
            let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            return reg.test(email);
        },

        length (stValue, length = 1) {

            stValue = jQuery.trim( stValue );
            return stValue.length >= length;

        }

    }

};
///////////////////////////////////////////////////////
///               FORMVALIDATION JS                ///
///////////////////////////////////////////////////////

var fv;
var fvGlobals;
var fvActions;
var fvValidations;
var fvCases;
var fvErrors;

modules.formvalidation = {

    globals: {
        allDataJsElement: '*[data-js=formvalidation]',
        errorClass: 'error',
        errorMessageAttribute: "data-lang-message",
        errorMessage: "Bitte prüfen Sie Ihre Eingaben!",
        errorElementToInsertBefore: ".element",

        ClassValidateEmptyField: 'required',
        ClassValidateEmptyCheckbox: 'required',
        ClassValidateZipField: 'validateZip',
        ClassValidateEmailField: 'validateEmail',
        ClassValidateLength: 'validateLength',
        ClassValidateMatch: 'validateMatch',
        ClassValidateMatchPart: 'validateMatchPart',

        thisActiveElement: '',
        submit: true,
        scrollTo: 9000000,
        errors: [],

        textinputTrigger: "input[type=text], input[type=date], input[type=email], input[type=password], input[type=number], input[type=search], input[type=time], input[type=url], input[type=tel]",
        selectboxTrigger: ".selectbox select",
        checkboxTrigger: ".checkbox input"
    },

    ///////////////////////////////////////////////////////
    ///           INIT FORMVALIDATION MODULES           ///
    ///////////////////////////////////////////////////////

    init: function() {

        fv = this;
        fvGlobals = this.globals;
        fvActions = this.setActions;
        fvValidations = this.setValidations;
        fvCases = this.setValidationCases;
        fvErrors = this.globals.errors;

        this.bindSubmit();

    },


    bindSubmit: function() {


        $(fvGlobals.allDataJsElement).submit(function() {

            fvGlobals.submit = true;
            fvGlobals.thisActiveForm = $(this);

            fvActions.resetErrors();

            fvGlobals.submit = fvActions.checkFormSubmit(fvCases.textinput(),fvCases.selectboxes(), fvCases.checkboxes());

            return fvGlobals.submit;

        });

    },

    setValidationCases: {

        textinput: function () {

            var textinputReturn = true;

            fvGlobals.thisActiveForm.find(fvGlobals.textinputTrigger).each(function() {

                var checkingElement = $(this);
                checkingElement.removeClass(fvGlobals.errorClass);

                if(checkingElement.is(':visible')) {

                    if (checkingElement.hasClass(fvGlobals.ClassValidateEmptyField)) {
                        if (!fvValidations.validateEmptyField(checkingElement.val())) {
                            textinputReturn = fvActions.setErrorHandling(checkingElement);
                        }
                    }

                    if (checkingElement.hasClass(fvGlobals.ClassValidateZipField)) {
                        if (!fvValidations.validateZipField(checkingElement.val())) {
                            textinputReturn = fvActions.setErrorHandling(checkingElement);
                        }
                    }

                    if (checkingElement.hasClass(fvGlobals.ClassValidateEmailField)) {
                        if (!fvValidations.validateEmailField(checkingElement.val())) {
                            textinputReturn = fvActions.setErrorHandling(checkingElement);
                        }
                    }

                    if (checkingElement.hasClass(fvGlobals.ClassValidateLength)) {
                        if (!fvValidations.validateLength(checkingElement.val(),checkingElement.attr('data-min'))) {
                            textinputReturn = fvActions.setErrorHandling(checkingElement);
                        }
                    }

                    if (checkingElement.hasClass(fvGlobals.ClassValidateMatch) || checkingElement.hasClass(fvGlobals.ClassValidateMatchPart)) {

                        checkingElement =  fvGlobals.thisActiveForm.find('.' + fvGlobals.ClassValidateMatch);
                        var checkingElementMatching =  fvGlobals.thisActiveForm.find('.' + fvGlobals.ClassValidateMatchPart);

                        if (!fvValidations.validateMatch(checkingElement.val(),checkingElementMatching.val())) {
                            textinputReturn = fvActions.setErrorHandling(checkingElement);
                            fvActions.setErrorHandling(checkingElementMatching);
                        }
                    }

                }

            });

            return textinputReturn;

        },

        selectboxes: function () {

            var selectboxesReturn = true;

            fvGlobals.thisActiveForm.find(fvGlobals.selectboxTrigger).each(function() {

                var checkingElement = $(this);
                checkingElement.closest("div").removeClass(fvGlobals.errorClass);

                if(checkingElement.closest("div").is(':visible')) {

                    if (checkingElement.hasClass(fvGlobals.ClassValidateEmptyCheckbox)) {
                        if (!fvValidations.validateEmptyField(checkingElement.find("option:selected").val())) {
                            selectboxesReturn = fvActions.setErrorHandling(checkingElement.closest("div"));
                        }
                    }

                }

            });

            return selectboxesReturn;

        },

        checkboxes: function () {

            var checkboxesReturn = true;

            fvGlobals.thisActiveForm.find(fvGlobals.checkboxTrigger).each(function() {

                var checkingElement = $(this);
                checkingElement.parent().removeClass(fvGlobals.errorClass);

                if(checkingElement.parent().is(':visible')) {

                    if (checkingElement.hasClass(fvGlobals.ClassValidateEmptyCheckbox)) {
                        if (!fvValidations.validateEmptyCheckbox(checkingElement)) {
                            checkboxesReturn = fvActions.setErrorHandling(checkingElement.parent());
                        }
                    }

                }

            });

            return checkboxesReturn;

        }

    },

    setActions: {

        checkFormSubmit: function (textinputCheck, selectboxesCheck, checkboxesCheck) {

            var tempSubmit = true;

            if (textinputCheck == false || selectboxesCheck == false || checkboxesCheck == false) {

                tempSubmit = false;

                base.scrollTo(fvGlobals.scrollTo + "px");
                fvActions.displayErrors();

            }

            return tempSubmit

        },

        setErrorHandling: function (checkingElement) {

            checkingElement.addClass(fvGlobals.errorClass);

            fvActions.windowScrollToCalculation(parseInt(checkingElement.offset().top));

            var errorMessage = checkingElement.attr(fvGlobals.errorMessageAttribute);

            if (errorMessage === undefined || errorMessage === null) {
                errorMessage = fvGlobals.errorMessage;
            }

            if (fvErrors.indexOf("- " + errorMessage) === -1){
                fvErrors.push("- " + errorMessage);
            }

            return false;
        },

        windowScrollToCalculation: function (top) {

            var siteCenter = parseInt(base.vars.windowHeight) / 2;

            if (fvGlobals.scrollTo > top) {
                if (top < siteCenter) {
                    top = 0
                }else{
                    top = top - siteCenter;
                }

                fvGlobals.scrollTo = top;
            }

        },

        resetErrors: function () {

            $(".status.error").remove();
            fvErrors = [];

        },

        displayErrors: function () {

            var errorBox = "<div class='status error'>";
            $.each( fvErrors, function( key, value ) {

                errorBox += "<p>" + value + "<br></p>"

            });
            errorBox += "</div>";
            var gridWrapper =  $(fvGlobals.errorElementToInsertBefore).first();
            $(errorBox).insertBefore(gridWrapper);

        }

    },



    setValidations: {

        validateEmptyField: function (stValue) {

            return fvValidations.validateLength(stValue,1);

        },

        validateEmptyCheckbox: function (element) {


            return element.prop('checked')

        },

        validateZipField: function (zip) {

            zip = jQuery.trim(zip);
            var reg = /^[0-9]{4,5}$/;
            return reg.test(zip);

        },

        validateEmailField: function (email) {

            email = jQuery.trim(email);
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            return reg.test(email);

        },

        validateLength: function (stValue,length) {

            stValue = jQuery.trim( stValue );
            return stValue.length >= length;

        },

        validateMatch: function (stValue1,stValue2) {

            stValue1 = jQuery.trim(stValue1);
            stValue2 = jQuery.trim(stValue2);
            return stValue1 == stValue2;

        }

    }


}


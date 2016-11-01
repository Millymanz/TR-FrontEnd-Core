var validation = {
    isDraft: false,
    timeSpanRegex: /^((([0-1][0-9])|([2][0-3])):(([0-5][0-9])|([2][0-3])):(([0-5][0-9])|([2][0-3])))$/,
    emailRegex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,

    getValidationType: function (typeName) {

        for (var i = 0, ii = validationTypes.length; i < ii ; i++) {

            if (validationTypes[i].name === typeName) {
                return validationTypes[i];
            }
        }
    },

    set: function ($element, isValid, errorMsg, validationArray) {

        // finds and return validation container
        var $errorcontainer = validation.getErrorContainer($element);

        var controlName = $element.attr("id");

        if (!controlName && ($element.is("select") || $element.attr("type") == "radio" || $element.attr("type") == "checkbox")) {
            controlName = $element.attr("name");
        }

        var parentIsTable = false;

        // return how many times element is inserted in validation array as invalid
        var invalidElementLength = 0;

        if (parentIsTable) {
            invalidElementLength = (typeof validationArray === 'undefined') ? 1 : $.grep(validationArray, function (n) { return n.headerId == controlName && n.valid == false; }).length;
        } else {
            invalidElementLength = (typeof validationArray === 'undefined') ? 1 : $.grep(validationArray, function (n) { return n.name == controlName && n.valid == false; }).length;
        }

        // it does not set error container if it is valid and validation array contains the element as invalid
        if ((isValid && invalidElementLength > 0) == false) {
            // set validation message in tooltip, style and bind events of tool tip
            validation.setErrorContainer($errorcontainer, $element, errorMsg, isValid, invalidElementLength);
        }

        // set the style of the element
        validation.setElementStyle($element, isValid);

        return false;
    },

    reset: function ($control) {

        var $items = [];

        for (var i = 0, vlength = validationTypes.length; i < vlength; i++) {
            var validationAttribute = validationTypes[i].dataattribute;

                var attributeFound = validation.hasAttribute($control, validationAttribute);
                if (attributeFound) {
                    $items.push($control[0]);
                }
                else {
                    // inputs are in child elements
                    $items = $control.find("input[" + validationAttribute + "],select[" + validationAttribute + "],textarea[" + validationAttribute + "], .panel-validation[" + validationAttribute + "]");
                }
          

            for (var j = 0, jj = $items.length; j < jj; j++) {
                validation.set($($items[j]), true, "", new Array());
            }
        }
    },

    getControlIdentifier: function ($control) {
        var controlId = $control.attr('id');
        var controlName = $control.attr('name');

        if ((controlId === undefined || controlId == "") && controlName !== undefined && controlName.length > 0) {
            return controlName;
        }
        else {
            return controlId;
        }
    },

    hasAttribute: function ($control, name) {
        return $control.attr(name);
    },

    getErrorContainer: function ($element) {
        var controlIdentifier = validation.getControlIdentifier($element);
        $errorcontainer = $("#" + validation.getControlIdentifier($element) + "-field-validation");
        return $errorcontainer;
    },

    setErrorContainer: function ($errorcontainer, $element, errorMsg, isValid, invalidElementLength) {
        // set error message
        $gcopErrorContainer = $errorcontainer;//.gcop();
        $gcopErrorContainer.attr("data-valmsg-text", errorMsg);
        $gcopErrorContainer.attr("title", errorMsg);

        if (isValid) {
            if (invalidElementLength < 1) {
                // show required indicator
                validation.showRequiredIndicator($errorcontainer);

                // remove invalid input class and set valid input class to the validation help
                $gcopErrorContainer.removeClass('field-validation-error');
                $gcopErrorContainer.addClass('field-validation-valid');

                // unbind click event of the validation help
                $errorcontainer.unbind("click");
            }
        }
        else {
            // hide required indicator
            validation.hideRequiredIndicator($errorcontainer);

            // remove valid input class and set invalid input class to the validation help
            $gcopErrorContainer.removeClass('field-validation-valid');
            $gcopErrorContainer.addClass('field-validation-error');

            // assign validation tooltip event for the first invalid control
            if (invalidElementLength <= 1) {
                validation.bindValidationToolTip($errorcontainer, $element);
            }
        }
    },

    getDynoControl: function ($element) {
        // return dyno control
        var $dynoControl = $element;
        if (validation.hasAttribute($element, "dyno-control") == false) {
            $dynoControl = $element.closest("div.dyno-control");
        }
        return $dynoControl;
    },

    hideRequiredIndicator: function ($errorcontainer) {
        // hide required indicator
        $errorcontainer.parent().find("span.required").hide();
    },

    showRequiredIndicator: function ($errorcontainer) {
        // show required indicator
        $errorcontainer.parent().find("span.required").show();
    },

    setDynoControlStyle: function ($element, isValid) {
        var elementName;
        var $tag = $element;
        var tagName = $tag.get(0).tagName;
        var type = $tag.get(0).type;
        if (isValid) {
            if (tagName == "TEXTAREA") {
                $element.css("border", "");
            }
            else if (tagName == "INPUT" && (type == "radio" || type == "checkbox")) {
                var elementname = $tag.getAttribute("name");
                $("input[name='" + elementname + "']").css("border", "").css("outline", "");

            } else if ($tag.attr("data-dyno-type") === "auto-complete") {
                $tag.find(".search").css("border", "").css("outline", "");
            }
            else {
                $element.closest("div.validation-style-wrapper").css("border", "");
            }
        }
        else {
            if (tagName == "TEXTAREA") {
                $element.css("border", "2px solid red");
            }
            else if (tagName == "INPUT" && (type == "radio" || type == "checkbox")) {
                var elementname = $tag.attr("name");
                $("input[name='" + elementname + "']").css("border", "2px solid red").css("outline", "2px solid red");

            } else if ($tag.attr("data-dyno-type") === "auto-complete") {
                $tag.find(".search").css("border", "2px solid red").css("outline", "2px solid red");
            }
            else {
                var $wrapper = $element.closest("div.validation-style-wrapper");
                $wrapper.css("border", "2px solid red"); //.css("outline", "2px solid red");
            }
        }
    },

    setDefaultControlStyle: function ($element, isValid) {
        var $tag = $element;
        var type = $tag.get(0).type;
        var tagName = $tag.get(0).tagName;
        var $parent = $element.parent();
        var $grandParent = $element.parent().parent();
        var $greatParent = $element.parent().parent().parent();

        if (isValid) {

            // new currency validation
            if ($greatParent.hasClass("currency-container") && $greatParent.hasClass("invalid")) {
                $greatParent.removeClass("invalid");
            }
            else if (tagName == "INPUT" && (type == "radio" || type == "checkbox")) {
                $grandParent.removeClass('invalid');
            }
            else if ($tag.attr("data-val-isdatetime") !== undefined) {
                $tag.find("select.date-picker-part").parent().removeClass("invalid");
                $tag.find("select.time-part").parent().removeClass('invalid');
            }
            else if ($tag.hasClass("date-picker-part")) {
                // remove validation style for date control
                $grandParent.removeClass("invalid");
            }
            else if ($tag.hasClass("time-part")) {
                // set validation style for time-control
                $grandParent.find("select.time-part").parent().removeClass('invalid');
            }
            else if ($tag.hasClass("panel-validation")) {
                $tag.removeClass('invalid');
            }
            else if ($tag.hasClass("tabbed-window-content")) {
                var tabId = $tag.attr("id") + "-tab-title";
                var $tabTitle = $("#" + tabId);
                $tabTitle.removeClass("invalid");
            } else if ($tag.attr("data-dyno-type") === "auto-complete") {
                $tag.find(".search").removeClass("invalid");
            }
            else if ($tag.attr("data-dyno-type") === "bool") {
                $tag.find("input[type=radio]").removeClass("invalid");
            }
            else {
                if ($parent.hasClass('select-wrapper')) {
                    $parent.removeClass('invalid');
                } else {
                    $tag.removeClass('invalid');
                }
            }
        }
        else {
            var $ancestor = $element.parent().parent().parent().parent();

            // new currency validation
            if ($ancestor.hasClass("currency-container")) {

                if (!$ancestor.hasClass("invalid")) {
                    $ancestor.addClass("invalid");
                    return;
                }
                else {
                    return;
                }
            }

            else if (tagName == "INPUT" && (type == "radio" || type == "checkbox")) {
                // set validation style for checkbox and radio buttons
                $grandParent.addClass('invalid');
            }
            else if ($tag.attr("data-val-isdatetime") !== undefined) {
                $tag.find("select.date-picker-part").parent().addClass("invalid");
                $tag.find("select.time-part").parent().addClass('invalid');
            }
            else if ($tag.hasClass("date-picker-part")) {
                // set validation style for date control
                $grandParent.find("select.date-picker-part").parent().addClass("invalid");
            }
            else if ($tag.hasClass("time-part")) {
                // set validation style for time-control
                $grandParent.find("select.time-part").parent().addClass('invalid');
            } else if ($tag.parent().hasClass("date-time-span")) {
                // NB: B#4736 This is a HACK to resolve (empty space) validation on Parameterised searches. If parameterised, on
                // composed search screeen and value is empty then remove "invalid" and "field-validation-error" classes.
                var $pTd = $tag.closest("tr").find("td.parameterised");
                var parameterised = $pTd.find("input[type=checkbox]:checked").length > 0;
                if (parameterised && $tag.closest("tr").find("input.cpftxt").val().length == 0) {
                    var $validator = $tag.parent().find('.field-validation-error');
                    $tag.removeClass('invalid');
                    $validator.removeClass('field-validation-error');
                    $validator.addClass('field-validation-valid');
                } else {
                    $tag.addClass('invalid');
                }
            } else if ($tag.hasClass("tabbed-window-content")) {
                var tabId = $tag.attr("id") + "-tab-title";
                var $tabTitle = $("#" + tabId);
                $tabTitle.addClass("invalid");
            } else if ($tag.attr("data-dyno-type") === "auto-complete") {
                $tag.find(".search").addClass("invalid");
            } else if ($tag.attr("data-dyno-type") === "bool") {
                $tag.find("input[type=radio]").addClass("invalid");
            } else {
                if ($parent.hasClass('select-wrapper')) {
                    $parent.addClass('invalid');
                } else {
                    $tag.addClass('invalid');
                }
            }
        }
    },

    setElementStyle: function ($element, isValid) {
        validation.setDefaultControlStyle($element, isValid);
    },

    bindValidationToolTip: function ($errorcontainer, $element) {
        // validation help click
        // validation help click

        /*
        $errorcontainer.off("click").on("click", function (e) {
            var $trigger = $(this);
            $("#validation-tooltip").gcop().hide();
            var $tooltip = $("#validation-tooltip");
            var $scroll = $('#scroll-content');

            // get position of the validation help and calculate new position of tool tip
            var position = $("#dyno-view-body").length > 0 ? $element.offset() : $element.position();

            // var top = position.top + $element.outerHeight() + 12; 
            // var top = (position.top - $dynobody.position().top) + $element.outerHeight() + $('#scroll-content').scrollTop();

            var top = ($(e.target).offset().top + $scroll.scrollTop() - $scroll.offset().top + 37);
            var left = $(e.target).offset().left - 56;

            // set msg to tooltip control
            $("#validation-text").html($(this).attr("data-valmsg-text"));

            // set new position of the tool tip
            $tooltip.css("top", top + "px");
            $tooltip.css("left", left + "px");
            $tooltip.css("display", "block");

            return false;

        });
        */

        $errorcontainer.off('click.target').on('click.target', function (e) {
            e.preventDefault();
            $(this).focus();
        });

        $errorcontainer.tooltip();

        $("a.validation-close").on("click", function () {
            $(this).parent().parent().gcop().hide();
            return false;
        });
    }
};

(function ($) {
    $.fn.validate = function (options) {

        var defaults = { ignoreList: 'template', validationArray: [] };
        options = $.extend(defaults, options);

        var invalidElements = new Array();
        var validationArray = defaults.validationArray;

        var isValidControl = function ($control) {

            var ignoreClasses = [], valid = true;

            // convert the supplied list or single item to an array if it is not one already.
            ignoreClasses = $.map(defaults.ignoreList.split(","), $.trim);

            // check if the 
            $.each(ignoreClasses, function (i) {
                if ($control.closest("div.dyno-control").hasClass(ignoreClasses[i])) {
                    valid = false;
                }
            });

            return valid;
        };

        this.each(function () {
            var $controlToValidate = $(this);
            if (isValidControl($controlToValidate)) {
                for (var i = 0, vlength = validationTypes.length; i < vlength; i++) {
                    var validationAttribute = validationTypes[i].dataattribute;

                    // get elements which contains validation attribute (e.g. data-val-required)
                    var $items = [];

                    // check if control has attribute using function.
                    var attributeFound = validation.hasAttribute($controlToValidate, validationAttribute);
                        if (attributeFound) {
                            $items.push($controlToValidate[0]);
                        }
                        else {
                            // inputs are in child elements
                            $items = $controlToValidate.find("input[" + validationAttribute + "],select[" + validationAttribute + "],textarea[" + validationAttribute + "], .panel-validation[" + validationAttribute + "]");
                        }
                   

                    var itemlength = $items.length;
                    if (itemlength == 0) {
                        continue;
                    }

                    for (var j = 0; j < itemlength; j++) {
                        var $control = $($items[j]);

                        // index of the element id in invalid element array
                        //var $dynoControl = $control.closest("div.dyno-control");
                        var controlName = $control.attr("id");

                        if (!controlName && ($control.is("select") || $control.attr("type") == "radio" || $control.attr("type") == "checkbox")) {
                            controlName = $control.attr("name");
                        }

                        var dataRow = $control.attr("data-row");
                        var invalidElementIndex = $.grep(validationArray, function (n) { return n.name == controlName && n.valid == false && n.row == dataRow; }).length;
                        //do not validate if the element is already in invalid elemnts array
                        if (invalidElementIndex < 1) {
                            //invoke validate method
                            var isValid;
                            isValid = validationTypes[i].validate($control);
                            var errorMessageinAttribute = jQuery.trim($control.attr(validationAttribute));
                            var errorMsg = errorMessageinAttribute.length > 0 ? errorMessageinAttribute : validationTypes[i].getValidationText($control);

                            var parentIsTable = $control.closest("div.dyno-control").attr("data-parent-type") == "Table";

                            // this code is here to deal with table rows.
                            // if the first row in a table has invalid values and the second doesnt, this code ensures 
                            // that the validation icon will be shown in the header.
                            if (!isValid) {

                                // insert the element id in invalid elements array
                                invalidElements.push(validation.getControlIdentifier($control));

                                // for now also insert into the validationArray passed in
                                validationArray.push({ name: controlName, valid: isValid, row: dataRow });
                            }

                            if (typeof dynoValidation === 'undefined') {
                                validation.set($control, isValid, errorMsg, validationArray);
                            }
                            else {
                                validation.set($control, isValid, errorMsg, dynoValidation.validationArray);
                            }
                        }
                    }
                }
            }

        });

        //if ($.grep(validationArray, function (n) {
        //    //if (typeof DYNOMODE === "undefined") {
        //    //    if (n.valid == false) {
        //    //        return true;
        //    //    } else {
        //    //        return false;
        //    //    }
        //    //} else {
        //            return n.valid == false;
        //    //}
        //}).length == 0) {
        //    // no validation errors
        //    if (options.success) {
        //        options.success();
        //    }

        //    return true;
        //}
        //else {
        //    if (options.onInvalid) {
        //        options.onInvalid();
        //    }

        //    defaults.validationArray = validationArray;
        //    return false;
        //}

        if (invalidElements.length == 0) {
            // no validation errors
            if (options.success) {
                options.success();
            }

            return true;

        } else {
            if (options.onInvalid) {
                options.onInvalid();
            }

            defaults.validationArray = validationArray;
            return false;
        }

    };
})(jQuery);


var validationTypes = [
	 {
	     "name": "required",
	     "dataattribute": "data-val-required",
	     "validate": function ($control) {
	         var val = jQuery.trim($control.val());

	         var isValid = false;
	         var $gcopControl = $control;//.gcop();
	         var tagName = $gcopControl.get(0).tagName;

	         if (validation.isDraft) {
	             // ignore required for draft
	             return true;
	         }

	         //if (tagName == "checkbox" || tagName == "radio") {
	         if ($gcopControl.get(0).tagName === "INPUT" && $gcopControl.get(0).tagName === "checkbox" || $gcopControl.get(0).tagName === "INPUT"  && $gcopControl.get(0).tagName === "radio") {
	             var $groupname = $gcopControl.attr("name");
	             isValid = $("input[name='" + $groupname + "']:checked").length > 0;
	         }
	         else if ($gcopControl.hasClass("date-picker-part")) {
	             isValid = $control.val() != "0" && jQuery.trim($control.parent().parent().find("select.month:eq(0)").val()) != "0" && jQuery.trim($control.parent().parent().find("select.year:eq(0)").val()) != "0";
	         }
	         else if ($gcopControl.hasClass("time-part")) {
	             isValid = $control.val() != "-1" && jQuery.trim($control.parent().parent().find("select.minute:eq(0)").val()) != "-1";
	         }
	         else if ($gcopControl.hasClass("dyno-image-upload")) {
	             isValid = jQuery.trim($gcopControl.getAttribute("data-value")) !== "";
	         }
	         else if ($gcopControl.hasClass("panel-validation")) {
	             var $groupname = $control.attr("id");

	             // check if autocomplete grid is not null
	             if ($gcopControl.find(".autocomplete-grid").length > 0) {

	                 isValid = JSON.parse($gcopControl.find(".autocomplete-grid").find(".data-row:first").attr("data")).value.length > 0;
	             }
	             else {
	                 isValid = $("input[name='" + $groupname + "']:checked").length > 0;
	                 //isValid = $("input[name='" + $groupname + "']").gcop().isAnyChecked();
	             }
	         }
	         else if ($gcopControl.attr("data-dyno-type") == "auto-complete") {

	             var hasValue = autocompleteGrid.hasValue($control.find(".autocomplete-grid"));

	             if (hasValue) {
	                 isValid = true;
	             } else {
	                 isValid = false;
	             }
	             //// single from list
	             //var selectedValue = $control.find(".search").attr("data-selected");
	             //var listType = $control.find().getAttribute("list-type");
	             //var allowFreeText = isTrue($gcopControl.getAttribute("data-allow-free-text"));


	             //// if multiple list - check the rows have something
	             //if (listType === "multiple") {
	             //    if ($gcopControl.find(".none-selected").is(':visible')) {
	             //        isValid = false;
	             //    } else {
	             //        isValid = true;
	             //    }
	             //} else if (listType === "single") {
	             //    if (selectedValue !== undefined && selectedValue !== "") {
	             //        isValid = true;
	             //    } else {
	             //        isValid = false;
	             //    }
	             //}
	         }
	         else if ($control.is("select")) {

	             isValid = ($control.val() != "-1" && $control.find("option").length > 0);
	         }
	         else {
	             isValid = val.length > 0;
	         }
	         return isValid;
	     },
	     "getValidationText": function ($control) {
	         if ($control.hasClass("dyno-image-upload")) {
	             return "Please select an image.";
	             //return "RESOURCE{{corejs.ui.js}:{ImageUploadRequiredValidationText}:{Please select an image.}}"; return "RESOURCE{{corejs.ui.js}:{ImageUploadRequiredValidationText}:{Please select an image.}}";

	         }
	         else {
	             return "Please specify a value";
	         }
	     },
	     "useParameters": false
	 },
     {
         "name": "isnumeric",
         "dataattribute": "data-val-isnumeric",
         "validate": function ($control) {
             var val = $control.val();

             var isRequired = $control.parent().attr("data-val-required");
             if (isNullOrEmpty(isRequired) && isNullOrEmpty(val)) {
                 return true;
             }

             if (DECIMALSEPARATOR) {
                 if (DECIMALSEPARATOR == '.') {
                     val = val.replace(",", "");
                 }
                 else if (DECIMALSEPARATOR == ',') {
                     val = val.replace(".", "").replace(",", ".");
                 }
             }
             return !isNaN(val);
         },
         "getValidationText": function ($control) {
             return "RESOURCE{{corejs.ui.js}:{GenericNumericValidationText}:{Please specify a numeric value}}";
         },
         "useParameters": false
     },
    {
        "name": "isint",
        "dataattribute": "data-val-isint",
        "validate": function ($control) {

            var val = $control.val();

            var isRequired = $control.parent().attr("data-val-required");
            if (isNullOrEmpty(isRequired) && isNullOrEmpty(val)) {
                return true;
            }

            var patt = /^[0-9]*$/;
            return patt.test(val);
        },
        "getValidationText": function ($control) {
            return "RESOURCE{{corejs.ui.js}:{GenericIntegerValidationText}:{Please specify an integer value}}";
        },
        "useParameters": false
    },
	{
	    "name": "max",
	    "dataattribute": "data-val-max",
	    "validate": function ($control) {
	        var val = $control.val();

	        var isRequired = $control.parent().attr("data-val-required");
	        if (isNullOrEmpty(isRequired) && isNullOrEmpty(val)) {
	            return true;
	        }

	        if (DECIMALSEPARATOR) {
	            if (DECIMALSEPARATOR == '.') {
	                val = val.replace(",", "");
	            }
	            else if (DECIMALSEPARATOR == ',') {
	                val = val.replace(".", "").replace(",", ".");
	            }
	        }

	        var maximumValue = parseFloat($control.attr("data-val-max-value"));
	        return parseFloat(val) <= maximumValue;
	    },
	    "getValidationText": function ($control) {
	        var msg = "RESOURCE{{corejs.ui.js}:{GenericMaxValidationText}:{Please specify a value less than maximum value {0}}}";
	        return msg.replace("{0}", $control.attr("data-val-max-value"));
	    },
	    "useParameters": true
	},
	{
	    "name": "min",
	    "dataattribute": "data-val-min",
	    "validate": function ($control) {
	        var val = $control.val();

	        var isRequired = $control.parent().attr("data-val-required");
	        if (isNullOrEmpty(isRequired) && isNullOrEmpty(val)) {
	            return true;
	        }

	        if (DECIMALSEPARATOR) {
	            if (DECIMALSEPARATOR == '.') {
	                val = val.replace(",", "");
	            }
	            else if (DECIMALSEPARATOR == ',') {
	                val = val.replace(".", "").replace(",", ".");
	            }
	        }

	        var minimumValue = parseFloat($control.attr("data-val-min-value"));
	        return parseFloat(val) >= minimumValue;
	    },
	    "getValidationText": function ($control) {
	        var msg = "RESOURCE{{corejs.ui.js}:{GenericMinValidationText}:{Please specify a value greater than minimum value {0}}}";
	        return msg.replace("{0}", $control.attr("data-val-min-value"));
	    },
	    "useParameters": true
	},
    {
        "name": "iscurrency",
        "dataattribute": "data-val-iscurrency",
        "validate": function ($control) {
            var val = $control.val();
            var patt = new RegExp("^-|\\d*(\\.|\\,)\\d{2}$", "g");
            return patt.test(val);
        },
        "getValidationText": function ($control) {
            return "RESOURCE{{corejs.ui.js}:{GenericCurrencyValidationText}:{Please specify a value in a valid currency format}}";
        },
        "useParameters": true
    },
    {
        "name": "decimalplaces",
        "dataattribute": "data-val-decimalplaces",
        "validate": function ($control) {
            var val = $control.val();

            var required = $control.attr("data-val-required");
            if (!required && !val) {
                return true;
            }

            var decimalplaces = parseInt($control.attr("data-val-decimalplaces-value"));
            var patt = decimalplaces > 0 ? new RegExp("^\\d*.\\d{" + decimalplaces + "}$", "g") : new RegExp("^\\d*$", "g");
            return patt.test(val);
        },
        "getValidationText": function ($control) {
            var msg = "RESOURCE{{corejs.ui.js}:{GenericDecimalPlacesValidationText}:{Please specify a value in a valid format ( {0} ) decimal places.}}";
            return msg.replace("{0}", $control.attr("data-val-decimalplaces-value"));
        },
        "useParameters": true
    },
    {
        "name": "isdate",
        "dataattribute": "data-val-isdate",
        "validate": function ($control) {
            var $parent = $control.parent().parent();
            var day = parseInt($parent.find("select.day").val());
            var month = parseInt($parent.find("select.month").val());
            var year = parseInt($parent.find("select.year").val());

            var required = $control.attr("data-val-required");

            ////Default Date
            //if (!required && year == 1 && month == 1 && day == 1) {
            //    return true;
            //}

            ////No Date Selected
            //if (!required && year == 0 && month == 0 && day == 0) {
            //    return true;
            //}

            if ((!required || validation.isDraft) && day === 0 && month === 0 && year === 0) {
                return true;
            }

            //// check for any unselected sections
            if (day === 0 || month === 0 || year === 0) {
                return false;
            }

            var dateObject = new Date(year, month - 1, day);
            return (day == dateObject.getDate() && month == dateObject.getMonth() + 1 && year == dateObject.getFullYear());
        },
        "getValidationText": function ($control) {
            return "RESOURCE{{corejs.ui.js}:{GenericDateValidationText}:{Please specify a valid date}}";
        },
        "useParameters": false
    },
    {
        "name": "istime",
        "dataattribute": "data-val-istime",
        "validate": function ($control) {
            var required = $control.attr("data-val-required");
            var hour = $control.val();
            var $parent = $control.parent().parent();
            var minute = $parent.find("select.time-part.minute").val();
            //if (!required && hour == "" && minute == "") {
            //    return true;
            //}

            // check for nothing selected
            if ((!required || validation.isDraft) && hour === "-1" && minute === "-1") {
                return true;
            }

            // check for any unselected sections
            if (hour === "-1" || minute === "-1") {
                return false;
            }

            return jQuery.trim($control.val()).length > 0 && jQuery.trim($parent.find("select.time-part").val()).length > 0;
        },
        "getValidationText": function ($control) {
            return "RESOURCE{{corejs.ui.js}:{GenericTimeValidationText}:{Please specify a valid time}}";
        },
        "useParameters": false
    },
    {
        "name": "isdatetime",
        "dataattribute": "data-val-isdatetime",
        "validate": function ($control) {

            var dateTimeControlId = $control.attr("id");

            var $datePart = $control.find("#" + dateTimeControlId + "-day");
            var $timePart = $control.find("#" + dateTimeControlId + "-hour");

            var hour = $timePart.val();
            var minute = $timePart.parent().parent().find("select.time-part.minute").val();

            var $parent = $datePart.parent().parent();
            var day = parseInt($parent.find("select.day").val());
            var month = parseInt($parent.find("select.month").val());
            var year = parseInt($parent.find("select.year").val());

            var required = $datePart.attr("data-val-required");

            if ((!required || validation.isDraft) && day === 0 && month === 0 && year === 0 && hour === "-1" && minute === "-1") {
                return true;
            }

            //// check for any unselected sections
            if (day === 0 || month === 0 || year === 0 || hour === "-1" || minute === "-1") {
                return false;
            }

            var dateObject = new Date(year, month - 1, day);
            return (day == dateObject.getDate() && month == dateObject.getMonth() + 1 && year == dateObject.getFullYear());

        },
        "getValidationText": function ($control) {
            return "RESOURCE{{corejs.ui.js}:{GenericDateTimeValidationText}:{Please specify a valid date time}}";
        },
        "useParameters": false
    },
     {
         "name": "past-date",
         "dataattribute": "data-val-past-date",
         "validate": function ($control) {
             var $parent = $control.parent().parent();
             var day = parseInt($parent.find("select.day").val());
             var month = parseInt($parent.find("select.month").val());
             var year = parseInt($parent.find("select.year").val());

             var required = $control.attr("data-val-required");
             if ((!required || validation.isDraft) && year == 0 && month == 0 && day == 0) {
                 return true;
             }

             var dateObject = new Date(year, month - 1, day);
             var today = new Date();
             return (dateObject >= today) || (today.getDate() == dateObject.getDate() && today.getMonth() == dateObject.getMonth() && today.getFullYear() == dateObject.getFullYear());
         },
         "getValidationText": function ($control) {
             return "RESOURCE{{corejs.ui.js}:{GenericFutureDateValidationText}:{Specified date is out of range. Please specify a later date.}}";
         },
         "useParameters": false
     },
     {
         "name": "future-date",
         "dataattribute": "data-val-future-date",
         "validate": function ($control) {
             var $parent = $control.parent().parent();
             var day = parseInt($parent.find("select.day").val());
             var month = parseInt($parent.find("select.month").val());
             var year = parseInt($parent.find("select.year").val());

             var required = $control.attr("data-val-required");
             if ((!required || validation.isDraft) && year == 0 && month == 0 && day == 0) {
                 return true;
             }

             var dateObject = new Date(year, month - 1, day);
             var today = new Date();
             return (dateObject <= today) || (today.getDate() == dateObject.getDate() && today.getMonth() == dateObject.getMonth() && today.getFullYear() == dateObject.getFullYear());
         },
         "getValidationText": function ($control) {
             return "RESOURCE{{corejs.ui.js}:{GenericPastDateValidationText}:{Specified date is out of range. Please specify a past date.}}";
         },
         "useParameters": false
     },
     {
         "name": "istext",
         "dataattribute": "data-val-istext",
         "validate": function ($control) {
             return true;
         },
         "getValidationText": function ($control) {
             return "";
         },
         "useParameters": false
     },
     {
         "name": "istimespan",
         "dataattribute": "data-val-istimespan",
         "validate": function ($control) {
             return validation.timeSpanRegex.test($control.val());
         },
         "getValidationText": function ($control) {
             return "RESOURCE{{corejs.ui.js}:{GenericTimeSpanValidationText}:{Please specify a valid time span}}";
         },
         "useParameters": false
     },
     {
         "name": "isemail",
         "dataattribute": "data-val-isemail",
         "validate": function ($control) {
             return validation.emailRegex.test($control.val());
         },
         "getValidationText": function ($control) {
             return "RESOURCE{{corejs.ui.js}:{GenericEmailValidationText}:{Please specify a valid email address}}";
         },
         "useParameters": false
     }
];

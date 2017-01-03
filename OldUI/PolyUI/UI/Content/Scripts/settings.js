var settings = {};
settings.details = {

    load: function () {

        $("#save").click(function () {
            settings.details.save($(this));
            return false;
        });

        //#3196 CPF Header
        if ($("#first-name").val() !== "") {
            corejs.title.set("RESOURCE{{TradeRiser.UI.TradeRiserUIResource}:{StatusBar_Settings}:{My Settings}}" + " > " + $("#first-name").val() + " " + $("#last-name").val());
        }
        else {
            corejs.title.set("RESOURCE{{TradeRiser.UI.TradeRiserUIResource}:{StatusBar_Settings}:{My Settings}}");
        }
    },

    save: function ($button) {

        var firstName, lastName, email, phone1, phone2, timeZone, language, valid;

        firstName = $("#first-name").val();
        lastName = $("#last-name").val();
        email = $("#email").val();
        //phone1 = $("#contact-number-1").val();
        //phone2 = $("#contact-number-2").val();
        timeZone = $("#time-zone").val();
        language = $("#select-language").val();

        valid = true;

        if (!$("#security-settings").validate()) {
            corejs.alert("RESOURCE{{settings.js}:{SettingsValidationText}:{Please correct the errors below}}", "e");
            return;
        }

        if (valid) {

            var userModel = {};
            userModel.firstName = firstName;
            userModel.lastName = lastName;
            userModel.emailAddress = email;
            //userModel.phone1 = phone1;
            //userModel.phone2 = phone2;
            userModel.timeZone = timeZone;
            userModel.language = language;

            var json = JSON.stringify(userModel);

            var success = function (html, textStatus, jqXHR) {
                $button.removeClass("disabled");

                if (CULTURE != userModel.language) {
                    // the language has changed so we need update
                    corejs.wait();
                    corejs.delayedAlert("RESOURCE{{settings.js}:{SettingsSaved}:{Saved Successfully.}}", "s");
                    window.location.href = APPLICATIONPATH + "user/account?lc=" + userModel.language;
                } else {
                    corejs.alert("RESOURCE{{settings.js}:{SettingsSaved}:{Saved Successfully.}}", "s");
                }
            }

            var fail = function (data, textStatus, jqXHR) {
                $button.removeClass("disabled");
                //var msg = "RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save: {0}}}";
                // corejs.alert(msg.replace("{0}", textStatus), "e");
                corejs.alert("RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save the settings.}}", "e");
            }

            corejs.ajax({ url: APPLICATIONPATH + "user/account", success: success, errorCallback: fail, data: { values: json } });
        }

    }
};

settings.password = {

    load: function () {

        $("#save").click(function () {
            settings.password.save($(this));
            return false;
        });

        var $oldPassword = $("#old-password");
        var $newPassword = $("#new-password");
        var $confirmPassword = $("#password-confirm");

        // handle basic keyboard input
        var doSave = function () {
            var $saveButton = $("#save");
            settings.password.save($saveButton);
        }

        $oldPassword.on("keydown", function (event) {
            if (event.which == 13) {
                $newPassword.focus();
            }
        });

        $newPassword.on("keydown", function (event) {
            if (event.which == 13) {
                $confirmPassword.focus();
            }
        });

        $confirmPassword.on("keydown", function (event) {
            if (event.which == 13) {
                doSave();
            }
        });

        //#3196 CPF Header
        if (typeof CURRENTUSER !== 'undefined') {
            corejs.title.set("RESOURCE{{TradeRiser.UI.TradeRiserUIResource}:{StatusBar_Settings}:{My Settings}}" + " > " + CURRENTUSER);
        }
        else {
            corejs.title.set("RESOURCE{{TradeRiser.UI.TradeRiserUIResource}:{StatusBar_Settings}:{My Settings}}");
        }

        window.setTimeout(function () { $oldPassword.focus(); }, 0);
    },

    save: function ($button) {

        var oldPassword, newPassword, confirmPassword,

        oldPassword = $("#old-password").val();
        newPassword = $("#new-password").val();
        confirmPassword = $("#password-confirm").val();

        if (!$("#password-details-section").validate()) {
            corejs.alert("RESOURCE{{settings.js}:{SettingsPasswordValidation}:{Please correct the errors below}}", "e");
            return false;
        }

        if (newPassword !== confirmPassword) {
            corejs.alert("RESOURCE{{settings.js}:{SettingsConfirmPassword}:{New password and confirm password do not match}}", "e");
            return false;
        }

        if (!$("#security-settings").validate()) {
            corejs.alert("RESOURCE{{settings.js}:{SettingsSecurityValidation}:{Please correct the errors below}}", "e");
            return;
        }
        var valid = true;

        var validationArray = [];
        if (!$("#password-details-section").validate({ validationArray: validationArray })) {
            corejs.alert("RESOURCE{{settings.js}:{SettingsPasswordValidation}:{Please correct the errors below}}", "e");
            return;
        }

        if (valid) {
            var userModel = {};
            userModel.oldPassword = oldPassword;
            userModel.newPassword = newPassword;
            userModel.confirmPassword = confirmPassword;

            var success = function (result, textStatus, jqXHR) {

                $button.removeClass("disabled");

                if (result.success) {
                    var path = corejs.querystring.get("i");
                    if (path) {
                        corejs.wait();
                        location.href = decodeURIComponent(path);
                    }
                }
            }

            var fail = function (data, textStatus, jqXHR) {
                $button.removeClass("disabled");
                //var msg = "RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save: {0}}}";
                //corejs.alert(msg.replace("{0}", textStatus), "e");
                if (data["unhandled"]) {
                    corejs.alert("RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save the password settings.}}", "e");
                }
            }

            corejs.ajax({ url: APPLICATIONPATH + "user/password", success: success, errorCallback: fail, data: { model: userModel } });
        }
    }
};

settings.preferences = {

    load: function () {

        $("#save").click(function () {
            settings.preferences.save($(this));
            return false;
        });
    },

    save: function () {

        var password, passwordConfirm, firstName, lastName, email, valid;
        email = $("#email").val();
        password = $("#password").val();
        passwordConfirm = $("#password-confirm").val();
        firstName = $("#first-name").val();
        lastName = $("#last-name").val();
        valid = true;

        if (!$("#security-settings").validate()) {
            corejs.alert("RESOURCE{{settings.js}:{SettingsPreferencesValidation}:{Please correct the errors below}}", "e");
            return;
        }

        if (password !== password) {
            corejs.alert("RESOURCE{{settings.js}:{SettingsPreferencesNotMatched}:{Passwords do not match}}", "e");
            valid = false;
        }

        if (valid) {

            var json = JSON.stringify(searchModel);

            var success = function (html, textStatus, jqXHR) {
                $button.removeClass("disabled");
                corejs.alert("RESOURCE{{settings.js}:{SettingsPreferencesSaved}:{Saved Successfully.}}", "s");
            }

            var fail = function (data, textStatus, jqXHR) {
                $button.removeClass("disabled");
                var msg = "RESOURCE{{settings.js}:{SettingsPreferencesSaveFailed}:{Failed to save the preferences.}}";
                corejs.alert(msg.replace("{0}", textStatus), "e");
            }


            //corejs.ajax({ url: APPLICATIONPATH + "incidents/mysearches/save", success: success, errorCallback: fail, data: { values: json } });
        }

    }
};

settings.alerting = {

    load: function () {

        $("#save").click(function () {
            if (settings.alerting.validate()) {
                settings.alerting.save($(this));
            }
            return false;
        });

        $("#escalate").on("change", function () {
            if ($(this).is(":checked")) {
                $("#escalationName").find("input").removeAttr("disabled").focus();
            } else {
                $("#escalationName").find("input").attr("disabled", "disabled");
            }
        });

        $("#redirect").on("change", function () {
            if ($(this).is(":checked")) {
                $("#delegateName").find("input").removeAttr("disabled").focus();
            } else {
                $("#delegateName").find("input").attr("disabled", "disabled");
            }
        });

        if ($("#escalate:checked").length == 1) {
            $("#escalationName").find("input").removeAttr("disabled");
        } else {
            $("#escalationName").find("input").attr("disabled", "disabled");
        }

        if ($("#outOfOffice:checked").length == 1) {
            $("#redirect").removeAttr("disabled");
        }
        else {
            $("#redirect").attr("disabled", "disabled");
            $("#redirect").removeAttr("checked");
        }

        $("#outOfOffice").on("change", function () {
            if ($(this).is(":checked")) {
                $("#redirect").removeAttr("disabled");
            }
            else {
                $("#redirect").attr("disabled", "disabled");
                $("#redirect").removeAttr("checked");
                $("#redirect").trigger("change");
            }
        });

        if ($("#redirect:checked").length == 1) {
            $("#delegateName").find("input").removeAttr("disabled");
        } else {
            $("#delegateName").find("input").attr("disabled", "disabled");
        }

        //#3196 CPF Header
        if (typeof CURRENTUSER !== 'undefined') {
            corejs.title.set("RESOURCE{{TradeRiser.UI.TradeRiserUIResource}:{StatusBar_Settings}:{My Settings}}" + " > " + CURRENTUSER);
        }
        else {
            corejs.title.set("RESOURCE{{TradeRiser.UI.TradeRiserUIResource}:{StatusBar_Settings}:{My Settings}}");
        }
    },
    validate: function () {
        var isValid = true;
        var $delegateAutoComplete = $("#delegateName");
        var $escalateAutoComplete = $("#escalationName");
        var delegateUserName = autocompleteGrid.val($delegateAutoComplete)[0];
        var escalateUserName = autocompleteGrid.val($escalateAutoComplete)[0];
        var msg = '';
        if (CURRENTUSER == delegateUserName) {
            msg = "RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save: Re-directing to yourself is not allowed.}}";
            isValid = false;
        }

        if (CURRENTUSER == escalateUserName) {
            msg = "RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save: Escalating to yourself is not allowed.}}";
            isValid = false;
        }

        if (!isValid) {
            corejs.alert(msg, "e", true);
        }

        return isValid;
    },
    save: function ($button) {

        if ($button.hasClass("disabled")) {
            return;
        }

        corejs.closealert();

        var $delegateAutoComplete = $("#delegateName");
        var $escalateAutoComplete = $("#escalationName");
        var $outOfOffice = $("#outOfOffice:checked");
        var $forward = $("#forward:checked");
        var $redirect = $("#redirect:checked");
        var $escalate = $("#escalate:checked");

        var escalateUserNames = autocompleteGrid.val($escalateAutoComplete);
        if (escalateUserNames.length == 0 && $escalate.length == 1) {
            corejs.alert("RESOURCE{{settings.js}:{PleaseProvideAUserToForwardTo}:{Please provide a user name to escalate to}}", "e", true);
            $escalateAutoComplete.find(".search").addClass("invalid");
            return;
        } else {
            $escalateAutoComplete.find(".search").removeClass("invalid");
        }

        var delegateUserNames = autocompleteGrid.val($delegateAutoComplete);
        if (delegateUserNames.length == 0 && $redirect.length == 1) {
            corejs.alert("RESOURCE{{settings.js}:{PleaseProvideAUserToForwardTo}:{Please provide a user name to forward your alerts to}}", "e", true);
            $delegateAutoComplete.find(".search").addClass("invalid");
            return;
        } else {
            $delegateAutoComplete.find(".search").removeClass("invalid");
        }

        var escalateUserNames = autocompleteGrid.val($escalateAutoComplete);
        //if (escalateUserNames.length != 0 ) {
        //    $delegateAutoComplete.find(".search").removeClass("invalid");
        //}

        var data = {
            delegateUserName: delegateUserNames[0],
            escalateUserName: escalateUserNames[0],
            outOfOffice: $outOfOffice.length,
            forward: $forward.length,
            redirect: $redirect.length,
            escalate: $escalate.length
        };

        var success = function (result, textStatus, jqXHR) {
            corejs.spin(false);
            $button.removeClass("disabled");

            if (result.success) {
                corejs.alert("RESOURCE{{settings.js}:{SettingsSaved}:{Saved Successfully.}}", "s");
            } else {
                // var msg = "RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save: {0}}}";
                // corejs.alert(msg.replace("{0}", result.message), "e", true);
                corejs.alert("RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save the settings.}}", "e");
            }
        }

        var fail = function (data, textStatus, jqXHR) {
            corejs.spin(false);
            $button.removeClass("disabled");
            //var msg = "RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save: {0}}}";
            //corejs.alert(msg.replace("{0}", textStatus), "e");
            if (data["unhandled"]) {
                corejs.alert("RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save the settings.}}", "e");
            }
        }

        $button.addClass("disabled");
        corejs.spin();
        corejs.ajax({ url: APPLICATIONPATH + "user/alerting", success: success, errorCallback: fail, data: data });
    }
};


var userpreferences = {
    user: "",

    load: function () {

        if (userpreferences.user !== "") {
            corejs.title.set("RESOURCE{{TradeRiser.UI.TradeRiserUIResource}:{StatusBar_Settings}:{My Settings}}" + " > " + userpreferences.user);
        }
        else {
            corejs.title.set("RESOURCE{{TradeRiser.UI.TradeRiserUIResource}:{StatusBar_Settings}:{My Settings}}");
        }

        $("#save").click(function () {
            userpreferences.save($(this));
            return false;
        });
    },

    getUserPerferencesData: function ($item) {
        try {

            var $defaultPage = $item.find("input[type=radio]:checked");
            var appName = $defaultPage.attr("data-app-name");
            var appUrl = $defaultPage.attr("app-url");

            // set as empty if this is a new preference
            if (appName == null || appName == undefined) {
                appName = "";
                appUrl = "";
            }

            var data = {
                key: appName,
                value: appUrl
            };

            return data;
        }
        catch (err) {
        }

    },

    save: function ($button) {

        if ($button.hasClass("disabled")) {
            return;
        }

        var data = userpreferences.getUserPerferencesData($("#user-apps-list"));

        var success = function (result, textStatus, jqXHR) {
            corejs.spin(false);
            $button.removeClass("disabled");

            if (result.success) {
                corejs.alert("RESOURCE{{settings.js}:{SettingsSaved}:{Saved Successfully.}}", "s");
            } else {
                corejs.alert("RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save the settings.}}", "e");
            }
        }

        var fail = function (data, textStatus, jqXHR) {
            corejs.spin(false);
            $button.removeClass("disabled");
            if (data["unhandled"]) {
                corejs.alert("RESOURCE{{settings.js}:{SettingsSaveFailed}:{Failed to save the settings.}}", "e");
            }
        }

        $button.addClass("disabled");
        corejs.spin();
        corejs.ajax({ url: APPLICATIONPATH + "user/updateuserpreferences", success: success, errorCallback: fail, data: data });
    }
};


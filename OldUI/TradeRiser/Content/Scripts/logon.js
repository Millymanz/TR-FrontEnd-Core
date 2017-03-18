var logon = {
    load: function () {

        // get iana timezone
        var tz = "";
        try {
            tz = Intl.DateTimeFormat().resolved.timeZone;
        } catch (e) {
            tz = "";
        }
        
        if (tz === "") {
            tz = jstz().timezone_name;
        }

        $("#timezone").val(tz);

        corejs.store.set("breadcrumbs", []);

        logon.setView();

        // language selector
        $("#language-code").change(function () {

            var languageCode = $("#language-code").val();

            corejs.wait(true);
            corejs.ajax({
                url: APPLICATIONPATH + "core/switchculture?lc=" + languageCode,
                dataType: "json",
                type: "GET",
                data: {},
                success: function (data) {
                    corejs.teleport(true);
                    location.reload();
                },
                errorCallback: function (a, b, c) {
                    corejs.alert("Failed to change language.", "e", true);
                    corejs.wait(false);
                }
            });
        });
        
        $("#logon").off('click').on('click', function () {
            $("#logon-form").validate({
                success: function () {
                    corejs.store.purge();
                    $("#logon-form").submit();
                },
                onInvalid: function () {
                    $('[data-toggle="tooltip"]').tooltip({
                        container: 'body'
                    });
                }
            });

            return false;
        });

        $("#username").keyup(function (event) {
            if (event.which === 13) {
                $("#password").focus();
            }
        });

        $("#password").keyup(function (event) {
            if (event.which === 13) {
                corejs.store.purge();
                $("#logon-form").submit();
            }
        });

        if ($("#username").val().length > 0) {
            $("#password").focus();
        } else {
            $("#username").focus().select();
        }

        $("#log-in").on("click", function () {
            corejs.wait(true);
            corejs.hash("v", "logon");
            return false;
        });

        $("#forgot-password").on("click", function () {
            corejs.wait(true);
            corejs.hash("v", "forgotpassword");
            return false;
        });

        $("#create-account").on("click", function () {
            corejs.wait(true);
            corejs.hash("v", "createaccount");
            return false;
        });

        // alerts
        var $alert = $("#alert");
        if ($alert.find('.message').text() !== "") {
            $alert.show();
            $alert.find('.closebutton-wrapper').off('click').on('click', function () {
                $alert.hide();
            });
        }

        $(window).off('hashchange').on('hashchange', function () {
            logon.setView();
        });


        $("#register").off("click").on("click", function () {
            $("#member-details").validate({
                success: function () {
                    members.edit.registersave();
                },
                onInvalid: function () {
                    corejs.alert("The 'User Details' section has some errors, please correct these before saving.", "e");
                }
            });

            return false;
        });
    },

    $newsBarSpinner: 0,
    $newsFailed: 0,
    $news: 0,
    newsIsRoute: false,
    newsRoute: "",

    setView: function () {
        // check to see if the hash has a token to say that we are on the standard logon page or forgot password.

        var view = corejs.hash("v");

        if (view == null) {
            view = "logon";
        }

        if (view === "forgotpassword") {
            $("#logon-form").hide();
            if ($("#forgot-password-section").length === 0) {
                logon.getForgotPasswordSection(function () {
                    logon.switchViews("forgotpassword");
                });
            } else {
                logon.switchViews("forgotpassword");
            }
        }
        else if (view === "createaccount") {
            $("#logon-form").hide();
            logon.switchViews("createaccount");
            //if ($("#member-section").length === 0) {
            //    logon.getForgotPasswordSection(function () {
            //        logon.switchViews("createaccount");
            //    });
            //} else {
            //    logon.switchViews("createaccount");
            //}
        }
        else {
            logon.switchViews("logon");
        }
    },

    switchViews: function (view) {
        if (view === "forgotpassword") {

            $("#logon-form").fadeOut("fast", function () {
                validation.reset($("#forgot-password-section"));
                $("#username-or-email").val("");
                $("#forgot-password-section").fadeIn("fast");
                $("#back-password").hide();
                $("#submit-forgot-password").show();
                $("#cancel-password").show();
            });
        } else if (view === "createaccount") {
            $("#logon-form").fadeOut("fast", function () {
                validation.reset($("#member-section"));
                //$("#username-or-email").val("");
                $("#member-section").fadeIn("fast");               
            });
        }
        else {
            $("#member-section").fadeOut("fast", function () {
                validation.reset($("#logon-form"));
                $("#logon-form").fadeIn("fast");
            });
            $("#forgot-password-section").fadeOut("fast", function () {
                validation.reset($("#logon-form"));
                $("#logon-form").fadeIn("fast");
            });
        }

        corejs.wait(false);
    },

    getForgotPasswordSection: function (callback) {

        var success = function (result, textStatus, jqXHR) {
            // add the forgot password html to the page.
            $("#signin-section").append(result);

            // bind events to buttons.
            logon.bindForgotPasswordEvents();

            if (callback) {
                callback();
            }
        }

        var fail = function (data, textStatus, jqXHR) {
            corejs.alert("There was an error whilst resetting your password. Please contact support for further help.", "e", true);
        }

        corejs.ajax({ url: APPLICATIONPATH + "core/ForgotPassword", dataType: "Html", success: success, errorCallback: fail, type: "GET" });
    },

    bindForgotPasswordEvents: function () {

        $("#submit-forgot-password").on("click", function () {
            if (!$(this).hasClass("disabled")) {
                logon.forgotPassword();
            }
        });

        $("#cancel-password").on("click", function () {
            var cancelButton = $("#cancel-password");

            if (cancelButton.attr('disabled')) {
            }
            corejs.hash("v", "logon");
            return false;
        });

        $("#back-password").on("click", function () {
            var submitButton = $("#submit-forgot-password");
            var cancelButton = $("#cancel-password");

            submitButton.removeAttr('disabled');
            submitButton.removeClass('disabled');
            cancelButton.removeAttr('disabled');
            cancelButton.removeClass('disabled');

            corejs.hash("v", "logon");
        });
    },

    forgotPassword: function () {
        var submitButton = $("#submit-forgot-password");
        var cancelButton = $("#cancel-password");

        if (submitButton.attr('disabled')) {
            return false;
        }

        submitButton.attr('disabled', 'disabled');
        submitButton.addClass('disabled');
        cancelButton.attr('disabled', 'disabled');
        cancelButton.addClass('disabled');

        var success = function (result, textStatus, jqXHR) {
            corejs.wait(false);
            submitButton.hide();
            cancelButton.hide();
            $("#back-password").show();
            corejs.alert(result.data.message,"s");
        }

        var fail = function (result, textStatus, jqXHR) {
            corejs.wait(false);
            submitButton.removeAttr('disabled');
            submitButton.removeClass('disabled');
            cancelButton.removeAttr('disabled');
            cancelButton.removeClass('disabled');
            corejs.alert(result.data.message, "e");
        }

        if (!$("#username-or-email").validate()) {
            submitButton.removeAttr('disabled');
            submitButton.removeClass('disabled');
            cancelButton.removeAttr('disabled');
            cancelButton.removeClass('disabled');
            return false;
        }
        else {
            corejs.wait(true);
            $("#submit-forgot-password").addClass("disabled");

            corejs.ajax({ url: APPLICATIONPATH + "core/ForgotPassword/" + $("#username-or-email").val(), success: success, errorCallback: fail, type: "POST" });
        }

        return true;
    }
};

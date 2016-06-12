var changePassword = {
    load: function () {
        changePassword.bindEvents();
    },

    bindEvents: function () {
        $("#password-submit").on("click", function () {
            changePassword.submitPassword();
        });
    },

    submitPassword: function () {
        var submitButton = $("#password-submit");
        var passwordFields = $("#logon-form .password-fields");

        if (submitButton.attr('disabled') !== undefined) {
            return false;
        }
        submitButton.attr('disabled', 'disabled');
        submitButton.addClass('disabled');

        var success = function (result, textStatus, jqXHR) {
            corejs.wait(false);
            $("#alert .alert-body").show().text(result.message);

            if (result.success) {
                passwordFields.hide();
                $("#password-submit").hide();
                $("#go-login").show();
            }
        }

        var fail = function (data, textStatus, jqXHR) {
            corejs.wait(false);

            // clear password fields
            $("#password").val('');
            $("#confirm-password").val('');

            if (data.message !== "") {
                $("#alert .alert-body").show().text(data.message);
            }
            else {
                $("#alert .alert-body").show().text("RESOURCE{{logon.js}:{FailedForgotPassword}:{There was an error whilst resetting your password. Please contact support for further help.}}");
            }

            submitButton.removeAttribute('disabled');
            submitButton.removeClass('disabled');
        }

        // validate that the username is not empty.
        if (!$("#logon-form").validate()) {
            submitButton.removeAttribute('disabled');
            submitButton.removeClass('disabled');
            return false;
        }
        else {
            corejs.wait(true);
            var model = {};
            model.password = $("#password").val().trim();
            model.confirmPassword = $("#confirm-password").val().trim();
            model.resetToken = $("#reset-token").val();

            corejs.ajax({ url: APPLICATIONPATH + "core/ChangePassword", data: model, success: success, errorCallback: fail, type: "POST" });
        }

        return false;
    }
}
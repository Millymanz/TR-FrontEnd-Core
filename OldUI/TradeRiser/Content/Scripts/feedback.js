
feedback = {

    load: function () {

        $("#save").click(function () {
            feedback.save($(this));
            return false;
        });
        $("#cancel").click(function () {
            location.href = "/app/index";
            return false;
        });

        var $name = $("#name");
        var $email = $("#email");
        var $message = $("#message");

        // handle basic keyboard input
        var doSave = function () {
            var $saveButton = $("#save");
            settings.password.save($saveButton);
        }

        $name.on("keydown", function (event) {
            if (event.which === 13) {
                $email.focus();
            }
        });

        $email.on("keydown", function (event) {
            if (event.which === 13) {
                $message.focus();
            }
        });

        $message.on("keydown", function (event) {
            if (event.which === 13) {
                doSave();
            }
        });

        window.setTimeout(function () { $name.focus(); }, 0);
    },

    save: function ($button) {

        var name = $("#name").val();
        var email = $("#email").val();
        var message = $("#message").val();

            var feedModel = {};
            feedModel.name = name;
            feedModel.email = email;
            feedModel.message = message;

            var success = function (result) {
                $button.removeClass("disabled");

                if (result.success) {
                    corejs.alert(result.message, "s", true);
                } else {
                    corejs.alert(result.message, "e", true);
                }
            }

            var fail = function (data) {
                $button.removeClass("disabled");

                if (data["unhandled"]) {
                    corejs.alert("Failed to save the password settings.", "e");
                } else {
                    var msg = "Failed to save: {0}";
                    corejs.alert(msg.replace("{0}", data.data.message), "e");
                }
            }

            corejs.ajax({ url: APPLICATIONPATH + "app/submitfeedback", success: success, errorCallback: fail, data: { model: feedModel } });
        
    }
};
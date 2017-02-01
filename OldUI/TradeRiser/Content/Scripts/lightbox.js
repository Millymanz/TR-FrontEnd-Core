var lightbox = {

    /*
    callback:   function to call when the lightbox is closed. Will pass back the html contained within the lightbox
    url:        the url from where the lightbox will get its display html
    height:      sets the height of the lightbox to a fixed value
    width:      sets the width of the lightbox to a fixed value
    */

    // TODO : could this be used to show simple messages too?? could have a message property??? but would have to deal with error icons etc...
    $noButton: null,
    $yesButton: null,
    $cancelButton: null,
    $lightbox: null,
    settings: null,
    clickX: null,
    clickY: null,

    load: function (options) {
        // extend the default settings with the options passed in.
        $.extend(lightbox.defaults, options);

        var defaults = {
            url: "",
            data: null,
            html: null,
            title: "Lightbox",
            width: -1,
            height: -1,
            yesButtonText: "Yes",
            showYesButton: true,
            yesCallback: null,
            noButtonText: "No",
            showNoButton: true,
            noCallback: null,
            cancelButtonText: "Cancel",
            showCancelButton: false,
            cancelCallback: null,
            yesButtonClass: null,
            noButtonClass: null,
            cancelButtonClass: null,
            showTitle: true,
            showFooter: true
        };

        lightbox.settings = $.extend({}, defaults, options);

        // set up all references to dom elements.
        lightbox.setReferences();

        // initialise the lightbox, set the button text etc.
        lightbox.initialise();
    },

    setReferences: function () {
        lightbox.$noButton = $("#lightbox-no-button");
        lightbox.$yesButton = $("#lightbox-yes-button");
        lightbox.$cancelButton = $("#lightbox-cancel-button");
        lightbox.$lightbox = $("#cpf-lightbox");
        lightbox.$closeButton = $(".lightbox-close");
        lightbox.$footer = $("#cpf-lightbox-buttons");
        lightbox.$title = lightbox.$lightbox.find("#cpf-lightbox-title");
    },

    initialise: function () {

        lightbox.$title.text(lightbox.settings.title);
        lightbox.$yesButton.text(lightbox.settings.yesButtonText);
        lightbox.$noButton.text(lightbox.settings.noButtonText);
        lightbox.$cancelButton.text(lightbox.settings.cancelButtonText);

        lightbox.settings.showYesButton ? lightbox.$yesButton.show() : lightbox.$yesButton.hide();
        lightbox.settings.showNoButton ? lightbox.$noButton.show() : lightbox.$noButton.hide();
        lightbox.settings.showCancelButton ? lightbox.$cancelButton.show() : lightbox.$cancelButton.hide();
        lightbox.settings.showFooter ? lightbox.$footer.show() : lightbox.$footer.hide();
        lightbox.settings.showTitle ? lightbox.$title.text(lightbox.settings.title) : lightbox.$title.text("");

        if (lightbox.settings.yesButtonClass) {
            lightbox.$yesButton.removeClass();
            lightbox.$yesButton.addClass(lightbox.settings.yesButtonClass);
        }

        if (lightbox.settings.noButtonClass) {
            lightbox.$noButton.removeClass();
            lightbox.$noButton.addClass(lightbox.settings.noButtonClass);
        }

        if (lightbox.settings.cancelButtonClass) {
            lightbox.$cancelButton.removeClass();
            lightbox.$cancelButton.addClass(lightbox.settings.cancelButtonClass);
        }

        lightbox.$yesButton.off("click").on("click", function () {
            if (lightbox.settings.yesCallback) {
                // does the content have a script function to call to get values?
                var content = lightbox.$lightbox.find(".content-container");
                var valueScript = null;
                if (content.length > 0) {
                    valueScript = content.attr("data-value-script");
                }

                if (valueScript !== null && valueScript !== "") {

                    var returnValue = lightbox.getFunctionFromString(valueScript)();
                    if (isNullOrEmpty(returnValue)) {
                        return;
                    }

                    lightbox.settings.yesCallback(returnValue);

                } else {
                    lightbox.settings.yesCallback();
                }
            }

            lightbox.show(false);
        });

        lightbox.$noButton.off("click").on("click", function () {
            if (lightbox.settings.noCallback) {
                lightbox.settings.noCallback();
            }

            lightbox.show(false);
        });

        var cancel = function () {
            lightbox.show(false);
            if (lightbox.settings.cancelCallback) {
                lightbox.settings.cancelCallback();
            }
        }
        lightbox.$cancelButton.off("click").on("click", cancel);
        lightbox.$closeButton.off("click").on("click", cancel);
        cpf.overlay.show("cpf-lightbox");
        lightbox.loadView();

    },

    loadView: function () {

        var success = function (html, loadedCallback) {

            $("#cpf-lightbox-content").html(html);

            // call the load script

            var loadScript = $("#cpf-lightbox-content").find(".content-container").attr("data-load-script");
            if (loadScript != null && loadScript !== "") {
                var fn = lightbox.getFunctionFromString(loadScript);
                if (fn !== undefined) {
                    fn();
                }
            }

            lightbox.show(true);

            if (loadedCallback) {
                loadedCallback();
            }
        };


        if (lightbox.settings.html !== null) {
            // we have some existing html to show.
            success(lightbox.settings.html, lightbox.settings.loadedCallback);

        } else {
            // we dont have the html already. Go and get it!
            cpf.ajax({
                url: lightbox.settings.url,
                dataType: "html",
                type: "POST",
                data: isNullOrEmpty(lightbox.settings.data) ? null : JSON.stringify(lightbox.settings.data),
                success: function (result) {
                    success(result, lightbox.settings.loadedCallback);
                },
                errorCallback: function () {
                    cpf.overlay.hide("cpf-lightbox");
                }
            });
        }
    },

    show: function (show) {
        if (lightbox.$lightbox) {
            if (show) {
                lightbox.positionAndShow(lightbox.$lightbox);
            } else {
                lightbox.$lightbox.hide();
                cpf.overlay.hide("cpf-lightbox");
                $('body').gcop().removeClass('noscroll');
            }
        }
    },

    getFunctionFromString: function (string) {
        var scope = window;
        var scopeSplit = string.split('.');
        for (var i = 0; i < scopeSplit.length - 1; i++) {
            scope = scope[scopeSplit[i]];
            if (scope == undefined) return false;
        }

        return scope[scopeSplit[scopeSplit.length - 1]];
    },

    showOverlay: function (show) {
        show ? $(".black-overlay").show() : $(".black-overlay").hide();
    },

    positionAndShow: function ($box) {

        var iframe = !!$box.find("iframe").length;
        $box.children().first().toggleClass("lightbox-responsive", iframe);

        // centre the msgbox, skip is dyno lightbox
        if (lightbox.$lightbox && !$box.gcop().hasAttribute("data-dyno-type")) {
            if (lightbox.settings.height !== -1) {
                lightbox.$lightbox.find('.lightbox').height(lightbox.settings.height);
            }
            if (lightbox.settings.width !== -1) {
                lightbox.$lightbox.find('.lightbox').width(lightbox.settings.width);
            }
            lightbox.$lightbox.show();
        }

        if ($box && !iframe) {
            if ($box[0] !== undefined) {
                var pTop = +(Math.round((window.innerHeight - $box[0].children[0].offsetHeight) / 2 / window.innerHeight + "e+2") + "e-2");
                $box.css({ 'padding-top': Math.ceil(window.innerHeight * (pTop > 0.325 ? 0.325 : pTop)) + 'px' });
            }
            $box.show();
        }

        $('body').addClass('noscroll');
    },

    showAtClickPosition: function ($box) {

        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var boxHeight = $box.height();
        var boxWidth = $box.width();
        $box.attr('style', '');
        $box.css({ 'left': windowWidth - 10, 'display': 'inline-block' });

        //force the box to keep it's width
        $box.css({ 'width': boxWidth });

        var rightExtent = boxWidth + lightbox.clickX;
        var bottomExtent = boxHeight + lightbox.clickY;



        //make sure none of the lightbox is offscreen.
        if (rightExtent > windowWidth) {
            lightbox.clickX = lightbox.clickX - boxWidth;
        }

        if (bottomExtent > windowHeight) {
            lightbox.clickY = lightbox.clickY - boxHeight;
        }

        if (lightbox.clickY < 0) {
            lightbox.clickY = 0;
        }

        if (lightbox.clickX < 0) {
            lightbox.clickX = 0;
        }


        $box.css({ 'left': lightbox.clickX + 'px', 'top': lightbox.clickY + 'px' });

        lightbox.clickX = null;
        lightbox.clickY = null;
    }
};
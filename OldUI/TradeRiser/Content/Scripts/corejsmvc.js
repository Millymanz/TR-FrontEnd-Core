/// <reference path="jquery-1.5-vsdoc.js" />
var cpfErrorTimeout;

// array to track which lightbox windows are open. 
// sometimes we have more than on, and when it one is closed the background fade is hidden when it should still show.
var openWindows = [];

var corejs = {};
corejs = {
    isIE: true,
    isIE7: false,
    isIE8: false,
    isIE9: false,
    isIE10: false,
    isMobile: false,
    load: function () {
        // COMMENTED OUT BUT LEFT IN UNTILL THE NEW WAY OF GETTING THE BROWSER INFORMATION HAS BEEN TESTED FULLY.
        // check the browser version        
        //corejs.isIE = navigator.appName.indexOf("Microsoft") > -1 || navigator.appName.indexOf("MSIE") > -1;
        //if (corejs.isIE) {
        //    if ($.browser.version == "6.0" || $.browser.version == "7.0") {
        //        corejs.isIE7 = true;
        //    } else if ($.browser.version == "8.0") {
        //        corejs.isIE8 = true;
        //    }
        //}

        corejs.isIE = corejs.browser.isIE();
        corejs.isIE7 = corejs.browser.isIE(7);
        corejs.isIE8 = corejs.browser.isIE(8);
        corejs.isIE9 = corejs.browser.isIE(9);
        corejs.isIE10 = corejs.browser.isIE(10);

        //check if mobile
        corejs.checkIfMobile();
        $(window).resize(function () {
            corejs.checkIfMobile();
            if (!corejs.isMobile) {
                corejs.toolbar.arrangeButtons();
            }
        });

        // check for a ribbon
        try {
            $(".ribbon").ribbon();
        } catch (err) {
        }

        // language selector
        $("#language-code").change(function () {
            var languageCode = $("#language-code").val();

            corejs.wait(true);
            corejs.ajax({
                url: APPLICATIONPATH + "core/switchculture?lc=" + languageCode,
                dataType: "json",
                type: "GET",
                data: {},
                cache: false,
                success: function (data) {
                    corejs.teleport(true);
                    location.reload();
                },
                errorCallback: function (a, b, c) {
                    corejs.alert("RESOURCE{{corejs.ui.js}:{FailedToChangeCultureCode}:{Failed to change language.}}", "e", true);
                    corejs.wait(false);
                }
            });
        });

        // cpf alert
        $("#alert .closebutton-wrapper").click(function () {
            corejs.closealert();
        });

        corejs.processDelayedAlert();

        //TODO:PA
        ////// exports
        ////exporter.load();

        var existingBreadcrumbs = corejs.store.get("breadcrumbs", null) || [];
        this.addPageToBreadcrumbs(existingBreadcrumbs);
        this.showBreadCrumbs(existingBreadcrumbs);

        // logo spinner on click then return true
        $("#top-logo").click(function (e) {
            //$('#apps-menu').fadeOut(35);
            corejs.teleport(true);
            return true;
        });

        //add onlick event to all the buttons
        corejs.button.click($("#flyout-toggle"));
        corejs.button.click($("#navigation-toggle"));
        corejs.button.click($("#filter-by-search-toggle"));
        corejs.button.click($("#toolbar-toggle"));
        corejs.button.click($("#toolbar-elipsis"));
        corejs.button.click($("#sort-toggle"));
        corejs.button.click($("#global-search-button"));
        corejs.button.click($("#node-toolbar-toggle"));
        corejs.button.click($("#notification-filter-toggle"));

        corejs.toolbar.initialiseDropDowns();

        corejs.navigation.scrollRight($('#scroll-nav-left > .scroll-nav-button'));
        corejs.navigation.scrollLeft($('#scroll-nav-right > .scroll-nav-button'));
        //corejs.navigation.load($('#navigation-menu'));
        // corejs.attachSpinner('#apps-menu a, #settings-menu a, #navigation-menu a');
        corejs.appsTray.initalise();
        corejs.settingsTray.initalise();
        corejs.historyTray.initalise();
        corejs.toolbar.active();

        corejs.initialise.globalSearch();
        corejs.initialise.toolbarShadow();

        $("#notifications").on("click", function (event) {
            event.preventDefault();
            corejs.teleport(true,
                         $.proxy(function () {
                             window.location = $(this).attr("href");
                         }, this));
        });

        if (corejs.isIE10) {
            $('input[type=password]').blur(function () {
                //work around for ie10 clipping text
                $(this).val($(this).val());
            });
        }

        //TODO: need to figure out when to load this. After dynoform loads and before ThoughtFlow saves. 
        corejs.whoami.load();
    },

    browser: {
        // version can be passed as null if just testing for IE.
        // if there is a version passed in then it will check if the browser is a specific version of IE.
        isIE: function (version) {

            var isIE = false;

            if (navigator.userAgent.indexOf("Trident") > -1 || navigator.appName.indexOf("Microsoft") > -1 || navigator.appName.indexOf("MSIE") > -1) {
                isIE = true;
            }

            // if arguments is greater than 0 we are checking for a specific version
            if (isIE == true && arguments.length > 0) {
                // if arguments is greater than 0 we are checking for a specific version
                isIE = Number(version) == corejs.browser.IEVersion();
            }

            return isIE;
        },

        IEVersion: function () {

            var version = 0;

            var versionPattern = new RegExp(/\brv[ :]+(\d+).(\d+)/g);
            var tridentPattern = new RegExp(/\Trident\/+(\d+)/);

            if (navigator.userAgent.indexOf("Trident") > -1) {
                var minorVersion = "";
                var majorVersion = "";

                var tem = versionPattern.exec(navigator.userAgent) || [];
                if (tem.length > 0) {
                    // we have the version string so get the values from that.
                    majorVersion = tem[1];
                    minorVersion = tem[2];
                } else {
                    // we dont have the version string. use the trident part to figure out the version
                    tem = tridentPattern.exec(navigator.userAgent) || [];
                    if (tem.length > 0) {
                        // Trident/7 = IE 11, Trident/6 = IE 10, Trident/5 = IE 9, and Trident/4 = IE 8
                        var v = Number(tem[1]) + 4;
                        majorVersion = v;
                        minorVersion = tem[2];
                    }
                }

                if (majorVersion !== "") {
                    version = Number(majorVersion);
                }
            } else {
                majorVersion = $.browser.version.split(".");
                version = Number(majorVersion[0]);
            }

            return version;
        }
    },

    currentPages: function (existingBreadcrumbs) {
        var pages = [];

        for (var i = 0, len = existingBreadcrumbs.length; i < len; i++) {
            pages.push(existingBreadcrumbs[i][0]);
        }

        return pages;
    },

    showBreadCrumbs: function (existingBreadcrumbs) {
        var $navigationList = $("#navigation-bar ul");
        for (var i = 0, len = existingBreadcrumbs.length; i < len; i++) {
            $navigationList.append(existingBreadcrumbs[i][1]);
        }
        corejs.navigation.load($('#navigation-menu'));
    },

    addPageToBreadcrumbs: function (existingBreadcrumbs) {
        if (PAGENAME != undefined) { //PAGENAME is declared in _CpfLayout.cshtml
            var newBreadcrumb = [PAGENAME, '<li class="navigation-item"><a href="' + window.location.href + '">' + PAGENAME + '</a></li>'];

            if (existingBreadcrumbs.length) {
                var pages = this.currentPages(existingBreadcrumbs);
                var positionInArray = $.inArray(PAGENAME, pages);

                if (positionInArray !== -1) {
                    while (existingBreadcrumbs.length > positionInArray) {
                        existingBreadcrumbs.pop();
                    }
                }
            }

            existingBreadcrumbs.push(newBreadcrumb);
            corejs.store.set("breadcrumbs", existingBreadcrumbs);
        }
    },

    appsTray: {
        initalise: function () {

            //corejs.button.click($("#button-apps"));

            //$('#apps-menu a').on('click', function (event) {
            //    event.preventDefault();
            //    $('#apps-menu').fadeOut(35);
            //    corejs.teleport(true,
            //        $.proxy(function (event) {
            //            window.location = $(this).attr('href');
            //        }, this));
            //});
        }
    },

    settingsTray: {
        initalise: function () {

            //corejs.button.click($("#button-settings"));

            $('#settings-menu a').on('click', function (event) {
                event.preventDefault();
                $('#apps-menu').fadeOut(35);
                corejs.teleport(true,
                    $.proxy(function (event) {
                        window.location = $(this).attr('href');
                    }, this));
            });
        }
    },

    historyTray: {
        initalise: function () {
            corejs.button.click($("#button-history"));
        }
    },

    getQueryString: function () {
        var data = [];
        var queryString, queryStringData;
        var queryStringArray = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < queryStringArray.length; i++) {
            queryString = queryStringArray[i].split('=');

            if (queryString.length > 1) {
                queryStringData = {
                    name: queryString[0],
                    value: queryString[1].indexOf("#") < 0 ? queryString[1] : queryString[1].split("#")[0]
                };
                data.push(queryStringData);
            }
        }

        return data;
    },

    wait: function (flag) {
        if (flag === true || arguments.length === 0) {
            document.body.style.cursor = "wait";
        } else {
            document.body.style.cursor = "default";
        }

        return false;
    },

    isTeleporting: false,
    spinnerTimeout: 0,
    spin: function () {

        // generic corejs.spin for ajax taken out. 
        // corejs.loadingBar() now for ajax, but placed on specific case-by-case basis
        // corejs.teleport() now used for page change
        // corejs.spin() is left for now as bookmarks for posible uses of loadingBar()

    },
    teleport: function (flag, callback) {

        function progline() {

            //fixed variables
            var windowWidth = $(window).width();
            var minWidth = windowWidth / 10;
            var maxWidth = windowWidth / 3.3;

            //random variables
            function getRandomWidth() {
                return Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
            };

            function getRandomPosition(maxRightPosition) {
                return Math.floor(Math.random() * (maxRightPosition - 0 + 1) + 0);
            };

            function getRandomSpeed() {
                return Math.floor(Math.random() * (4000 - 1000 + 1) + 1000);
            };

            function animateProgLine($progLine, alreadyRunning) {

                if (corejs.isTeleporting === true) {

                    var randomWidth = getRandomWidth();
                    var maxRightPosition = windowWidth - randomWidth;
                    var randomPosition = getRandomPosition(maxRightPosition);
                    var randomSpeed = getRandomSpeed();

                    //calculate which side of the screen the prog line is on and animate in the other direction
                    var slideEndPosition = randomWidth * -1;
                    var slideOutDirecteion = "left";

                    if (((randomWidth / 2) + randomPosition) < (windowWidth / 2)) {
                        slideEndPosition = windowWidth;
                        slideOutDirecteion = "right";
                    }
                    if (alreadyRunning) {
                        $progLine.fadeIn(800);
                    } else {
                        $progLine.fadeIn(100);
                    }

                    $progLine.css(
                    {
                        left: randomPosition,
                        width: randomWidth
                    });

                    $progLine.animate(
                    {
                        left: slideEndPosition,
                        easing: 'easeInOutCubic'
                    },
                    {
                        duration: randomSpeed,
                        complete: function () {

                            setTimeout(animateProgLine($progLine, true), 500);
                        }
                    });
                } else {
                    // stop the aniimation and remove the left position once it's finished for the last time
                    $("#prog-line-container").find('.prog-line').stop();
                    //$("#prog-line-container").hide("slide", { direction: "down" }, 100);
                    //$("#prog-line-container").height(0);
                }
            }

            //$("#prog-line-container").show();
            /*
            $("#prog-line-container").animate({ "height": 3 }, 250); */

            $('.prog-line').each(
                function () {
                    animateProgLine($(this));
                });
        }

        if (flag === true || arguments.length === 0) {

            //$('#prog-line').show();

            //only call if it's not already running
            if (corejs.isTeleporting === false) {

                $('#prog-line').css('left', '0px;');
                corejs.isTeleporting = true;
                progline();
            }

        } else {
            //stop the animation and reset the styles if a stop is called.



            // $('#prog-line-container .prog-line').stop();
            corejs.isTeleporting = false;
            //$('#prog-line').attr('style', '').hide();
            //$('#prog-line-container .prog-line').attr('style', '');
            //$("#prog-line-container").hide("slide", { direction: "down" }, 100);
        }

        if (callback && typeof (callback) === "function") {
            callback();
        }

    },
    attachSpinner: function (elements) {

        $(elements).click(function () {
            corejs.spin();
        });
    },

    noOfRowsSelected: function () {
        // this method seems to be called when printing regardless of the existance of a zugo results or not.
        // if no zugo results on the page, return a positive
        if ($(".zugo-item").length == 0) {
            return 1;
        }

        return $(".zugo-item input:checkbox:checked").length;
    },

    loaderSpin: function (show) {
        if (show) {
            var msg = "RESOURCE{{PageLoader.js}:{PageLoading}:{Loading...}}";
            $("#page-loader-message").text(msg);
            $("#page-loader").show();
        } else {
            $("#page-loader").hide();
        }
    },
    loadingBar: function ($loader, show, size) {

        if (show) {
            createAndRun();
        } else {
            destroy();
        }

        function createAndRun() {
            $loader.show();
            var svgHeight, svgWidth, leftInterval, barWidth, corners;

            switch (size) {
                case 'tiny':
                    svgHeight = 20;
                    svgWidth = 32;
                    leftInterval = 7;
                    barWidth = 4;
                    corners = 1;
                    break;
                case 'small':
                    svgHeight = 30;
                    svgWidth = 45;
                    leftInterval = 10;
                    barWidth = 6;
                    corners = 1;
                    break;
                case 'large':
                    svgHeight = 50;
                    svgWidth = 90;
                    leftInterval = 23;
                    barWidth = 13;
                    corners = 2;
                    break;
                default:
                    svgHeight = 40;
                    svgWidth = 73;
                    leftInterval = 16;
                    barWidth = 9;
                    corners = 2;
            }

            var svgTemplate = "<svg xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns='http://www.w3.org/2000/svg' xmlns:cc='http://creativecommons.org/ns#' xmlns:dc='http://purl.org/dc/elements/1.1/' height='" + svgHeight + "' width='" + svgWidth + "' version='1.1' class='custom-loader'><metadata xmlns='http://www.w3.org/2000/svg' ><rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'><cc:Work xmlns:cc='http://creativecommons.org/ns#' ><dc:format xmlns:dc='http://purl.org/dc/elements/1.1/'>image/svg+xml</dc:format><dc:type xmlns:dc='http://purl.org/dc/elements/1.1/' rdf:resource='http://purl.org/dc/dcmitype/StillImage'/><dc:title xmlns:dc='http://purl.org/dc/elements/1.1/'/></cc:Work></rdf:RDF></metadata></svg>";
            var groupTemplate = "<g xmlns='http://www.w3.org/2000/svg'  fill-rule='evenodd' ></g>"

            $loader.append(svgTemplate);

            var $svg = $loader.find('svg');

            $svg.append(groupTemplate);

            var $g = $svg.find('g');
            var left = 0;

            for (var i = 0; i < 5; i++) {
                $g.append("<rect xmlns='http://www.w3.org/2000/svg' data-id='" + i + "' ry='" + corners + "' height='" + svgHeight + "' width='" + barWidth + "' y='0' x='" + left + "' class='custom-loader-bar'/>")
                left = left + leftInterval;
            }

            $loader.html($loader.html());
            animateLoader($loader);
        }

        function destroy() {
            // TODO remove dyno-form-load
            $('#dyno-form-load').remove();
            $('#dyno-view-load').remove();
            $loader.hide();
            $loader.empty();
        }

        function animateLoader($loader) {

            $loader.find('g').children('rect').each(function (index) {

                var $this = $(this);

                setTimeout($.proxy(function () {
                    flashBar($(this));
                }, this), index * 150);

            });

            setTimeout(function () { animateLoader($loader) }, 900);
        }

        function flashBar($this) {
            $this.animate({ opacity: 1 }, 150).animate({ opacity: 0.25 }, 400);
        }

    },
    fadingLoader: function ($container, show) {

        if (show) {
            $container.addClass('loader-relative');
            $container.append("<div class='fade-loader'>&nbsp;</div>");
            corejs.fladeLoaderOpacityAnimation($container);


        }
        else {
            $container.find('.fade-loader').stop();
            $container.find('.fade-loader').fadeOut(100, function () { $container.find('.fade-loader').remove(); $container.removeClass('loader-relative'); });

            ;
        }

    },
    fladeLoaderOpacityAnimation: function ($container) {

        var $loader = $container.find('.fade-loader');
        $loader.animate({ opacity: 0.4 }, 1500, function () { $loader.animate({ opacity: 0.1 }, 900, function () { corejs.fladeLoaderOpacityAnimation($container); }); });

    },
    //post: function (url, data, callback, errorCallback, timeout) {
    // handleLogon : if set to false, the cpf login handler will not redirect
    ////TODO:PA $ENV(AjaxTimeout),
    ajax: function (args) {
        var defaults = { dataType: "json", type: "POST", timeout: 600000, traditional: false, handleLogon: true, async: true };
        var options = $.extend({}, defaults, args);

        //var error = new cpfAjaxError();
        //error.customError = options.errorCallback;

        var ajaxData = {
            type: options.type,
            dataType: options.dataType,
            url: options.url,
            data: options.data,
            traditional: options.traditional,
            success: function (data, textStatus, jqXHR) {
                if (options.handleLogon == false || corejs.ajaxLoginHandler(jqXHR, textStatus)) {
                    // if data type is json handle return object
                    if (options.dataType == "json") {
                        if (data["success"] != undefined) {
                            // if request failed with 200
                            if (data["success"] != true) {

                                // if the exception text is found in the return object then log it
                                var errorData = {};
                                errorData.stackTrace = "";
                                errorData.message = !isNullOrEmpty(data["errorLog"]) ? data["errorLog"] : "";
                                if (!isNullOrEmpty(data["data"])) {
                                    errorData.stackTrace = !isNullOrEmpty(data["data"]["stackTrace"]) ? data["data"]["stackTrace"] : "";
                                }
                                //PAREMOVED
                                //corejs.errorLog.add(errorData);

                                corejs.showErrorLog = true;

                                // if user friendly error message is found then display it
                                if (!isNullOrEmpty(data["message"])) {
                                    corejs.alert(data["message"], data["alertType"], data["blink"]);
                                }

                                // run error method
                                if (options.errorCallback) {
                                    options.errorCallback(data, textStatus, jqXHR);
                                }
                            } else {
                                // if request is successful and there is userfriendly message then display it 
                                if (!isNullOrEmpty(data["message"])) {
                                    if (data["delayed"] == true) {
                                        corejs.delayedAlert(data["message"], data["alertType"], data["blink"]);
                                    } else {
                                        corejs.alert(data["message"], data["alertType"], data["blink"]);
                                    }
                                }

                                // run success method
                                options.success(data, textStatus, jqXHR);
                            }
                        } else {
                            // if return object is not json action result
                            options.success(data, textStatus, jqXHR);
                        }
                    } else {
                        // data type is not json and 200 run success method
                        options.success(data, textStatus, jqXHR);
                    }

                    if (data["delayed"]) {
                        var url = data["redirectUrl"];
                        if (!isNullOrEmpty(url)) {
                            window.location = APPLICATIONPATH + url;
                        }
                    }
                }
            },
            error: function (xmlhttp, message, exception) {
                corejs.showErrorLog = true;
                var data = null;
                var errorData = {};

                // not  a true error. could be when you cancel a search or run another one.
                if (xmlhttp.status === 0 || xmlhttp.readyState === 0) {
                    return false;
                }
                // request failed
                try {
                    data = JSON.parse(xmlhttp.responseText);
                    errorData.message = !isNullOrEmpty(data["errorLog"]) ? data["errorLog"] : "";
                    errorData.stackTrace = "";
                    if (!isNullOrEmpty(data["data"])) {
                        errorData.stackTrace = !isNullOrEmpty(data["data"]["stackTrace"]) ? data["data"]["stackTrace"] : "";
                    }
                } catch (err) {
                    errorData.message = message + " " + exception;
                    errorData.stackTrace = "";
                }
                //PAREMOVED
                //corejs.errorLog.add(errorData);
                if (!options.errorCallback) {
                    corejs.alert("RESOURCE{{corejs.ui.js}:{GenericAjaxError}:{There has been an error in an ajax request. Please contact your administrator.}}", "e"); //objResponse.message
                } else if (options.errorCallback) {
                    options.errorCallback(data == null ? xmlhttp : data, message, exception);
                }
            },
            beforeSend: function (jqXHR, settings) {
                corejs.spin();
            },
            complete: function (jqXHR, textStatus) {
                corejs.spin(false);

            },
            timeout: options.timeout,
            async: options.async
        };

        if (options.context != undefined && options.context != null) {
            context: options.context;
        }

        if (options.headers != undefined && options.headers != null) {
            ajaxData.headers = options.headers;
        }

        if (options.cache != undefined && options.cache != null) {
            ajaxData.cache = options.cache;
        }

        // if we want a json payload, the contentType needs to be "application/json; charset=utf-8" and we need to JSON.stringify to data object
        // if not, we can use contentType "application/x-www-form-urlencoded; charset=UTF-8", and it will be a form post, and we'll leave the data object as is, and let jQuery deal with it
        if (ajaxData.dataType == "json" && !options.contentType) {
            ajaxData.contentType = "application/json; charset=utf-8";
            ajaxData.data = JSON.stringify(options.data);
        }

        var xhr = $.ajax(ajaxData);

        return xhr;
    },

    // handles session timeouts of async json requests
    ajaxLoginHandler: function (xmlhttp, message, exception) {
        try {
            if (xmlhttp.getResponseHeader("login") == "1") {
                location.href = APPLICATIONPATH + "core/Logon?i=" + xmlhttp.getResponseHeader("logini") + "&url=" + location.href;
                return false;
            }
        } catch (err) {
            return true;
        }

        return true;
    },

    // display a generic alert to the user abount an error
    ajaxErrorHandler: function (xmlhttp, message, exception) {
        var msg = "RESOURCE{{corejs.ui.js}:{GenericAlertText}:{There has been an error in an ajax request.\n\nPlease try again.\n\n '{0}': '{1}'}}";
        alert(msg.replace("{0}", xmlhttp.status).replace("{1}", xmlhttp.statusText));
        return false;
    },

    querystring:
    {
        get: function (key, defaultValue) {
            if (defaultValue == null) defaultValue = "";
            key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
            var qs = regex.exec(window.location.href);
            if (qs == null)
                return defaultValue;
            else
                return qs[1];
        }
    },
    showErrorLog: false,
    alert: function (message, messageType, blink) {

        var $alert = $("#alert");
        var $alertBody = $(".alert-body");
        var alertTimeoutDuration = 20000;
        var showLogs = false;

        $alertBody.removeClass("bg-warning bg-success bg-danger");
        if (messageType) {
            switch (messageType.toLowerCase()) {
                case "error":
                case "e":
                    $alertBody.addClass("bg-danger");
                    showLogs = true;
                    break;
                case "notify":
                case "n":
                    alertTimeoutDuration = 2000;
                    break;
                case "success":
                case "s":
                    $alertBody.addClass("bg-success");
                    alertTimeoutDuration = 5000;
                    break;
                case "warning":
                case "w":
                    $alertBody.addClass("bg-warning");
                    break;
                case "information":
                case "info":
                case "i":
                default:
                    break;
            }
        }


        if (corejs.showErrorLog) {
            var $errorWrapper = $("#error-logs-wrapper");
            if (showLogs && $errorWrapper.length == 1) {
                var $errorWrapper = $("#error-logs-wrapper");
                var errorLogs = corejs.errorLog.get();

                var $errorLogDownButton = $("#show-errorlogs-button span.down");
                var $errorLogUpButton = $("#show-errorlogs-button span.up");

                if (errorLogs.length > 0) {
                    $alert.addClass('has-more');
                    $("#show-errorlogs-button").css('display', 'inline-block');
                    $errorLogUpButton.show();
                    $errorLogDownButton.hide();
                    $("#error-logs-wrapper").hide();
                    var $errorLogs = [];
                    for (var i = errorLogs.length - 1; i >= 0; i--) {
                        $errorLogs.push("<div class='error-log' logindex='" + i + "'>" + errorLogs[i]["message"] + "</div>");
                    }

                    $errorWrapper.html($errorLogs.join(""));


                    $errorLogDownButton.off("click").on("click", function () {

                        $errorLogDownButton.hide();
                        $errorLogUpButton.show();
                        $errorWrapper.hide();

                        return false;
                    });


                    $errorLogUpButton.off("click").on("click", function () {

                        $errorLogDownButton.show();
                        $errorLogUpButton.hide();
                        $errorWrapper.show();

                        return false;
                    });


                    $("#error-logs-wrapper").find(".error-log").off("click").on("click", function () {
                        var errorIndex = $(this).attr("logindex");
                        var errorLogs = corejs.errorLog.get();
                        if (errorLogs.length > 0 && errorIndex > -1) {
                            var $errorBox = $("#cpf-error-wrapper");
                            $errorBox.find(".title-text").html(errorLogs[errorIndex]["message"]);
                            $errorBox.find(".content span").html(errorLogs[errorIndex]["stackTrace"]);
                            ConfirmationBox.Show($("#cpf-error-wrapper"));
                        }

                        return false;
                    });
                }
            } else {
                $errorWrapper.hide();
            }
        } else {
            $("#show-errorlogs-button").hide();
            $("#error-logs-wrapper").hide();
        }

        $message = $alert.find(".message");
        message = message.replace("'", "\'");

        $message.text(message);

        clearTimeout(corejs.cpfAlertTimeout);
        $alert.show();


        $alert.fadeIn("fast");

        corejs.cpfAlertTimeout = setTimeout('corejs.checkAndCloseAlert();', alertTimeoutDuration);
    },

    delayedAlert: function (message, messageType, blink) {
        var key = USERID + "_delayedAlert";
        // set delayed alert with a ttl of 2 mins
        corejs.store.set(key, { 'message': message, 'messageType': messageType, 'blink': blink }, 120000);
    },

    processDelayedAlert: function () {

        var key = USERID + "_delayedAlert";
        var delayed = corejs.store.get(key, null);

        if (!isNullOrEmpty(delayed)) {
            corejs.alert(delayed.message, delayed.messageType, delayed.blink);
            corejs.store.remove(key);
        }
    },

    status: function (message) {
        var $status = $("#message");
        $status.empty();
        $status.append(message);

        return false;
    },

    cpfAlertTimeout: 0,

    checkAndCloseAlert: function () {

        //dont hide the alert automatically if the MORE button has been hit
        if ($('#error-logs-wrapper').css('display') == 'none') {
            corejs.closealert("medium");
        }

    },

    closealert: function (speed) {
        var $alert = $("#alert");
        clearTimeout(corejs.cpfAlertTimeout);


        // if it is an old browser, just slam it out, otherwise fade out.
        if (corejs.isIE7 || corejs.isIE8) {
            $alert.hide();
        } else {
            if (!speed) {
                speed = "fast";
            }

            $alert.fadeOut("fast", function () {
                $alert.hide();
            });
        }
    },

    regex: function (inputtext, regexpatterns) {
        var pattern;
        for (var i = 0; i < regexpatterns.length; i++) {
            pattern = new RegExp(regexpatterns[i].patterntext, "gi");
            inputtext = inputtext.replace(pattern, regexpatterns[i].replacetext);
        }
        return inputtext;
    },

    initialisemessagebox: function () {
        var msgBox = { buttons: [] };
        return msgBox;
    },

    setmessagebox: function (args) {
        var defaults = { title: "RESOURCE{{corejs.ui.js}:{GenericMessageBoxTitle}:{Message}}", message: "RESOURCE{{corejs.ui.js}:{GenericMessageBoxText}:{No message provided}}", yesbuttontext: "RESOURCE{{corejs.ui.js}:{GenericMessageBoxYes}:{Yes}}", nobuttontext: "RESOURCE{{corejs.ui.js}:{GenericMessageBoxNo}:{No}}", okbuttontext: "RESOURCE{{corejs.ui.js}:{GenericMessageBoxOK}:{OK}}", singlebutton: false, icontype: "" };
        var options = $.extend({}, defaults, args);

        corejs.wait();

        //  options.buttonCount = options.buttons.length;
        $(".lb-win").remove();
        corejs.ajax({
            url: COREROOT + "/core/Message",
            dataType: "html",
            type: "POST",
            data: options,
            success: function (html) {
                var $message = $(html);
                $("body").append($message);

                if (options.singlebutton && options.buttons.onnokclick) {
                    $("#msgbox-ok").click(function () {
                        corejs.wait();
                        options.buttons.onnokclick();
                        $message.hide();
                        corejs.wait(false);
                        return false;
                    });
                } else {
                    if (options.buttons.onyesclick) {
                        $("#msgbox-yes").click(function () {
                            corejs.wait();
                            options.buttons.onyesclick();
                            $message.hide();
                            corejs.wait(false);
                            return false;
                        });
                    }

                    if (options.buttons.onnoclick) {
                        $("#msgbox-no").click(function () {
                            corejs.wait();
                            options.buttons.onnoclick();
                            $message.hide();
                            corejs.wait(false);
                            return false;
                        });
                    }
                }
                $message.show();
                $message.centre();
                corejs.wait(false);
            },
            errorCallback: function (a, b, c) {
                corejs.alert("RESOURCE{{corejs.ui.js}:{GenericMessageBoxError}:{Unable to display message box.}}", "e", true);
                corejs.wait(false);
            }
        });

        return false;
    },

    error: function (err) {
        corejs.alert(err.message, "e");
        return false;
    },

    errorParser: function (xmlhttp, message, exception) {
        try {
            return JSON.parse(xmlhttp.responseText);
        } catch (err) {
            return null;
        }
    },

    parseHtml: function (htmlContent, elementname) {
        var elementstartindex = htmlContent.indexOf('<' + elementname), elementendIndex;
        elementstartindex = elementstartindex + htmlContent.substring(elementstartindex).indexOf('>') + 1;
        elementendIndex = htmlContent.indexOf('</' + elementname);
        return htmlContent.substring(elementstartindex, elementendIndex);
    },

    pad: function (number, count, str) {
        return Array(count - String(number).length + 1).join(str || '0') + number;
    },
    bindHelpEvents: function ($container) {
        var $helpLinks;
        var $helpClose;

        // all help are binded
        if (typeof $container === 'undefined' || $container == null) {
            $container = $("body");
        }

        // get links
        $helpLinks = $container.find("a.help-link");

        // get close buttons
        $helpClose = $(".help-close", $container);
        /*
        $helpLinks.off("click").on("click", function (event) {
            $(".help-layer-wrapper").hide();

            var $link = $(this);
            var $layer = $("> label > #" + $link.attr("data-target"), $container);
            if ($layer.length == 0) {
                $layer = $("#" + $link.attr("data-target"), $container);
            }

            var linkOffset = $link.offset();
            linkOffset.top += 13;
            linkOffset.left -= 15;
            $layer.show();
            $layer.offset(linkOffset);

            return false;
        });

        $helpClose.off("click").on("click", function () {
            $(this).parent().parent().hide();
            return false;
        });
        */
    },

    hash: function (name, value) {
        try {
            var hashString = unescape(location.hash);
            hashString = hashString.substring(hashString.indexOf('{')); // trim the hash

            var hashobject;

            try {
                hashobject = JSON.parse(hashString);
                if (!hashobject) {
                    hashobject = {};
                }
            } catch (exxx) {
                hashobject = {};
            }

            if (!name && !value) {
                // they want the whole object
                return hashobject;
            }

            if (arguments.length == 1) {
                // get hash value
                return hashobject[name];
            }

            if (!value) {
                // get hash value
                delete hashobject[name];
                location.hash = JSON.stringify(hashobject);
                return hashobject[name];
            } else {
                // set hash value
                hashobject[name] = value;
                var json = JSON.stringify(hashobject);
                location.hash = json;

                return false;
            }
        } catch (exx) {
            corejs.errorLog.add(exx.Message);
        }
    },

    newHash: function (model) {
        var json = JSON.stringify(model);
        location.hash = json;
    },

    store:
    {
        load: false,
        interval: null,

        get: function (key, defaultValue) {
            return $.jStorage.get(key, defaultValue);
        },

        set: function (key, value, ttl) {
            $.jStorage.set(key, value);
            if (!isNullOrEmpty(ttl)) {
                $.jStorage.setTTL(key, ttl);
            }
        },

        remove: function (key) {
            $.jStorage.deleteKey(key);
        },

        size: function () {
            return $.jStorage.storageSize();
        },

        purge: function () {
            $.jStorage.flush();
        },

        keys: function () {
            return $.jStorage.index();
        },

        publish: function (publishKey, value) {
            $.jStorage.publish(publishKey, value);
        },

        subscribe: function (publishKey, callback) {
            $.jStorage.subscribe(publishKey, callback);
        }
    },

    errorLog:
    {
        get: function () {
            var emptyArray = [];
            return corejs.store.get("cpfErrorLogs", emptyArray);
        },

        add: function (value, ttl) {
            var emptyArray = [];


            var errorLogs = corejs.store.get("cpfErrorLogs", emptyArray);
            if (errorLogs.length > 4) {
                for (var i = 1; i < 5; i++) {
                    emptyArray.push(errorLogs[i]);
                }
                emptyArray.push(value);
                errorLogs = emptyArray;
            } else {
                errorLogs.push(value);
            }

            corejs.store.set("cpfErrorLogs", errorLogs);
        }
    },

    title:
    {
        get: function () {
            return $("#navigation-menu li").last().find("a").text();
        },

        set: function (newTitle) {
            //$("#navigation-menu li").last().find("a").text(newTitle);
        }
    },

    sanitise: function (text) {

        if (!isNullOrEmpty(text)) {
            return JSON.stringify(text).replace(/\W/g, '').toLowerCase();
        }

        return '';
    },
    button: {
        click: function ($element, callback) {

            $element.off("click.toggle");

            $element.on('click.toggle', function (event) {

                corejs.button.animate($element, callback);

                return false;
            });

            return false;
        },
        animate: function ($element, callback) {

            var buttonType = $element.attr('data-button-type');
            var buttonActive = $element.attr('data-active');
            var toggleGroup = $($element.attr('data-toggle-group'));
            var toggleGroupName = $element.attr('data-toggle-group');
            var menuToToggle = $($element.attr('data-menu-to-toggle'));
            var otherMenuToToggle;
            var otherMenuHideAnimation;
            var showAnimation = $element.attr("data-show-animation");
            var hideAnimation = $element.attr("data-hide-animation");

            if (callback && typeof (callback) === "function") {
                callback($element);
            }

            switch (buttonType) {

                case 'soloWithNoClickOff':

                    // if the menu-to-toggle is visible then we'll close it and remove the surface and empty openMenu array
                    if (buttonActive === 'true') {

                        corejs.button.hide[hideAnimation]($element, menuToToggle);

                        $element.attr('data-active', 'false');


                    } else {

                        corejs.button.show[showAnimation]($element, menuToToggle);

                        $element.attr('data-active', 'true');

                    }

                    break;

                case 'soloWithClickOff':

                    // if the menu-to-toggle is visible then we'll close it and remove the surface and empty openMenu array
                    if (buttonActive === 'true') {

                        corejs.button.hide[hideAnimation]($element, menuToToggle);

                        $element.attr('data-active', 'false');

                        corejs.surface.close($element, toggleGroup);

                    } else {

                        corejs.button.show[showAnimation]($element, menuToToggle);

                        $element.attr('data-active', 'true');

                        corejs.surface.open($element, toggleGroup);
                    }

                    break;
                case 'toggleBetweenGroupWithNoClickOff':

                    // if the menu-to-toggle is visible then we'll close it and remove the surface 
                    if (buttonActive === 'false') {

                        //if the menu to toggle is not visible close the other menus in the toggle group and open this one

                        // REVIEW: should not be selecting using attributes and using jquery each
                        toggleGroup.find('[data-toggle-group="' + toggleGroupName + '"]').each(function () {

                            otherMenuToToggle = $($(this).attr('data-menu-to-toggle'));
                            otherMenuHideAnimation = $(this).attr('data-hide-animation');

                            if ($(this).attr('data-active') === 'true') {

                                corejs.button.hide[otherMenuHideAnimation]($(this), otherMenuToToggle);
                                $(this).attr('data-active', 'false');

                            }

                        });

                        corejs.button.show[showAnimation]($element, menuToToggle);
                        $element.attr('data-active', 'true');

                    } else {

                        corejs.button.hide[hideAnimation]($element, menuToToggle);
                        $element.attr('data-active', 'false');
                    }


                    break;

                case 'toggleGroupWithNoClickOff':


                    // if the menu-to-toggle is visible then we'll close it and remove the surface 
                    if (buttonActive === 'false') {

                        //if the menu to toggle is not visible close the other menus in the toggle group and open this one

                        // REVIEW: should not be selecting using attributes and using jquery each
                        toggleGroup.find('[data-toggle-group]').each(function () {

                            otherMenuToToggle = $($(this).attr('data-menu-to-toggle'));
                            otherMenuHideAnimation = $(this).attr('data-hide-animation');

                            if ($(this).attr('data-active') === 'true') {

                                corejs.button.hide[otherMenuHideAnimation]($(this), otherMenuToToggle);

                                $(this).attr('data-active', 'false');

                            }

                        });

                        corejs.button.show[showAnimation]($element, menuToToggle);

                        $element.attr('data-active', 'true');
                    }


                    break;

                case 'toggleGroupWithClickOff':

                    // if the menu-to-toggle is visible then we'll close it and remove the surface 
                    if (buttonActive === 'true') {

                        corejs.button.hide[hideAnimation]($element, menuToToggle);
                        $element.attr('data-active', 'false');

                        corejs.surface.close($element, toggleGroup);

                    } else {

                        //if the menu to toggle is not visible close the other menus in the toggle group and open this one

                        // REVIEW: should not be selecting using attributes and using jquery each
                        toggleGroup.find('[data-toggle-group]').each(function () {

                            otherMenuToToggle = $($(this).attr('data-menu-to-toggle'));
                            otherMenuHideAnimation = $(this).attr('data-hide-animation');


                            if ($(this).attr('data-active') === 'true') {

                                //hanle alternative behaviour for global search persistance & elipsis dropdown
                                if (
                                    otherMenuToToggle.attr('id') != 'global-search-container' ||
                                    (otherMenuToToggle.attr('id') === 'global-search-container' &&
                                        $('#global-search').val().length === 0)
                                ) {

                                    corejs.button.hide[otherMenuHideAnimation]($(this), otherMenuToToggle);

                                    $(this).attr('data-active', 'false');
                                }

                            }

                        });

                        corejs.button.show[showAnimation]($element, menuToToggle);

                        $element.attr('data-active', 'true');



                        ////check if an elipsis dropdown is open
                        if ($element.parents('#toolbar-container').length == 1 && $('#toolbar-elipsis').attr("data-active") == "true") {
                            corejs.button.animate($('#toolbar-elipsis'));
                        }


                        //handle the double drop down in the toolbar 
                        if ($element.parent().parent().attr('id') == 'toolbar-elipsis-dropdown' || ($element.parent().parent().parent().attr('id') == 'toolbar-elipsis-dropdown' && $element.parent().hasClass('dual-button'))) {
                            corejs.surface.open($element, toggleGroup);

                            $('#surface-div').on("click.doublemenu", function () {
                                corejs.button.animate($('#toolbar-elipsis'));
                            });

                        } else {
                            corejs.surface.open($element, toggleGroup);
                        }

                    }

                    break;

                default:
                    console.log('Button has no data-button-type attribute assigned');
                    break;
            }

            return false;

        },

        show: {
            showAndPositionWithArrow: function ($element, menuToToggle) {
                // calculating position of menu (accouting for that it may be off the screen)
                // set up positioning variables
                var padding = 3;
                var menuWidth = parseInt(menuToToggle.css("width"), 10);
                var halfButtonWidth = parseInt($element.outerWidth(true), 10) / 2;
                var windowWidth = $('#fixed-top-section').width();
                var offsetLeft = $element.offset().left - $(window).scrollLeft();

                //position the menu
                if (navigator.appVersion.indexOf("MSIE 7.") != -1) {
                    //fix positioning issue in ie7
                    menuToToggle.css("left", (windowWidth - offsetLeft - menuWidth - padding - 40));
                    menuToToggle.css("top", 38);

                } else {
                    menuToToggle.css("left", (windowWidth - offsetLeft - menuWidth - padding));
                }


                //position the arrow underneath the button
                var arrowPosition = (windowWidth - offsetLeft - menuWidth - padding) * -1 + halfButtonWidth;

                $('#arrow-after').remove();
                $('#arrow-before').remove();

                $('<style id="arrow-after">' + '.menu:after {left:' + arrowPosition + 'px}' + '</style>').appendTo(menuToToggle);
                $('<style id="arrow-before">' + '.menu:before {left:' + arrowPosition + 'px}' + '</style>').appendTo(menuToToggle);
                $element.addClass('selected');
                menuToToggle.show();


            },
            slideInFlyout: function ($element, menuToToggle) {

                $("#flyout-content").scrollTop(0);
                $("#flyout-container").animate({ "left": "0px" }, 450, "easeOutQuint");
                $("#flyout-toggle").addClass('flyout-shadow');
                $("#flyout-arrow").addClass('turn180').addClass('selected');


            },
            slideDown: function ($element, menuToToggle) {
                menuToToggle.slideDown(125);
                $element.addClass('selected');
            },
            slideDownToolbar: function ($element, menuToToggle) {
                // alert($('#toolbar-dropdown-padder').height() + ' ' + $(window).height());
                $('#toolbar-container').height($(window).height() - 105);
                // alert($('#toolbar-dropdown-padder').height() + ' ' + $(window).height());
                menuToToggle.slideDown(50);

                $element.addClass('selected');
            },
            showGlobalSearch: function ($element, menuToToggle) {

                $('#main-toolbar').fadeOut(50);

                //because of theming we can't just set the colours. We'll grab them from the default colors of the input box
                var inputBackgroundColor = menuToToggle.find('#global-search').css('background-color');
                var inputColor = menuToToggle.find('#global-search').css('color');
                var inputBorderColor = menuToToggle.find('#global-search').css('border-color');

                menuToToggle.animate({
                    backgroundColor: inputBackgroundColor,
                    borderWidth: '1px',
                    borderColor: inputBorderColor,
                    borderStyle: 'solid',
                    paddingRight: '3px',
                    paddingLeft: '3px',
                    width: '30px',
                    top: '-3px'
                }, 75, function () {
                    $element.animate({
                        top: '2px',
                        right: '0px',
                        fontSize: '21px',
                        width: '27px',
                        color: inputColor

                    }, 220, function () {
                        menuToToggle.find('#global-search').css('width', '230px').fadeIn().animate({ paddingLeft: '4px' });
                        menuToToggle.animate({ width: 280 });
                    });
                });


                //remove the click event from the button and replace it with the search function
                $element.unbind();
                $element.click(function () {
                    //TODO: add the call to the function that executes the global search here
                }
                );
            },
            showFilterMobileSearch: function ($element, menuToToggle) {
                alert('show');
            }


        },
        hide: {
            basicHide: function ($element, menuToToggle) {
                menuToToggle.hide();
                $element.removeClass('selected');
            },

            slideOutFlyout: function ($element, menuToToggle) {

                $("#flyout-container").animate({ "left": "-200px" }, 450, "easeOutQuint", function () {

                    $("#flyout-arrow").removeClass('turn180').removeClass('selected');
                });
                $("#flyout-toggle").removeClass('flyout-shadow');
                $("#flyout-toggle").attr('data-active', 'false');

            },
            slideOutSecondaryNav: function ($element, menuToToggle) {

                $("#secondary-nav").animate({ "left": "-227px" }, 450, "easeOutQuint", function () {

                    $("#secondary-nav-arrow").removeClass('turn180').removeClass('selected');
                });
                $("#secondary-nav-toggle").removeClass('flyout-shadow');
                $("#secondary-nav-toggle").attr('data-active', 'false');

            },
            slideUp: function ($element, menuToToggle) {
                menuToToggle.slideUp(125, function () {
                    menuToToggle.removeAttr('style');
                    $element.removeClass('selected');
                    if ($element.parent().hasClass('dropped-down')) {
                        $element.parent().removeClass('dropped-down');
                    }
                });

            },
            hideGlobalSearch: function ($element, menuToToggle) {

                $('#main-toolbar').fadeIn(50);

                // grab the accent color form the apps menu (which will always be present)
                var accentColor = $('#button-apps').css('color');


                if (!$('#global-search').val()) {

                    $('#cancel-global-search-button').hide();

                    menuToToggle.animate({ backgroundColor: 'transparent', borderWidth: '0px' }, 75, function () {
                        menuToToggle.animate({
                            width: 38,
                            paddingRight: '0px',
                            paddingLeft: '0px',
                            top: '-3px'
                        });


                    });

                    menuToToggle.find('#global-search').css('display', 'none', function () {
                        menuToToggle.find('#global-search').animate({
                            width: 0
                        }, 75);
                    });

                    // $element.animate({backgroundColor: 'transparent'},75);

                    $element.animate({
                        top: '3px',
                        right: '4px',
                        fontSize: '28px',
                        width: '28px',
                        color: accentColor
                    });

                    //rebind the click to show the global search
                    corejs.button.click($element);

                }
            },
            hideFilterMobileSearch: function ($element, menuToToggle) {
                alert('hide');
            }

        }
    },
    surface: {
        open: function ($element, elementsToPushAboveSurface) {

            // push the toggle group above the surface
            elementsToPushAboveSurface.addClass('button-group-above-surface');

            var surface = $("#surface-div");

            // show the surface dive
            surface.addClass('surface');

            surface.unbind("click");


            // give the surface an onclick that acts as if you are pushing the button that called this function
            surface.on('click', function (event) {

                corejs.button.animate($element);

                //trigger whatever's behind what you just clicked on
                $(document.elementFromPoint(event.clientX, event.clientY)).trigger("click");


            });

        },
        close: function ($element, elementsToPushAboveSurface) {

            //enable the surface div for click off event

            $("#surface-div").removeClass('surface');

            elementsToPushAboveSurface.removeClass('button-group-above-surface');

        }

    },
    input: {
        hint: function ($element, hintText) {
            if ($element.val().length === 0) {
                corejs.input.hasNoText($element);

                $element.val(hintText);
            } else {
                corejs.input.hasText($element);
            }

            $element.attr("data-hint", hintText);

            $element.focus(function () {
                if ($element.val() === hintText) {
                    corejs.input.hasText($element);
                    $element.val('');
                }
            });

            $element.focusout(function () {
                if ($element.val() === '') {
                    $element.val(hintText);
                    corejs.input.hasNoText($element);
                }
            });
        },

        hasText: function ($element) {
            $element.addClass('input-has-text').removeClass('input-no-text');
        },

        hasNoText: function ($element) {
            $element.addClass('input-no-text').removeClass('input-has-text');
        }

    },
    overlay: {
        hide: function (controlId) {
            for (var i = 0, ii = openWindows.length; i < ii; i++) {
                if (openWindows[i] == controlId) {
                    openWindows.splice(i, 1);
                    break;
                }
            }

            if (openWindows.length == 0) {
                $("#background-overlay").hide();
            }
        },
        show: function (controlId) {
            var exists = false;

            for (var i = 0, ii = openWindows.length; i < ii; i++) {
                if (openWindows[i] == controlId) {
                    exists = true;
                    break;
                }
            }

            if (openWindows.length == 0) {
                // no existing windows are open. show the overlay.
                $("#background-overlay").show();
            }

            if (!exists) {
                openWindows.push(controlId);
            }
        }
    },
    checkIfMobile: function () {

        var windowWidth = $(window).width();

        if (windowWidth <= 800) {

            corejs.isMobile = true;

        } else {
            //if this the view port just switch then remove the inline styles jquery added.
            if (corejs.isMobile === true) {
                corejs.purgeJquery();
            }
            corejs.isMobile = false;

        }

    },
    purgeJquery: function () {
        //use this array to create a list of things that need purging
        var elements = ["#secondary-nav", "#toolbar-container", "#thoughtflow-details-wrapper"];
        for (var i = 0; i < elements.length; i = i + 1) {

            $(elements[i]).removeAttr("style");

            if ($(elements[i]).attr('id') == 'thoughtflow-details-wrapper') {
                $(elements[i]).removeClass('show-as-lightbox');
            }
        }

        $('#background-overlay').hide();
        $('body').removeClass('noscroll');

    },
    navigation: {
        scrollLeft: function ($element) {
            $element.click(function () {

                var $nav = $('#navigation-menu');
                var currentLeft = parseInt($nav.css('left'), 10);
                var navOverflow = parseInt($nav.width(), 10) - parseInt($(window).width(), 10);
                var rightPadding = 30;
                var stepAmount = 150;

                if (navOverflow > 0 && currentLeft > (navOverflow * -1)) {

                    if ((currentLeft * -1) + stepAmount >= navOverflow) {
                        stepAmount = navOverflow + rightPadding - (currentLeft * -1);
                        $element.parent().fadeOut(75);

                    }

                    $nav.animate({ left: currentLeft - stepAmount + 'px' }, { duration: 100, easing: 'easeOutQuad' });
                    $('#scroll-nav-left').fadeIn();
                }
            });
        },
        scrollRight: function ($element) {
            $element.click(function () {
                var $nav = $('#navigation-menu');
                var currentLeft = parseInt($nav.css('left'), 10);
                var stepAmount = 150;

                if (currentLeft + stepAmount >= 0) {
                    stepAmount = currentLeft * -1;

                    $element.parent().fadeOut(75);
                }
                $nav.animate({ left: currentLeft + stepAmount + 'px' }, { duration: 100, easing: 'easeOutQuad' });
                $('#scroll-nav-right').fadeIn();


            });
        },
        load: function ($element) {

            var navWidth = parseInt($element.outerWidth(), 10);
            var windowWidth = parseInt($(window).width(), 10);
            var rightPadding = 30;

            if ((navWidth + rightPadding) > windowWidth) {
                var navOverflow = (navWidth - windowWidth + rightPadding) * -1;
                $element.css('left', navOverflow);
                $('#scroll-nav-left').show();
            }

            $('#navigation-menu li:last-child').addClass('navigation-item-current-page');


        }
    },
    toolbar: {
        active: function () {
            //$('.toolbar a').on('mousedown', function () {
            //    $(this).addClass('mouse-down');
            //    $(this).children().addClass('mouse-down');
            //});
            //$('.toolbar a .button-label').on('mousedown', function () {
            //    $(this).addClass('mouse-down');
            //    $(this).parent().addClass('mouse-down');
            //});
            //$('.toolbar a').on('mouseleave', function (e) {

            //    if (!e && window.event) e = event;
            //    var goingto = e.relatedTarget || event.toElement;
            //    if (!$(goingto).hasClass('mouse-down')) {
            //        $(this).removeClass('mouse-down');
            //        $(this).children().removeClass('mouse-down');
            //    }

            //});
            //$('.toolbar a .button-label').on('mouseleave', function (e) {

            //    if (!e && window.event) e = event;
            //    var goingto = e.relatedTarget || event.toElement;

            //    if (!$(goingto).hasClass('mouse-down')) {
            //        $(this).removeClass('mouse-down');
            //        $(this).parent().removeClass('mouse-down');
            //    }
            //});
        },
        toolbarButtons: {},
        initialiseDropDowns: function () {

            //if there are any buttons in the eplisis dropdown, we're going to have to move them back to work out the new posistions
            var buttonsToMoveToToolbarContainer = $('ul#toolbar-elipsis-dropdown > li');

            for (var i = 0, ii = buttonsToMoveToToolbarContainer.length; i < ii; i++) {
                $(buttonsToMoveToToolbarContainer[i]).detach().appendTo('ul#toolbar-container');
            }

            //initialise sections
            var sectionButtons = $("#main-toolbar li > .section-button");

            for (var i = 0, ii = sectionButtons.length; i < ii; i++) {

                if ($($(sectionButtons[i]).attr('data-menu-to-toggle')).find('ul li a').length == $($(sectionButtons[i]).attr('data-menu-to-toggle')).find('ul li a.disabled').length) {

                    //if there's no un-disabled buttons in the drop down then this whole button is nothing but a meaningless void.
                    $(sectionButtons[i]).addClass('disabled');

                } else {
                    corejs.toolbar.bindDropDownEvents($(sectionButtons[i]));
                    $(sectionButtons[i]).removeClass('disabled');
                }

            }


            //initalise dual buttons
            var dualButtons = $("#main-toolbar li .dual-button");

            for (var i = 0, ii = dualButtons.length; i < ii; i++) {

                if ($(dualButtons[i]).find('ul li a').hasClass('disabled')) {

                    //The main section button is disabled, so we'll have to hide the whole section
                    $(dualButtons[i]).addClass('disabled');

                } else if ($($(dualButtons[i]).find('.section-button').attr('data-menu-to-toggle')).find('ul li a').length == $($(dualButtons[i]).find('.section-button').attr('data-menu-to-toggle')).find('ul li a.disabled').length) {

                    //if the drop down section doesnt has any un-disabled buttons then make the dual-button into a regular button 
                    $(dualButtons[i]).addClass('regular-override').removeClass('disabled');

                    corejs.toolbar.bindDropDownEvents($(dualButtons[i]));

                } else {

                    $(dualButtons[i]).removeClass('regular-override').removeClass('disabled');

                    //if we're here then dual button is good so bind events
                    corejs.toolbar.bindDropDownEvents($(dualButtons[i]).find('.section-button'));
                }
            };

            //grab all the buttons and put them in an object so we can manipluate them on window resize
            corejs.toolbar.toolbarButtons = $("ul#toolbar-container > li");
            corejs.toolbar.calculateButtonPositions();
            corejs.toolbar.arrangeButtons();
            $("ul#toolbar-container").removeClass('off-screen');

        },
        calculateButtonPositions: function () {

            for (var i = 0, ii = corejs.toolbar.toolbarButtons.length; i < ii; i++) {
                $(corejs.toolbar.toolbarButtons[i]).attr("data-position", $(corejs.toolbar.toolbarButtons[i]).offset().left + $(corejs.toolbar.toolbarButtons[i]).outerWidth()).attr('data-button-count', i);
            }


        },
        isResising: false,
        haveBeenResizedAfter: false,
        arrangeButtons: function () {

            corejs.toolbar.haveBeenResizedAfter = true;
            var showElipsis = false;

            if (!corejs.toolbar.isResising) {

                corejs.toolbar.haveBeenResizedAfter = false;

                corejs.toolbar.isResising = true;

                var availableWidth = $(window).width() - $('#top-bar-tools').outerWidth() - 50; //add 50px of extra padding for asthetics
                var openMenuButton;
                var $sectionButton;

                for (var i = 0, ii = corejs.toolbar.toolbarButtons.length; i < ii; i++) {

                    if ($(corejs.toolbar.toolbarButtons[i]).attr("data-position") >= availableWidth) {
                        $(corejs.toolbar.toolbarButtons[i]).attr("data-outside", "true");
                        showElipsis = true;
                    } else {
                        $(corejs.toolbar.toolbarButtons[i]).attr("data-outside", "false");
                    }
                }

                var buttonsToMoveToEilpsisDropdown = $('ul#toolbar-container > li[data-outside="true"]');

                for (var i = buttonsToMoveToEilpsisDropdown.length, ii = -1 ; i > ii; i--) {

                    openMenuButton = $($(buttonsToMoveToEilpsisDropdown[i]).find('div[data-active="true"]'));
                    if (openMenuButton.length > 0) {
                        //if there's any menus open we'll need to close them, and do it while their invisible so you dont see wonky animations due to lack of relative parent during animation
                        $(openMenuButton.attr('data-menu-to-toggle')).css("visibility", "hidden");
                        corejs.button.animate(openMenuButton);
                        $(openMenuButton.attr('data-menu-to-toggle')).css("visibility", "visible");
                    }

                    //to handle toggling between the right group now it's moved we'll need to rebind the onclick events
                    $sectionButton = $(buttonsToMoveToEilpsisDropdown[i]).find('.section-button');
                    if ($sectionButton != undefined) {
                        $sectionButton.attr('data-toggle-group', '#toolbar-elipsis-dropdown');
                        corejs.toolbar.bindDropDownEvents($sectionButton);
                    }

                    $(buttonsToMoveToEilpsisDropdown[i]).detach().prependTo('ul#toolbar-elipsis-dropdown');
                }

                var buttonsToMoveToToolbarContainer = $('ul#toolbar-elipsis-dropdown > li[data-outside="false"]');

                for (var i = 0, ii = buttonsToMoveToToolbarContainer.length; i < ii; i++) {
                    //close any open dropdowns

                    openMenuButton = $($(buttonsToMoveToToolbarContainer[i]).find('div[data-active="true"]'));
                    if (openMenuButton.length > 0) {
                        //if there's any menus open we'll need to close them, and do it while their invisible so you dont see wonky animations due to lack of relative parent during animation
                        $(openMenuButton.attr('data-menu-to-toggle')).css("visibility", "hidden");
                        corejs.button.animate(openMenuButton);
                        $(openMenuButton.attr('data-menu-to-toggle')).css("visibility", "visible");
                    }

                    //to handle toggling between the right group now it's moved we'll need to rebind the onclick events
                    $sectionButton = $(buttonsToMoveToToolbarContainer[i]).find('.section-button');
                    if ($sectionButton != undefined) {
                        $sectionButton.attr('data-toggle-group', '#main-toolbar');
                        corejs.toolbar.bindDropDownEvents($sectionButton);
                    }

                    $(buttonsToMoveToToolbarContainer[i]).detach().appendTo('ul#toolbar-container');
                }




                corejs.toolbar.isResising = false;


            }

            if (showElipsis) {
                $('#main-toolbar #toolbar-elipsis, #main-toolbar #toolbar-elipsis-dropdown-container').css("display", "inline-block");
            } else {
                $('#main-toolbar #toolbar-elipsis, #main-toolbar #toolbar-elipsis-dropdown-container').css("display", "none");
            }

        },
        bindDropDownEvents: function ($element) {

            corejs.button.click($element,
                function ($element) {

                    var $menuToToggle = $($element.attr('data-menu-to-toggle'));
                    if ($element.parent().hasClass('dual-button')) {



                        //go sideways if it's in the elipsis dropdown
                        if ($element.parent().parent().parent().attr('id') == 'toolbar-elipsis-dropdown') {
                            $menuToToggle.css({
                                'left': $element.parent().parent().parent().outerWidth() - 4,
                                'min-width': $element.parent().parent().css('width'),
                                'top': $element.offset().top - 74
                            });
                        } else {
                            $menuToToggle.css({
                                //'left': $element.parent().offset().left,
                                'min-width': $element.parent().css('width')
                            });
                        }

                        $element.parent().addClass('dropped-down');


                    } else {


                        //go sideways if it's in the elipsis dropdown
                        if ($element.parent().parent().attr('id') == 'toolbar-elipsis-dropdown') {
                            $menuToToggle.css({
                                'left': $element.parent().parent().outerWidth() - 4,
                                'top': 'auto',
                                'min-width': $element.css('width'),
                                'margin-top': -2
                            });
                        } else {
                            $menuToToggle.css({
                                //  'left': $element.offset().left,
                                'min-width': $element.css('width')
                            });
                        }

                    }


                    function close() {
                        corejs.button.animate($element);
                    }

                    $menuToToggle.find('ul li a').off("click.close");
                    $menuToToggle.find('ul li a').on("click.close", close);

                    return false;
                });

        }
    },
    initialise: {
        globalSearch: function () {


            var searchBox = $('#global-search');
            var cancelButton = $('#cancel-global-search-button');
            var mobileGlobalSearchButton = $('#global-search-desktop-mobile');

            //handle if user deletes the filter text
            searchBox.on("keyup", $.proxy(function (event) {
                //only do removeFilter if there is one applied
                if (searchBox.val().length > 0) {
                    cancelButton.fadeIn(20);
                    corejs.surface.close($('#global-search-button'), $('#top-bar-tools'));
                } else {
                    $('#global-search').attr('data-active', 'true');
                    corejs.surface.open($('#global-search-button'), $('#top-bar-tools'));
                }
            }, this));


            cancelButton.on("click", $.proxy(function (event) {

                cancelButton.fadeOut(20);
                searchBox.val('');
                corejs.surface.open($('#global-search-button'), $('#top-bar-tools'));
            }, this));


            // handle cancel button if there is value in the search box on page load
            if (searchBox.length > 0) {
                if (searchBox.val().length === 0) {

                    cancelButton.hide();
                } else {

                    cancelButton.show();
                }
            }

            //click event for the mobile version of the button

            mobileGlobalSearchButton.on("click", function () {
                //TODO this should take you to the gloabal search page once it's implemented
                alert("This will take you to the global search page");
            });

        },
        toolbarShadow: function () {

            $(window).scroll(function () {
                if ($(window).scrollTop() > 0) {
                    $('#main-toolbar').addClass('toolbar-dropshadow');
                } else {
                    $('#main-toolbar').removeClass('toolbar-dropshadow');
                }
            });
        }
    }
};

corejs.JSONDateFormat = function (jsondate) {
    if (jsondate != undefined) {
        jsondate = jsondate.replace("/Date(", "").replace(")/", "");
        if (jsondate.indexOf("+") > 0) {
            jsondate = jsondate.substring(0, jsondate.indexOf("+"));
        } else if (jsondate.indexOf("-") > 0) {
            jsondate = jsondate.substring(0, jsondate.indexOf("-"));
        }

        return new Date(parseInt(jsondate, 10));
    }
};

corejs.whoami =
{
    data: {},

    load: function () {

    },

    val: function () {
        var objectIdentifier = corejs.whoami.getAttachmentObjectIdentifier();

        this.data["url"] = window.location.href;
        this.data["title"] = document.title;

        for (var key in objectIdentifier) {
            if (objectIdentifier.hasOwnProperty(key)) {
                this.data[key] = objectIdentifier[key];
            }
        }

        return corejs.whoami.data;
    },

    add: function (key, value) {
        this.data[key] = value;
    },

    getAttachmentObjectIdentifier: function () {
        var identifier = {};

        if (typeof (undefined) != typeof ($MODEL)) {
            identifier = $MODEL;
        }

        //Add page type parameters (is this needed after dymo parameters are set?)
        var $dynoForm = $("#page").find(".dyno-form");

        if ($dynoForm.length > 0) {
            var identifierString = $dynoForm.attr("data-identifier");

            //CRDM___Dashboard___Transaction Viewer___1
            if (identifierString) {
                var properties = identifierString.split("___");

                identifier.container = properties[0];
                identifier.type = properties[1];
                identifier.name = properties[2];
                identifier.version = properties[3];
                identifier.objectType = 3;
            }
        } else if ($("#page").length > 0) {

            var $searchType = $("#page").find("#search-wrapper");
            //Explorer Search
            if ($searchType.length > 0) {
                var $results = $searchType.find("#results");

                if ($results.attr("data-container")) {
                    identifier.container = $results.attr("data-container");

                    if ($results.attr("data-search-type") === "user") {
                        identifier.type = "Search";
                    }

                    identifier.name = $results.attr("data-javascript-encoded-name");
                    //User objects have no version
                    //identifier.version = $results.attr("data-version");
                    identifier.objectType = 4;

                    if (SEARCHES["ExplorerSearch"] !== undefined) {
                        var currentSearch = SEARCHES["ExplorerSearch"];
                        for (var k = 0; k < currentSearch.searchParameters.length; k++) {
                            identifier[currentSearch.searchParameters[k].Key] = currentSearch.searchParameters[k].Value;
                        }
                    }

                    var $resultsData = $results.find(".results-container");
                    if ($resultsData.length != 0) {
                        var dataString = $resultsData.attr("data");
                        var dataObj = JSON.parse(dataString);

                        identifier.dateTimeOfExecution = corejs.JSONDateFormat(dataObj.dateTimeOfExecution);
                    }
                }
            } else {
                //Incident Search (try looking into SEARCHES)
                if (SEARCHES["IncidentSearch"] !== undefined) {
                    var currentSearch = SEARCHES["IncidentSearch"];

                    identifier.container = currentSearch.containerName;
                    if (currentSearch.isDefaultSearch) {
                        identifier.type = "DefaultSearch";
                        identifier.objectType = 2;
                    } else {
                        identifier.type = "Search";
                        identifier.objectType = 4;
                    }
                    identifier.name = currentSearch.searchNameEncoded;

                    for (var k = 0; k < currentSearch.searchParameters.length; k++) {
                        identifier[currentSearch.searchParameters[k].Key] = currentSearch.searchParameters[k].Value;
                    }
                }
            }
        }

        //Add Query Parameters
        var queryParams = corejs.querystring.GetAll();
        for (var i = 0; i < queryParams.length; i++) {
            identifier[queryParams[i]] = queryParams[queryParams[i]];
        }

        identifier.dateTimeStamp = new Date();

        return identifier;
    },

    businessCard: function (elementId, data) {
        var renderUrl = APPLICATIONPATH + "businesscard";
        var dataObj = corejs.whoami.val();

        var $cardElement = $("#" + elementId);
        if ($cardElement.length === 0) {
            corejs.alert("RESOURCE{{corejsmvc.js}:{BusinessCardFailed}:{Failed to find element for business card.}}", "e");
        } else {
            var success = function (result) {
                if (isTrue(result.success)) {
                    $cardElement.html(result.data.html);
                }
                else {
                    corejs.alert("RESOURCE{{corejsmvc.js}:{BusinessCardFailed}:{Failed to get business card HTML.}}", "e");
                }
                return false;
            };

            var fail = function (data) {
                corejs.alert("RESOURCE{{corejsmvc.js}:{BusinessCardFailed}:{Failed to get business card HTML.}}", "e");
                return false;
            };

            corejs.ajax({ url: renderUrl, success: success, errorCallback: fail, data: { 'data': JSON.stringify(dataObj) } });
        }
    }
};

corejs.querystring.GetAll = function () {
    var vars = [], hash;
    if (window.location.href.indexOf('?') !== -1) {
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
    }
    return vars;
}

function isNullOrEmpty(value) {
    if (value === null || value === undefined || value === '' || typeof value === 'undefined' || value.length === 0 || $.trim(value).length === 0) {
        return true;
    }

    return false;
}

function isTrue(value) {

    if (!isNullOrEmpty(value) && (value === true || value === "true" || value === "True")) {
        return true;
    }

    return false;
}

var cpfErrorTimeout;
var ERRORALERTTEMPLATE = "<div class='error-tab' onclick='corejs.errorToggle(true)' title=''><img /> </div>";

var ConfirmationBox = (function ($confirmationBox, $trigger, success) {

    var cls = function ($confirmationBox, $trigger, success) {

        var confirmationBoxId = $confirmationBox.attr("id");

        $trigger.bind("click", function () {

            corejs.overlay.show(confirmationBoxId);
            $confirmationBox.show();

            $confirmationBox.css("width", $(window).width() - ($(window).width() / 1.618) + "px");
            $confirmationBox.css("height", ($confirmationBox.width() / 1.618) + "px");


            // centre the msgbox
            $confirmationBox.css("top", (($(window).height() - $confirmationBox.outerHeight()) / 2) + "px");
            $confirmationBox.css("left", (($(window).width() - $confirmationBox.outerWidth()) / 2) + "px");

            $(".foot", $confirmationBox).css("margin-left", "-" + ($(".foot", $confirmationBox).width() / 2) + "px");

            // set msgbox yes button event
            $("#" + confirmationBoxId + "-msgbox-yes", $confirmationBox).unbind("click").bind("click", function () {
                // execute success function
                if ((typeof success) == 'function' && success != null) {
                    success();
                }
                // hide msgbox
                $confirmationBox.hide();
                corejs.overlay.hide(confirmationBoxId);
                return false;
            });

            return false;
        });

        $("#" + confirmationBoxId + "-msgbox-no", $confirmationBox).click(function () {
            // hide msg box
            $confirmationBox.hide();
            corejs.overlay.hide(confirmationBoxId);
            return false;
        });
    };

    // static method for hide msgbox
    cls.Hide = function ($confirmationBox) {
        $confirmationBox.hide();
        corejs.overlay.hide($confirmationBox.attr("id"));
    }

    // static method for show msgbox
    cls.Show = function ($confirmationBox, success, message, falsyCallback, primaryButton, args) {
        corejs.overlay.show($confirmationBox.attr("id"));

        if (message != null && message != undefined) {
            $(".detail > div > span", $confirmationBox).html(message);
        }

        var $confirmationBoxLb = $confirmationBox.find('.lightbox');

        var width = ($confirmationBox.attr("id") === "cpf-error-wrapper") ? "50rem" : "36rem";

        $confirmationBox.css({ "visibility": "hidden" }).show();
        $confirmationBoxLb.css({ "width": width, "top": (($(window).height() / 2) - ($confirmationBoxLb.outerHeight() / 2) - 48) + "px" });
        $confirmationBox.hide().css({ "visibility": "visible" });
        lightbox.positionAndShow($confirmationBox);


        if (primaryButton !== null && primaryButton !== undefined) {
            $('.pill-button-wrapper a.pill-button').each(function () {
                if ($(this).attr('id') !== $confirmationBox.attr("id") + "-msgbox-" + primaryButton) {
                    $(this).addClass('btn-secondary');
                    $(this).parent().append($(this));
                }
            });
        }

        $("#" + $confirmationBox.attr("id") + "-msgbox-ok").unbind().click(function () {
            if ((typeof success) == 'function' && success != null) {
                success();
            }
            ConfirmationBox.Hide($confirmationBox);
            return false;
        });

        $("#" + $confirmationBox.attr("id") + "-msgbox-yes").unbind().click(function () {
            if ((typeof success) == 'function' && success != null) {
                if (args !== null && args !== undefined) {
                    success(args);
                } else {
                    success();
                }
            }
            ConfirmationBox.Hide($confirmationBox);
            return false;
        });

        $("#" + $confirmationBox.attr("id") + "-msgbox-no").unbind().click(function () {

            if (falsyCallback) {
                if (args !== null && args !== undefined) {
                    falsyCallback(args);
                } else {
                    falsyCallback();
                }
            }

            ConfirmationBox.Hide($confirmationBox);
            return false;
        });

        $('.lightbox-close').click(function () {
            ConfirmationBox.Hide($confirmationBox);
            return false;
        });
    }

    return cls;
})();

var StartTimes = [];

function SetStart(name) {
    var StartTime = new Date().getTime();
    StartTimes[name] = StartTime;
}

function CalculateExecutionTime(name) {
    var EndTime = new Date().getTime();
    var executionTime = EndTime - StartTimes[name];
    if (executionTime > 0) {
        console.log(name + ":" + executionTime + "ms");
    }
}

function ClearExecutionTimes() {
    StartTimes = [];
}

//combobox
function combo(thelist, theinput) {
    var input = document.getElementById(theinput);
    var idx = thelist.selectedIndex;
    var content = thelist.options[idx].innerHTML;
    input.value = content;
}

// prevent links with href="#" inserting/replacing # in the address bar.
$('a[href=#]').on('click', function (e) {
    e.preventDefault();
    return true;
});




//TODO PA
//$(document).ready(function () {
//    $('[data-toggle="tooltip"').tooltip();
//});




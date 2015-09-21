
/*
*TradeRiser Proxy - Class
*/
function TradeRiserProxy() {
    var self = this;

    //this.getAllContinousResults = function (callback) {
    //    {
    //        $.ajax({
    //            url: "/App/GetAllEmergingPatternDefaultsTest",
    //            type: "POST",
    //            dataType: "text",
    //            success: function (returnedData) {
    //                callback(returnedData);
    //            }
    //        });
    //    }
    //};

    this.getAllContinousResults = function (callback) {
        {
            $.ajax({
                url: "/App/GetAllCompletedPatternDefaults",
                type: "POST",
                dataType: "text",
                success: function (returnedData) {
                    callback(returnedData);
                }
            });
        }
    };

    this.getUserProfile = function (callback) {
        {
            $.ajax({
                url: "/App/GetUserProfile",
                type: "POST",
                dataType: "text",
                data: { accessToken: $('#a_t').val() },
                success: function (returnedData) {
                    callback(returnedData);
                }
            });
        }
    };

    this.logOff = function () {
        {
            $.ajax({
                url: "/AppInfo/LogOff",
                type: "POST",
                dataType: "text",
                data: { username: $('#u_n').val(), accessToken: $('#a_t').val() },
                success: function (returnedData) {
                    callback(returnedData);
                }
            });
        }
    };

    this.tokenChecker = function (callback) {
        {
            $.ajax({
                url: "/AppInfo/TokenChecker",
                type: "POST",
                dataType: "text",
                data: { accessToken: $('#a_t').val() },
                success: function (returnedData) {
                    callback(returnedData);
                }
            });
        }
    };

    this.getNewToken = function (callback) {
        {
            $.ajax({
                url: "/AppInfo/ObtainNewToken",
                type: "POST",
                dataType: "text",
                data: { username: $('#u_n').val(), password: $('#p_d').val() },
                success: function (returnedData) {
                    callback(returnedData);
                }
            });
        }
    };

    this.registerToken = function (callback) {
        {
            $.ajax({
                url: "/AppInfo/RegisterToken",
                type: "POST",
                dataType: "text",
                data: { username: $('#u_n').val(), accessToken: $('#a_t').val() },
                success: function (returnedData) {
                    callback(returnedData);
                }
            });
        }
    };

    this.unfollowQuery = function (query, callback) {
        {
            $.ajax({
                url: "/App/UnfollowQuery",
                type: "POST",
                dataType: "text",
                data: { query: query, accessToken: hvnme = $('#a_t').val() },
                success: function (returnedData) {
                    callback(returnedData);
                }
            });
        }
    };

    this.followQuery = function (query, callback) {
        {
            $.ajax({
                url: "/App/FollowQuery",
                type: "POST",
                dataType: "text",
                data: { query: query, accessToken: hvnme = $('#a_t').val() },
                success: function (returnedData) {
                    callback(returnedData);
                }
            });
        }
    };

    this.getAllCompletedPatternDefaults = function (callback) {

        $.ajax({
            url: "/TRDemo/GetAllCompletedPatternDefaultsTest",
            type: "POST",
            dataType: "text",
            success: function (callback) {
                callback();
            }
        });

    };

    this.getAnswer = function (query, callback, callbackError) {

        $.ajax({
            url: "/App/GetAnswer",
            type: "POST",
            dataType: "text",
            data: { searchQuery: query, accessToken: $('#a_t').val() },
            success: function (returnedData) {
                callback(returnedData);
            },
            error: function (data) {
                // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
                alert('ajax call  failed');
            }
        })
    };

    this.fetchSymbolData = function (symbolID, timeFrame, callback, callbackError) {

        $.ajax({
            url: "/App/GetSymbolData",
            type: "POST",
            dataType: "text",
            data: { symbolID: symbolID, timeFrame: timeFrame, accessToken: $('#a_t').val() },
            success: function (returnedData) {
                callback(returnedData);
            },
            error: function (data) {
                // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
                alert('ajax call  failed');
            }
        })


    };

}
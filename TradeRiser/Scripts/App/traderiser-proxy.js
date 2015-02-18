
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
                data: { query: query },
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
                data: { query: query },
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
            data: { searchQuery: query },
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

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

    this.unSaveQuery = function (query, callback) {
        {
            $.ajax({
                url: "/App/UnsaveQuery",
                type: "POST",
                dataType: "text",
                data: { query: query, accessToken: hvnme = $('#a_t').val() },
                success: function (returnedData) {
                    callback(returnedData);
                }
            });
        }
    };

    this.saveQuery = function (query, callback) {
        {
            $.ajax({
                url: "/App/SaveQuery",
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


    this.getDataResults = function (selectionID, callback, callbackError) {

        $.ajax({
            url: "/App/GetDataResult",
            type: "POST",
            dataType: "text",
            data: { selectionID: selectionID, accessToken: $('#a_t').val() },
            success: function (returnedData) {
                callback(returnedData);
            },
            error: function (data) {
                // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
                alert('ajax call  failed');
            }
        })
    };


    //this.fetchSymbolData = function (symbolID, timeFrame, callback, callbackError) {

    //    $.ajax({
    //        url: "/App/GetSymbolData",
    //        type: "POST",
    //        dataType: "text",
    //        data: { symbolID: symbolID, timeFrame: timeFrame, accessToken: $('#a_t').val() },
    //        success: function (returnedData) {
    //            callback(returnedData);
    //        },
    //        error: function (data) {
    //            // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
    //            alert('ajax call  failed');
    //        }
    //    })


    //};


    this.testApi = function (symbolID) {
        // url: "http://devapi.traderiser.com/api/UserAuth/Authenticate",

       // var myObject = '{\' UserName: traderiserapp@traderiser.com \}';




        var myObject = { UserName: 'traderiserapp@traderiser.com' };
        var myUrlTemp = "http://localhost:59665/api/Query/GetUserProfile";

        var myUrlTempMM = "http://devapi.traderiser.com/api/Query/GetUserProfile";

        var mySessionUrl = "http://devapi.traderiser.com/api/UserAuth/SessionTokenActive";

        var urloginModel = "http://localhost:59665/api/UserAuth/Authenticate";
        var LoginModel = { UserName: 'traderiserapp@traderiser.com', Password: 'Hydrus!$men1' };


        var myUrlTempAnswer = "http://localhost:59665/api/Query/GetAnswer";

        var queryObj = {
            Username: $('#u_n').val(),
            Query: "EUR/USD price change of at least 20 pips on 5min timeframe"
        };

        var json_text = JSON.stringify(myObject);


        //var urloginModel = "http://devapi.traderiser.com/api/UserAuth/Authenticate";
        //var LoginModel = { UserName: 'traderiserapp@traderiser.com', Password: 'Hydrus!$men1' };


        //$.ajax({
            
        //        beforeSend: function(xhrObj){
        //            xhrObj.setRequestHeader("Content-Type","application/json");
        //            xhrObj.setRequestHeader("Accept", "application/json");
        //            xhrObj.setRequestHeader('Authorization', 'Bearer ' + $('#a_t').val() + ' ');
        //        },
        //    contentType: "application/json",
        //    url: myUrlTempMM,
        //    type: "POST",
        //    dataType: "json",
        //    //data: { UserName: $('#u_n').val() },
        //    data: json_text,
        //    success: function (returnedData) {
        //        alert('Success');
        //    },
        //    error: function (data) {
        //        // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
        //        alert('ajax call  failed');
        //    }
        //})



        $.ajax({

            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Accept", "application/json");
                xhrObj.setRequestHeader('Authorization', 'Bearer ' + $('#a_t').val() + ' ');
            },
            contentType: "application/json",
            url: mySessionUrl,
            type: "GET",          
            success: function (returnedData) {
                alert('Success');
            },
            error: function (data) {
                // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
                alert('ajax call  failed');
            }
        })









    };


}
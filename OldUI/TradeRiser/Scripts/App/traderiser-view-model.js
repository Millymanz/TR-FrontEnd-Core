ko.bindingHandlers.hoverToggle = {
    update: function (element, valueAccessor) {

        $(element).children(":first").hover(
            function () {

                //if (globalSelectedItem != this.id) {
                //    $(this).css("background-color", "#32a4b8");
                //    $(this).css("color", "white");
                //}
                //else {
                //    $(this).css("background-color", "#32a4b8");
                //    $(this).css("color", "white");
                //}

                $(this).css("background-color", "#32a4b8");
                $(this).css("color", "white");

            }, function () {

                if (globalSelectedItem != this.id) {
                    $(this).css("background-color", "white");
                    $(this).css("color", "black");
                }
                else {
                    $(this).css("background-color", "#BFCFD0");
                    $(this).css("color", "black");
                }



                //$(this).css("background-color", "white");
                //$(this).css("color", "black");



            }
        );
    }
};


//Global variable
var globalSelectedItem = "test";

/*
*TradeRiser View Model - Class
*/
function TradeRiserViewModel(tradeRiserProxy) {
    var self = this;
    this.UNDEFINED;
    this.getHours;

    this.getMinutes = "getUTCMinutes";
    this.getHours = "getUTCHours";
    this.getDay = "getUTCDay";
    this.getDate = "getUTCDate";
    this.getMonth = "getUTCMonth";
    this.getFullYear = "getUTCFullYear";
    this.setMinutes;
    this.setHours;
    this.setDate;
    this.setMonth;
    this.setFullYear;


    this.tradeRiserProxy = tradeRiserProxy;
    this.mainQuery = ko.observable();
    this.continuousResults = ko.observableArray();
    this.onDemandResults = ko.observableArray();
    this.historicQueries = ko.observableArray();
    this.queriesSubscription = ko.observableArray();
    this.queriesSaved = ko.observableArray();

    this.paneFixWidth = 0;
    this.graphicalQuery = ko.observable();
    this.graphicalQueryStartPeriod = ko.observable();
    this.graphicalQueryEndPeriod = ko.observable();
    this.symbolQuery = ko.observable();
    this.timeFrameQuery = ko.observable();
    this.chartPadDataIntraday;

    this.chartLookUp = {};

    this.init = function () {
       // tradeRiserProxy.getAllContinousResults(self.initializeAllContinousResultsCards);

        tradeRiserProxy.getUserProfile(self.initializeUserProfileConfigCards);

        self.paneFixWidth = $(".pane").width();

        self.tokenChecker();
    };


    this.fireNotification = function () {






       // $('#reportArea').click(function () {
            var shortCutFunction = $("#toastTypeGroup input:radio:checked").val();
            var msg = $('#message').val();
            var title = $('#title').val() || '';
            var $showDuration = $('#showDuration');
            var $hideDuration = $('#hideDuration');
            var $timeOut = $('#timeOut');
            var $extendedTimeOut = $('#extendedTimeOut');
            var $showEasing = $('#showEasing');
            var $hideEasing = $('#hideEasing');
            var $showMethod = $('#showMethod');
            var $hideMethod = $('#hideMethod');
    
            var addClear = $('#addClear').prop('checked');

            //toastr.options = {
            //    closeButton: $('#closeButton').prop('checked'),
            //    debug: $('#debugInfo').prop('checked'),
            //    newestOnTop: $('#newestOnTop').prop('checked'),
            //    progressBar: $('#progressBar').prop('checked'),
            //    positionClass: $('#positionGroup input:radio:checked').val() || 'toast-top-right',
            //    preventDuplicates: $('#preventDuplicates').prop('checked'),
            //    onclick: null
            //};



            toastr.options = {
                closeButton: true,
                debug: false,
                newestOnTop: true,
                progressBar: true,
                positionClass: "toast-bottom-right",
                preventDuplicates: false,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                timeOut: "5000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            }



            $('#toastrOptions').text('Command: toastr["'
                    + shortCutFunction
                    + '"]("'
                    + msg
                    + (title ? '", "' + title : '')
                    + '")\n\ntoastr.options = '
                    + JSON.stringify(toastr.options, null, 2)
            );

            var $toast = toastr[shortCutFunction](msg, title); // Wire up an event handler to a button in the toast, if it exists
            $toastlast = $toast;

            if (typeof $toast === 'undefined') {
                return;
            }

            if ($toast.find('#okBtn').length) {
                $toast.delegate('#okBtn', 'click', function () {
                    alert('you clicked me. i was toast #' + toastIndex + '. goodbye!');
                    $toast.remove();
                });
            }
            if ($toast.find('#surpriseBtn').length) {
                $toast.delegate('#surpriseBtn', 'click', function () {
                    alert('Surprise! you clicked me. i was toast #' + toastIndex + '. You could perform an action here.');
                });
            }
            if ($toast.find('.clear').length) {
                $toast.delegate('.clear', 'click', function () {
                    toastr.clear($toast, { force: true });
                });
            }
       // });


    };

    this.initialiseUI = function () {
        $("#testIndex").keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {

                self.getAnswer();
                event.preventDefault();
                return false;
            }
        });

        // $('#highlighted').prop('checked',true);
        $("#highlighted").on("change", function (evt) {
            Highcharts.charts[0].highlighted = $('#highlighted').prop('checked');
            Highcharts.charts[0].redraw();
        });


        $(".ancherComplaint").click(function (evt) {
           // evt.stopPropagation();
            alert('1225654');
        });

        $("#autoSuggest").click(function () {

            //the on and off feature has been hacked
            if (document.getElementById('autoSuggestTicker').checked) {
                $("#autoSuggestTicker").prop('checked', false);
            }
            else {
                $("#autoSuggestTicker").prop('checked', true);
            }

        });

        $("#menu-bar-sign-out2").off("click").on("click", function()
        {
            var success = function (result) {
                if (result.success) {
                    // $cardElement.html(result.data.html);
                    //logoff
                   }
                return false;
            };

            var fail = function (data) {
               // corejs.alert("RESOURCE{{corejsmvc.js}:{BusinessCardFailed}:{Failed to get business card HTML.}}", "e");
                return false;
            };

            //corejs.ajax({ url: '', success: success, errorCallback: fail, data: { 'data': JSON.stringify(dataObj) } });

        })


        //function SelectHighlighter(highlightersLength) {
        //    var val = highlightersLength;
        //    var chart = Highcharts.charts[0];

        //    var xtrem = chart.xAxis[0].getExtremes();
        //    var diff = xtrem.userMax - xtrem.userMin;
        //    chart.xAxis[0].setExtremes(
        //      higlighters[val].StartDateTime - diff / 2,
        //      higlighters[val].StartDateTime + diff / 2
        //    );
        //    // var region = chart.highlightedRegions[val].element;
        //    // var pinLeft = ($(region).attr("x") + ($(region).attr("w") / 2) - (chart.pinsConf.width / 2));
        //    // var pinTop = ($(region).attr("y") - chart.pinsConf.height);

        //    for (var i = 0; i < chart.pins.length; i++) {
        //        if (higlighters[val].Comment == chart.pins[i].attr('data-comment')) {
        //            // if (chart.pins[i].attr("left") == pinLeft && chart.pins[i].attr("top") == pinTop)
        //            chart.pins[i].click();
        //        }
        //    }
        //};




    };

    this.initializeAllContinousResultsCards = function (returnedData) {

        var json = returnedData;
        var obj = JSON && JSON.parse(json) || $.parseJSON(json);

        if (obj != null || obj != 'undefined') {

            for (var i = 0; i < obj.ResultSummaries.length; i++) {

                var extraFieldsArray = new Array();

                var tings = "";

                var tings = "";
                var limit = 2;
                if (obj.ResultSummaries[i].KeyResultField.length <= 2) { limit = obj.ResultSummaries[i].KeyResultField.length; }

                for (var n = 0; n < limit; n++) {

                    var str = JSON.stringify(obj.ResultSummaries[i].KeyResultField[n]);
                    var str = str.replace('"', ' ');
                    var resn = str.replace('"', ' ');
                    var resv = resn.replace('}', ' ');
                    var resf = resv.replace('{', ' ');
                    var ress = resf.replace(',', ' ');

                    var tempArray = obj.ResultSummaries[i].KeyResultField[n];

                    var extraFields = [{
                        keyfield: tempArray[0] + ' : ', keydata: tempArray[1]
                    }];

                    tings = extraFields;

                    extraFieldsArray.push(extraFields);
                }


                var resultItem = {
                    SymbolID: obj.ResultSummaries[i].SymbolID,
                    StartDateTime: obj.ResultSummaries[i].StartDateTime,
                    EndDateTime: obj.ResultSummaries[i].EndDateTime,
                    Source: obj.ResultSummaries[i].Source,
                    TimeFrame: obj.ResultSummaries[i].TimeFrame,
                    MoreStandardData: obj.ResultSummaries[i].MoreStandardData,
                    MoreKeyFields: obj.ResultSummaries[i].MoreKeyFields,
                    QueryID: i,
                    SymbolImages: obj.ResultSummaries[i].ImageCollection,

                    ExtraFields: extraFieldsArray
                };

                self.continuousResults.push(resultItem);
            }



        };
    }

    this.initializeUserProfileConfigCards = function (returnedData) {

        var json = returnedData;
        var obj = JSON && JSON.parse(json) || $.parseJSON(json);

        if (obj != null || obj != 'undefined') {

            for (var i = 0; i < obj.UserProfileConfig.Following.length; i++) {

                var queryCard = {
                    QueryID: obj.UserProfileConfig.Following[i].QueryID,
                    Query: obj.UserProfileConfig.Following[i].Query
                }
                self.queriesSubscription.push(queryCard);
            }

            for (var i = 0; i < obj.UserProfileConfig.HistoricQueries.length; i++) {

                var queryCard = {
                    QueryID: obj.UserProfileConfig.HistoricQueries[i].QueryID,
                    Query: obj.UserProfileConfig.HistoricQueries[i].Query
                }
                self.historicQueries.push(queryCard);
            }


            for (var i = 0; i < obj.UserProfileConfig.SavedQueries.length; i++) {

                var queryCard = {
                    QueryID: obj.UserProfileConfig.SavedQueries[i].QueryID,
                    Query: obj.UserProfileConfig.SavedQueries[i].Query
                }
                self.queriesSaved.push(queryCard);
            }

        };

    }

    this.fetch = function () {

        //Temp solution
        var criteria = self.symbolQuery().split(';');

        var timeframe = 'EndOfDay';

        var symbolID = criteria[0];
        if (criteria.length == 2) timeframe = criteria[1].replace(/\s+/g, '');;

        //tradeRiserProxy.fetchSymbolData(symbolID, self.timeFrameQuery(), self.populateChartPad, self.errorResponse);

        //tradeRiserProxy.fetchSymbolData(symbolID, self.timeFrameQuery(), self.populateChartPad, self.errorResponse);
        tradeRiserProxy.testApi(symbolID);


        //tradeRiserProxy.fetchSymbolData(self.symbolQuery(), 'EndOfDay', self.populateChartPad, self.errorResponse);
    }

    this.populateChartPad = function (response) {

        var json = response;
        var data = JSON && JSON.parse(json) || $.parseJSON(json);

        // split the data set into ohlc and volume
        var ohlc = [],
            volume = [],
            dataLength = data.length;

        for (i = 0; i < dataLength; i++) {
            ohlc.push([
                data[i][0], // the date
                data[i][1], // open
                data[i][2], // high
                data[i][3], // low
                data[i][4] // close
            ]);

            volume.push([
                data[i][0], // the date
                data[i][5] // the volume
            ])
        }


        var dateTimeTemp = data[1][0] - data[0][0];

        chartPadDataIntraday = true;
        if (dateTimeTemp >= 86400000) {
            chartPadDataIntraday = false;
        }

        var buttonSetup = { selected: 1 };

        if (chartPadDataIntraday) {
            var buttonsArray = [{
                type: 'hour',
                count: 1,
                text: '1h'
            },
            {
                type: 'hour',
                count: 2,
                text: '2h'
            },
            {
                type: 'hour',
                count: 3,
                text: '3h'
            },
            {
                type: 'day',
                count: 1,
                text: '1D'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }];

            buttonSetup = {
                buttons: buttonsArray,
                selected: 2,
                inputEnabled: false
            }
        }


        // set the allowed units for data grouping
        var groupingUnits = [[
            'week',                         // unit name
            [1]                             // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]];

        //var mainChartItem = {
        //    type: 'candlestick',
        //    name: self.symbolQuery(),
        //    data: ohlc,
        //    dataGrouping: {
        //        units: groupingUnits
        //    }
        //}

        var mainChartItem = [{
            type: 'candlestick',
            name: self.symbolQuery(),
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }
            , {
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }]


        if (chartPadDataIntraday) {
            mainChartItem = [{
                type: 'candlestick',
                name: self.symbolQuery(),
                data: ohlc
            }
             , {
                 type: 'column',
                 name: 'Volume',
                 data: volume,
                 yAxis: 1,
                 dataGrouping: {
                     units: groupingUnits
                 }
             }

            ]
        }





        $('#highStockCustom').chartRegionSelector('StockChart', {

            //rangeSelector: {
            //    selected: 1
            //},
            rangeSelector: buttonSetup,

            title: {
                text: self.symbolQuery(),
            },

            yAxis: [{
                title: {
                    text: 'OHLC'
                },
                // top: 200,
                // left : 3,
                height: 300,
                lineWidth: 2
            }

            ,
            {
                title: {
                    text: 'Volume'
                },
                top: 380,
                height: 50,
                offset: 0,
                lineWidth: 2
            }


            ],

            series: mainChartItem

            //series: [{
            //    type: 'candlestick',
            //    name: self.symbolQuery(),
            //    data: ohlc
            //    ,
            //    dataGrouping: {
            //        units: groupingUnits
            //    }
            //}
            //, {
            //    type: 'column',
            //    name: 'Volume',
            //    data: volume,  
            //    yAxis: 1,
            //    dataGrouping: {
            //        units: groupingUnits
            //    }


            //}      

            //]



        });

    }

    this.logOff = function () {
        tradeRiserProxy.logOff();
    };

    this.tokenChecker = function () {
        setInterval(function () {

            tradeRiserProxy.tokenChecker(function (boolitem) {

                var tokenValid = (boolitem.toLowerCase() === 'true');

                if (tokenValid == false) {
                    // alert("Token Expired!");

                    tradeRiserProxy.getNewToken(function (response) {
                        var json = JSON.parse(response)
                        $('#a_t').val(json.AccessToken);
                    });


                    tradeRiserProxy.registerToken(function (response) {
                        var resgisterationSuccess = (response.toLowerCase() === 'true');

                        if (resgisterationSuccess === true) {
                            console.log('Registeration Success');
                        }
                        else {
                            console.log('Registeration Failed');
                        }

                    });



                }
            });

        }, 60000); //120000 every 2mins
    };

    //this.tokenHandler = function (boolitem) {
    //    if (boolitem) {

    //    }
    //    else {
    //        alert("Token Expired!");
    //    }

    //    //if token expired reconnect
    //    //
    //};

    this.addToQuery = function () {

        //alert(globalGraphicalQueryEndPeriod);

        $("#criteriaDialog").dialog("close");


        self.graphicalQueryStartPeriod(globalGraphicalQueryStartPeriod);
        self.graphicalQueryEndPeriod(globalGraphicalQueryEndPeriod);

        var graphicalQuery = null;

        var tempPeriod = "";

        if (chartPadDataIntraday) {
            var tempPeriod = self.dateFormatting("%Y-%m-%d %H:%M:%S", globalGraphicalQueryStartPeriod) + '  #  ' + self.dateFormatting("%Y-%m-%d %H:%M:%S", globalGraphicalQueryEndPeriod);
        }
        else {
            tempPeriod = self.dateFormatting("%b %e, %Y", globalGraphicalQueryStartPeriod) + '  #  ' + self.dateFormatting("%b %e, %Y", globalGraphicalQueryEndPeriod);
        }

        //var tempPeriod = self.dateFormatting("%Y-%m-%d %H:%M:%S", globalGraphicalQueryStartPeriod) + '  -  ' + self.dateFormatting("%Y-%m-%d %H:%M:%S", globalGraphicalQueryEndPeriod);


        if (self.mainQuery() && self.defined(self.mainQuery())) {
            graphicalQuery = self.mainQuery();
            graphicalQuery += '' + self.symbolQuery() + ' Custom Pattern Period {^' + self.symbolQuery() + '^' + self.timeFrameQuery() + '@' + tempPeriod + '&}';
        }
        else {
            graphicalQuery = ' Custom Pattern Period {^' + self.symbolQuery() + '^' + self.timeFrameQuery() + '@' + tempPeriod + '&}';
        }

        //alert(self.mainQuery());

        //$("#testIndex").css("color", "green");
        //$(".graphicalQueryInput").empty();
        //$("#contenthandle").before('<a href="#" class="btn-chart"><div class="graphicalQueryInput"> Pattern Criteria - ' + graphicalQuery + '</div></a>');

        //// $("#contenthandle").before('<span class="graphicalQueryInput">Graphical Selection....</span>');

        self.mainQuery(graphicalQuery);
    };


    this.selectHighlightItem = function (itemId) {

        //event
        var currentItemId = itemId;

        if (self.selected == "none") {
            self.selected = currentItemId;
            globalSelectedItem = currentItemId;
        }
        else {
            var selectorTemp = "#" + self.selected;

            $(selectorTemp).css("background-color", "white");
            $(selectorTemp).css("color", "black");

            self.selected = currentItemId;
            globalSelectedItem = currentItemId;
        }
        var currentItem = "#" + currentItemId;
        $(currentItem).css("background-color", "#BFCFD0");
        $(currentItem).css("color", "black");

    };

    this.retrieveDataResults = function (resultKey, event) {

        
        //event
        var currentItem = event.currentTarget.children[0];
        self.selectHighlightItem(currentItem.id);

        var loadchart = document.getElementById("loadchartDia");
        if (loadchart !== null || loadchart !== 'defined') {
            loadchart.style.display = 'block';
        }

        $("#resultCanvas").empty();
        $("#summaryResults").empty();

        tradeRiserProxy.getDataResults(currentItem.id, function (dataInterm) {

            loadchart.style.display = 'none';
            var obj = dataInterm;

            if (obj != "") {
                if (obj != null || obj != 'undefined') {
                    var json = dataInterm;
                    var obj = JSON && JSON.parse(json) || $.parseJSON(json);
                    self.displayResult(obj);
                }
            }
        });

        //$.ajax({
        //    url: "/App/GetDataResult",
        //    type: "POST",
        //    dataType: "text",
        //    data: { selectionID: currentItem.id, accessToken: $('#a_t').val() },
        //    success: function (dataInterm) {
        //        try {
        //            loadchart.style.display = 'none';
        //            var obj = dataInterm;

        //            if (obj != "") {
        //                if (obj != null || obj != 'undefined') {

        //                    var json = dataInterm;
        //                    var obj = JSON && JSON.parse(json) || $.parseJSON(json);

        //                    //DisplayResult(obj);
        //                    self.displayResult(obj);
        //                }
        //            }
        //        }
        //        catch (error) {
        //            alert(error);
        //        }
        //    },
        //    error: function (dataInterm) {
        //        // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
        //        alert('ajax call  failed');
        //    }
        //})













    };

    this.updateMainQuery = function (query) {
        self.mainQuery(query.Query);
        self.getAnswer();
    }

    this.getAnswer = function () {

        if (self.mainQuery() != "") {
            if (self.mainQuery() !== null && self.mainQuery() !== 'undefined') {

                var loadchart = document.getElementById("loadchartDia");
                if (loadchart !== null || loadchart !== 'defined') {
                    loadchart.style.display = 'block';
                }

                //clear url variable if it has unrequired url parameters
                //window.location.href = window.location.href.split('?')[0];
                var arraySplit = window.location.href.split('?');
                if (arraySplit.length > 1) {
                    window.history.pushState("ClearingUrl", "ClearingUrl", window.location.href.split('?')[0]);
                }

                //this is redundant QueryID is never required by the ui
                var r = (12 + Math.random() * 16) % 16 | 0;

                var queryCard = {
                    QueryID: 'tempId-' + r.toString(),
                    Query: self.mainQuery()
                }


                self.historicQueries.unshift(queryCard);

                $("#resultCanvas").empty();
                $("#summaryResults").empty();

                for (var g = 0; g < Highcharts.charts.length; g++) {
                    if (Highcharts.charts[g] != null && Highcharts.charts[g] !== undefined) {
                        Highcharts.charts[g].destroy();
                    }
                }

                self.onDemandResults([]);

                var displayError = document.getElementById("noresults");
                displayError.style.display = 'none';


                tradeRiserProxy.getAnswer(self.mainQuery(), self.renderQueryResults, self.errorResponse);
            }
        }
    };

    this.selected = "none";
    this.toolBarShow = true;
    this.toolBarMessage = ko.observable("<< Show Toolbar");

    this.toolBottomBarShow = true;
    this.toolBottomBarMessage = ko.observable("<< Hide Answer Toolbar >>");



    this.toggle = function () {
        self.selected(!self.selected());
    };

    this.variableCleanUp = function (variable) {

        var str = JSON.stringify(variable);
        var str = str.replace('"', ' ');
        var resn = str.replace('"', ' ');
        var resv = resn.replace('}', ' ');
        var resf = resv.replace('{', ' ');
        var ress = resf.replace(',', ' ');

        return ress;
    };

    this.toolBar = function (returnedData) {
        if (self.toolBarShow) {
            self.toolBarMessage("<< Hide Toolbar");
            self.toolBarShow = false;
        }
        else {
            self.toolBarMessage("<< Show Toolbar");
            self.toolBarShow = true;
        }
    }

    this.toolBottomBar = function (returnedData) {
        if (self.toolBottomBarShow) {
            //self.toolBottomBarMessage("<< Hide Answer Toolbar");
            self.toolBottomBarShow = false;
        }
        else {
           // self.toolBottomBarMessage("<< Show Answer Toolbar");
            self.toolBottomBarShow = true;
        }
    }

    this.renderQueryResults = function (returnedData) {

        try {
            var loadchart = document.getElementById("loadchartDia");
            if (loadchart != null || loadchart != 'defined') {
                loadchart.style.display = 'none';
            }

            var json = returnedData;
            var obj = JSON && JSON.parse(json) || $.parseJSON(json);

            if (obj !== "") {
                if (obj !== null) {

                    var assetClassName = obj.ResultSummaries[0].SymbolID;

                    for (var i = 0; i < obj.ResultSummaries.length; i++) {

                        var extraFieldsArray = new Array();

                        var tings = "";
                        var limit = 2;
                        if (obj.ResultSummaries[i].KeyResultField.length <= 2) { limit = obj.ResultSummaries[i].KeyResultField.length; }

                        //for (var n = 0; n < obj.ResultSummaries[i].KeyResultField.length; n++) {
                        for (var n = 0; n < limit; n++) {

                            var str = JSON.stringify(obj.ResultSummaries[i].KeyResultField[n]);
                            var str = str.replace('"', ' ');
                            var resn = str.replace('"', ' ');
                            var resv = resn.replace('}', ' ');
                            var resf = resv.replace('{', ' ');
                            var ress = resf.replace(',', ' ');

                            var tempArray = obj.ResultSummaries[i].KeyResultField[n];

                            var extraFields = [{
                                keyfield: tempArray[0] + ' : ', keydata: tempArray[1]
                            }];

                            tings = extraFields;

                            extraFieldsArray.push(extraFields);
                        }

                        var resultItem = {
                            SymbolID: obj.ResultSummaries[i].SymbolID,
                            StartDateTime: obj.ResultSummaries[i].StartDateTime,
                            EndDateTime: obj.ResultSummaries[i].EndDateTime,
                            Source: obj.ResultSummaries[i].Source,
                            TimeFrame: obj.ResultSummaries[i].TimeFrame,
                            MoreStandardData: obj.ResultSummaries[i].MoreStandardData,
                            MoreKeyFields: obj.ResultSummaries[i].MoreKeyFields,
                            QueryID: obj.ResultSummaries[i].QueryID,
                            SymbolImages: obj.ResultSummaries[i].ImageCollection,
                            ExtraFields: extraFieldsArray
                        };

                        self.onDemandResults.push(resultItem);

                        if (i == 0) {
                            self.selectHighlightItem(resultItem.QueryID);
                        }
                    }
                    self.displayResult(obj);
                }
                else {
                    var displayError = document.getElementById("noresults");
                    displayError.style.display = 'block';
                }
            }
            else {
                var displayError = document.getElementById("noresults");
                displayError.style.display = 'block';
            }
        }
        catch (ex) {
            var displayError = document.getElementById("noresults");
            displayError.style.display = 'block';
            alert(ex);
        }

    };

    this.errorResponse = function () {

    };

    this.defined = function (obj) {
        return obj !== self.UNDEFINED && obj !== null;
    };

    this.fireAlert = function () {
        alert('I have been clicked') 
    };


    this.displayToastrNotification = function (resultItem) {

        var shortCutFunction = "info";

      //  var msg = "How many times did the eurusd touch the upper Bollinger band in the 1min timeframe and the last time that the RSI, in the 1min timeframe was overbought in real time";
        // var title = "Answer Update";

        var title = "Update To Query Answer";
        var msg = resultItem.Query;

        var queryPassIn = { QueryID: resultItem.QueryID, Query: resultItem.Query }

        toastr.options = {
            closeButton: true,
            debug: false,
            newestOnTop: true,
            progressBar: true,
            positionClass: "toast-bottom-right",
            preventDuplicates: false,
            //onclick: self.updateMainQuery(msg),
            onclick: function () { self.updateMainQuery(queryPassIn) },
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "15000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        }

        //toastr.options.onclick = function () { self.fireAlert() };

        $('#toastrOptions').text('Command: toastr["'
                + shortCutFunction
                + '"]("'
                + msg
                + (title ? '", "' + title : '')
                + '")\n\ntoastr.options = '
                + JSON.stringify(toastr.options, null, 2)
        );

        var $toast = toastr[shortCutFunction](msg, title); // Wire up an event handler to a button in the toast, if it exists
        $toastlast = $toast;
    };

    this.upDateContinousQueryResult = function (latestResultCard) {

        //var loadchart = document.getElementById("loadchartDia");
        //if (loadchart != null || loadchart != 'defined') {
        //    loadchart.style.display = 'block';
        //}



        //this should be done on the server side
        var imageArray = new Array();
        if (latestResultCard.Source == "Forex") {
            var symItemArr = latestResultCard.SymbolID.split('/');

            for (var q = 0; q < symItemArr.length; q++) {
                var path = '../../Images/flagcurrencies/' + symItemArr[q] + '.png';
                imageArray.push(path);
            }
        }
        //-----------------------------------------------//


        var tings = "";
        var extraFieldsArray = new Array();

        for (var n = 0; n < latestResultCard.KeyResultField.length; n++) {
            var str = JSON.stringify(latestResultCard.KeyResultField[n]);
            var str = str.replace('"', ' ');
            var resn = str.replace('"', ' ');
            var resv = resn.replace('}', ' ');
            var resf = resv.replace('{', ' ');
            var ress = resf.replace(',', ' ');
            var tempArray = latestResultCard.KeyResultField[n];

            var extraFields = [{
                keyfield: tempArray[0] + ' : ', keydata: tempArray[1]
            }];
            tings = extraFields;
            extraFieldsArray.push(extraFields);
        }

        var resultItem = {
            Query: latestResultCard.Query,
            SymbolID: latestResultCard.SymbolID,
            StartDateTime: latestResultCard.StartDateTime,
            EndDateTime: latestResultCard.EndDateTime,
            Source: latestResultCard.Source,
            TimeFrame: latestResultCard.TimeFrame,
            MoreStandardData: latestResultCard.MoreStandardData,
            MoreKeyFields: latestResultCard.MoreKeyFields,
            QueryID: latestResultCard.QueryID,
            //SymbolImages: imageArray,
            SymbolImages: latestResultCard.ImageCollection,
            ExtraFields: extraFieldsArray


            /*,
            ExtraFields: extraFieldsArray*/
        };

        if (self.continuousResults().length > 0) {
            var hjj = self.continuousResults()[0];
            var ghgh = hjj;
        }

        var removalList = [];
        for (var d = 0; d < self.continuousResults().length; d++) {

            if (self.continuousResults()[d].QueryID == resultItem.QueryID) {
                removalList.push(d);
            }
        }

        for (var i = 0; i < removalList.length; i++) {
            self.continuousResults.splice(removalList[i], 1);
        }



        self.continuousResults.unshift(resultItem);

        self.displayToastrNotification(resultItem);


        //setTimeout(function () {
        //    if (loadchart != null || loadchart != 'defined') {
        //        loadchart.style.display = 'none';
        //    }
        //}, 3000);


       


    };

    self.pick = function () {
        var args = arguments,
            i,
            arg,
            length = args.length;
        for (i = 0; i < length; i++) {
            arg = args[i];
            if (typeof arg !== 'undefined' && arg !== null) {
                return arg;
            }
        }
    };

    this.pad = function (number, length) {
        // Create an array of the remaining length +1 and join it with 0's
        return new Array((length || 2) + 1 - String(number).length).join(0) + number;
    };

    this.defaultOptions = {
        colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970',
            '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
        symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
        lang: {
            loading: 'Loading...',
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                    'August', 'September', 'October', 'November', 'December'],
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            decimalPoint: '.',
            numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'], // SI prefixes used in axis labels
            resetZoom: 'Reset zoom',
            resetZoomTitle: 'Reset zoom level 1:1',
            thousandsSep: ','
        }
    };

    this.extend = function (a, b) {
        var n;
        if (!a) {
            a = {};
        }
        for (n in b) {
            a[n] = b[n];
        }
        return a;
    };

    this.dateFormatting = function (format, timestamp, capitalize) {
        if (!self.defined(timestamp) || isNaN(timestamp)) {
            return 'Invalid date';
        }
        format = self.pick(format, '%Y-%m-%d %H:%M:%S');

        var date = new Date(timestamp),
            key, // used in for constuct below
            // get the basic time values
            hours = date[self.getHours](),
            day = date[self.getDay](),
            dayOfMonth = date[self.getDate](),
            month = date[self.getMonth](),
            fullYear = date[self.getFullYear](),
            lang = self.defaultOptions.lang,
            langWeekdays = lang.weekdays,

            // List all format keys. Custom formats can be added from the outside. 
            replacements = self.extend({

                // Day
                'a': langWeekdays[day].substr(0, 3), // Short weekday, like 'Mon'
                'A': langWeekdays[day], // Long weekday, like 'Monday'
                'd': self.pad(dayOfMonth), // Two digit day of the month, 01 to 31
                'e': dayOfMonth, // Day of the month, 1 through 31

                // Week (none implemented)
                //'W': weekNumber(),

                // Month
                'b': lang.shortMonths[month], // Short month, like 'Jan'
                'B': lang.months[month], // Long month, like 'January'
                'm': self.pad(month + 1), // Two digit month number, 01 through 12

                // Year
                'y': fullYear.toString().substr(2, 2), // Two digits year, like 09 for 2009
                'Y': fullYear, // Four digits year, like 2009

                // Time
                'H': self.pad(hours), // Two digits hours in 24h format, 00 through 23
                'I': self.pad((hours % 12) || 12), // Two digits hours in 12h format, 00 through 11
                'l': (hours % 12) || 12, // Hours in 12h format, 1 through 12
                'M': self.pad(date[self.getMinutes]()), // Two digits minutes, 00 through 59
                'p': hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
                'P': hours < 12 ? 'am' : 'pm', // Lower case AM or PM
                'S': self.pad(date.getSeconds()), // Two digits seconds, 00 through  59
                'L': self.pad(Math.round(timestamp % 1000), 3) // Milliseconds (naming from Ruby)
            }, ChartRegionSelector.dateFormats);


        // do the replaces
        for (key in replacements) {
            while (format.indexOf('%' + key) !== -1) { // regex would do it in one line, but this is faster
                format = format.replace('%' + key, typeof replacements[key] === 'function' ? replacements[key](timestamp) : replacements[key]);
            }
        }

        // Optionally capitalize the string and return
        return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
    };

    this.unFollowQuery = function (item) {

        self.tradeRiserProxy.unfollowQuery(item.Query, function () {
            var i = self.queriesSubscription().filter(function (elem) {
                return elem.QueryID === item.QueryID;
            })[0];
            self.queriesSubscription.remove(i);
        });
    };

    this.followQuery = function (item) {

        self.tradeRiserProxy.followQuery(item.Query, function () {

            self.queriesSubscription.unshift(item);
        });
    };


    this.unSaveQuery = function (item) {

        self.tradeRiserProxy.unSaveQuery(item.Query, function () {
            var i = self.queriesSaved().filter(function (elem) {
                return elem.QueryID === item.QueryID;
            })[0];
            self.queriesSaved.remove(i);
        });
    };

    this.saveQuery = function (item) {

        self.tradeRiserProxy.saveQuery(item.Query, function () {

            self.queriesSaved.unshift(item);
        });
    };

    this.valueNotAvailableChecker = function (value) {

        if (value == -999999.9999) {
            return '-';
        }
        return value;
    };

    this.displayResult = function (obj) {
        //Change complex json to visuals
        //assuming chart for now
        //parse json object    
        //var currentWidth = $("#resultCanvas").width();
        $("#resultCanvas").empty();

       // $(".pane").width(self.paneFixWidth);

        var resultsData = new ResultsData();

        var arraySeries = [];
        var overlayArray = [];
        var trendsOverlayArray = [];
        var highlighterArray = [];
        var yAxisArray = []; //has to be double quotes
        var groupingUnits = [];


        var presentationTypeCount = obj.CurrentResult.PresentationTypes.length;

        if (presentationTypeCount > 0) {

            $("#resultCanvas").append($('<table id="tableCanvas" width="100%" cellpadding="15" cellspacing="1" border="1" style="border-color:#E0E0E0;"></table>'));

            //$("#resultCanvas").append($('<br/>'
            //                   + '<table id="tableCanvas" width="100%" cellpadding="15" cellspacing="1" border="1" style="border-color:#E0E0E0;"></table>'));

        }

        var rawDataResults = obj.CurrentResult.RawDataResults;

        var selectChartKey = '';

        var iterRow = 0;
        var iter = 0;

       
        //Main widget
        try {
            for (var pp = 0; pp < presentationTypeCount; pp++, iterRow++) {

                var json = rawDataResults[pp].ChartReadyDataResults;
                var dataLookUp = self.createLookUp(json, obj.CurrentResult.PresentationTypes[pp].SubWidgets);
                var mulitipleWidgetLookUp = self.createMulitipleWidgetsLookUp(json);

                //var extIndicatorLookUp = self.createExternalIndicatorLookUp(json);
                var extIndicatorLookUp = self.createExternalIndicatorLookUpNew(obj.CurrentResult.PresentationTypes[pp].SubWidgets);

                var extIndicatorLookUpNamesOnly = self.externalIndicatorNameOnly(obj.CurrentResult.PresentationTypes[pp].SubWidgets);

                var uniqueLookUpCount = self.createStartingValueLookUp(obj.CurrentResult.PresentationTypes[pp].SubWidgets);

                switch (obj.CurrentResult.PresentationTypes[pp].MainWidget) {
                    case 'SpecialTable':
                        {
                            var correlTabStr = '<table width=80% cellpadding="12" cellspacing="12" border="1" style="border-color:#E0E0E0; "><tr style="border-color:#E0E0E0;"><td></td>';
                            var tempStr = '';

                            var lineSeriesOptions = [],
                               symbolNames = [],
                               chartData = [];
                            var keySymbol = obj.CurrentResult.ResultSymbols[0][0];
                            var keyColumn = 0;

                            for (var bb = 0; bb < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length; bb++) {
                             
                                for (var vv = 0; vv < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders.length; vv++) {

                                    correlTabStr += '<td>' + obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders[vv] + '</td>';

                                    if (keySymbol == obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders[vv])
                                    {
                                        keyColumn = vv;
                                    }
                                  }
                                  correlTabStr += '</tr>';


                               var cellLength = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders.length;
                                   
                                var rowHeader = 0;
                                for (var ss = 0; ss < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value.length; ss++) {//column
                                
                                    var counts = 0;                                   

                                    for (var vv = 0; vv < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[ss].length; vv++) {//row

                                        if (vv == 0) {
                                            tempStr += '<tr><td>' + obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].RowHeaders[rowHeader] + '</td>';
                                            symbolNames.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].RowHeaders[rowHeader]);
                                        }

                                        if (keyColumn == ss) //column
                                        {
                                            chartData.push(self.valueNotAvailableChecker(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[ss][vv]));
                                        }

                                        tempStr += '<td>' + self.valueNotAvailableChecker(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[ss][vv]) + '</td>';
                                      
                                    }
                                    tempStr += '</tr>';
                                    rowHeader++;
                                }
                            }



                            var final = "<td valign='top'><div> Correlation Matrix <br/><br/>" + correlTabStr + tempStr + "</div></td>";


                            var width = '40%';
                            var height = '70%';
                          
                            var title = 'Correlation Analysis';
                            var chartClassName = "columnChart";

                            var markupFinal = "<div class='widgetTitle'>" + title + "</div><br/><br/>"
                                + "<table cellpadding='15' cellspacing='15'><tr><td>"
                                + "<div class='"
                                + chartClassName + "' style='height: " + height + "; width:" + width + "'><div class='" + chartClassName + "' style='height: " + height + "; width:" + width + "'></div></div>"
                                + "</td>"
                                + final
                                + "</tr></table>";


                            $("#tableCanvas").append($("<tr><td colspan='2' style='top:0px' width='100%' id=celln" + pp + " valign='top'>" + markupFinal + "</td></tr>"));


                            $(chartClassName).highcharts({
                                chart: {
                                    type: 'column'
                                },
                                title: {
                                    text: 'Correlation ' + keySymbol
                                },
                                xAxis: {
                                    categories: symbolNames
                                },
                                credits: {
                                    enabled: false
                                },
                                series: [{
                                    /*name: 'John',*/
                                    data : chartData

                                    //data: [5, 3, 4, -7, -2, 8, 4]
                                }]
                            });


                            self.initalizeSubWidgets(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);



                        } break;

                    

                    case 'Basics':
                        {
                            var correlTabStr = '<table width=80% cellpadding="12" cellspacing="12" border="1" style="border-color:#E0E0E0; "><tr style="border-color:#E0E0E0;"><td></td>';
                            var tempStr = '';

                            var lineSeriesOptions = [],
                               symbolNames = [],
                               chartData = [];
                            var keySymbol = obj.CurrentResult.ResultSymbols[0][0];
                            var keyColumn = 0;

                            var firstTable = '';
                            var secondTable = '';

                            var firstTableHeadings = '';
                            var secondTableHeadings = '';

                            var changeIndex = 0;
                            var percentageChangeIndex = 0;

                            //first table
                            for (var bb = 0; bb < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length; bb++) {

                                for (var vv = 0; vv < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders.length; vv++) {

                                    correlTabStr += '<td>' + obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders[vv] + '</td>';

                                    if (keySymbol == obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders[vv]) {
                                        keyColumn = vv;
                                    }
                                }
                                correlTabStr += '</tr>';

                           

                                var colLength = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders.length;
                                var rowLength = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].RowHeaders.length;

                                if (colLength == 0) {
                                    
                                    tempStr += '<tr><td></td>';
                                    for (var gen = 0; gen < symbolNames.length; gen++) {
                                        tempStr += '<td>' + symbolNames[gen] + '</td>';
                                    }
                                    tempStr += '</tr>';


                                    colLength = 2;

                                    for (var row = 0; row < rowLength; row++) {//row

                                        var counts = 0;
                                        var currentLength = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr.length;

                                        for (var col = 0; col < currentLength; col++) {//column

                                            if (col == 0) {
                                                tempStr += '<tr><td>' + obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].RowHeaders[row] + '</td>';
                                                
                                                if (obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].RowHeaders[row] == 'Change') {
                                                     changeIndex = row;                                                  
                                                }

                                                if (obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].RowHeaders[row] == 'Percentage Change From Previous Close') {
                                                    percentageChangeIndex = row;
                                                }
                                            }

                                            if (keyColumn == col) {
                                                chartData.push(self.valueNotAvailableChecker(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[col][row]));
                                            }

                                            tempStr += '<td>' + self.valueNotAvailableChecker(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[col][row]) + '</td>';
                                        }
                                        tempStr += '</tr>';
                                    }

                                    if (bb == 1) {
                                        secondTableHeadings = correlTabStr;
                                        secondTable = "<br/><table width=80% cellpadding='12' cellspacing='12' border='1' style='border-color:#E0E0E0; '>" + tempStr + "</table>";
                                        tempStr = '';
                                        correlTabStr = '';
                                    }

                                }
                                else {
                                    for (var row = 0; row < rowLength; row++) {//row

                                        var counts = 0;

                                        for (var col = 0; col < colLength; col++) {//column

                                            if (col == 0) {
                                                tempStr += '<tr><td>' + obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].RowHeaders[row] + '</td>';
                                                symbolNames.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].RowHeaders[row]);
                                            }

                                            if (keyColumn == col) {
                                                chartData.push(self.valueNotAvailableChecker(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[row][col]));
                                            }

                                            tempStr += '<td>' + self.valueNotAvailableChecker(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[row][col]) + '</td>';
                                        }
                                        tempStr += '</tr>';
                                    }


                                    if (bb == 0) {
                                        firstTableHeadings = correlTabStr;
                                        firstTable = tempStr + '</table>';
                                        tempStr = '';
                                        correlTabStr = '';
                                    }
                                }
                            }



                            var final = "<td valign='top'><div> Trade Data <br/><br/>" + firstTableHeadings + firstTable
                                + "<br/><br/>"
                                + "Fundamentals and Other Facts"
                                + "<br/>"
                                + secondTable
                                + "</div></td>";









                            var width = '40%';
                            var height = '70%';

                            var title = symbolNames.length > 1 ? 'Comparison' : symbolNames[0];
                            var extraTitle = '';

                            if (symbolNames.length > 1) {
                                title = 'Comparison';
                            }
                            else {
                                title = symbolNames[0];

                                if (obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[1].GenericStr[0][changeIndex] < 0) {
                                    var triangle = "<table><tr><td><div style='width: 0;height: 0;"
                                        + "border-left: 10px solid transparent;border-right: 10px solid transparent; border-top: 20px solid red;'></div></td>";

                                    extraTitle += triangle + "<td><div style='color:red'>" + 
                                        obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[1].GenericStr[0][changeIndex] + " "
                                         + obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[1].GenericStr[0][percentageChangeIndex] + "%"
                                        +"</div></td></tr></table>";
                                }
                                else 
                                {
                                    var triangle = "<table><tr><td><div style='width: 0;height: 0;"
                                        + "border-left: 10px solid transparent;border-right: 10px solid transparent; border-bottom: 20px solid green;'></div></td>";

                                    extraTitle += triangle + "<td><div style='color:green'>" +
                                         obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[1].GenericStr[0][changeIndex] + " "
                                         + obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[1].GenericStr[0][percentageChangeIndex] + "%"
                                          + "</div></td></tr></table>";
                                }
                            }

                            var chartClassName = "linesChart";
                         
                            var markupFinal = "<div class='widgetTitle'>" + title + extraTitle + "</div><br/><br/>"
                            + "<table cellpadding='15' cellspacing='15'><tr><td valign='top'>"
                                + "<div style='height: " + height + "; width:" + width + "'><div class='comparisonChart' style='height: " + height + "; width:" + width + "'></div></div>"
                                + "</td>"
                                + final
                                + "</tr></table>";


                            $("#tableCanvas").append($("<tr><td colspan='2' style='top:0px' width='100%' id=celln" + pp + " valign='top'>" + markupFinal + "</td></tr>"));


                            var lengthCount = symbolNames.length;

                            if (lineSeriesOptions != null || lineSeriesOptions !== undefined) {
                                var buttonSetup = { selected: 4 };
                                for (var c = 0; c < lengthCount; c++) {
                                    var dataKey = "RAW_COMPARISON" + "_" + symbolNames[c];
                                    dataResults = dataLookUp[dataKey];

                                    if (dataResults != null || dataResults !== undefined) {

                                        var lineSeriesData = [];
                                        workingKey = dataKey;

                                        dataLength = dataResults.length;

                                        for (i = 0; i < dataLength; i++) {
                                            lineSeriesData.push([
                                                dataResults[i][0], // the date
                                                dataResults[i][4] // the volume
                                            ])
                                        }


                                        if (symbolNames.length == 1) {

                                            lineSeriesOptions[c] = {
                                                type: 'area',
                                                name: symbolNames[c],
                                                data: lineSeriesData
                                            }
                                        }
                                        else {
                                            lineSeriesOptions[c] = {                                              
                                                name: symbolNames[c],
                                                data: lineSeriesData
                                            }
                                        }


                                    }//new
                                }//for loop end



                                //if (symbolNames.length == 1) {

                                    $('.comparisonChart').highcharts('StockChart', {
                                        chart: {
                                        },
                                        credits: {
                                            enabled: false
                                        },
                                        rangeSelector: buttonSetup,
                                        xAxis: {
                                            type: 'datetime'
                                        },
                                        yAxis: {                                         
                                        },
                                        legend: {
                                            enabled: false
                                        },
                                        plotOptions: {
                                            area: {
                                                fillColor: {
                                                    linearGradient: {
                                                        x1: 0,
                                                        y1: 0,
                                                        x2: 0,
                                                        y2: 1
                                                    },
                                                    stops: [
                                                        [0, Highcharts.getOptions().colors[0]],
                                                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                                    ]
                                                },
                                                marker: {
                                                    radius: 2
                                                },
                                                lineWidth: 1,
                                                states: {
                                                    hover: {
                                                        lineWidth: 1
                                                    }
                                                },
                                                threshold: null
                                            }
                                        },
                                        tooltip: {
                                            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                                            valueDecimals: 2
                                        },
                                        series: lineSeriesOptions
                                    });
                        
                            }
                            self.initalizeSubWidgets(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);

                        } break;

                    case 'SideBarChart':
                        {
                            self.widgetPlacerT(pp, presentationTypeCount, 'Statistical Analysis', '500px', 'sideBarChart', iter);


                            var lengthCount = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length;

                            var lineSeriesOptions = [],
                                symbolNames = [],
                                chartData = [];
                            var tempSeries = [];

                            var xAxis = "";
                            var yAxis = "";
                            var title = "";

                            for (var bb = 0; bb < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length; bb++) {
                                for (var ss = 0; ss < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr.length; ss++) {

                                    for (var cc = 0; cc < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[ss].length; cc++) {

                                        if (ss == 0) {
                                            symbolNames.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[0][cc]);

                                            xAxis = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Xaxis;
                                            yAxis = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Yaxis;
                                            title = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Title;

                                        }
                                        else {
                                            var timeFrameGroupedData = {
                                                name: obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[ss][cc],
                                                data: []
                                            };
                                            tempSeries.push(timeFrameGroupedData);

                                        }
                                    }
                                }
                            }


                            for (var bb = 0; bb < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length; bb++) {
                                chartData = [];

                                for (var ss = 0; ss < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value.length; ss++) {
                                    chartData = []
                                    for (var vv = 0; vv < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[ss].length; vv++) {

                                        chartData.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[ss][vv]);
                                    }
                                    tempSeries[ss].data = chartData;
                                }
                            }

                            $('.sideBarChart').highcharts({
                                chart: {
                                    type: 'bar'
                                },
                                title: {
                                    text: title
                                },
                                xAxis: {
                                    categories: symbolNames,
                                    title: {
                                        text: null
                                    }
                                },
                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: yAxis,
                                        align: 'high'
                                    },
                                    labels: {
                                        overflow: 'justify'
                                    }
                                },
                                tooltip: {
                                    valueSuffix: ' ' + yAxis
                                },
                                plotOptions: {
                                    bar: {
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                },
                                legend: {
                                    layout: 'vertical',
                                    align: 'right',
                                    verticalAlign: 'top',
                                    x: -40,
                                    y: 80,
                                    floating: true,
                                    borderWidth: 1,
                                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                                    shadow: true
                                },
                                credits: {
                                    enabled: false
                                },

                                series: tempSeries
                            });

                            self.initalizeSubWidgets(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);

                        } break;

                    case 'ColumnChart':
                        {
                            self.widgetPlacerT(pp, presentationTypeCount, 'Statistical Analysis', '500px', 'columnChart', iter);

                            var lengthCount = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length;

                            var lineSeriesOptions = [],
                                symbolNames = [],
                                chartData = [];

                            var xAxis = "";
                            var yAxis = "";
                            var title = "";



                            for (var bb = 0; bb < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length; bb++) {
                                //symbolNames.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[0][bb]);

                                for (var ss = 0; ss < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[0].length; ss++) {
                                    symbolNames.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[0][ss]);

                                    xAxis = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Xaxis;
                                    yAxis = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Yaxis;
                                    title = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Title;

                                }


                            }


                            for (var bb = 0; bb < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length; bb++) {
                                for (var ss = 0; ss < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0].length; ss++) {
                                    chartData.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0][ss]);
                                }
                            }




                            $('.columnChart').highcharts({
                                chart: {
                                    type: 'column'
                                },
                                title: {
                                    text: title
                                },
                                yAxis: {
                                    title: {
                                        text: yAxis
                                    }

                                },
                                xAxis: {
                                    categories: symbolNames
                                    //categories: ['EURUSD', 'NZDUSD', 'USDCAD', 'GBPUSD', 'AUDUSD', 'USDJPY', 'USDCHF']
                                },
                                credits: {
                                    enabled: false
                                },
                                series: [{
                                    colorByPoint: true,
                                    data: chartData,
                                    name: 'Currency'
                                }]
                            });
                            self.initalizeSubWidgets(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);

                        } break;

                    case 'MultipleAxisChart':
                        {
                            //loop for every event


                            var chartData = [];
                            var classname = 'columnChart' + pp;
                            self.widgetPlacerT(pp, presentationTypeCount, 'Statistical Analysis', '400px', classname, iter);


                            var firstplotTitle = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[0].Title;
                            var priceActionTitle = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[0].Xaxis;
                            var eventTypeTitle = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[0].Yaxis;

                            var xAxisContent = [];
                            for (var bb = 0; bb < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length; bb++) {

                                var lengthCount = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length;

                                //title = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Title;


                                var lineSeriesData = [];
                                var lineSeriesDataRaw = [];
                                for (var ss = 0; ss < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0].length; ss++) {

                                    if (bb == 0) {
                                        xAxisContent.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[0][ss]);
                                    }

                                    var value = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[1][ss];
                                    var rawValue = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[2][ss];

                                    //var datetimes = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0][ss];
                                    //var datetimes = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].GenericStr[0][ss];

                                    if (obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Key != 'RAW') {
                                        lineSeriesData.push([xAxisContent[ss], value]);
                                        lineSeriesDataRaw.push([xAxisContent[ss], rawValue]);

                                        //datetimes = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0][ss];
                                        //value = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[1][ss];
                                    }

                                }

                                if (obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Key != 'RAW') {
                                    chartData.push({
                                        name: bb + "df",
                                        type: 'spline',
                                        yAxis: bb,
                                        data: lineSeriesData
                                    });

                                    chartData.push({
                                        name: obj.CurrentResult.ResultSymbols[pp][bb],
                                        type: 'spline',
                                        yAxis: chartData.length,
                                        data: lineSeriesDataRaw
                                    });
                                }
                            }


                            var masterxAxisContent = [];
                            for (var ss = 0; ss < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[1].GenericStr[0].length; ss++) {
                                masterxAxisContent.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[1].GenericStr[0][ss]);
                            }





                            $('.' + classname).highcharts({
                                credits: {
                                    enabled: false
                                },
                                chart: {
                                    zoomType: 'xy'
                                },
                                title: {
                                    text: firstplotTitle
                                },
                                subtitle: {
                                    text: 'Correlation Check'
                                },
                                xAxis: [{
                                    categories: xAxisContent,   //xAxisContent
                                    crosshair: true
                                }],
                                yAxis: [{ // Primary yAxis
                                //    labels: {
                                //        format: '{value} price',
                                //        style: {
                                //            color: 'black'
                                //        }
                                //    },
                                //    title: {
                                //        text: 'Temperature',
                                //        style: {
                                //            color: 'black'
                                //        }
                                //    },
                                //    opposite: true

                                //}, { // Secondary yAxis
                                    gridLineWidth: 2,
                                    title: {
                                        text: eventTypeTitle,
                                        style: {
                                            color: Highcharts.getOptions().colors[0]
                                        }
                                    },
                                    labels: {
                                        format: '{value}',
                                        style: {
                                            color: Highcharts.getOptions().colors[0]
                                        }
                                    },

                                    opposite: true

                                }


                                 , { // Tertiary yAxis
                                    gridLineWidth: 2,
                                    title: {
                                        text: priceActionTitle,
                                        style: {
                                            color: Highcharts.getOptions().colors[1]
                                        }
                                    },
                                    labels: {
                                        format: '{value} mb',
                                        style: {
                                            color: Highcharts.getOptions().colors[1]
                                        }
                                    }
                                     //,
                                   // opposite: true
                                }



                                //, { // Tertiary yAxis
                                //    gridLineWidth: 0,
                                //    title: {
                                //        text: 'Sea-Level Pressure',
                                //        style: {
                                //            color: Highcharts.getOptions().colors[1]
                                //        }
                                //    },
                                //    labels: {
                                //        format: '{value} mb',
                                //        style: {
                                //            color: Highcharts.getOptions().colors[1]
                                //        }
                                //    },
                                //    opposite: true
                                //}

                                ],
                                tooltip: {
                                    shared: true
                                },
                                legend: {
                                    layout: 'vertical',
                                    align: 'left',
                                    x: 80,
                                    verticalAlign: 'top',
                                    y: 55,
                                    floating: true,
                                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                                },
                                series: chartData


                                //    [{
                                //    name: 'Rainfall',
                                //    type: 'column',
                                //    yAxis: 1,
                                //    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                                //    tooltip: {
                                //        valueSuffix: ' mm'
                                //    }

                                //}, {
                                //    name: 'Sea-Level Pressure',
                                //    type: 'spline',
                                //    yAxis: 2,
                                //    data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
                                //    marker: {
                                //        enabled: false
                                //    },
                                //    dashStyle: 'shortdot',
                                //    tooltip: {
                                //        valueSuffix: ' mb'
                                //    }

                                //}, {
                                //    name: 'Temperature',
                                //    type: 'spline',
                                //    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                                //    tooltip: {
                                //        valueSuffix: ' °C'
                                //    }
                                //}]
                            });

                            self.initalizeSubWidgets(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);




                            /****************************************************************/

                            arraySeries = []; //test
                            overlayArray = [];
                            highlighterArray = [];
                            yAxisArray = []; //has to be double quotes


                            var chartClassName = 'chartspace dialogchart' + pp;

                            //function to confirm number of indicators involved
                            //var candlestickHeight = '610px';
                            var candlestickHeight = '650px';

                            switch (extIndicatorLookUp.length) {
                                case 2: { candlestickHeight = '740px' } break;
                                case 3: { candlestickHeight = '920px' } break;
                                case 4: { candlestickHeight = '1040px' } break;
                            }

                            self.widgetPlacerT(pp, presentationTypeCount, 'Technical Analysis', candlestickHeight, chartClassName, iter);

                            var dataResultsT = dataLookUp["RAW"];
                            if (dataResultsT != null || dataResultsT !== undefined) {

                                var lineSeriesOptions = [],
                                    symbolNames = [];

                                var ohlc_CandleStick = [], volume_CandleStick = [];

                                for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[pp].length; bb++) {
                                    symbolNames.push(obj.CurrentResult.ResultSymbols[pp][bb]);
                                }

                                var c = 0;
                                var dataLength = dataResultsT.length;

                                if (dataLength > 0) {

                                    var dateTimeTemp = dataResultsT[1][0] - dataResultsT[0][0];

                                    var bIntradayChart = true;

                                    if (dateTimeTemp >= 86400000) {
                                        bIntradayChart = false;
                                    }


                                    for (i = 0; i < dataLength; i++) {
                                        ohlc_CandleStick.push([
                                            dataResultsT[i][0], // the date
                                            dataResultsT[i][1], // open
                                            dataResultsT[i][2], // high
                                            dataResultsT[i][3], // low
                                            dataResultsT[i][4] // close
                                        ]);

                                        volume_CandleStick.push([
                                            dataResultsT[i][0], // the date
                                            dataResultsT[i][5] // the volume
                                        ])
                                    }
                                }


                                var mainChartItem = {
                                    type: 'candlestick',
                                    name: symbolNames[0],
                                    data: ohlc_CandleStick,
                                    yAxis: 0,
                                    dataGrouping: {
                                        units: groupingUnits
                                    }
                                }

                                if (bIntradayChart) {
                                    mainChartItem = {
                                        type: 'candlestick',
                                        name: symbolNames[0],
                                        data: ohlc_CandleStick,
                                        yAxis: 0
                                    }
                                }
                                arraySeries.push(mainChartItem);

                                for (var hl = 0; hl < rawDataResults[pp].HighLightRegion.length; hl++) {

                                    rawDataResults[pp].HighLightRegion[hl].Comment.split("**");

                                    var ffaxisIndex = rawDataResults[pp].HighLightRegion[hl].AxisIndex;
                                    var fhgseriesIndex = rawDataResults[pp].HighLightRegion[hl].SeriesIndex;

                                    var highlighterItem = {
                                        colour: rawDataResults[pp].HighLightRegion[hl].Colour,
                                        axisIndex: rawDataResults[pp].HighLightRegion[hl].AxisIndex,
                                        seriesIndex: rawDataResults[pp].HighLightRegion[hl].SeriesIndex,
                                        startDate: rawDataResults[pp].HighLightRegion[hl].StartDateTime,
                                        endDate: rawDataResults[pp].HighLightRegion[hl].EndDateTime,
                                        speechBubbleHtml: rawDataResults[pp].HighLightRegion[hl].Comment
                                    }
                                    highlighterArray.push(highlighterItem);
                                }

                                var chartItemDef = {
                                    title: {
                                        text: 'OHLC'
                                    },
                                    height: 310,
                                    lineWidth: 2
                                };

                                yAxisArray.push(chartItemDef);

                                presentationTypeIndex = pp;
                                // var highId = Highcharts.charts[Highcharts.charts.length - 1].container.id;

                                self.initalizeSubWidgets(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);

                                SelectMiniChart(presentationTypeIndex, obj, highlighterArray, dataLookUp, arraySeries, overlayArray, yAxisArray, trendsOverlayArray);
                                self.initialiseDynaTable(highlighterArray);

                                //Insert into Title area
                                if (highlighterArray.length > 0) {

                                    var highId = Highcharts.charts[Highcharts.charts.length - 1].container.id;

                                    $("#highlightControl" + pp).append($("<label>HighLighters : </label><input type='checkbox' checked id='highlightControlCheckBoxSplit" + highId + "'>"));

                                    //$("#highlightControl" + pp).append($("<label>HighLighters : </label><input type='checkbox' checked id='highlightControlCheckBoxSplit" + highId + "'>&nbsp&nbsp<button id='viewMoreSplit" + highId + "'>View More</button>"));

                                    $("#highlightControlCheckBoxSplit" + highId).bind("change", function (e) {

                                        var splitArrayTxt = e.target.id.split('Split');
                                        var clikedItemId = splitArrayTxt[1];

                                        for (var g = 0; g < Highcharts.charts.length; g++) {

                                            if (typeof Highcharts.charts[g] !== 'undefined') {
                                                if (Highcharts.charts[g].container.id == clikedItemId) {

                                                    Highcharts.charts[g].pointFormat = '<span style="color:{series.color};white-space:nowrap"> \u25CF{series.name}: <b>{point.y}</b></span>';

                                                    Highcharts.charts[g].tooltip.positioner = function () {
                                                        return {
                                                            x: 20,
                                                            y: 80
                                                        };
                                                    }

                                                    Highcharts.charts[g].highlighted = $("#highlightControlCheckBoxSplit" + clikedItemId).prop('checked');
                                                    Highcharts.charts[g].redraw();


                                                }
                                            }
                                        }
                                    })



                                }




                            }









                            /****************************************************************/


                        } break;


                    case 'RawEconomic':
                        {                           
                            //loop for every event


                            var markup = "<div class='widgettitle'>" + obj.currentresult.resultsymbols[pp] + " - economic indicators</div><br/>";
                            markup += "<table class='simpleeconomictable' style='width:100%'><thead><tr><th>" + obj.currentresult.resultsymbols[pp] + "</th>"
                           + "<th>actual</th>"
                           + "<th>release date</thh>"
                           + "<th>previous</th>"
                           + "<th>unit</th>";
                            markup += "</tr></thead>";

                            

                            //for table display only
                            for (var bb = 0; bb < obj.currentresult.rawdataresults[pp].chartreadydataresults.length; bb++) {
                                markup += "<tr>";
                                markup += "<td>" + obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].title + "</td>";
                                    
                               var lastindex = obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].value[0].length - 1;
                               markup += "<td>" + obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].value[0][lastindex] + "</td>";
                               markup += "<td>" + obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].genericstr[0][lastindex] + "</td>";
                               markup += "<td>" + obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].value[0][lastindex] + "</td>" //use value[1]
                               markup += "<td>usd billion</td>" //use value[2] //unit
                               markup += "</tr>";
                            }
                            
                            markup += "</table>";
                            markup += "<br/></div>";                          


                            $("#tablecanvas").append($("<tr><td colspan='2' style='top:0px' width='100%' valign='top'>" + markup + "</td></tr>"));




                            for (var bb = 0; bb < obj.currentresult.rawdataresults[pp].chartreadydataresults.length; bb++) {
                                var classname = 'columnchart' + bb;

                                var lengthcount = obj.currentresult.rawdataresults[pp].chartreadydataresults.length;

                                self.widgetplacertsidebyside(bb, lengthcount, '', '300px', classname, iter);


                                var lineseriesoptions = [],
                                    symbolnames = [],
                                    chartdata = [];

                                var xaxis = "";
                                var yaxis = "";
                                var title = "";


                                for (var ss = 0; ss < obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].genericstr[0].length; ss++) {
                                    symbolnames.push(obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].genericstr[0][ss]);

                                    xaxis = obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].xaxis;
                                    yaxis = obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].yaxis;
                                    title = obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].title;
                                }

                                for (var ss = 0; ss < obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].value[0].length; ss++) {
                                    chartdata.push(obj.currentresult.rawdataresults[pp].chartreadydataresults[bb].value[0][ss]);
                                }
                                var colornameset = 'red';
                                
                                switch (bb)
                                {
                                    case 0: { colornameset = '#7cb5ec'; } break;
                                    case 1: { colornameset = '#ffbf00'; } break;
                                    case 2: { colornameset = '#e50000'; } break;
                                    case 3: { colornameset = 'black'; } break;
                                    case 4: { colornameset = '#db843d'; } break;
                                    case 5: { colornameset = '#006600'; } break;
                                }

                                $('.' + classname).highcharts({
                                    chart: {
                                        type: 'column'
                                    },
                                    title: {
                                        text: title
                                    },
                                    yaxis: {
                                        title: {
                                            text: yaxis
                                        }

                                    },
                                    xaxis: {
                                        categories: symbolnames
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    colors: [colornameset],
                                    series: [{
                                        colorbypoint: false,
                                        data: chartdata,
                                        name: title
                                    }]
                                });
                            }
                            self.initalizesubwidgets(obj.currentresult.presentationtypes[pp], pp, obj, datalookup, arrayseries, overlayarray, groupingunits, yaxisarray, iter, extindicatorlookup, mulitiplewidgetlookup, trendsoverlayarray, uniquelookupcount, extindicatorlookupnamesonly);


                        } break;

                    case 'GeneralLinesChart':
                        {
                            //loop for every event

                            var chartData = [];
                            var classname = 'columnChart' + pp;
                            self.widgetPlacerT(pp, presentationTypeCount, 'Statistical Analysis', '400px', classname, iter);

                            var xAxisContent = [];
                            for (var bb = 0; bb < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length; bb++) {

                                var lengthCount = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length;

                                title = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Title;


                                var lineSeriesData = [];
                                for (var ss = 0; ss < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0].length; ss++) {

                                    if (bb == 0) {
                                        xAxisContent.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0][ss]);
                                    }

                                    var value = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[1][ss];

                                    if (bb == 1) {
                                        value = value + 15;
                                    }

                                    lineSeriesData.push([obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0][ss],
                                        value]);
                                }

                                chartData.push({
                                    name: bb + "df",
                                    data: lineSeriesData
                                });



                            }

                            var colorNameSet = '#ffbf00';

                            switch (bb) {
                                case 0: { colorNameSet = '#7cb5ec'; } break;
                                case 1: { colorNameSet = '#ffbf00'; } break;
                                case 2: { colorNameSet = '#e50000'; } break;
                                case 3: { colorNameSet = 'black'; } break;
                                case 4: { colorNameSet = '#DB843D'; } break;
                                case 5: { colorNameSet = '#006600'; } break;
                            }
                            var buttonSetup = { selected: 4 };

                            $('.' + classname).highcharts('StockChart', {
                                chart: {
                                },
                                credits: {
                                    enabled: false
                                },
                                rangeSelector: buttonSetup,
                                xAxis: {
                                    type: 'datetime'
                                },
                                yAxis: {
                                },
                                legend: {
                                    enabled: false
                                },
                                plotOptions: {
                                    area: {
                                        fillColor: {
                                            linearGradient: {
                                                x1: 0,
                                                y1: 0,
                                                x2: 0,
                                                y2: 1
                                            },
                                            stops: [
                                                [0, Highcharts.getOptions().colors[0]],
                                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                            ]
                                        },
                                        marker: {
                                            radius: 2
                                        },
                                        lineWidth: 1,
                                        states: {
                                            hover: {
                                                lineWidth: 1
                                            }
                                        },
                                        threshold: null
                                    }
                                },
                                tooltip: {
                                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                                    valueDecimals: 2
                                },
                                series: chartData
                            });

                            self.initalizeSubWidgets(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);

                        } break;

                    case 'IndicatorComparison':
                        {
                            //loop for every event
                                                    
                            var chartData = [];
                            var classname = 'columnChart' + pp;
                            self.widgetPlacerT(pp, presentationTypeCount, 'Statistical Analysis', '400px', classname, iter);

                            var xAxisContent = [];
                            for (var bb = 0; bb < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length; bb++) {                               

                                var lengthCount = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length;

                                title = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Title;


                                var lineSeriesData = [];
                                    for (var ss = 0; ss < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0].length; ss++) {

                                        if (bb == 0) {
                                            xAxisContent.push(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0][ss]);
                                        }

                                        var value = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[1][ss];

                                        if (bb == 1) {
                                            value = value + 15;
                                        }

                                        lineSeriesData.push([obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[0][ss],
                                            value]);
                                    }

                                    chartData.push({
                                        name: bb + "df",
                                        data: lineSeriesData
                                    });



                            }

                            var colorNameSet = '#ffbf00';

                                switch (bb) {
                                    case 0: { colorNameSet = '#7cb5ec'; } break;
                                    case 1: { colorNameSet = '#ffbf00'; } break;
                                    case 2: { colorNameSet = '#e50000'; } break;
                                    case 3: { colorNameSet = 'black'; } break;
                                    case 4: { colorNameSet = '#DB843D'; } break;
                                    case 5: { colorNameSet = '#006600'; } break;
                                }
                                var buttonSetup = { selected: 4 };

                                $('.' + classname).highcharts('StockChart', {
                                    chart: {
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    rangeSelector: buttonSetup,
                                    xAxis: {
                                        type: 'datetime'
                                    },
                                    yAxis: {
                                    },
                                    legend: {
                                        enabled: false
                                    },
                                    plotOptions: {
                                        area: {
                                            fillColor: {
                                                linearGradient: {
                                                    x1: 0,
                                                    y1: 0,
                                                    x2: 0,
                                                    y2: 1
                                                },
                                                stops: [
                                                    [0, Highcharts.getOptions().colors[0]],
                                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                                ]
                                            },
                                            marker: {
                                                radius: 2
                                            },
                                            lineWidth: 1,
                                            states: {
                                                hover: {
                                                    lineWidth: 1
                                                }
                                            },
                                            threshold: null
                                        }
                                    },
                                    tooltip: {
                                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                                        valueDecimals: 2
                                    },
                                    series: chartData
                                });

                            self.initalizeSubWidgets(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);

                        } break;

                    case 'LineSeriesChart':
                        {
                            self.widgetPlacerT(pp, presentationTypeCount, 'Correlation Analysis', '500px', 'correlationChart', iter);

                            var lengthCount = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length;

                            var lineSeriesOptions = [],
                                symbolNames = [];

                            for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[pp].length; bb++) {
                                symbolNames.push(obj.CurrentResult.ResultSymbols[pp][bb]);
                            }

                            var workingKey = "";

                            for (var c = 0; c < lengthCount; c++) {
                                var dataKey = "RAW_COMPARISON" + "_" + symbolNames[c];
                                dataResults = dataLookUp[dataKey];

                                if (dataResults != null || dataResults !== undefined) {

                                    var lineSeriesData = [];
                                    workingKey = dataKey;

                                    dataLength = dataResults.length;

                                    for (i = 0; i < dataLength; i++) {
                                        lineSeriesData.push([
                                            dataResults[i][0], // the date
                                            dataResults[i][4] // the volume
                                        ])
                                    }

                                    lineSeriesOptions[c] = {
                                        name: symbolNames[c],
                                        data: lineSeriesData
                                    }
                                }//new
                            }//for loop end


                            //var dateTimeTemp = dataResults[1][0] - dataResults[0][0];

                            if (lineSeriesOptions != null || lineSeriesOptions !== undefined) {

                                dataResults = dataLookUp[workingKey];

                                //var dateTimeTemp = lineSeriesOptions[1]["data"][0] - lineSeriesOptions[0]["data"][0];
                                var dateTimeTemp = dataResults[1][0] - dataResults[0][0];

                                var bIntradayChart = true;

                                if (dateTimeTemp >= 86400000) {
                                    bIntradayChart = false;
                                }

                                var buttonSetup = { selected: 4 };

                                if (bIntradayChart) {
                                    var buttonsArray = [{
                                        type: 'hour',
                                        count: 1,
                                        text: '1h'
                                    },
                                    {
                                        type: 'hour',
                                        count: 2,
                                        text: '2h'
                                    },
                                    {
                                        type: 'hour',
                                        count: 3,
                                        text: '3h'
                                    },
                                    {
                                        type: 'day',
                                        count: 1,
                                        text: '1D'
                                    }, {
                                        type: 'all',
                                        count: 1,
                                        text: 'All'
                                    }];

                                    buttonSetup = {
                                        buttons: buttonsArray,
                                        selected: 2,
                                        inputEnabled: false
                                    }
                                }


                                $('.correlationChart').highcharts('StockChart', {
                                    chart: {
                                    },
                                    rangeSelector: buttonSetup,
                                    yAxis: {
                                        labels: {
                                            formatter: function () {
                                                return (this.value > 0 ? '+' : '') + this.value + '%';
                                            }
                                        },
                                        plotLines: [{
                                            value: 0,
                                            width: 2,
                                            color: 'silver'
                                        }]
                                    },
                                    plotOptions: {
                                        series: {
                                            compare: 'percent'
                                        }
                                    },
                                    tooltip: {
                                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                                        valueDecimals: 2
                                    },
                                    series: lineSeriesOptions
                                });
                            }
                            self.initalizeSubWidgets(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);

                        } break;

                    case 'CandleStickChart':
                        {
                            arraySeries = []; //test
                            overlayArray = [];
                            highlighterArray = [];
                            yAxisArray = []; //has to be double quotes


                            var chartClassName = 'chartspace dialogchart' + pp;

                            //function to confirm number of indicators involved
                            //var candlestickHeight = '610px';
                            var candlestickHeight = '650px';

                            switch (extIndicatorLookUp.length) {
                                case 2: { candlestickHeight = '740px' } break;
                                case 3: { candlestickHeight = '920px' } break;
                                case 4: { candlestickHeight = '1040px' } break;
                            }

                            self.widgetPlacerT(pp, presentationTypeCount, 'Technical Analysis', candlestickHeight, chartClassName, iter);

                            var dataResultsT = dataLookUp["RAW"];
                            if (dataResultsT != null || dataResultsT !== undefined) {

                                var lineSeriesOptions = [],
                                    symbolNames = [];

                                var ohlc_CandleStick = [], volume_CandleStick = [];

                                for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[pp].length; bb++) {
                                    symbolNames.push(obj.CurrentResult.ResultSymbols[pp][bb]);
                                }

                                var c = 0;
                                var dataLength = dataResultsT.length;

                                if (dataLength > 0) {

                                    var dateTimeTemp = dataResultsT[1][0] - dataResultsT[0][0];

                                    var bIntradayChart = true;

                                    if (dateTimeTemp >= 86400000) {
                                        bIntradayChart = false;
                                    }


                                    for (i = 0; i < dataLength; i++) {
                                        ohlc_CandleStick.push([
                                            dataResultsT[i][0], // the date
                                            dataResultsT[i][1], // open
                                            dataResultsT[i][2], // high
                                            dataResultsT[i][3], // low
                                            dataResultsT[i][4] // close
                                        ]);

                                        volume_CandleStick.push([
                                            dataResultsT[i][0], // the date
                                            dataResultsT[i][5] // the volume
                                        ])
                                    }
                                }


                                var mainChartItem = {
                                    type: 'candlestick',
                                    name: symbolNames[0],
                                    data: ohlc_CandleStick,
                                    yAxis: 0,
                                    dataGrouping: {
                                        units: groupingUnits
                                    }
                                }

                                if (bIntradayChart) {
                                    mainChartItem = {
                                        type: 'candlestick',
                                        name: symbolNames[0],
                                        data: ohlc_CandleStick,
                                        yAxis: 0
                                    }
                                }
                                arraySeries.push(mainChartItem);
                             
                                for (var hl = 0; hl < rawDataResults[pp].HighLightRegion.length; hl++) {

                                    rawDataResults[pp].HighLightRegion[hl].Comment.split("**");

                                    var ffaxisIndex = rawDataResults[pp].HighLightRegion[hl].AxisIndex;
                                    var fhgseriesIndex = rawDataResults[pp].HighLightRegion[hl].SeriesIndex;

                                    var highlighterItem = {
                                        colour: rawDataResults[pp].HighLightRegion[hl].Colour,
                                        axisIndex: rawDataResults[pp].HighLightRegion[hl].AxisIndex,
                                        seriesIndex: rawDataResults[pp].HighLightRegion[hl].SeriesIndex,
                                        startDate: rawDataResults[pp].HighLightRegion[hl].StartDateTime,
                                        endDate: rawDataResults[pp].HighLightRegion[hl].EndDateTime,
                                        speechBubbleHtml: rawDataResults[pp].HighLightRegion[hl].Comment
                                    }
                                    highlighterArray.push(highlighterItem);
                                }

                                var chartItemDef = {
                                    title: {
                                        text: 'OHLC'
                                    },
                                    height: 310,
                                    lineWidth: 2
                                };

                                yAxisArray.push(chartItemDef);

                                presentationTypeIndex = pp;
                                // var highId = Highcharts.charts[Highcharts.charts.length - 1].container.id;

                                self.initalizeSubWidgets(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);

                                SelectMiniChart(presentationTypeIndex, obj, highlighterArray, dataLookUp, arraySeries, overlayArray, yAxisArray, trendsOverlayArray);
                                self.initialiseDynaTable(highlighterArray);

                                //Insert into Title area
                                if (highlighterArray.length > 0) {

                                    var highId = Highcharts.charts[Highcharts.charts.length - 1].container.id;

                                    $("#highlightControl" + pp).append($("<label>HighLighters : </label><input type='checkbox' checked id='highlightControlCheckBoxSplit" + highId + "'>"));

                                    //$("#highlightControl" + pp).append($("<label>HighLighters : </label><input type='checkbox' checked id='highlightControlCheckBoxSplit" + highId + "'>&nbsp&nbsp<button id='viewMoreSplit" + highId + "'>View More</button>"));

                                    $("#highlightControlCheckBoxSplit" + highId).bind("change", function (e) {

                                        var splitArrayTxt = e.target.id.split('Split');
                                        var clikedItemId = splitArrayTxt[1];

                                        for (var g = 0; g < Highcharts.charts.length; g++) {

                                            if (typeof Highcharts.charts[g] !== 'undefined') {
                                                if (Highcharts.charts[g].container.id == clikedItemId) {

                                                    Highcharts.charts[g].pointFormat = '<span style="color:{series.color};white-space:nowrap"> \u25CF{series.name}: <b>{point.y}</b></span>';

                                                    Highcharts.charts[g].tooltip.positioner = function () {
                                                        return {
                                                            x: 20,
                                                            y: 80
                                                        };
                                                    }

                                                    Highcharts.charts[g].highlighted = $("#highlightControlCheckBoxSplit" + clikedItemId).prop('checked');
                                                    Highcharts.charts[g].redraw();


                                                }
                                            }
                                        }
                                    })



                                }




                            }

                        } break;
                }

                if (iterRow == 2) {
                    iterRow = 0;
                    iter++;
                }
            }

            //performance stats
            self.LoadPerformanceStatistics(obj);


            //disclaimer
            $("#resultCanvas").append($('<br/><br/><div id="riskDisclaimer"><h2>Risk Disclaimer</h2><p>Please acknowledge the following: <br/>The Charts are provided'
              + '" as is", without warranty or guarantee of any kind, including but not limited to the warranties of merchantability and fitness for a particular purpose.'
              + 'In no event shall TradeRiser Limited and its affiliates or any third party contributor be liable for any claim, damages or other liability, whether in an '
              + 'action of contract, tort or otherwise, arising from, out of or in connection with the use of or other dealings in the Charts. The Charts run on pricing '
              + 'data provided by us to a third party charting administrator. You accept that the price data displayed in the Charts may be delayed and that we do not '
              + 'guarantee the accuracy or completeness of the data and that we do not guarantee that the service will be uninterrupted.</p><p>'
              + '<h4>Disclaimer</h4>The TradeRiser service includes analysis '
              + 'of financial instruments. There are potential risks relating to investing and trading. You must be aware of such risks and familiarize yourself in regard '
              + 'to such risks and to seek independent advice relating thereto. You should not trade with money that you cannot afford to lose. The TradeRiser service and'
              + 'its content should not be construed as a solicitation to invest and/or trade. You should seek independent advice in this regard. Past performance is not'
              + 'indicative of future performance. No representation is being made that any results discussed within the service and its related media content will be achieved.'
              + 'TradeRiser, TradeRiser Limited, their members, shareholders, employees, agents, representatives and resellers do not warrant the completeness, accuracy or timeliness'
              + 'of the information supplied, and they shall not be liable for any loss or damages, consequential or otherwise, which may arise from the use or reliance of the'
              + 'TradeRiser service and its content.</p></div>'));



        }
        catch (err) {
            alert(err);
        }
    };

    this.initialiseDynaTable = function (highlighterArray) {

        var currenthighChartsId = Highcharts.charts[Highcharts.charts.length - 1].container.id;

        self.chartLookUp[currenthighChartsId] = highlighterArray;

        var allElements = $('.genericResultsTable');

        for (var j = 0; j < allElements.length; j++) {
            var idSelect = allElements[j].id;

            $('#' + idSelect).dynatable({
                table: {
                    defaultColumnIdStyle: 'trimDash'
                },
                features: {
                    paginate: true,
                    search: false,
                    recordCount: true,
                    perPageSelect: false
                },
                writers: {
                    _rowWriter: myRowWriter
                }
            }).bind('dynatable:afterProcess', addClickEvent);
        }

        addClickEvent();

        function addClickEvent() {
            $('#' + idSelect).find("tr").on("click", function (evt, x) {

                var higlighters = self.chartLookUp[currenthighChartsId];
                var incrementVal = 0;
                var idx;
                var indexId = this.getAttribute('data-index');
                $.each(higlighters, function (item, index) {
                    if (item == indexId) {
                        //idx = index;
                        idx = incrementVal;
                    }
                    incrementVal++;
                });


                SelectHighlighter(idx, currenthighChartsId, self.chartLookUp);

                //SelectHighlighter(this.getAttribute('data-index'), currenthighChartsId, self.chartLookUp);
            });
        }
    };

    this.LoadPerformanceStatistics = function (obj) {

        var presentationTypeCount = obj.CurrentResult.PresentationTypes.length;

        for (var pp = 0; pp < presentationTypeCount; pp++) {

            if (obj.CurrentResult.RawDataResults[pp].PerformanceStatistics.length > 0) {
                $("#resultCanvas").append($("<div id='performanceStats'><h2>Performance Statistics</h2><a class='naviPos' href='#performStatsButton'>Top</a>"));

                //$("#resultCanvas").append($("<div class ='performanceStatsNote'>*Below are listed table(s) of performance statistics which predominantly shows the pattern recoginition rate and this tells you how reliable the recognition is for the symbol."
                //    + "<br/>The percentage value gains more significance and value over time as the number of patterns found increases.</div>"));


                $("#resultCanvas").append($("<div class ='performanceStatsNote'>" + obj.CurrentResult.RawDataResults[pp].PerformanceStatistics[0].Description + "</div>"));



                break;
            }
        }


        for (var pp = 0; pp < presentationTypeCount; pp++) {

            //header management
            for (var mm = 0; mm < obj.CurrentResult.RawDataResults[pp].PerformanceStatistics.length; mm++) {

                var tableId = "performanceStatsTable" + mm;

                $("#resultCanvas").append($("<table class= 'performanceStatsTable' id = " + tableId + " border='1'><tr></tr></table>"));

                for (var tt = 0; tt < obj.CurrentResult.RawDataResults[pp].PerformanceStatistics[mm].Headers.length; tt++) {

                    $('#' + tableId + ' > tbody > tr').append("<td class='performanceStatsHeaderCells' id=pshcelln" + tt + " valign='top'>"
                        + obj.CurrentResult.RawDataResults[pp].PerformanceStatistics[mm].Headers[tt] + "</td>");

                }


                //Stats body
                for (var tt = 0; tt < obj.CurrentResult.RawDataResults[pp].PerformanceStatistics[mm].StatsLog.length; tt++) {

                    var createdTemp = "rown" + tt;
                    var createdId = "id=" + createdTemp;

                    $('#' + tableId).append("<tr " + createdId + "></tr>");


                    for (var rr = 0; rr < obj.CurrentResult.RawDataResults[pp].PerformanceStatistics[mm].StatsLog[tt].length; rr++) {

                        $('#' + tableId + ' > tbody > #' + createdTemp).append("<td class='performanceStatsCells' id=pscelln" + tt + " valign='top'>"
                            + obj.CurrentResult.RawDataResults[pp].PerformanceStatistics[mm].StatsLog[tt][rr] + "</td>");
                    }
                }


            }
        }
    };

    this.widgetPlacer = function (index, total, markup) {

        var remaining = total - index;
        var remainder = index % 2;

        var nthPos = index;

        var width = '50%';
        if (remaining == 1) {
            width = '100%';
        }


        if (index == 0) {
            if (remaining > 1) {
                $("#tableCanvas").append($("<tr><td style='top:0px' width='50%' id=celln" + index + " >" + markup + "</td></tr>"));
            }
            else {
                $("#tableCanvas").append($("<tr><td style='top:0px' width='100%' id=celln" + index + " >" + markup + "</td></tr>"));
            }
        }
        else {
            if (remaining > 1) {
                $("<td style='top:0px' id=celln" + index + " width='100%'>" + markup + "</td>").appendTo($("#tableCanvas tr:nth-child(" + nthPos + ")"));
            }
            else {
                $("<td style='top:0px' id=celln" + index + " width='50%'>" + markup + "</td>").appendTo($("#tableCanvas tr:nth-child(" + nthPos + ")"));
            }
        }
    };

    //this.highLightersHandling = function (index, total, title, height, chartClassName, iter) {

    //    $("#highlighted").on("change", function (evt) {
    //        Highcharts.charts[0].highlighted = $('#highlighted').prop('checked');
    //        Highcharts.charts[0].redraw();
    //    });
    //};

    this.tabularClick = function (clickindex) {
        SelectHighlighter(clickindex);
    };

    this.widgetPlacerWidth = function (index, total, title, height, width, chartClassName, iter) {

        var remaining = total - index;
        var remainder = index % 2;

        var nthPos = 0;

        //var preferredWidth = $('#pane').width() * 0.90;
        //width = preferredWidth + 'px';

        var markup = "<div class='widgetTitle'>" + title + "</div><br/><br/> <div id='highlightControl" + index + "'></div><div class='" + chartClassName + "' style='height: " + height + "; width:" + width + "'></div>";

        $("#tableCanvas").append($("<tr><td colspan='2' style='top:0px' width='100%' id=celln" + index + " valign='top'>" + markup + "</td></tr>"));

    };

    this.widgetPlacerSimple = function (index, total, title, height, chartClassName, iter) {

        var remaining = total - index;
        var remainder = index % 2;

        var nthPos = 0;

        var width = '100%';

        var preferredWidth = $('#pane').width() * 0.40;
        width = preferredWidth + 'px';

        //var markup = "<table class='simpleEconomicTable'><thead><tr><td>Japan</td>"
        //+ "<td>Actual</td>"
        //+ "<td>Release Date Time</td>"
        //+ "<td>Previous</td>"
        // + "<td>Unit</td>";
        //markup += "</tr></thead>";
        //markup += "<tr><td>GDP Growth</td><td>-0.3</td><td>March 29/5/2016</td><td>0.8</td><td>USD Billion</td></tr>";
        //markup += "<tr><td>GDP Growth</td><td>-0.3</td><td>March 29/5/2016</td><td>0.8</td><td>USD Billion</td></tr>";
        //markup += "<tr><td>GDP Growth</td><td>-0.3</td><td>March 29/5/2016</td><td>0.8</td><td>USD Billion</td></tr>";
        //markup += "<tr><td>GDP Growth</td><td>-0.3</td><td>March 29/5/2016</td><td>0.8</td><td>USD Billion</td></tr>";
        //markup += "</table>";
        //markup += "<br/><br/>";
        //markup += "<br/></div><div class='" + chartClassName + "' style='height: " + height + "; width:" + width + "'></div>";

        var markup = "<div class='widgetTitle'>" + title + "</div><br/><br/> <div id='highlightControl" + index + "'></div><div class='" + chartClassName + "' style='height: " + height + "; width:" + width + "'></div>";

        $("#tableCanvas").append($("<tr><td colspan='2' style='top:0px' width='100%' id=celln" + index + " valign='top'>" + markup + "</td></tr>"));

    };


    this.widgetPlacerT = function (index, total, title, height, chartClassName, iter) {

        var remaining = total - index;
        var remainder = index % 2;

        var nthPos = 0;

        var width = '100%';
        //if (remainder == 0 && remaining > 1) {
        //    //width = '50%';
        //    width = '700px';
        //}

        var preferredWidth = $('#pane').width() * 0.90;
        width = preferredWidth + 'px';

      

        var markup = "<div class='widgetTitle'>" + title + "</div><br/><br/> <div id='highlightControl" + index + "'></div><div class='" + chartClassName + "' style='height: " + height + "; width:" + width + "'></div>";


        //var markup = "<div class='widgetTitle'>" + title + "</div><br/><br/> <div id='highlightControl" + index + "'></div><div id='container' style='height: 400px; min-width: 310px; max-width: 800px; margin: 0 auto'></div>";


        $("#tableCanvas").append($("<tr><td colspan='2' style='top:0px' width='100%' id=celln" + index + " valign='top'>" + markup + "</td></tr>"));







    };

    this.widgetPlacerAlt = function (index, total, title, height, chartClassName, iter, markup) {

        var remaining = total - index;
        var remainder = index % 2;

        var nthPos = 0;

        var width = '100%';
        var preferredWidth = $('#pane').width() * 0.90;
        width = preferredWidth + 'px';


        var markupFinal = "<div class='widgetTitle'>" + title + "</div><br/><br/> <div id='highlightControl" + index + "'></div><div class='" + chartClassName + "' style='height: " + height + "; width:" + width + "'>"+ markup +"</div>";


        $("#tableCanvas").append($("<tr><td colspan='2' style='top:0px' width='100%' id=celln" + index + " valign='top'>" + markupFinal + "</td></tr>"));

    };


    this.widgetPlacerTSideBySide = function (index, total, title, height, chartClassName, iter) {

        var remaining = total - index;
        var remainder = index % 2;

        // var nthPos = index;
        //var nthPos = iter;

        var nthPos = 0;

        //var width = '50%';
        //if (remaining == 1) {
        //    width = '100%';
        //}

        var width = '100%';
        if (remainder == 0 && remaining > 1) {
            //width = '50%';
            width = '700px';
        }

        //var markup = "<div class='widgetTitle'>" + title + "</div><br/><br/><div class='" + chartClassName + "' style='height: " + height + "'></div>";

        var markup = "<div class='widgetTitle'>" + title + "</div><br/><br/><div class='" + chartClassName + "' style='height: " + height + "; width:" + width + "'></div>"; //*
        // var markup = "<div class='widgetTitle'>" + title + "</div><br/><div class='" + chartClassName + "' style='height: " + height + "; width= 50% '></div>";



        if (remainder == 0) {
            if (remaining > 1) {
                $("#tableCanvas").append($("<tr><td style='top:0px' width='50%' id=celln" + index + " valign='top'>" + markup + "</td></tr>"));

            }
            else {
                $("#tableCanvas").append($("<tr><td colspan='2' style='top:0px' width='100%' id=celln" + index + " valign='top'>" + markup + "</td></tr>"));
            }
        }
        else {
            // $("#tableCanvas  > tbody > tr > td").eq(nthPos).after("<td style='top:0px' id=celln" + index + " width='100%' valign='top'>" + markup + "</td>");

            var indset = index - 1;
            var newId = "#celln" + indset;

            $("#tableCanvas  > tbody > tr > " + newId).eq(nthPos).after("<td style='top:0px' id=celln" + index + " width='100%' valign='top'>" + markup + "</td>");

            //$("#tableCanvas  > tbody > tr > td").eq(nthPos).after("<td style='top:0px' id=celln" + index + " width='100%' valign='top'>" + markup + "</td>");
        }
    };

    this.isExternalIndicator = function (indicatorItem) {
        switch (indicatorItem) {
            case 'ATR':
            case 'STDDEV':
            case 'RSI':
            case 'Aroon Oscillator':
            case 'Aroon Up':
            case 'Aroon Down':

            case 'Stochastic':
            case 'StochRSI':
            case 'TRIX':
            case 'ROC':
            case 'MFI':
            case 'OBV':
            case 'Ultimateoscillator':

            case 'CCI':
            case 'OBV':
            case 'EMA':

            case 'MACD':
                {
                    return true;
                }
                break;
        }
        return false;
    };

    this.externalIndicatorNameOnly = function (json) {
        var j = 0;
        var extIndicatorLookUp = {};

        json.forEach(function (el, i, arr) {
            if (self.isExternalIndicator(el) == true) {
                extIndicatorLookUp[i] = el + j;
                j++;
            }
        });
        return extIndicatorLookUp;
    };

    this.createExternalIndicatorLookUp = function (json) {
        var extIndicatorLookUp = {};

        var tempIndicatorParentLookUp =
        {
            length: 0,
            indicatorLookUp: {}
        };

        var j = 1;

        json.forEach(function (el, i, arr) {
            if (self.isExternalIndicator(el.Key)== true) {
                extIndicatorLookUp[el.Key] = j;
                j++;
            }
        });
        tempIndicatorParentLookUp.indicatorLookUp = extIndicatorLookUp;
        tempIndicatorParentLookUp.length = j - 1;

        return tempIndicatorParentLookUp;
    };

    this.createExternalIndicatorLookUpNew = function (json) {
        var extIndicatorLookUp = {};

        var tempIndicatorParentLookUp =
        {
            length: 0,
            indicatorLookUp: {}
        };

        var j = 1; //current
        //var j = 2;
        //j = 0;

        json.forEach(function (el, i, arr) {
            if (self.isExternalIndicator(el) == true) {
                //extIndicatorLookUp[el] = j;
                var valName = j - 1;

                extIndicatorLookUp[el + valName] = j;

                j++;
            }
        });
        tempIndicatorParentLookUp.indicatorLookUp = extIndicatorLookUp;
        tempIndicatorParentLookUp.length = j - 1;
        //tempIndicatorParentLookUp.length = j - 2;

        return tempIndicatorParentLookUp;
    };

    this.createStartingValueLookUp = function (json) {        
            var i,
                len = json.length,
                out = [],
                obj = {};
            var dataLookUp = {};

            for (i = 0; i < len; i++) {
                obj[json[i]] = 0;
            }
            for (i in obj) {
                dataLookUp[i] = 0;
                //out.push(i);
            }
            return dataLookUp;
    };

    //creates unique list with flag to handle repeated indicators
    this.createStartingValueLookUpSpecial = function (json) {
        var i,
            len = json.length,
            out = [],
            obj = {};
        var dataLookUp = {};

        for (i = 0; i < len; i++) {
            obj[json[i]] = 0;
        }
        for (i in obj) {
            dataLookUp[i] = { firstRepeatflag: false, currentCount: 0 };
        }
        return dataLookUp;
    };

    this.repeatedIndicatorHandling = function (currentElement, repeatedList) {

        var indicatorKey = '';
        var counterFlag = repeatedList[currentElement];

        if (typeof counterFlag !== 'undefined') {
            switch (currentElement) {
                case 'OutSlowKData':
                    {
                        if (counterFlag.firstRepeatflag == false) {
                            counterFlag.firstRepeatflag = true;
                            counterFlag.currentCount = 1;
                        }
                        else {
                            counterFlag.currentCount = counterFlag.currentCount + 2;
                        }
                    } break;

                case 'OutSlowDData':
                    {
                        if (counterFlag.firstRepeatflag == false) {
                            counterFlag.firstRepeatflag = true;
                            counterFlag.currentCount = 0;
                        }
                        else {
                            counterFlag.currentCount = counterFlag.currentCount + 2;
                        }
                    }
                    break;

                case 'UpperBand':
                    {
                        if (counterFlag.firstRepeatflag == false) {
                            counterFlag.firstRepeatflag = true;
                            counterFlag.currentCount = 1;
                        }
                        else {
                            counterFlag.currentCount = counterFlag.currentCount + 3;
                        }
                    } break;

                case 'LowerBand':
                    {
                        if (counterFlag.firstRepeatflag == false) {
                            counterFlag.firstRepeatflag = true;
                            counterFlag.currentCount = 1;
                        }
                        else {
                            counterFlag.currentCount = counterFlag.currentCount + 3;
                        }
                    }
                    break;

                case 'MiddleBand':
                    {
                        if (counterFlag.firstRepeatflag == false) {
                            counterFlag.firstRepeatflag = true;
                            counterFlag.currentCount = 0;
                        }
                        else {
                            counterFlag.currentCount = counterFlag.currentCount + 3;
                        }
                    }
                    break;

                case 'MACDLine':
                    {
                        if (counterFlag.firstRepeatflag == false) {
                            counterFlag.firstRepeatflag = true;
                            counterFlag.currentCount = 2;
                        }
                        else {
                            counterFlag.currentCount = counterFlag.currentCount + 3;
                        }
                    } break;

                case 'SignalLine':
                    {
                        if (counterFlag.firstRepeatflag == false) {
                            counterFlag.firstRepeatflag = true;
                            counterFlag.currentCount = 1;
                        }
                        else {
                            counterFlag.currentCount = counterFlag.currentCount + 3;
                        }
                    }
                    break;

                case 'MACDHistogram':
                    {
                        if (counterFlag.firstRepeatflag == false) {
                            counterFlag.firstRepeatflag = true;
                            counterFlag.currentCount = 0;
                        }
                        else {
                            counterFlag.currentCount = counterFlag.currentCount + 3;
                        }
                    }
                    break;

                case 'ATR':
                case 'STDEV':
                case 'RSI':
                case 'SMA':
                case 'CCI':
                case 'OBV':
                case 'EMA':
                    {
                        if (counterFlag.firstRepeatflag == false) {
                            counterFlag.firstRepeatflag = true;
                            counterFlag.currentCount = 0;
                        }
                        else {
                            counterFlag.currentCount = counterFlag.currentCount + 1;
                        }
                    }
                    break;
            }
        }

        if (typeof counterFlag === 'undefined') {
            indicatorKey = currentElement;
        }
        else {
            indicatorKey = currentElement + counterFlag.currentCount;
        }


        var final = { Indicator : indicatorKey, UpdatedLookup : repeatedList };
        return final;
    };

    this.createLookUp = function (json, subWidgets) {
        var dataLookUp = {};
        var tempLookUp = {};
        var dataListKey = [];

        var subWidgetsMarking = [];

        json.forEach(function (el, i, arr) {
            var currentCount = tempLookUp[el.Key];
            if (typeof currentCount !== 'undefined') {
                tempLookUp[el.Key] = currentCount + 1;
            }
            else {
                tempLookUp[el.Key] = 1;
            }

            subWidgetsMarking.push([el.Key, el.Value, false]);
            //dataListKey.push(el.Key);
        });

        //Repeated Indicators only
        json.forEach(function (firstElement, i, arr) {
            json.forEach(function (secondElement, j, arr) {
                if (i != j && firstElement.Key == secondElement.Key) {
                    dataListKey.push(firstElement.Key);
                }
            });
        });


        var repeatedIndicatorLookupWithFlags = self.createStartingValueLookUpSpecial(dataListKey);


        var ManySet = false;
        // generate the lookup table for reuse
        json.forEach(function (el, i, arr) {

            var index = i - 1;
            if (index === -1) index = 0;

            var nameLookUp = el.Key + "" + index;

            var currentCount = tempLookUp[el.Key];
            if (typeof currentCount !== 'undefined') {
                index = currentCount - 1;
                tempLookUp[el.Key] = index;

                //nameLookUp = el.Key + "" + index;

                var nameLookUp = self.repeatedIndicatorHandling(el.Key, repeatedIndicatorLookupWithFlags);

                dataLookUp[nameLookUp.Indicator] = el.Value;



            }
            else {
                nameLookUp = el.Key;
            }

            if (el.Key == "RAW") {
                nameLookUp = el.Key;
                dataLookUp[nameLookUp] = el.Value;
            }


            //else {
            //    var found = false;
            //    for (var e = 0; e < subWidgetsMarking.length; e++) {
            //        if (el.Key == subWidgetsMarking[e][0]
            //            && false == subWidgetsMarking[e][2]) {
            //            var nameIndx = e - 1
            //            var nameLookUpSet = subWidgetsMarking[e][0] + "" + nameIndx;
            //            dataLookUp[nameLookUpSet] = subWidgetsMarking[e][1];

            //            subWidgetsMarking[e][2] = true;
            //        }
            //    }
            //}


        });




        return dataLookUp;
    };


    this.createLookUpOld = function (json, subWidgets) {
        var dataLookUp = {};
        var tempLookUp = {};
        var subWidgetsMarking = [];

        json.forEach(function (el, i, arr) {
            var currentCount = tempLookUp[el.Key];
            if (typeof currentCount !== 'undefined') {
                tempLookUp[el.Key] = currentCount + 1;
            }
            else {
                tempLookUp[el.Key] = 1;
            }

            subWidgetsMarking.push([el.Key, el.Value, false]);

        });


        for (var i = 0; i < subWidgets.length; i++){
            var nameLookUp = subWidgets[i] + "" + i; 
            //dataLookUp[nameLookUp];
        }
        

        var ManySet = false;
        // generate the lookup table for reuse
        json.forEach(function (el, i, arr) {

            var index = i - 1;
            if (index === -1) index = 0;

            var nameLookUp = el.Key + "" + index;

            var currentCount = tempLookUp[el.Key];
            if (typeof currentCount !== 'undefined') {
                index = currentCount - 1;
                tempLookUp[el.Key] = index;

                nameLookUp = el.Key + "" + index;
            }
            else {
                nameLookUp = el.Key;
            }

            if (el.Key == "RAW") {
                nameLookUp = el.Key;
                dataLookUp[nameLookUp] = el.Value;
            }
            else {
                var found = false;
                for (var e = 0; e < subWidgetsMarking.length; e++) {
                    if (el.Key == subWidgetsMarking[e][0]
                        && false == subWidgetsMarking[e][2])
                    {
                        var nameIndx = e - 1
                        var nameLookUpSet = subWidgetsMarking[e][0] + "" + nameIndx;
                        dataLookUp[nameLookUpSet] = subWidgetsMarking[e][1];

                        subWidgetsMarking[e][2] = true;

                        //subWidgetsMarking.push(el.Key, true);

                       // subWidgets.splice(e, 1);
                        //break;
                    }
                }

                //for (var i = 0; i < subWidgets.length; i++) {
                //    var nameLookUpSet = subWidgets[i] + "" + i;
                //    dataLookUp[nameLookUpSet] = el.Value;
                //}

            }


        });




        return dataLookUp;
    };

    this.createLookUpOriginalOld = function (json) {
        var dataLookUp = {};
        var tempLookUp = {};

        //json.forEach(function (el, i, arr) {

        //    json.forEach(function (nu, j, arrd) {

        //        if (el.Key == nu.Key && i != j) {
                    
        //            var currentCount = tempLookUp[el.Key];
        //            if (typeof currentCount !== 'undefined') {
        //                tempLookUp[el.Key] = currentCount + 1;
        //            }
        //            else {
        //                tempLookUp[el.Key] = 1;
        //            }
        //        }

        //    });
        //});


        json.forEach(function (el, i, arr) {
            //if (el.Key == nu.Key && i != j) {

                var currentCount = tempLookUp[el.Key];
                if (typeof currentCount !== 'undefined') {
                    tempLookUp[el.Key] = currentCount + 1;
                }
                else {
                    tempLookUp[el.Key] = 1;
                }
            //}
        });









        var ManySet = false;
        // generate the lookup table for reuse
        json.forEach(function (el, i, arr) {

                var index = i - 1;
                if (index === -1) index = 0;

                var nameLookUp = el.Key + "" + index;

                var currentCount = tempLookUp[el.Key];
                if (typeof currentCount !== 'undefined') {
                    index = currentCount - 1;
                    tempLookUp[el.Key] = index;

                    nameLookUp = el.Key + "" + index;
                }
                else {
                    nameLookUp = el.Key;
                }
           
                if (el.Key == "RAW") nameLookUp = el.Key;
                dataLookUp[nameLookUp] = el.Value;

        });

        return dataLookUp;
    };

    this.createMulitipleWidgetsLookUp = function (json) {
        var tempLookUp = {};

        json.forEach(function (el, i, arr) {
            json.forEach(function (nu, j, arrd) {
                if (el.Key == nu.Key && i != j) {
                    var currentCount = tempLookUp[el.Key];
                    if (typeof currentCount !== 'undefined') {
                        tempLookUp[el.Key] = currentCount + 1;
                    }
                    else {
                        tempLookUp[el.Key] = 1;
                    }
                }
            });
        });      
        return tempLookUp;
    };


    this.initalizeSubWidgets = function (presentationTypes, index, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly) {

        PrepareChartData(presentationTypes, index, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly);
    }

    this.convertToNumericKeyID = function (selectChartKey) {
        var accumulated = "";
        var total = 0;
        for (var i = 0; i < selectChartKey.length; i++) {
            var n = selectChartKey.charCodeAt(i);
            accumulated = accumulated + n;
            total = total + n;
        }
        return total;
    }


    this.people = ko.observableArray([
        { name: 'Bert' },
        { name: 'Charles' },
        { name: 'Denise' }
    ]);

    this.addPerson = function () {
        self.people.push({ name: "New at " + new Date() });
    };

    this.removePerson = function () {
        self.people.remove(this);
    };

}



//Class
function ResultsData() {
    this.smaOverlay = [];
    this.upperBollingerBand = [];
    this.lowerBollingerBand = [];
    this.rsiData = [];
    this.aroonOsc = [];
    this.aroonUp = [];
    this.aroonDown = [];
    this.MACDHistogram = [];
    this.MACDline = [];
    this.avtrInd = [];
    this.higlighters = [];
}

//Populate continuousResults array with the resultsSummary list
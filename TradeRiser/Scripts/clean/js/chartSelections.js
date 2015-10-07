// JavaScript Document



//$("#highlighted").on("change", function (evt) {
//    Highcharts.charts[0].highlighted = $('#highlighted').prop('checked');
//    Highcharts.charts[0].redraw();
//});


function SelectMiniChart(presentationTypeIndex, obj, highlighterArray, dataLookUp, arraySeries, overlayArray, yAxisArray) {

    var chartClassName = 'chartspace dialogchart' + presentationTypeIndex;

    var classOnly = '.dialogchart' + presentationTypeIndex;

    var dataPrep = [];
    var d, datePoint;


    var dataResultsT = dataLookUp["RAW"];

    if (dataResultsT != null || dataResultsT !== undefined) {

        var lineSeriesOptions = [],
            symbolNames = [];

        var volume_CandleStick = [];

        for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
        }

        var dataLength = dataResultsT.length;

        if (dataLength > 0) {

            var dateTimeTemp = dataResultsT[1][0] - dataResultsT[0][0];

            var bIntradayChart = true;

            if (dateTimeTemp >= 86400000) {
                bIntradayChart = false;
            }

            //var buttonSetup = { selected: 1 };

            //if (bIntradayChart) {
            //            var buttonsArray = [{
            //                type: 'hour',
            //                count: 1,
            //                text: '1h'
            //            },
            //            {
            //                type: 'hour',
            //                count: 2,
            //                text: '2h'
            //            },
            //            {
            //                type: 'hour',
            //                count: 3,
            //                text: '3h'
            //            },
            //            {
            //                type: 'day',
            //                count: 1,
            //                text: '1D'
            //            }, {
            //                type: 'all',
            //                count: 1,
            //                text: 'All'
            //    }];          
            //    buttonSetup = {
            //        buttons: buttonsArray,
            //        selected: 1,
            //        inputEnabled: false
            //    }
            //}




            var buttonsArray = SelectButtonArray(obj.CurrentResult.RawDataResults[presentationTypeIndex].DataTimeFrame);
            buttonSetup = {
                buttons: buttonsArray,
                selected: 0,
                inputEnabled: false,
                buttonTheme: {
                    width: 60
                }
            }



            if (yAxisArray.length == 1) {
                yAxisArray[0].height = 400;
            }

            // create the chart
            $(classOnly).highcharts('StockChart', {

                credits: {
                    enabled: false
                },
         
                //tooltip: {
                //style: {
                //        height: '200px',
                //        width: '700px'
                //},
                //pointFormat: '<span style="color:{series.color};white-space:nowrap"> \u25CF{series.name}: <b>{point.y}</b></span>',
                //positioner: function() {
                //        return {
                //            x: 300,
                //            y: 20
                //        };
                //    },
                //},
                plotOptions :{
                    series: {
                        dataGrouping: {enabled:false}
                    }
                },

                //navigator: {
                //    enabled: false
                //},
                //scrollbar: {
                //    enabled: false
                //},

                title: {
                    text: symbolNames[0]
                },

                rangeSelector: buttonSetup,

                yAxis: yAxisArray,

                series: arraySeries,

                highlighted: true,
                highlightRegion: highlighterArray,

                overlay: overlayArray

            });
        }
    }


    for (var iterItem = 0; iterItem < Highcharts.charts.length; iterItem++) {

        if (Highcharts.charts[iterItem] != null && Highcharts.charts[iterItem]!== undefined) {
                Highcharts.charts[iterItem].highlighted = true;
                Highcharts.charts[iterItem].redraw();
        }
    }  


}


function SelectButtonArray(timeFrame) {

    var buttonsArray = [
        {
            type: 'day',
            count: 250,
            text: '- (Out)'
        },
        {
            type: 'day',
            count: 40,
            text: '- (In 1x)'
        },
        {
            type: 'day',
            count: 10,
            text: '- (In 2x)'
        }
    ];


    switch (timeFrame)
    {
        case '1min':
            {
                buttonsArray = [
                 {
                     type: 'hour',
                     count: 6,
                     text: '- (Out)'
                 },
                 {
                     type: 'hour',
                     count: 4,
                     text: '- (In 1x)'
                 }
                 ,
                 {
                     type: 'hour',
                     count: 2,
                     text: '- (In 2x)'
                 }
                 ,
                 {
                     type: 'hour',
                     count: 1,
                     text: '- (In 3x)'
                 }
                ];
            } break;

        case '5min':
            {
                buttonsArray = [
                 {
                     type: 'hour',
                     count: 12,
                     text: '- (Out)'
                 },
                 {
                     type: 'hour',
                     count: 6,
                     text: '- (In 1x)'
                 }
                 ,
                 {
                     type: 'hour',
                     count: 4,
                     text: '- (In 2x)'
                 }
                 ,
                 {
                    type: 'hour',
                    count: 2,
                    text: '- (In 3x)'
                 }
                 ,
                 {
                     type: 'hour',
                     count: 1,
                     text: '- (In 4x)'
                 }
                ];

            } break;

        case '10min':
            {

            } break;

        case '15min':
            {
                buttonsArray = [
                {
                    type: 'day',
                    count: 7,
                    text: '- (Out)'
                },
                {
                    type: 'day',
                    count: 4,
                    text: '- (In 1x)'
                },
                {
                    type: 'day',
                    count: 2,
                    text: '- (In 2x)'
                }
                ];

            } break;

        case '30min':
            {

            } break;

        case '1hour':
            {
                buttonsArray = [
                {
                    type: 'day',
                    count: 16,
                    text: '- (Out)'
                },
                {
                    type: 'day',
                    count: 7,
                    text: '+ (In 1x)'
                }
                ,
                {
                    type: 'day',
                    count: 3,
                    text: '+ (In 2x)'
                }
                ];
            } break;

        case '2hour':
            {

            } break;

        case '3hour':
            {

            } break;

        case '4hour':
            {

            } break;

        case 'EndOfDay':
            {

            } break;

        case 'Weekly':
            {

            } break;

        case 'Monthly':
            {

            } break;

    };
    return buttonsArray; 

}


//function GetSelectorValue(timeFrame)
//{
//    var selectorNo = 0;
//    switch (timeFrame)
//    {
//        case '1min':
//            {
//                selectorNo = 0;
//            } break;

//        case '5min':
//            {

//            } break;

//        case '10min':
//            {

//            } break;

//        case '15min':
//            {
//                selectorNo = 0;
//            } break;

//        case '30min':
//            {

//            } break;

//        case '1hour':
//            {

//            } break;

//        case '2hour':
//            {

//            } break;

//        case '3hour':
//            {

//            } break;

//        case '4hour':
//            {

//            } break;

//        case 'EndOfDay':
//            {

//            } break;

//        case 'Weekly':
//            {

//            } break;

//        case 'Monthly':
//            {

//            } break;

//    };
//    return selectorNo;
//}





















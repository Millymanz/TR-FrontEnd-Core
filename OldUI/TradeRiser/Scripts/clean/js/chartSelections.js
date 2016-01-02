// JavaScript Document



//$("#highlighted").on("change", function (evt) {
//    Highcharts.charts[0].highlighted = $('#highlighted').prop('checked');
//    Highcharts.charts[0].redraw();
//});

function SelectHighlighter(highlightersLength, currenthighChartsId, chartLookUp) {
    var val = highlightersLength;

    for (var g = 0; g < Highcharts.charts.length; g++) {

        if (typeof Highcharts.charts[g] !== 'undefined') {
            if (Highcharts.charts[g].container.id == currenthighChartsId) {
                var chart = Highcharts.charts[g];

                var xtrem = '';
                var miniBool = true;
                var maxBool = true;
                var axisIndex = 0;
                for (var y = 0; y < chart.xAxis.length; y++) {

                    var xtremTemp = chart.xAxis[y].getExtremes();
                    
                    miniBool = isNaN(xtremTemp.userMin);
                    maxBool = isNaN(xtremTemp.userMax);

                    if (miniBool === false && maxBool === false) {
                        xtrem = xtremTemp;
                        axisIndex = y;
                        break;
                    }
                }

                //ensure extents exist
                if (miniBool === false && maxBool === false) {
                    var diff = xtrem.userMax - xtrem.userMin;
                    //var diff = xtrem.userMax - xtrem.userMin;

                    var higlighters = chartLookUp[currenthighChartsId];

                    chart.xAxis[axisIndex].setExtremes(
                        higlighters[val].startDate - diff / 2,
                        higlighters[val].startDate + diff / 2

                    );

                    //open speech bubble
                    for (var i = 0; i < chart.pins.length; i++) {
                        if (higlighters[val].speechBubbleHtml == chart.pins[i].attr('data-comment')) {                            
                            chart.pins[i].click();
                        }
                    }
                }


            }
        }
    }
}


function SelectMiniChart(presentationTypeIndex, obj, highlighterArray, dataLookUp, arraySeries, overlayArray, yAxisArray, trendsOverlayArray) {

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
            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb] + " " + obj.CurrentResult.RawDataResults[presentationTypeIndex].DataTimeFrame);
        }

  

        var dataLength = dataResultsT.length;

        if (dataLength > 0) {

            var dateTimeTemp = dataResultsT[1][0] - dataResultsT[0][0];

            var bIntradayChart = true;

            if (dateTimeTemp >= 86400000) {
                bIntradayChart = false;
            }

          
   
            var buttonsArray = SelectButtonArray(obj.CurrentResult.RawDataResults[presentationTypeIndex].DataTimeFrame);
            buttonSetup = {
                buttons: buttonsArray,
                selected: 1,
                inputEnabled: false,
                buttonTheme: {
                    width: 70
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

                plotOptions: {
                    series: {
                        dataGrouping: { enabled: false }
                    }
                },
             
                title: {
                    text: symbolNames[0]
                },

                rangeSelector: buttonSetup,

                yAxis: yAxisArray,

                series: arraySeries,

                highlighted: true,
                highlightRegion: highlighterArray,

                customSlopeLines: trendsOverlayArray,                

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
            type: 'all',
            count: 1,
            text: '- (Out All)'
        },
        {
            type: 'day',
            count: 250,
            text: '- (In)'
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
                    type: 'all',
                    count: 1,
                    text: '- (Out All)'
                },
                 {
                     type: 'hour',
                     count: 6,
                     text: '- (In)'
                 },
                 {
                     type: 'hour',
                     count: 4,
                     text: '+ (In 1x)'
                 }
                 ,
                 {
                     type: 'hour',
                     count: 2,
                     text: '+ (In 2x)'
                 }
                 ,
                 {
                     type: 'hour',
                     count: 1,
                     text: '+ (In 3x)'
                 }
                ];
            } break;

        case '5min':
            {
                buttonsArray = [
                {
                    type: 'all',
                    count: 1,
                    text: '- (Out All)'
                },
                {
                     type: 'hour',
                     count: 12,
                     text: '- (In)'
                 },
                 {
                     type: 'hour',
                     count: 6,
                     text: '+ (In 1x)'
                 }
                 ,
                 {
                     type: 'hour',
                     count: 4,
                     text: '+ (In 2x)'
                 }
                 ,
                 {
                    type: 'hour',
                    count: 2,
                    text: '+ (In 3x)'
                 }
                 ,
                 {
                     type: 'hour',
                     count: 1,
                     text: '+ (In 4x)'
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
                    type: 'all',
                    count: 1,
                    text: '- (Out All)'
                },
                {
                    type: 'day',
                    count: 7,
                    text: '- (In)'
                },
                {
                    type: 'day',
                    count: 4,
                    text: '+ (In 1x)'
                },
                {
                    type: 'day',
                    count: 2,
                    text: '+ (In 2x)'
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
                    type: 'all',
                    count: 1,
                    text: '- (Out All)'
                },
                {
                    type: 'day',
                    count: 16,
                    text: '- (In)'
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





















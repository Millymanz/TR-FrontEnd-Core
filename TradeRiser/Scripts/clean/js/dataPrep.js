// JavaScript Document
function DisplaySummary(presentationTypes, presentationTypeIndex, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray) {

}

function PrepareChartData(presentationTypes, presentationTypeIndex, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp) {

        //create selectChartKey from loop
        var allCount = 8;
        var allCountIter = 0;
        var selectChartKey = '';

        var bSubWidgetSet = false;
    
        var indicatorPos = 0;
        if (yAxisArray != null && typeof yAxisArray != 'undefined') {
            indicatorPos = yAxisArray[0].height;
        }

        var indSpacing = 90;
        var indicatorGap = 0; //handles gap between bottom chart indicators

        for (var ss = 0; ss < presentationTypes.SubWidgets.length; ss++) {

            switch (presentationTypes.SubWidgets[ss]) {
                case 'CorrelationTable':
                    {
                        var indOne = obj.CurrentResult.ProcessedResults.KeyFieldIndex[0];
                        var indTwo = obj.CurrentResult.ProcessedResults.KeyFieldIndex[1];


                        var resultValue = dataLookUp["CorrelationRatio"];

                        var lineSeriesOptions = [],
                            symbolNames = [];

                        for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
                            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
                        }

                        var correlTabStr = '<table cellpadding="12" cellspacing="12" border="1" style="border-color:#E0E0E0;"><tr style="border-color:#E0E0E0;"><td></td><td>' + symbolNames[0] + '</td></tr>';
                        var tempStr = '<tr style="border-color:#E0E0E0;"><td>' + symbolNames[1] + '</td><td>' + resultValue + '</td></tr></table>';

                        var final = correlTabStr + tempStr;

                        $('<br/>' + final).appendTo($("#celln"+ presentationTypeIndex));


                        dataResults = obj.CurrentResult.RawDataResults[0].ChartReadyDataResults;

                        bSubWidgetSet = true;

                        allCountIter++;
                    }
                    break;

                case 'SMA':
                    {
                        var dataResults = dataLookUp["SMA"];

                        if (dataResults != null || dataResults !== undefined) {
                            var dataLength = dataResults.length;
                            var smaData = [];

                            for (var ri = 0; ri < dataLength; ri++) {
                                smaData.push([
                                    dataResults[ri][0], // the date
                                    dataResults[ri][1] // the close
                                ])
                            }

                            var smaChartItem = {
                                code: 'sma',
                                name: 'SMA',
                                color: 'red',
                                data: [smaData],
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            overlayArray.push(smaChartItem);                          

                            allCountIter++;
                            GenerateSummary(obj, presentationTypeIndex);
                        }
                    }
                    break;

                case 'BollingerBands':
                    {
                        var dataUpperBand = dataLookUp["UpperBand"];
                        var dataLowerBand = dataLookUp["LowerBand"];
                        var dataMiddleBand = dataLookUp["MiddleBand"];

                        if (dataMiddleBand != null || dataMiddleBand !== undefined) {
                            var smaOverlayArray = [];
                            var upperBollingerBandArray = [];
                            var lowerBollingerBandArray = [];

                            var dataLength = dataMiddleBand.length;

                            for (var ri = 0; ri < dataLength; ri++) {
                                smaOverlayArray.push([
                                    dataMiddleBand[ri][0], // the date
                                    dataMiddleBand[ri][1] // the close
                                ])

                                upperBollingerBandArray.push([
                                    dataUpperBand[ri][0], // the date
                                    dataUpperBand[ri][1] // the close
                                ])

                                lowerBollingerBandArray.push([
                                    dataLowerBand[ri][0], // the date
                                    dataLowerBand[ri][1] // the close
                                ])
                            }

                            var smaChartItem = {
                                code: 'sma',
                                name: 'SMA',
                                color: 'red',
                                data: [smaOverlayArray],
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            overlayArray.push(smaChartItem);

                            var bollingerBandsChartItem = {
                                code: 'bbands',
                                name: 'Bollinger Bands',
                                color: 'blue',
                                data: [lowerBollingerBandArray, upperBollingerBandArray],
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            overlayArray.push(bollingerBandsChartItem);
                            allCountIter++;

                            GenerateSummary(obj, presentationTypeIndex);
                        }                        
                    }
                    break;

                case 'Aroon Oscillator':
                    {
                        var indicatorName = "Aroon Oscillator";
                        selectChartKey = selectChartKey + indicatorName;
                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];

                        var dataResults = dataLookUp["Aroon Oscillator"];

                        if (dataResults != null || dataResults !== undefined) {
                            var dataLength = dataResults.length;
                            var aroonOscArray = [];

                            for (var ri = 0; ri < dataLength; ri++) {
                                aroonOscArray.push([
                                    dataResults[ri][0], // the date
                                    dataResults[ri][1] // the close
                                ])
                            }

                            var aroonOscChart = {
                                type: 'area',
                                name: 'Aroon Oscillator',
                                data: aroonOscArray,
                                yAxis: yAxisPos,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            arraySeries.push(aroonOscChart);

                            indicatorPos = indicatorPos + indSpacing + indicatorGap;
                            var chartItemDef = {
                                title: {
                                    text: 'Aroon Osc'
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };
                            yAxisArray.push(chartItemDef);

                            allCountIter++;
                            GenerateSummary(obj, presentationTypeIndex);
                        }                        
                    }
                    break;

                case 'Aroon Up':
                    {
                        var indicatorName = "Aroon Up";
                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];

                        selectChartKey = selectChartKey + "Aroon Up";

                        var dataResults = dataLookUp["Aroon Up"];

                        if (dataResults != null || dataResults !== undefined) {
                            var dataLength = dataResults.length;
                            var aroonUpArray = [];

                            for (var ri = 0; ri < dataLength; ri++) {
                                aroonUpArray.push([
                                    dataResults[ri][0], // the date
                                    dataResults[ri][1] // the close
                                ])
                            }

                            var aroonUpChart = {
                                type: 'line',
                                name: indicatorName,
                                data: aroonUpArray,
                                yAxis: yAxisPos,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            arraySeries.push(aroonUpChart);

                            indicatorPos = indicatorPos + indSpacing + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: indicatorName
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };
                            yAxisArray.push(chartItemDef);

                            allCountIter++;
                            GenerateSummary(obj, presentationTypeIndex);
                        }
                    }
                    break;

                case 'Aroon Down':
                    {
                        var indicatorName = "Aroon Down";
                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];

                        selectChartKey = selectChartKey + indicatorName;

                        var dataResults = dataLookUp["Aroon Down"];

                        if (dataResults != null || dataResults !== undefined) {
                            var dataLength = dataResults.length;
                            var aroonDownArray = [];

                            for (var ri = 0; ri < dataLength; ri++) {
                                aroonDownArray.push([
                                    dataResults[ri][0], // the date
                                    dataResults[ri][1] // the close
                                ])
                            }

                            var aroonDownChart = {
                                type: 'line',
                                name: indicatorName,
                                data: aroonDownArray,
                                yAxis: yAxisPos,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            arraySeries.push(aroonDownChart);

                            indicatorPos = indicatorPos + indSpacing + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: indicatorName
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };
                            yAxisArray.push(chartItemDef);

                            allCountIter++;

                            GenerateSummary(obj, presentationTypeIndex);
                        }
                    }
                    break;

                case 'RSI':
                    {
                        var indicatorName = "RSI";
                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];


                        selectChartKey = selectChartKey + "RSI";

                        var dataResults = dataLookUp["RSI"];

                        if (dataResults != null || dataResults !== undefined) {
                            var dataLength = dataResults.length;
                            var rsiArray = [];

                            for (var ri = 0; ri < dataLength; ri++) {
                                rsiArray.push([
                                    dataResults[ri][0], // the date
                                    dataResults[ri][1] // the close
                                ])
                            }

                            var rsiChart = {
                                type: 'line',
                                name: 'RSI',
                                data: rsiArray,
                                yAxis: yAxisPos,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            arraySeries.push(rsiChart);

                            indicatorPos = indicatorPos + indSpacing + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: indicatorName
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };
                            yAxisArray.push(chartItemDef);

                            allCountIter++;

                            GenerateSummary(obj, presentationTypeIndex);
                        }
                    }
                    break;

                case 'MACD':
                    {
                        var indicatorName = "MACD";

                        selectChartKey = selectChartKey + "MACD";

                        var dataMACD = dataLookUp["MACDLine"];
                        var dataSignal = dataLookUp["SignalLine"];
                        var dataMACDHistogram = dataLookUp["MACDHistogram"];

                        if (dataMACD != null || dataMACD !== undefined) {
                            var dataLength = dataMACD.length;
                            var macdArray = [];
                            var macdSignalArray = [];
                            var macdHistogramArray = [];

                            for (var ri = 0; ri < dataLength; ri++) {

                                macdArray.push([
                                    dataMACD[ri][0], // the date
                                    dataMACD[ri][1] // the close
                                ])

                                macdSignalArray.push([
                                    dataSignal[ri][0], // the date
                                    dataSignal[ri][1] // the close
                                ])

                                macdHistogramArray.push([
                                    dataMACDHistogram[ri][0], // the date
                                    dataMACDHistogram[ri][1] // the close
                                ])
                            }
                            var axis = 1;

                            var macdChartItem = {
                                type: 'line',
                                name: 'MACDline',
                                data: macdArray,
                                yAxis: axis,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            arraySeries.push(macdChartItem);


                            var signalChartItem = {
                                type: 'line',
                                name: 'signalLine',
                                data: macdSignalArray,
                                yAxis: axis,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            arraySeries.push(signalChartItem);


                            var macdHistogramChartItem = {
                                type: 'column',
                                name: 'MACDHistogram',
                                data: macdHistogramArray,
                                yAxis: axis,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            arraySeries.push(macdHistogramChartItem);

                            indicatorPos = indicatorPos + indSpacing + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: 'MACD'
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };
                            yAxisArray.push(chartItemDef);

                            allCountIter++;

                            GenerateSummary(obj, presentationTypeIndex);
                        }
                    }
                    break;

                case 'ATR':
                    {
                        var indicatorName = "ATR";
                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];

                        selectChartKey = selectChartKey + "ATR";

                        var dataResults = dataLookUp["ATR"];

                        if (dataResults != null || dataResults !== undefined) {
                            var dataLength = dataResults.length;
                            var atrArray = [];

                            for (var ri = 0; ri < dataLength; ri++) {
                                atrArray.push([
                                    dataResults[ri][0], // the date
                                    dataResults[ri][1] // the close
                                ])
                            }
                            var atrChart = {
                                type: 'line',
                                name: 'ATR',
                                data: atrArray,
                                yAxis: yAxisPos,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                            arraySeries.push(atrChart);

                            indicatorPos = indicatorPos + indSpacing + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: indicatorName
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };
                            yAxisArray.push(chartItemDef);

                            allCountIter++;
                            GenerateSummary(obj, presentationTypeIndex);
                        }
                    }
                    break;
           
                default:
                    {
                        var indOne = obj.CurrentResult.ProcessedResults.KeyFieldIndex[0];
                        var indTwo = obj.CurrentResult.ProcessedResults.KeyFieldIndex[1];

                        var resultValue = dataLookUp["CorrelationRatio"];

                        var lineSeriesOptions = [],
                            symbolNames = [];

                       // GenerateSummary(obj, presentationTypeIndex);

                        bSubWidgetSet = true;
                        allCountIter++;
                    }
                    break;
            }
            indicatorGap = indicatorGap + 30;
        }

        //if (bSubWidgetSet === true) {
        //    $("#resultCanvas").append($('<br/><hr style="border: 0; color: #9E9E9E; background-color: #9E9E9E; height: 1px; width: 100%; text-align: left;" />'));
        //}
}

function GenerateSummary(obj, presentationTypeIndex) {

    var genTabStr = "<table cellpadding='8' cellspacing='20'><tr><td style='border-left: 1px solid grey; vertical-align: top;'>";
    genTabStr += "<span style='color:#3a89ff;'><strong>Detailed Facts: </strong></span><br/> <br/>"
    genTabStr += "<table cellpadding='8' cellspacing='8' border='1' style='border-color:#E0E0E0;'>";


    for (var bb = 0; bb < obj.CurrentResult.ProcessedResults.KeyFieldIndex[presentationTypeIndex].length; bb++) {

        var selectingIndex = obj.CurrentResult.ProcessedResults.KeyFieldIndex[presentationTypeIndex][bb];

        genTabStr += '<tr style="border-color:#E0E0E0;"><td>' + obj.CurrentResult.ProcessedResults.Headers[selectingIndex] + '</td><td>'
        + obj.CurrentResult.ProcessedResults.ComputedResults[0][selectingIndex] + '</td></tr>';
    }
    genTabStr += "</table></td>";

    var firstSummary = obj.CurrentResult.RawDataResults[presentationTypeIndex].Summaries[0];

    //if (typeof firstSummary !== null || typeof firstSummary !== 'undefined') {
    if (typeof firstSummary !== 'undefined') {

        genTabStr += "<td valign='top' style='border-left: 1px solid grey; border-right: 1px solid grey; vertical-align: top;'>";
        genTabStr += "<div style='margin-left:10px;margin-right:10px;'><span style='color:#3a89ff;'><strong>Summary:</strong> </span><br/> <br/>";
        genTabStr += firstSummary;
        genTabStr += "</div></td>";
    }

    var summaryMore = obj.CurrentResult.RawDataResults[presentationTypeIndex].Summaries[1];
    //if (typeof summaryMore !== null || typeof summaryMore !== 'undefined') {

    if (typeof summaryMore !== 'undefined') {

        genTabStr += "<td valign='top' style='border-left: 1px solid grey; border-right: 1px solid grey; vertical-align: top;>";
        genTabStr += "<div style='margin-left:10px;margin-right:10px;'><span style='color:#3a89ff;'><strong>More Summary:</strong> </span><br/>" +
            summaryMore + "</td>";
    }
    genTabStr += "</tr></table>";
  

    var final = genTabStr;


    $('<br/>' + final).appendTo($("#celln" + presentationTypeIndex));



    //generate dynatable
    $('.genericResultsTable').dynatable({
        table: {
            defaultColumnIdStyle: 'trimDash'
        },
        features: {
            paginate: true,
            search: false,
            recordCount: true,
            perPageSelect: false
        }
    });




}
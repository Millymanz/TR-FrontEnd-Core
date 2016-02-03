// JavaScript Document
function DisplaySummary(presentationTypes, presentationTypeIndex, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray) {

}

function myRowWriter(rowIndex, record, columns, cellWriter) {
var tr = '';

// grab the record's attribute for each column
    for (var i = 0, len = columns.length; i < len; i++) {
        tr += cellWriter(columns[i], record);
    }
    return '<tr style=cursor:pointer data-index=' + record.Id + '>' + tr + '</tr>';
    //return '<tr style=cursor:pointer data-index=' + rowIndex + '>' + tr + '</tr>';
}

function WidgetAlreadyUsed(presentationItem, widgetUsedList) {
    
    for (var t = 0; t < widgetUsedList.length; t++) {
        if (presentationItem == widgetUsedList[t]) {
            return true;
        }
    }
    widgetUsedList.push(presentationItem);  
    return false;
}

function GenerateRandomColour() {

    var textArray = [
    '#5dff4f',
    'blue',
    '#006a72',
    '#0055a6',
    '#ad655f',
    '#f3e877'
    ];
    var randomNumber = Math.floor(Math.random() * textArray.length);
    return textArray[randomNumber];
}

function PrepareChartData(presentationTypes, presentationTypeIndex, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray) {
    
    try
    {


        //create selectChartKey from loop
        var allCount = 8;
        var allCountIter = 0;
        var selectChartKey = '';

        var bSubWidgetSet = false;

        var widgetUsedList = [];
    
        var indicatorPos = 0;
        if (yAxisArray != null && typeof yAxisArray != 'undefined') {
            if (yAxisArray.length > 0) {
                indicatorPos = yAxisArray[0].height;
            }
        }

        var indSpacing = 90;
        // var indicatorGap = 0; //handles gap between bottom chart indicators

        var indicatorGap = 20;
        var summariesSet = false;
        indicatorPos = indicatorPos + 80;

        for (var ss = 0; ss < presentationTypes.SubWidgets.length; ss++) {

            switch (presentationTypes.SubWidgets[ss]) {
                case 'CorrelationTable':
                    {
                        //var correlTabStr = '<table cellpadding="12" cellspacing="12" border="1" style="border-color:#E0E0E0;"><tr style="border-color:#E0E0E0;"><td></td>';
                        //var tempStr = '';

                        //var pp = presentationTypeIndex;

                        //var lineSeriesOptions = [],
                        //   symbolNames = [],
                        //   chartData = [];

                        //for (var bb = 0; bb < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults.length; bb++) {

                        //    for (var vv = 0; vv < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders.length; vv++) {

                        //        correlTabStr += '<td>' + obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders[vv] + '</td>';
                        //    }
                        //    correlTabStr += '</tr>';


                        //    var cellLength = obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].ColumnHeaders.length;

                        //    var rowHeader = 0;
                        //    for (var ss = 0; ss < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value.length; ss++) {

                        //        var counts = 0;


                        //        for (var vv = 0; vv < obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[ss].length; vv++) {

                        //            if (vv == 0) {
                        //                tempStr += '<tr><td>' + obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].RowHeaders[rowHeader] + '</td>';
                        //            }

                        //            tempStr += '<td>' + obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[ss][vv] + '</td>';


                        //           // tempStr += '<td>' + self.valueNotAvailableChecker(obj.CurrentResult.RawDataResults[pp].ChartReadyDataResults[bb].Value[ss][vv]) + '</td>';

                        //        }
                        //        tempStr += '</tr>';
                        //        rowHeader++;
                        //    }
                        //}

                        //var final = correlTabStr + tempStr;

                        //$("#tableCanvas  > tbody > tr > td").eq(pp).after("<td style='top:0px' id=celln" + pp + " width='100%' valign='top'>" + final + "</td>");

                        bSubWidgetSet = true;

                        allCountIter++;
                    }
                    break;

                case 'EMA':
                case 'TMA':
                    {
                        var indicatorName = presentationTypes.SubWidgets[ss];
                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];


                        var dataResults = {};
                        var widgetName = "";
                        var currentCount = mulitipleWidgetLookUp[indicatorName];
                        if (typeof currentCount !== 'undefined') {
                            dataResults = dataLookUp[indicatorName + ss];
                            widgetName = obj.CurrentResult.PresentationTypes[0].SubWidgetsAltName[ss];
                        }
                        else {
                            dataResults = dataLookUp[indicatorName];
                            widgetName = indicatorName;
                        }


                        if (dataResults != null || dataResults !== undefined) {
                            var dataLength = dataResults.length;
                            var smaData = [];

                            for (var ri = 0; ri < dataLength; ri++) {
                                smaData.push([
                                    dataResults[ri][0], // the date
                                    dataResults[ri][1] // the close
                                ])
                            }

                            //For handling multilple widgets of the same
                            //kind, this diversifies color
                            var selectedColor = "purple";
                            if (WidgetAlreadyUsed(indicatorName, widgetUsedList)) {
                                selectedColor = GenerateRandomColour();
                            }

                            var smaChartItem = {
                                code: indicatorName,
                                name: widgetName,
                                color: selectedColor,
                                data: [smaData]
                            }

                            overlayArray.push(smaChartItem);

                            allCountIter++;

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
                        }
                    }
                    break;

                case 'SMA':
                    {
                        var dataResults = {};
                        var widgetName = "";
                        var currentCount = mulitipleWidgetLookUp["SMA"];
                        if (typeof currentCount !== 'undefined') {
                            dataResults = dataLookUp["SMA" + ss];
                            widgetName = obj.CurrentResult.PresentationTypes[0].SubWidgetsAltName[ss];
                        }
                        else {
                            dataResults = dataLookUp["SMA"];
                            widgetName = "SMA";
                        }
                        

                        if (dataResults != null || dataResults !== undefined) {
                            var dataLength = dataResults.length;
                            var smaData = [];

                            for (var ri = 0; ri < dataLength; ri++) {
                                smaData.push([
                                    dataResults[ri][0], // the date
                                    dataResults[ri][1] // the close
                                ])
                            }

                            //For handling multilple widgets of the same
                            //kind, this diversifies color
                            var selectedColor = "red";
                            if (WidgetAlreadyUsed('SMA', widgetUsedList)) {
                                selectedColor = GenerateRandomColour();
                            }

                            //var smaChartItem = {
                            //    code: 'sma',
                            //    name: widgetName,
                            //    color: selectedColor,
                            //    data: [smaData],
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}

                            var smaChartItem = {
                                code: 'sma',
                                name: widgetName,
                                color: selectedColor,
                                data: [smaData]
                            }

                            overlayArray.push(smaChartItem);                          

                            allCountIter++;

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
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

                            //var smaChartItem = {
                            //    code: 'sma',
                            //    name: 'SMA',
                            //    color: 'red',
                            //    data: [smaOverlayArray],
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}

                            var smaChartItem = {
                                code: 'sma',
                                name: 'SMA',
                                color: 'red',
                                data: [smaOverlayArray]
                            }

                            overlayArray.push(smaChartItem);

                            //var bollingerBandsChartItem = {
                            //    code: 'bbands',
                            //    name: 'Bollinger Bands',
                            //    color: 'blue',
                            //    data: [lowerBollingerBandArray, upperBollingerBandArray],
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}

                            var bollingerBandsChartItem = {
                                code: 'bbands',
                                name: 'Bollinger Bands',
                                color: 'blue',
                                data: [lowerBollingerBandArray, upperBollingerBandArray]
                            }

                            overlayArray.push(bollingerBandsChartItem);
                            allCountIter++;

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
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

                            //var aroonOscChart = {
                            //    type: 'area',
                            //    name: 'Aroon Oscillator',
                            //    data: aroonOscArray,
                            //    yAxis: yAxisPos,
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}
                            var aroonOscChart = {
                                type: 'area',
                                name: 'Aroon Oscillator',
                                data: aroonOscArray,
                                yAxis: yAxisPos                               
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

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
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

                            //var aroonUpChart = {
                            //    type: 'line',
                            //    name: indicatorName,
                            //    data: aroonUpArray,
                            //    yAxis: yAxisPos,
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}

                            var aroonUpChart = {
                                type: 'line',
                                name: indicatorName,
                                data: aroonUpArray,
                                yAxis: yAxisPos,
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
                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
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

                            //var aroonDownChart = {
                            //    type: 'line',
                            //    name: indicatorName,
                            //    data: aroonDownArray,
                            //    yAxis: yAxisPos,
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}

                            var aroonDownChart = {
                                type: 'line',
                                name: indicatorName,
                                data: aroonDownArray,
                                yAxis: yAxisPos
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

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
                        }
                    }
                    break;

                case 'ROC':
                case 'MFI':
                case 'OBV':
                case 'CCI':
                case 'Ultimateoscillator':

                case 'STDDEV':
                case 'RSI':
                case 'ATR':
                    {
                        var indicatorName = presentationTypes.SubWidgets[ss];
                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];


                        selectChartKey = selectChartKey + indicatorName;

                        var dataResults = dataLookUp[indicatorName];

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
                                name: indicatorName,
                                data: rsiArray,
                                yAxis: yAxisPos
                            }

                            arraySeries.push(rsiChart);

                            indicatorPos = indicatorPos + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: indicatorName
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };
                            indicatorPos = indicatorPos + 100;

                            yAxisArray.push(chartItemDef);

                            allCountIter++;

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
                        }
                    }
                    break;


                case 'TRIX':
                    {
                        var indicatorName = presentationTypes.SubWidgets[ss];

                        selectChartKey = selectChartKey + indicatorName;

                        var stochasticPKDataTemp = dataLookUp["OutSlowKData"];
                        var stochasticPDDataTemp = dataLookUp["OutSlowDData"];


                        if (stochasticPKDataTemp != null || stochasticPKDataTemp !== undefined) {
                            var dataLength = stochasticPKDataTemp.length;
                            var stochasticPKData = [];
                            var stochasticPDData = [];

                            for (var ri = 0; ri < dataLength; ri++) {

                                stochasticPKData.push([
                                    stochasticPKDataTemp[ri][0], // the date
                                    stochasticPKDataTemp[ri][1] // the close
                                ])

                                stochasticPDData.push([
                                    stochasticPDDataTemp[ri][0], // the date
                                    stochasticPDDataTemp[ri][1] // the close
                                ])
                            }
                            var axis = 1;

                            //var macdChartItem ={
                            //    type: 'line',
                            //    name: 'Stochastic %K ',
                            //    data: stochasticPKData,
                            //    yAxis: axis,
                            //    dashStyle: 'ShortDash',
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}

                            var macdChartItem = {
                                type: 'line',
                                name: 'Stochastic %K ',
                                data: stochasticPKData,
                                yAxis: axis,
                                dashStyle: 'ShortDash'
                            }

                            arraySeries.push(macdChartItem);

                            var signalChartItem = {
                                type: 'line',
                                name: 'Stochastic %D ',
                                data: stochasticPDData,
                                dashStyle: 'LongDash',
                                yAxis: axis
                            }

                            arraySeries.push(signalChartItem);

                            indicatorPos = indicatorPos + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: 'Stochastic'
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };
                            indicatorPos = indicatorPos + 100;

                            yAxisArray.push(chartItemDef);

                            allCountIter++;

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
                        }
                    }
                    break;

                case 'StochRSI':
                    {
                        var indicatorName = presentationTypes.SubWidgets[ss];

                        selectChartKey = selectChartKey + indicatorName;

                        var stochasticPKDataTemp = dataLookUp["OutFastKData"];
                        var stochasticPDDataTemp = dataLookUp["OutFastDData"];


                        if (stochasticPKDataTemp != null || stochasticPKDataTemp !== undefined) {
                            var dataLength = stochasticPKDataTemp.length;
                            var stochasticPKData = [];
                            var stochasticPDData = [];

                            for (var ri = 0; ri < dataLength; ri++) {

                                stochasticPKData.push([
                                    stochasticPKDataTemp[ri][0], // the date
                                    stochasticPKDataTemp[ri][1] // the close
                                ])

                                stochasticPDData.push([
                                    stochasticPDDataTemp[ri][0], // the date
                                    stochasticPDDataTemp[ri][1] // the close
                                ])
                            }
                            var axis = 1;

                            var macdChartItem = {
                                type: 'line',
                                name: 'StochRSI %K ',
                                data: stochasticPKData,
                                yAxis: axis,
                                /*dashStyle: 'ShortDash'*/
                            }

                            arraySeries.push(macdChartItem);

                            var signalChartItem = {
                                type: 'line',
                                name: 'StochRSI %D ',
                                data: stochasticPDData,
                                dashStyle: 'LongDash',
                                yAxis: axis
                            }

                            arraySeries.push(signalChartItem);

                            indicatorPos = indicatorPos + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: 'StochRSI'
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };

                            indicatorPos = indicatorPos + 100;

                            yAxisArray.push(chartItemDef);

                            allCountIter++;

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
                        }
                    }
                    break;

                case 'Stochastic':
                    {
                        var indicatorName = presentationTypes.SubWidgets[ss];
                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];

                        selectChartKey = selectChartKey + indicatorName;

                        var stochasticPKDataTemp = dataLookUp["OutSlowKData"];
                        var stochasticPDDataTemp = dataLookUp["OutSlowDData"];
                       

                        if (stochasticPKDataTemp != null || stochasticPKDataTemp !== undefined) {
                            var dataLength = stochasticPKDataTemp.length;
                            var stochasticPKData = [];
                            var stochasticPDData = [];

                            for (var ri = 0; ri < dataLength; ri++) {

                                stochasticPKData.push([
                                    stochasticPKDataTemp[ri][0], // the date
                                    stochasticPKDataTemp[ri][1] // the close
                                ])

                                stochasticPDData.push([
                                    stochasticPDDataTemp[ri][0], // the date
                                    stochasticPDDataTemp[ri][1] // the close
                                ])
                            }
                            var axis = 1;
                            
                            var macdChartItem = {
                                type: 'line',
                                name: 'Stochastic %K ',
                                data: stochasticPKData,
                                yAxis: yAxisPos,
                                dashStyle: 'ShortDash'
                            }

                            arraySeries.push(macdChartItem);


                            var signalChartItem = {
                                type: 'line',
                                name: 'Stochastic %D ',
                                data: stochasticPDData,
                                dashStyle: 'LongDash',
                                yAxis: yAxisPos
                            }

                            arraySeries.push(signalChartItem);

                            indicatorPos = indicatorPos + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: 'Stochastic'
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };
                            indicatorPos = indicatorPos + 100;

                            yAxisArray.push(chartItemDef);

                            allCountIter++;

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
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

                            //var macdChartItem = {
                            //    type: 'line',
                            //    name: 'MACDline',
                            //    data: macdArray,
                            //    yAxis: axis,
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}

                            var macdChartItem = {
                                type: 'line',
                                name: 'MACDline',
                                data: macdArray,
                                yAxis: axis
                            }

                            arraySeries.push(macdChartItem);


                            //var signalChartItem = {
                            //    type: 'line',
                            //    name: 'signalLine',
                            //    data: macdSignalArray,
                            //    yAxis: axis,
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}

                            var signalChartItem = {
                                type: 'line',
                                name: 'signalLine',
                                data: macdSignalArray,
                                yAxis: axis
                            }
                            arraySeries.push(signalChartItem);


                            //var macdHistogramChartItem = {
                            //    type: 'column',
                            //    name: 'MACDHistogram',
                            //    data: macdHistogramArray,
                            //    yAxis: axis,
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}

                            var macdHistogramChartItem = {
                                type: 'column',
                                name: 'MACDHistogram',
                                data: macdHistogramArray,
                                yAxis: axis
                            }

                            arraySeries.push(macdHistogramChartItem);

                            indicatorPos = indicatorPos + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: 'MACD'
                                },
                                top: indicatorPos,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            };

                            indicatorPos = indicatorPos + 100;


                            yAxisArray.push(chartItemDef);

                            allCountIter++;

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
                        }
                    }
                    break;                

                case 'Trends':
                    {
                        var dataResults = {};
                        var widgetName = "";
                        var currentCount = mulitipleWidgetLookUp["Trends"];
                        if (typeof currentCount !== 'undefined') {
                            dataResults = dataLookUp["Trends" + ss];
                            widgetName = obj.CurrentResult.PresentationTypes[0].SubWidgetsAltName[ss];
                        }
                        else {
                            dataResults = dataLookUp["Trends"];
                            widgetName = "Trends";
                        }


                        if (dataResults != null || dataResults !== undefined) {
                            var dataLength = dataResults.length;
                            var smaData = [];

                            for (var ri = 0; ri < dataLength; ri++) {
                                smaData.push([
                                    dataResults[ri][0], // the date
                                    dataResults[ri][1] // the close
                                ])
                            }

                            //For handling multilple widgets of the same
                            //kind, this diversifies color
                            var selectedColor = "red";
                            if (WidgetAlreadyUsed('Trends', widgetUsedList)) {
                                selectedColor = GenerateRandomColour();
                            }

                            //var smaChartItem = {
                            //    code: 'sma',
                            //    name: widgetName,
                            //    color: selectedColor,
                            //    data: [smaData],
                            //    dataGrouping: {
                            //        units: groupingUnits
                            //    }
                            //}

                            var smaChartItem = {
                                //code: 'sma',
                                //name: widgetName,
                                //color: selectedColor,
                                //data: [smaData],

                                series: arraySeries[presentationTypeIndex].data,
                                name: "Slope Line",
                                startDate: dataResults[0][0],
                                lineWidth: 3,
                                color: 'red',
                                startValue: dataResults[0][1],
                                endDate: dataResults[1][0],
                                endValue: dataResults[1][1]


                                //series : arraySeries
                                //name: "Slope Line",
                                //startDate: 1430485200000,
                                //lineWidth: 3,
                                
                                //startValue: 120,
                                //endDate: 1430935200000,
                                //endValue: 150


                            }

                            trendsOverlayArray.push(smaChartItem);

                            allCountIter++;

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
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

                        if (summariesSet === false) {
                            GenerateSummary(obj, presentationTypeIndex);
                            summariesSet = true;
                        }
                        bSubWidgetSet = true;
                        allCountIter++;
                    }
                    break;
            }
            //indicatorGap = indicatorGap + 30;
        }

        //if (bSubWidgetSet === true) {
        //    $("#resultCanvas").append($('<br/><hr style="border: 0; color: #9E9E9E; background-color: #9E9E9E; height: 1px; width: 100%; text-align: left;" />'));
        //}
    }
    catch (ex) {
        alert(ex);
    }
}

function GenerateSummary(obj, presentationTypeIndex) {

    var genTabStr = "<table cellpadding='8' cellspacing='20' style='width:100%'><tr><td style='width:20%; border-left: 0px solid grey; vertical-align: top;'>";
    genTabStr += "<span style='color:#3a89ff;'><strong>Detailed Facts: </strong></span><br/> <br/>"
    genTabStr += "<table cellpadding='8' cellspacing='8' border='1' style='border-color:#E0E0E0;'>";


    for (var bb = 0; bb < obj.CurrentResult.ProcessedResults.KeyFieldIndex[presentationTypeIndex].length; bb++) {

        var selectingIndex = obj.CurrentResult.ProcessedResults.KeyFieldIndex[presentationTypeIndex][bb];

        genTabStr += "<tr style='border-color:#E0E0E0;'><td>" + obj.CurrentResult.ProcessedResults.Headers[selectingIndex]
            + "</td><td>"
        + obj.CurrentResult.ProcessedResults.ComputedResults[0][selectingIndex] + '</td></tr>';
    }
    genTabStr += "</table></td>";

    var firstSummary = obj.CurrentResult.RawDataResults[presentationTypeIndex].Summaries[0];
    var summaryMore = obj.CurrentResult.RawDataResults[presentationTypeIndex].Summaries[1];

    var ignoreMoreSummary = false;

    if (typeof firstSummary !== 'undefined') {
        if (!firstSummary) {
            firstSummary = summaryMore;
            ignoreMoreSummary = true;
        }

        if (ignoreMoreSummary === false) {

            genTabStr += "<td valign='top' style='width:40%; border-left: 1px solid grey; border-right: 1px solid grey; vertical-align: top;'>";
            genTabStr += "<div style='margin-left:10px;margin-right:10px;'><span style='color:#3a89ff;'><strong>Tabular Summary:</strong> </span><br/> <br/>";
            genTabStr += firstSummary;
            genTabStr += "</div></td>";
        }
    }


    if (ignoreMoreSummary === false) {
        if (typeof summaryMore !== 'undefined') {

            genTabStr += "<td valign='top' style='border-left: 0px solid grey; border-right: 0px solid grey; vertical-align: top;>";
            genTabStr += "<div style='margin-left:10px;margin-right:10px;'><span style='color:#3a89ff;'><strong>Analysis Summary:</strong> </span><br/>" +
                summaryMore + "</td>";
        }
    }
    genTabStr += "</tr></table>";
  

    var final = genTabStr;

    //$('<br/>' + final).appendTo($("#celln" + presentationTypeIndex));


    $(final).appendTo($("#summaryResults"));


   //var allElements = $('.genericResultsTable');

   // for (var j = 0; j < allElements.length; j++) {
   //     var idSelect = allElements[j].id;

   //     $('#' + idSelect).dynatable({
   //         table: {
   //             defaultColumnIdStyle: 'trimDash'
   //         },
   //         features: {
   //             paginate: true,
   //             search: false,
   //             recordCount: true,
   //             perPageSelect: false
   //         },
   //         writers: {
   //             _rowWriter: myRowWriter
   //         }
   //     }).bind('dynatable:afterProcess', addClickEvent);
   // }

    
   // addClickEvent();

   // function addClickEvent() {
   //     $('#' + idSelect).find("tr").on("click", function (evt, x) {
   //         SelectHighlighter(this.getAttribute('data-index'), currenthighChartsId);
   //     });
   // }




}


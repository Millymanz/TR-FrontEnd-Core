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

function PrepareChartData(presentationTypes, presentationTypeIndex, obj, dataLookUp, arraySeries, overlayArray, groupingUnits, yAxisArray, iter, extIndicatorLookUp, mulitipleWidgetLookUp, trendsOverlayArray, uniqueLookUpCount, extIndicatorLookUpNamesOnly, plotLinesArray) {
    
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
            if (yAxisArray.length > 0 || presentationTypes.MainWidget == 'CandleStickChart') {
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

                        if (summariesSet === false) {
                            GenerateSummary(obj, presentationTypeIndex);
                            summariesSet = true;
                        }
                    }
                    break;

                case 'PIVOTPOINTS':
                    {
                        var dataResults = {};
                        var widgetName = presentationTypes.SubWidgets[ss];

                        var currentCount = mulitipleWidgetLookUp[widgetName];
                        var startIndex = uniqueLookUpCount[widgetName];
                        var lineIndx = startIndex;

                        dataResults = dataLookUp[widgetName + lineIndx];

                        if (typeof currentCount !== 'undefined') {
                            uniqueLookUpCount[widgetName] = lineIndx + 1;
                        }
                        else {
                            dataResults = dataLookUp[widgetName];
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
                            if (WidgetAlreadyUsed('PIVOTPOINTS', widgetUsedList)) {
                                selectedColor = GenerateRandomColour();
                            }


                            var lineChartItem = {
                                value: dataResults[0][1],
                                color: 'green',
                                 dashStyle: 'none',
                                width: 2,
                                label: {
                                    text: 'Resistance Level 1'
                                }                                
                            }
                            plotLinesArray.push(lineChartItem);

                            var lineChartItemFirst = {
                                value: dataResults[1][1],
                                color: 'red',
                                 dashStyle: 'none',
                                width: 2,
                                label: {
                                    text: 'Resistance Level 2'
                                }
                            }
                            plotLinesArray.push(lineChartItemFirst);

                            var lineChartItemSecond = {
                                value: dataResults[2][1],
                                color: 'orange',
                                 dashStyle: 'none',
                                width: 2,
                                label: {
                                    text: 'Resistance Level 3'
                                }
                            }
                            plotLinesArray.push(lineChartItemSecond);

                            var lineChartItemThree = {
                                value: dataResults[3][1],
                                color: 'green',
                                 dashStyle: 'none',
                                width: 2,
                                label: {
                                    text: 'Support Level 1'
                                }
                            }
                            plotLinesArray.push(lineChartItemThree);

                            var lineChartItemFour = {
                                value: dataResults[4][1],
                                color: 'red',
                                 dashStyle: 'none',
                                width: 2,
                                label: {
                                    text: 'Support Level 2'
                                }
                            }
                            plotLinesArray.push(lineChartItemFour);

                            var lineChartItemFive = {
                                value: dataResults[5][1],
                                color: 'orange',
                                 dashStyle: 'none',
                                width: 2,
                                label: {
                                    text: 'Support Level 3'
                                }
                            }
                            plotLinesArray.push(lineChartItemFive);












                            //var lineChartItem = {
                            //    value: 1.51812,
                            //    color: 'blue',
                            //    dashStyle: 'shortdash',
                            //    width: 2,
                            //    label: {
                            //        text: 'Last quarter minimum'
                            //    }
                            //}
                            //plotLinesArray.push(lineChartItem);


                            //var lineChartItemFirst = {
                            //    value: 1.57772,
                            //    color: 'green',
                            //    dashStyle: 'shortdash',
                            //    width: 2,
                            //    label: {
                            //        text: 'Last quarter minimum'
                            //    }
                            //}
                            //plotLinesArray.push(lineChartItemFirst);



                            //var lineChartItemSecond = {
                            //    value: 1.511,
                            //    color: 'yellow',
                            //    dashStyle: 'shortdash',
                            //    width: 2,
                            //    label: {
                            //        text: 'Last quarter minimum'
                            //    }
                            //}
                            //plotLinesArray.push(lineChartItemSecond);



                            //var lineChartItemThree = {
                            //    value: 1.37,
                            //    color: 'green',
                            //    dashStyle: 'shortdash',
                            //    width: 2,
                            //    label: {
                            //        text: 'Last quarter minimum'
                            //    }
                            //}
                            //plotLinesArray.push(lineChartItemThree);



                            //var lineChartItemFour = {
                            //    value: 1.6,
                            //    color: 'green',
                            //    dashStyle: 'shortdash',
                            //    width: 2,
                            //    label: {
                            //        text: 'Last quarter minimum'
                            //    }
                            //}
                            //plotLinesArray.push(lineChartItemFour);



                            //var lineChartItemFive = {
                            //    value: 1.45,
                            //    color: 'black',
                            //    dashStyle: 'shortdash',
                            //    width: 2,
                            //    label: {
                            //        text: 'Last quarter minimum'
                            //    }
                            //}
                            //plotLinesArray.push(lineChartItemFive);







                            allCountIter++;

                            if (summariesSet === false) {
                                GenerateSummary(obj, presentationTypeIndex);
                                summariesSet = true;
                            }
                        }
                    }
                    break;

                case 'EMA':
                case 'TMA':                  
                case 'SMA':
                case 'NORMAL':
                    {
                        var dataResults = {};

                        var widgetName = presentationTypes.SubWidgets[ss];

                        var currentCount = mulitipleWidgetLookUp[widgetName];
                        var startIndex = uniqueLookUpCount[widgetName];
                        var lineIndx = startIndex;

                        dataResults = dataLookUp[widgetName + lineIndx];

                        if (typeof currentCount !== 'undefined') {
                            uniqueLookUpCount[widgetName] = lineIndx + 1;
                        }
                        else {
                            dataResults = dataLookUp[widgetName];
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
                            if (WidgetAlreadyUsed(widgetName, widgetUsedList)) {
                                selectedColor = GenerateRandomColour();
                            }

                            var nameWidget = widgetName + lineIndx;

                            var smaChartItem = {
                                code: nameWidget,
                                name: nameWidget,
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

                case "MONTH HIGH":
                case "MONTH LOW":
                case "DAY HIGH":
                case "DAY LOW":
                    {                        
                        var dataResults = {};

                        var widgetName = presentationTypes.SubWidgets[ss];

                        var currentCount = mulitipleWidgetLookUp[widgetName];
                        var startIndex = uniqueLookUpCount[widgetName];
                        var lineIndx = startIndex;

                        dataResults = dataLookUp[widgetName + lineIndx];

                        if (typeof currentCount !== 'undefined') {
                            uniqueLookUpCount[widgetName] = lineIndx + 1;
                        }
                        else {
                            dataResults = dataLookUp[widgetName];
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
                            var selectedColor = "orange";
                            if (WidgetAlreadyUsed(widgetName, widgetUsedList)) {
                                selectedColor = GenerateRandomColour();
                            }

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
                        //var widgetName = "";

                        //var lowerBollingerBandsIndx = ss + 2;
                        //var upperBollingerBandsIndx = ss + 1;
                        //var middleBollingerBandsIndx = ss + 0;

                        //var dataUpperBand = dataLookUp["UpperBand" + upperBollingerBandsIndx];
                        //var dataLowerBand = dataLookUp["LowerBand" + lowerBollingerBandsIndx];
                        //var dataMiddleBand = dataLookUp["MiddleBand" + middleBollingerBandsIndx];



                        var widgetName = "BollingerBands";

                        var startIndex = uniqueLookUpCount[widgetName];


                        var lowerBollingerBandsIndx = startIndex + 2;
                        var upperBollingerBandsIndx = startIndex + 1;
                        var middleBollingerBandsIndx = startIndex + 0;

                        var dataUpperBand = dataLookUp["UpperBand" + upperBollingerBandsIndx];
                        var dataLowerBand = dataLookUp["LowerBand" + lowerBollingerBandsIndx];
                        var dataMiddleBand = dataLookUp["MiddleBand" + middleBollingerBandsIndx];


                        if (typeof dataUpperBand !== 'undefined' && typeof dataLowerBand !== 'undefined') {
                            //Add 2 because of OutSlowKData and OutSlowDData 
                            uniqueLookUpCount[widgetName] = uniqueLookUpCount[widgetName] + 2;
                        }
                        else {
                            dataUpperBand = dataLookUp["UpperBand"];
                            dataLowerBand = dataLookUp["LowerBand"];
                            dataMiddleBand = dataLookUp["MiddleBand"];
                        }









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
                        var dataResults = {};

                        var widgetName = presentationTypes.SubWidgets[ss];

                       // var currentCount = mulitipleWidgetLookUp[widgetName];

                        var startIndex = uniqueLookUpCount[widgetName];
                        var lineIndx = startIndex;

                        dataResults = dataLookUp[widgetName + lineIndx];

                        if (typeof dataResults !== 'undefined') {
                            uniqueLookUpCount[widgetName] = lineIndx + 1;
                        }
                        else {
                            dataResults = dataLookUp[widgetName];
                        }


                       var indicatorName = extIndicatorLookUpNamesOnly[ss];
                        //var selectIndicator = ss + 1;
                        //var selectIndicator = lineIndx + 1;

                        //var selectIndicator = lineIndx + 1;

                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];
                        
                        selectChartKey = selectChartKey + indicatorName;
                       

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

                //case 'StochRSI':
                //    {
                //        var indicatorName = presentationTypes.SubWidgets[ss];

                //        selectChartKey = selectChartKey + indicatorName;

                //        var stochasticPKDataTemp = dataLookUp["OutFastKData"];
                //        var stochasticPDDataTemp = dataLookUp["OutFastDData"];


                //        if (stochasticPKDataTemp != null || stochasticPKDataTemp !== undefined) {
                //            var dataLength = stochasticPKDataTemp.length;
                //            var stochasticPKData = [];
                //            var stochasticPDData = [];

                //            for (var ri = 0; ri < dataLength; ri++) {

                //                stochasticPKData.push([
                //                    stochasticPKDataTemp[ri][0], // the date
                //                    stochasticPKDataTemp[ri][1] // the close
                //                ])

                //                stochasticPDData.push([
                //                    stochasticPDDataTemp[ri][0], // the date
                //                    stochasticPDDataTemp[ri][1] // the close
                //                ])
                //            }
                //            var axis = 1;

                //            var macdChartItem = {
                //                type: 'line',
                //                name: 'StochRSI %K ',
                //                data: stochasticPKData,
                //                yAxis: axis,
                //                /*dashStyle: 'ShortDash'*/
                //            }

                //            arraySeries.push(macdChartItem);

                //            var signalChartItem = {
                //                type: 'line',
                //                name: 'StochRSI %D ',
                //                data: stochasticPDData,
                //                dashStyle: 'LongDash',
                //                yAxis: axis
                //            }

                //            arraySeries.push(signalChartItem);

                //            indicatorPos = indicatorPos + indicatorGap;

                //            var chartItemDef = {
                //                title: {
                //                    text: 'StochRSI'
                //                },
                //                top: indicatorPos,
                //                height: 100,
                //                offset: 0,
                //                lineWidth: 2
                //            };

                //            indicatorPos = indicatorPos + 100;

                //            yAxisArray.push(chartItemDef);

                //            allCountIter++;

                //            if (summariesSet === false) {
                //                GenerateSummary(obj, presentationTypeIndex);
                //                summariesSet = true;
                //            }
                //        }
                //    }
                    //    break;


                case 'StochRSI':
                    {
                        var stochasticPKDataTemp = {};
                        var stochasticPDDataTemp = {};

                        var widgetName = "StochRSI";

                        var startIndex = uniqueLookUpCount[widgetName];

                        var outSlowKDataIndx = startIndex + 1;
                        var outSlowDDataIndx = startIndex + 0;

                        stochasticPKDataTemp = dataLookUp["OutFastKData" + outSlowKDataIndx];
                        stochasticPDDataTemp = dataLookUp["OutFastDData" + outSlowDDataIndx];

                        if (typeof stochasticPKDataTemp !== 'undefined' && typeof stochasticPDDataTemp !== 'undefined') {
                            //Add 2 because of OutSlowKData and OutSlowDData 
                            uniqueLookUpCount[widgetName] = uniqueLookUpCount[widgetName] + 2;
                        }
                        else {
                            stochasticPKDataTemp = dataLookUp["OutFastKData"];
                            stochasticPDDataTemp = dataLookUp["OutFastDData"];
                        }
                        
                        var selectIndicator = ss + 1;

                        var indicatorName = extIndicatorLookUpNamesOnly[ss];


                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];


                        selectChartKey = selectChartKey + indicatorName;


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
                                yAxis: yAxisPos,
                                dashStyle: 'ShortDash'
                            }

                            arraySeries.push(macdChartItem);


                            var signalChartItem = {
                                type: 'line',
                                name: 'StochRSI %D ',
                                data: stochasticPDData,
                                dashStyle: 'LongDash',
                                yAxis: yAxisPos
                            }

                            arraySeries.push(signalChartItem);

                            indicatorPos = indicatorPos + indicatorGap;

                            var chartItemDef = {
                                title: {
                                    text: 'Stoch RSI'
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
                        var stochasticPKDataTemp = {};
                        var stochasticPDDataTemp = {};

                        var widgetName = "Stochastic";

                        var startIndex = uniqueLookUpCount[widgetName];

                        var outSlowKDataIndx = startIndex + 1;
                        var outSlowDDataIndx = startIndex + 0;

                        stochasticPKDataTemp = dataLookUp["OutSlowKData" + outSlowKDataIndx];
                        stochasticPDDataTemp = dataLookUp["OutSlowDData" + outSlowDDataIndx];

                        if (typeof stochasticPKDataTemp !== 'undefined' && typeof stochasticPDDataTemp !== 'undefined') {
                            //Add 2 because of OutSlowKData and OutSlowDData 
                            uniqueLookUpCount[widgetName] = uniqueLookUpCount[widgetName] + 2;
                        }
                        else {
                            stochasticPKDataTemp = dataLookUp["OutSlowKData"];
                            stochasticPDDataTemp = dataLookUp["OutSlowDData"];
                        }


                        //var currentCount = mulitipleWidgetLookUp["OutSlowKData"];
                        //var currentAltCount = mulitipleWidgetLookUp["OutSlowDData"];
                        //if (typeof currentCount !== 'undefined' && typeof currentAltCount !== 'undefined') {

                        //    stochasticPKDataTemp = dataLookUp["OutSlowKData" + ss];
                        //    stochasticPDDataTemp = dataLookUp["OutSlowDData"+ ss];

                        //    widgetName = obj.CurrentResult.PresentationTypes[presentationTypeIndex].SubWidgetsAltName[ss];
                        //}
                        //else {
                        //    stochasticPKDataTemp = dataLookUp["OutSlowKData"];
                        //    stochasticPDDataTemp = dataLookUp["OutSlowDData"];
                        //    widgetName = "Stochastic";
                        //}

                        //var indicatorName = presentationTypes.SubWidgets[ss];
                        var selectIndicator = ss + 1;

                         var indicatorName = extIndicatorLookUpNamesOnly[ss];

                        //var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName + selectIndicator];

                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];


                        selectChartKey = selectChartKey + indicatorName;

                        //var stochasticPKDataTemp = dataLookUp["OutSlowKData"];
                        //var stochasticPDDataTemp = dataLookUp["OutSlowDData"];
                       

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
                        var widgetName = indicatorName;

                        selectChartKey = selectChartKey + "MACD";

                        var startIndex = uniqueLookUpCount[widgetName];

                        var macdLineIndx = startIndex + 2;
                        var signalLineIndx = startIndex + 1;
                        var macdHistogramIndx = startIndex + 0;


                        var dataMACD = dataLookUp["MACDLine" + macdLineIndx];
                        var dataSignal = dataLookUp["SignalLine" + signalLineIndx];
                        var dataMACDHistogram = dataLookUp["MACDHistogram" + macdHistogramIndx];

                        var indicatorName = extIndicatorLookUpNamesOnly[ss];
                        var yAxisPos = extIndicatorLookUp.indicatorLookUp[indicatorName];
                        selectChartKey = selectChartKey + indicatorName;

                        if (typeof dataMACD !== 'undefined' && typeof dataSignal !== 'undefined' && typeof dataMACDHistogram !== 'undefined') {
      
                            uniqueLookUpCount[widgetName] = uniqueLookUpCount[widgetName] + 3;
                        }
                        else {
                            dataMACD = dataLookUp["MACDLine"];
                            dataSignal = dataLookUp["SignalLine"];
                            dataMACDHistogram = dataLookUp["MACDHistogram"];
                        }



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

                          var macdChartItem = {
                                type: 'line',
                                name: 'MACDline',
                                data: macdArray,
                                yAxis: yAxisPos
                            }
                            arraySeries.push(macdChartItem);



                            var signalChartItem = {
                                type: 'line',
                                name: 'signalLine',
                                data: macdSignalArray,
                                yAxis: yAxisPos
                            }
                            arraySeries.push(signalChartItem);


                            var macdHistogramChartItem = {
                                type: 'column',
                                color: '#ff4d4d',
                                name: 'MACDHistogram',
                                data: macdHistogramArray,
                                yAxis: yAxisPos
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

    if (obj.CurrentResult.ProcessedResults.KeyFieldIndex.length > presentationTypeIndex) {
        for (var bb = 0; bb < obj.CurrentResult.ProcessedResults.KeyFieldIndex[presentationTypeIndex].length; bb++) {

            var selectingIndex = obj.CurrentResult.ProcessedResults.KeyFieldIndex[presentationTypeIndex][bb];

            genTabStr += "<tr style='border-color:#E0E0E0;'><td>" + obj.CurrentResult.ProcessedResults.Headers[selectingIndex]
                + "</td><td>"
            + obj.CurrentResult.ProcessedResults.ComputedResults[0][selectingIndex] + '</td></tr>';
        }
        genTabStr += "</table></td>";

        var textState = "";
        var firstSummary = obj.CurrentResult.RawDataResults[presentationTypeIndex].Summaries[0];
        var summaryMore = obj.CurrentResult.RawDataResults[presentationTypeIndex].Summaries[1];

        var ignoreMoreSummary = false;
        var switchTitle = "Tabular Summary";

        if (typeof firstSummary !== 'undefined') {
            if (!firstSummary) {
                textState = firstSummary;
                firstSummary = summaryMore;
                ignoreMoreSummary = true;
            }

            if (typeof summaryMore === 'undefined' || textState === "" && ignoreMoreSummary) {
                switchTitle = "Analysis Summary";
            }

            if (ignoreMoreSummary === false /*|| textState === "" && ignoreMoreSummary*/) {

                genTabStr += "<td valign='top' style='width:40%; border-left: 1px solid grey; border-right: 1px solid grey; vertical-align: top;'>";
                genTabStr += "<div style='margin-left:10px;margin-right:10px;'><span style='color:#3a89ff;'><strong>" + switchTitle + ":</strong> </span><br/><br/>";
                genTabStr += firstSummary;
                genTabStr += "</div></td>";
            }
        }


        if (ignoreMoreSummary === false) {
            if (typeof summaryMore !== 'undefined') {

                genTabStr += "<td valign='top' style='border-left: 0px solid grey; border-right: 0px solid grey; vertical-align: top;>";
                genTabStr += "<div style='margin-left:10px;margin-right:10px;'><span style='color:#3a89ff;'><strong>Analysis Summary:</strong> </span><br/><br/>" +
                    summaryMore + "</td>";
            }
        }
        genTabStr += "</tr></table>";


        var final = genTabStr;

        //$('<br/>' + final).appendTo($("#celln" + presentationTypeIndex));


        $(final).appendTo($("#summaryResults"));
    }


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


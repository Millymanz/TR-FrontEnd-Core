$(function() {
    var overlay1Data = [];
    var overlay2Data = [];
    var overlay3Data_1 = [];
    var overlay3Data_2 = [];
    var MACDline = [];
    var signalLine = [];
    var MACDHistogram = [];
    var aroonUp = [];
    var aroonDown = [];
    var aroonOsc = [];
    var rsIndex = [];
    var i, d, j, tempData, dd, SMA, datePoint;
    var SMADays = 10;
    var conversionLine = [];
    var baseLine = [];
    var leadingSpanA = [];
    var leadingSpanB = [];
    var laggingSpan = [];
    var stochasticDays = 14;
    var stanDevData = [];
    var stochasticPKData = [];
    var stochasticPDData = [];
    var EMA12 = data[0][4];
    var EMA26 = data[0][4];
    var stanDev = 0;
    var macline = 0,
        sigline = 0,
        machist = 0;
    var daySinceHigh = 0;
    var daySinceLow = 0;
    var highHigh = 0,
        lowLow = 0,
        highHigh9 = 0,
        lowLow9 = 0,
        highHigh26 = 0,
        lowLow26 = 0,
        highHigh52 = 0,
        lowLow52 = 0;
    var arup = 0,
        ardow = 0;
    var avgGain = 0;
    var avgLoss = 0;
    var ohlc = [],
        volume = [],
        dataLength = data.length;
    var groupingUnits = [
        ['week', // unit name
            [1] // allowed multiples
        ],
        ['month', [1, 2, 3, 4, 6]]
    ];
    var higlighters = [];
    var firstTR = 0;
    var avtr = [];

    dataCalculations(data);

    function dataCalculations(data) {
        overlay1Data = [];
        overlay2Data = [];
        overlay3Data_1 = [];
        stochasticPDData = [];
        stochasticPKData = [];
        overlay3Data_2 = [];
        MACDline = [];
        stanDevData = [];
        signalLine = [];
        MACDHistogram = [];
        aroonUp = [];
        aroonDown = [];
        aroonOsc = [];
        rsIndex = [];
        SMADays = 10;
        EMA12 = data[0][4];
        conversionLine = [];
        baseLine = [];
        leadingSpanA = [];
        leadingSpanB = [];
        laggingSpan = [];
        EMA26 = data[0][4];
        macline = 0;
        sigline = 0;
        machist = 0;
        highHigh = lowLow = 0;
        highHigh9 = lowLow9 = 0;
        highHigh26 = lowLow26 = 0;
        highHigh52 = lowLow52 = 0;
        daySinceHigh = 0;
        daySinceLow = 0;
        arup = 0;
        ardow = 0;
        avgGain = 0;
        avgLoss = 0;
        firstTR = data[0][2] - data[0][3];
        avtr = 0;
        avtrInd = [];
        for (i = 1; i < 15; i++) {
            var diff = data[i][4] - data[i - 1][4];
            if (diff > 0) {
                avgGain += diff;
            } else {
                avgLoss += Math.abs(diff);
            }
            firstTR = Math.max((data[i][2] - data[i][3]), (data[i][2] - data[i - 1][4]), (data[i][3] - data[i - 1][4]));
            avtr += firstTR;
        }

        avtr = firstTR / 14;
        // avtrInd.push([data[14][0], avtr]);
        avgGain = avgGain / 14;
        avgLoss = avgLoss / 14;
        for (i = 0; i < data.length; i++) {
            d = data[i];
            // console.log(d);
            datePoint = data[i + SMADays];
            /*overlay1Data.push([d[0], d[4] + 20]);*/
            tempData = 0;
            stanDev = 0;
            // highHigh = lowLow = 0;
            highHigh9 = lowLow9 = 0;
            highHigh26 = lowLow26 = 0;
            highHigh52 = lowLow52 = 0;
            var count = i + SMADays;
            if (count < data.length && (datePoint !== undefined)) {
                for (j = i; j < count; j++) {
                    dd = data[j];
                    tempData = tempData + dd[4];
                }

                SMA = tempData / SMADays;
                for (j = i; j < count; j++) {
                    dd = data[j];
                    stanDev += Math.pow((dd[4] - SMA), 2)
                }



                stanDev = Math.sqrt(stanDev / SMADays);
                overlay1Data.push([datePoint[0], SMA]);
            }

            stanDevData.push([d[0], stanDev]);
            overlay2Data.push([d[0], d[4] + 10]);
            overlay3Data_1.push([d[0], d[4] - 20]);
            overlay3Data_2.push([d[0], d[4] + 20]);
            EMA12 = (d[4] - EMA12) * (2 / (12 + 1)) + EMA12;
            EMA26 = (d[4] - EMA26) * (2 / (26 + 1)) + EMA26;
            macline = EMA26 - EMA12;
            sigline = (macline - sigline) * (2 / (9 + 1)) + sigline;
            machist = macline - sigline;
            MACDline.push([d[0], macline]);
            signalLine.push([d[0], sigline]);
            MACDHistogram.push([d[0], machist]);
            for (j = 0; j < stochasticDays; j++) {
                if (i + j < data.length - 1) {
                    if (highHigh < data[i + j][2]) {
                        highHigh = data[i + j][2]
                    }
                    if (lowLow > data[i + j][3]) {
                        lowLow = data[i + j][3]
                    }
                }
            }
            for (j = 0; j < 52; j++) {
                if (j < 9 && i + j < data.length - 1) {
                    if (highHigh9 < data[i + j][2]) {
                        highHigh9 = data[i + j][2]
                    }
                    if (lowLow9 > data[i + j][3]) {
                        lowLow9 = data[i + j][3]
                    }
                }
                if (j < 26 && i + j < data.length - 1) {
                    if (highHigh26 < data[i + j][2]) {
                        highHigh26 = data[i + j][2]
                    }
                    if (lowLow26 > data[i + j][3]) {
                        lowLow26 = data[i + j][3]
                    }
                }
                if (i + j < data.length - 1) {
                    if (highHigh52 < data[i + j][2]) {
                        highHigh52 = data[i + j][2]
                    }
                    if (lowLow52 > data[i + j][3]) {
                        lowLow52 = data[i + j][3]
                    }
                }
            }
            conversionLine.push([data[i][0], (highHigh9 + lowLow9) / 2]);
            baseLine.push([data[i][0], (highHigh26 + lowLow26) / 2]);
            leadingSpanA.push([data[i][0], (conversionLine[i][1] + baseLine[i][1]) / 2]);
            leadingSpanB.push([data[i][0], (highHigh52 + lowLow52) / 2]);
            if (i + 25 < data.length) {
                laggingSpan.push([data[i][0], data[i + 25][4]]);
            }
            stochasticPKData.push([data[i][0], (data[i][4] - lowLow) / (highHigh - lowLow) * 100]);
            if (i + 2 < data.length && i >= 2) {
                stochasticPDData.push([data[i][0], (stochasticPKData[i][1] + stochasticPKData[i - 1][1] + stochasticPKData[i - 2][1]) / 3]);
            }
            if (daySinceLow <= 0) {
                for (var k = 0; k < 25; k++) {
                    if (i + k < data.length - 1) {
                        if (data[i + k][3] < data[i + k + 1][3]) {
                            daySinceLow = k;
                        }
                    }
                }
            } else {
                var ad = ((25 - daySinceLow) / 25) * 100;
                ardow = ad;
                aroonDown.push([d[0], ad]);
                daySinceLow--;
            }
            if (daySinceHigh <= 0) {
                for (var k = 0; k < 25; k++) {
                    if (i + k < data.length - 1) {
                        if (data[i + k][2] > data[i + k + 1][2]) {
                            daySinceHigh = k;
                        }
                    }
                }
            } else {
                var ad = ((25 - daySinceHigh) / 25) * 100;
                arup = ad;
                aroonUp.push([d[0], ad]);
                daySinceHigh--;
            }
            aroonOsc.push([d[0], arup - ardow]);
            if (i > 14) {
                diff = d[4] - data[i - 1][4];
                var gain = 0;
                var loss = 0;
                if (diff > 0) {
                    loss = 0;
                    gain = diff;
                } else {
                    loss = Math.abs(diff);
                    gain = 0;
                }
                avgLoss = ((avgLoss * 13) + loss) / 14;
                avgGain = ((avgGain * 13) + gain) / 14;
                var rs = avgGain / avgLoss;
                var rsi = 100 - (100 / (1 + rs));
                rsIndex.push([d[0], rsi]);
                firstTR = Math.max((data[i][2] - data[i][3]), (data[i][2] - data[i - 1][4]), (data[i][3] - data[i - 1][4]));
                var temp = avtr;
                avtr = ((temp * 13) + firstTR) / 14;
                avtrInd.push([d[0], avtr]);
            }
            // EMA26Data.push(d[0],EMA26);
        }
        // console.log(aroonDown);
        //console.log(overlay1Data);
        // split the data set into ohlc and volume
        ohlc = [];
        volume = [];
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
            ]);
        }
        // set the allowed units for data grouping
        groupingUnits = [
            ['week', // unit name
                [1] // allowed multiples
            ],
            ['month', [1, 2, 3, 4, 6]]
        ];
        higlighters = [{
            colour: '#dddddd',
            axisIndex: 1,
            seriesIndex: 0,
            startDate: Date.UTC(2013, 0, 20),
            endDate: Date.UTC(2013, 0, 27)
        }, {
            colour: '#dddddd',
            axisIndex: 1,
            seriesIndex: 0,
            startDate: Date.UTC(2013, 3, 23),
            endDate: Date.UTC(2013, 3, 30),
            speechBubbleHtml: '<b>Histogram </b> <br/> other comment '
        }, {
            colour: '#daffbf',
            axisIndex: 1,
            seriesIndex: 1,
            startDate: Date.UTC(2013, 4, 5),
            endDate: Date.UTC(2013, 4, 9),
            speechBubbleHtml: 'cccc 2'
        }, {
            colour: '#dddddd',
            axisIndex: 2,
            seriesIndex: 1,
            startDate: Date.UTC(2013, 3, 23),
            endDate: Date.UTC(2013, 3, 30),
            speechBubbleHtml: '<b>Histogram </b> <br/> other comment '
        }, {
            colour: '#efff2c',
            axisIndex: 0,
            startDate: Date.UTC(2013, 0, 3),
            endDate: Date.UTC(2013, 0, 7)
        }, {
            colour: '#bfdaff',
            axisIndex: 0,
            startDate: Date.UTC(2013, 3, 1),
            endDate: Date.UTC(2013, 3, 8),
            speechBubbleHtml: 'aaaa'
        }, {
            colour: '#fbffd4',
            axisIndex: 0,
            startDate: Date.UTC(2013, 4, 5),
            endDate: Date.UTC(2013, 4, 9),
            speechBubbleHtml: 'bbbb'
        }, {
            colour: '#bfdaff',
            axisIndex: 3,
            startDate: Date.UTC(2013, 3, 1),
            endDate: Date.UTC(2013, 3, 8),
            speechBubbleHtml: 'aaaa'
        }, {
            colour: '#fbffd4',
            axisIndex: 3,
            startDate: Date.UTC(2013, 4, 5),
            endDate: Date.UTC(2013, 4, 9),
            speechBubbleHtml: 'bbbb'
        }];
        // create the chart

    }
    var chart = $('#container').highcharts('StockChart', {
        rangeSelector: {
            selected: 1
        },
        tooltip: {
            style: {
                height: '200px',
                width: '700px'
            },
            pointFormat: '<span style="color:{series.color};white-space:nowrap"> \u25CF{series.name}: <b>{point.y}</b></span>',
            // The HTML of the point's line in the tooltip. Variables are enclosed by curly brackets. Available variables are point.x, point.y, series.name and series.color and other properties on the same form. Furthermore, point.y can be extended by the tooltip.yPrefix and tooltip.ySuffix variables.
            positioner: function() {
                return {
                    x: 20,
                    y: 80
                };
            },
        },
        title: {
            text: 'AAPL Historical'
        },
        xAxis: {
            _plotBands: [{ // mark the weekend
                color: '#FCFFC5',
                from: Date.UTC(2013, 3, 2),
                to: Date.UTC(2013, 3, 8)
            }]
        },
        plotOptions: {
            candlestick: {
                lineWidth: 1
            },
            area: {
                fillOpacity: 0.2
            }
        },
        yAxis: [{
            title: {
                text: 'OHLC'
            },
            top: 200,
            height: 300,
            lineWidth: 2
        }, {
            title: {
                text: 'Aroon'
            },
            top: 525,
            height: 100,
            offset: 0,
            lineWidth: 1
        }, {
            title: {
                text: 'MACD'
            },
            top: 650,
            height: 100,
            offset: 0,
            lineWidth: 2
        }, {
            title: {
                text: 'STD'
            },
            top: 775,
            height: 100,
            offset: 0,
            lineWidth: 2
        }, {
            top: 900,
            // right: 100,
            title: {
                text: 'Ichimoku Cloud'
            },
            offset: 0,
            height: 200,
            opposite: true

        }, {

            top: 525,
            // right: 100,
            offset: 0,
            height: 100,
            labels: {
                enabled: false
            },
            opposite: true

        }, {
            top: 650,
            // right: 100,
            offset: 0,
            labels: {
                enabled: false
            },
            height: 100,
            opposite: true

        }, {
            top: 775,
            // right: 100,
            offset: 0,
            labels: {
                enabled: false
            },
            height: 100,
            opposite: true

        }],
        series: [
            /*{
        type: 'line',
        name: 'AAPL',
        data: ohlc,
        dataGrouping: {
        units: groupingUnits
        }
        },*/
            {
                type: 'candlestick',
                name: 'AAPL',
                data: ohlc,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'column',
                name: 'MACDHistogram',
                data: MACDHistogram,
                yAxis: 2,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'signalLine',
                data: signalLine,
                yAxis: 2,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'MACDline',
                data: MACDline,
                yAxis: 2,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'Aroon Down',
                data: aroonDown,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'Aroon Up',
                data: aroonUp,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'area',
                name: 'Aroon Oscillator',
                data: aroonOsc,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'RSI',
                data: rsIndex,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'Standard Deviation Ind',
                data: stanDevData,
                yAxis: 3,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'Stochastic %K ',
                data: stochasticPKData,
                yAxis: 3,
                dashStyle: 'ShortDash',
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'Stochastic %D ',
                data: stochasticPDData,
                dashStyle: 'LongDash',
                yAxis: 3,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'AVTRI',
                data: avtrInd,
                yAxis: 3,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'Conversion Line',
                data: conversionLine,
                yAxis: 4,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'Base Line',
                data: baseLine,
                yAxis: 4,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'Leading Span A',
                data: leadingSpanA,
                // color: "rgba(200, 0, 0, 0.2)",
                yAxis: 4,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'Leading Span B',
                data: leadingSpanB,
                // color: "rgba(124, 181, 236,0.2)",
                yAxis: 4,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'line',
                name: 'Lagging Span',
                data: laggingSpan,
                yAxis: 4,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'column',
                yAxis: 5,
                name: 'Volume',
                color: "rgba(176, 35, 123,0.3)",
                data: volume,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'column',
                yAxis: 6,
                name: 'Volume',
                enableMouseTracking: false,
                color: "rgba(176, 35, 123,0.3)",
                data: volume,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'column',
                yAxis: 7,
                name: 'Volume',
                enableMouseTracking: false,
                color: "rgba(176, 35, 123,0.3)",
                data: volume,
                dataGrouping: {
                    units: groupingUnits
                }
            },
        ],
        // highlightRegion: [{
        //     colour: '#efff2c',
        //     startDate: Date.UTC(2013, 0, 3),
        //     endDate: Date.UTC(2013, 0, 7)
        // }, {
        //     colour: '#bfdaff',
        //     startDate: Date.UTC(2013, 3, 1),
        //     endDate: Date.UTC(2013, 3, 8),
        //     speechBubbleHtml: 'aaaa'
        // }, {
        //     colour: '#fbffd4',
        //     startDate: Date.UTC(2013, 4, 5),
        //     endDate: Date.UTC(2013, 4, 9),
        //     speechBubbleHtml: 'bbbb'
        // }],
        // highlightRegionVolume : [
        //     {
        //         colour: '#dddddd',
        //         startDate:Date.UTC(2013, 0, 20),
        //         endDate:Date.UTC(2013, 0, 27)
        //     },
        //     {
        //         colour: '#dddddd',
        //         startDate:Date.UTC(2013, 3, 23),
        //         endDate:Date.UTC(2013, 3, 30),
        //         speechBubbleHtml:'cccc 1 <a href="http://www.google.com">click</a> <br/> 
        //asda qweq2342  err4523423 2342342 3453 23423422 '
        //     },
        //     {
        //         colour: '#daffbf',
        //         startDate:Date.UTC(2013, 4, 5),
        //         endDate:Date.UTC(2013, 4, 9),
        //         speechBubbleHtml:'cccc 2'
        //     }
        // ],
        highlighted: true,
        highlightRegion: higlighters,
        trendLines: [{
            name: "Trend signalLine",
            startDate: Date.UTC(2013, 4, 7),
            lowColor: "#42ad5e",
            highColor: "#4e66dc",
            endDate: Date.UTC(2013, 3, 19)
        }],
        overlay: [{
                code: 'sma',
                name: 'SMA',
                color: 'red',
                data: [overlay1Data],
                dataGrouping: {
                    units: groupingUnits
                }
            }
            /*,
                {
                    code: 'ema',
                    name:'EMA',
                    color:'green',
                    data:[overlay2Data]
                }*/
            , {
                code: 'bbands',
                name: 'Bolinger Bands',
                color: 'blue',
                data: [overlay3Data_1, overlay3Data_2],
                dataGrouping: {
                    units: groupingUnits
                }
            }
        ]
    });
    // console.log(Highcharts.charts[0]);
    // $('#highlighted').prop('checked',true);
    $("#highlighted").on("change", function(evt) {
        Highcharts.charts[0].highlighted = $('#highlighted').prop('checked');
        Highcharts.charts[0].redraw();
    });
    $("#nextData").on("click", function(evt) {
        alert("Loading Next Data Set");
        var chart = Highcharts.charts[0];
        dataCalculations(data2);
        chart.series[0].setData(ohlc);
        chart.series[1].setData(MACDHistogram);
        chart.series[2].setData(signalLine);
        chart.series[3].setData(MACDline);
        chart.series[4].setData(aroonDown);
        chart.series[5].setData(aroonUp);
        chart.series[6].setData(aroonOsc);
        chart.series[7].setData(rsIndex);
        Highcharts.charts[0].redraw();
    });

});

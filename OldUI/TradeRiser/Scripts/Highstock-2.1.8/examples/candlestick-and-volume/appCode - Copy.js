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
        [
            'second', [1, 2, 5, 10, 15, 30]
        ],
        [
            'minute', [1, 2, 5, 10, 15, 30]
        ],
        [
            'hour', [1, 2, 3, 4, 6, 8, 12]
        ],
        [
            'day', [1]
        ],
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
            [
                'second', [1, 2, 5, 10, 15, 30]
            ],
            [
                'minute', [1, 2, 5, 10, 15, 30]
            ],
            [
                'hour', [1, 2, 3, 4, 6, 8, 12]
            ],
            [
                'day', [1]
            ],
            ['week', // unit name
                [1] // allowed multiples
            ],
            ['month', [1, 2, 3, 4, 6]]
        ];
        higlighters = [{
            //     colour: '#dddddd',
            //     axisIndex: 0,
            //     key: "ichimokuCloud",
            //     startDate: Date.UTC(2013, 0, 20),
            //     endDate: Date.UTC(2013, 0, 27)
            // }, {
            //     colour: '#dddddd',
            //     axisIndex: 0,
            //     key: "ichimokuCloud",
            //     startDate: Date.UTC(2013, 3, 23),
            //     endDate: Date.UTC(2013, 3, 30),
            //     speechBubbleHtml: '<b>Histogram </b> <br/> other comment '
            // }, {
            colour: '#daffbf',
            key: "massIndex",
            // seriesKey: 'sma',
            // axisIndex: 0,
            // seriesIndex: 0,
            id: 1,
            startDate: 1449480600000,
            endDate: 1449482400000,
            speechBubbleHtml: 'cccc 2'
        }, {
            colour: '#dddddd',
            // key: "massIndex",
            axisIndex: 0,
            seriesKey: 'stochasticOscillator',
            id: 2,
            startDate: 1449585900000,
            endDate: 1449588600000,
            speechBubbleHtml: '<b>Histogram </b> <br/> other comment '
        }, {
            colour: '#efff2c',
            // key: "massIndex",
            axisIndex: 0,
            // seriesIndex: 0,
            seriesKey: 'sma',
            id: 3,
            startDate: 1449559800000,
            endDate: 1449561600000,
            speechBubbleHtml: '<b>Speech Bubble </b> <br/> other comment '

        }, {
            colour: '#bfdaff',
            // key: "massIndex",
            axisIndex: 0,
            id: 4,
            startDate: 1449574200000,
            endDate: 1449576900000,
            speechBubbleHtml: 'aaaa'
        }, {
            colour: '#fbffd4',
            // key: "massIndex",            
            axisIndex: 0,
            id: 5,
            startDate: 1449553500000,
            endDate: 1449555300000,
            speechBubbleHtml: 'bbbb'
        }, {
            colour: '#bfdaff',
            // key: "massIndex",
            axisIndex: 0,
            id: 6,
            startDate: 1449568800000,
            endDate: 1449571500000,
            seriesKey: 'ichimokuCloud',
            speechBubbleHtml: 'aaaa1'
        }, {
            colour: '#fbffd4',
            // key: "massIndex",
            axisIndex: 0,
            seriesKey: 'ichimokuCloud',
            id: 7,
            startDate: 1449550800000,
            endDate: 1449552600000,
            speechBubbleHtml: 'bbbb3'
        }];

        // create the chart

    }
    var chart = $('#container').highcharts('StockChart', {
        rangeSelector: {
            enabled: false
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
        navigator: {
            enabled: true
        },
        plotOptions: {
            candlestick: {
                lineWidth: 1,
                color: "#2f7ed8",
                borderColor: "#FFFFFF",
                lineColor: "#2f7ed8",
                lineWidth: 1,
                upColor: "silver",
                upLineColor: "silver"
            },
            area: {
                fillOpacity: 0.2
            },
            series: {
                dataGrouping: {
                    enabled: false
                }
            }
        },
        yAxis: [{
            title: {
                text: 'OHLC'
            },
            top: 100,
            height: 300,
            lineWidth: 2
        }],
        series: [{
            type: 'candlestick',
            name: 'EUR/USD:FXCM',
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }],
        highlighted: true,
        highlightRegion: higlighters,
        overlay: [],
    });
    // console.log(Highcharts.charts[0]);
    // $('#highlighted').prop('checked',true);
    function addClickEvent() {
        $("#records_table").find("tbody").find("tr").on("click", function(evt, x) {
            var idx;
            var indexId = this.getAttribute('data-index');
            _.each(higlighters, function(item, index) {
                if (item.id == indexId) {
                    idx = index;
                }
            });
            selectHighlighter(idx);
            console.log('hey');
        });
    }
    $("#highlighted").on("change", function(evt) {
        Highcharts.charts[0].highlighted = $('#highlighted').prop('checked');
        Highcharts.charts[0].redraw();
        var trHTML = "";
        $.each(higlighters, function(i, item) {

            trHTML += '<tr data-index="' + item.id + '" class="rowItem"><td>' + item.id + '</td><td>' + (new Date(item.startDate)) + '</td><td>' + (new Date(item.endDate)) + '</td><td>' + (item.key || item.seriesKey ? item.key || item.seriesKey : 'default') + '</td><td>' + item.speechBubbleHtml + '</td></tr>';
        });
        if ($('#highlighted').prop('checked')) {
            $(".rowItem").remove();
            $('#records_table').append(trHTML);
            // $(".rowItem").on("click", function(evt, x) {
            //     selectHighlighter(this.getAttribute('data-index'));
            // });

            function myRowWriter(rowIndex, record, columns, cellWriter) {
                var tr = '';

                // grab the record's attribute for each column
                for (var i = 0, len = columns.length; i < len; i++) {
                    tr += cellWriter(columns[i], record);
                }

                return '<tr data-index=' + record.id + '>' + tr + '</tr>';
            };
            $("#records_table").dynatable({
                writers: {
                    _rowWriter: myRowWriter
                },
                dataset: {
                    perPageDefault: 5,
                }
            }).bind('dynatable:afterProcess', addClickEvent);


            addClickEvent();
        }
    });
    var highlightersLength = higlighters.length - 1;
    $(".highlightButton").on("click", function(evt, x) {
        console.log(evt, x);
        if (this.id == "next") {
            highlightersLength++;
        } else {
            highlightersLength--;
        }
        var chart = Highcharts.charts[0];
        // console.log(chart.xAxis[0].getExtremes());
        if (highlightersLength < 0) {
            highlightersLength = higlighters.length - 1;
        }
        if (highlightersLength > higlighters.length - 1) {
            highlightersLength = highlightersLength % (higlighters.length);
        }
        selectHighlighter(highlightersLength);

        // var val = highlightersLength;
        // var xtrem = chart.xAxis[0].getExtremes();
        // var diff = xtrem.userMax - xtrem.userMin;

        // chart.xAxis[0].setExtremes(
        //     higlighters[val].startDate - diff / 2,
        //     higlighters[val].startDate + diff / 2
        // );
    });
    var selectHighlighter = function(highlightersLength) {
        var val = highlightersLength;
        var chart = Highcharts.charts[0];

        var xtrem = chart.xAxis[0].getExtremes();
        var diff = xtrem.userMax - xtrem.userMin;
        chart.xAxis[0].setExtremes(
            higlighters[val].startDate - diff / 2,
            higlighters[val].startDate + diff / 2
        );
        // var region = chart.highlightedRegions[val].element;
        // var pinLeft = ($(region).attr("x") + ($(region).attr("w") / 2) - (chart.pinsConf.width / 2));
        // var pinTop = ($(region).attr("y") - chart.pinsConf.height);

        for (var i = 0; i < chart.pins.length; i++) {
            if (higlighters[val].speechBubbleHtml == chart.pins[i].attr('data-comment')) {
                // if (chart.pins[i].attr("left") == pinLeft && chart.pins[i].attr("top") == pinTop)
                chart.pins[i].click();
            }
        }
    };
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
    var chart = Highcharts.charts[0];
    var top = chart.yAxis[0].bottom;
    var activeIndicators = [];

    var addIndicator = function(key) {
        // console.log(this);
        var chart = Highcharts.charts[0];
        var ichimokuSeries = [{
            type: 'line',
            name: 'Conversion Line',
            data: conversionLine,
            // yAxis: 4,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'line',
            name: 'Base Line',
            data: baseLine,
            // yAxis: 4,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'line',
            name: 'Leading Span A',
            data: leadingSpanA,
            // color: "rgba(200, 0, 0, 0.2)",
            // yAxis: 4,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'line',
            name: 'Leading Span B',
            data: leadingSpanB,
            // color: "rgba(124, 181, 236,0.2)",
            // yAxis: 4,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'line',
            name: 'Lagging Span',
            data: laggingSpan,
            // yAxis: 4,
            dataGrouping: {
                units: groupingUnits
            }
        }];
        var indicator = key;
        var addAxistoChart = function(title, indicator) {
            var chart = Highcharts.charts[0];

            var id = 'x' + (new Date().getUTCMilliseconds());

            activeIndicators.push({
                id: id,
                indicator: indicator
            });

            chart.yAxis[0].update({
                height: (100 - ((activeIndicators.length + 1) * 20)) + "%"
            });
            // top: (i === 0 ? 0 : i + 1) + "%",
            //     height: (s === 100 ? 100 : s - 1) + "%"
            chart.addAxis({
                id: id,
                // labels: {
                //     enabled: false
                // },
                // height: "10%",
                top: (100 - ((activeIndicators.length) * 20)) + "%",
                height: 10 + "%",
                // top: top + 20,
                title: {
                    text: title
                },
                opposite: true
            });
            chart.options.activeIndicators = activeIndicators;

            // top += 100 + 20;
            return id;
        };
        switch (indicator) {
            case 'sma':
                chart.options.overlay.push({
                    code: 'sma',
                    name: 'SMA',
                    color: 'red',
                    id: key,
                    data: [overlay1Data],
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.render();
                break;
            case 'volume':
                var id = addAxistoChart("Volume", indicator);
                chart.addSeries({
                    type: 'column',
                    yAxis: id,
                    name: 'Volume',
                    enableMouseTracking: false,
                    color: "rgba(176, 35, 123,0.3)",
                    data: volume,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.redraw();
                break;
            case 'standardDeviation':
                var id = addAxistoChart("SDI", indicator);
                chart.addSeries({
                    type: 'line',
                    name: 'Standard Deviation Ind',
                    data: stanDevData,
                    yAxis: id,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.redraw();
                break;
            case 'aroon':
                var id = addAxistoChart("Aroon", indicator);
                chart.addSeries({
                    type: 'line',
                    name: 'Aroon Down',
                    data: aroonDown,
                    yAxis: id,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.addSeries({
                    type: 'line',
                    name: 'Aroon Up',
                    data: aroonUp,
                    yAxis: id,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.redraw();
                break;
            case 'aroonOscillator':
                var id = addAxistoChart("AroonOscillator", indicator);
                chart.addSeries({
                    type: 'area',
                    name: 'Aroon Oscillator',
                    data: aroonOsc,
                    yAxis: id,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.redraw();
                break;
            case 'macd':
                var id = addAxistoChart("MACD", indicator);
                chart.addSeries({
                    type: 'line',
                    name: 'signalLine',
                    data: signalLine,
                    yAxis: id,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.addSeries({
                    type: 'line',
                    name: 'MACDline',
                    data: MACDline,
                    yAxis: id,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.redraw();
                break;
            case 'stochasticOscillator':
                var id = addAxistoChart("Stochastic", indicator);
                chart.addSeries({
                    type: 'line',
                    name: 'Stochastic %K ',
                    data: stochasticPKData,
                    yAxis: id,
                    dashStyle: 'ShortDash',
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.addSeries({
                    type: 'line',
                    name: 'Stochastic %D ',
                    data: stochasticPDData,
                    dashStyle: 'LongDash',
                    yAxis: id,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.redraw();
                break;
            case 'macdHistogram':
                var id = addAxistoChart("MACD Histogram", indicator);
                chart.addSeries({
                    type: 'column',
                    name: 'MACDHistogram',
                    data: MACDHistogram,
                    yAxis: id,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.redraw();
                break;
            case 'rsi':
                var id = addAxistoChart("RSI", indicator);
                chart.addSeries({
                    type: 'line',
                    name: 'RSI',
                    data: rsIndex,
                    yAxis: id,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.redraw();
                break;
            case 'atr':
                var id = addAxistoChart("ATR", indicator);
                chart.addSeries({
                    type: 'line',
                    name: 'AVTRI',
                    data: avtrInd,
                    yAxis: id,
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
                chart.redraw();
                break;
            case 'bollinger':
            case 'keltnerChannels':
            case 'priceChannels':
            case 'emaEnvelope':
            case 'smaEnvelope':
                // var id = addAxistoChart("keltnerChannels");
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var plotData = [],
                        plotData1 = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[0], data.data[i].v[1]])
                        plotData1.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[2]]);
                    }
                    chart.addSeries({
                        type: 'arearange',
                        id: key,
                        name: data.seriesConfig[0] ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        data: plotData,
                        fillOpacity: 0.1,
                        // yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                    chart.addSeries({
                        type: 'line',
                        // name: 'EMA',
                        id: key + 1,
                        data: plotData1,
                        name: data.seriesConfig[2] ? data.seriesConfig[2].name : key,
                        color: data.seriesConfig[2] ? data.seriesConfig[2].color : '',
                        dashStyle: data.seriesConfig[2] ? data.seriesConfig[2].dashStyle : '',
                        // yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        },
                    });
                });
                break;

            case 'chandelierExit':
                // var id = addAxistoChart("keltnerChannels");
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var plotData = [],
                        plotData1 = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[0]])
                        plotData1.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[1]]);
                    }
                    chart.addSeries({
                        type: 'line',
                        id: key,

                        name: data.seriesConfig[0] ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        data: plotData,
                        fillOpacity: 0.2,
                        // yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                    chart.addSeries({
                        type: 'line',
                        // name: 'EMA',
                        id: key + 1,
                        data: plotData1,
                        name: data.seriesConfig[1] ? data.seriesConfig[1].name : key,
                        color: data.seriesConfig[1] ? data.seriesConfig[1].color : '',
                        dashStyle: data.seriesConfig[1] ? data.seriesConfig[1].dashStyle : '',
                        // yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                });
                break;
            case 'ema':
            case 'wma':
                // var id = addAxistoChart("keltnerChannels");
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var plotData = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v])
                    }
                    chart.addSeries({
                        type: 'line',
                        id: i > 0 ? key + i : key,
                        name: data.seriesConfig && data.seriesConfig[0] ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig && data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        data: plotData,
                        // fillOpacity: 0.2,
                        // yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                });
                break;
            case 'dailyPivot':
                // var id = addAxistoChart("keltnerChannels");
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var info = {
                        plotData0: [],
                        plotData1: [],
                        plotData2: [],
                        plotData3: [],
                        plotData4: [],
                        plotData5: [],
                        plotData6: []
                    };
                    for (var i = 0; i < data.data.length; i++) {
                        info.plotData0.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[0]])
                        info.plotData1.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[1]]);
                        info.plotData2.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[2]]);
                        info.plotData3.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[3]]);
                        info.plotData4.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[4]]);
                        info.plotData5.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[5]]);
                        info.plotData6.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[6]]);
                    }
                    for (var i = 0; i < 8; i++) {
                        chart.addSeries({
                            type: 'line',
                            // id: key,
                            id: i > 0 ? key + i : key,

                            name: data.seriesConfig[i] ? data.seriesConfig[i].name : key,
                            color: data.seriesConfig[i] ? data.seriesConfig[i].color : '',
                            data: info["plotData" + i],
                            dashStyle: data.seriesConfig[i] ? data.seriesConfig[i].dashStyle : '',
                            fillOpacity: 0.2,
                            // yAxis: id,
                            dataGrouping: {
                                units: groupingUnits
                            },
                        });
                    };
                });
                break;
            case 'ichimokuCloud':
                // var id = addAxistoChart("keltnerChannels");
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var info = {
                        plotData0: [],
                        plotData1: [],
                        plotData2: [],
                        plotData3: [],
                        plotData4: [],
                        plotData5: [],
                        plotData6: []
                    };
                    for (var i = 0; i < data.data.length; i++) {
                        info.plotData0.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[0]])
                        info.plotData1.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[1]]);
                        info.plotData2.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[2]]);
                        info.plotData3.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[3]]);
                        info.plotData4.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[4]]);
                        info.plotData5.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[5][0], data.data[i].v[5][1]]);
                        info.plotData6.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[6][0], data.data[i].v[6][1]]);
                    }
                    for (var i = 0; i < 7; i++) {
                        chart.addSeries({
                            type: i < 5 ? 'line' : 'arearange',
                            name: data.seriesConfig[i] ? data.seriesConfig[i].name : key,
                            color: data.seriesConfig[i] ? data.seriesConfig[i].color : '',
                            // id: key,
                            id: i > 0 ? key + i : key,
                            data: info["plotData" + i],
                            dashStyle: data.seriesConfig[i] ? data.seriesConfig[i].dashStyle : '',
                            fillOpacity: i < 5 ? 1 : 0.2,
                            lineWidth: data.seriesConfig[i] && data.seriesConfig[i].lineWidth ? data.seriesConfig[i].lineWidth : 1,
                            plotOffset: data.seriesConfig[i] && data.seriesConfig[i].plotOffset ? data.seriesConfig[i].plotOffset : '',
                            // yAxis: id,
                            dataGrouping: {
                                units: groupingUnits
                            },
                        });
                    };
                });
                break;
            case 'adl':
            case 'cci':
            case 'coppock':
            case 'emv':
            case 'gapo':
            case 'massIndex':
            case 'mfi':
            case 'obv':
            case 'pgo':
            case 'qStick':
            case 'roc':
            case 'stochRsi':
            case 'uo':
            case 'williamsR':
                var id = addAxistoChart(key, indicator);
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);


                    var plotData = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v])
                    }
                    chart.addSeries({
                        type: 'line',
                        name: data.seriesConfig && data.seriesConfig[0] ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig && data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        data: plotData,
                        // fillOpacity: 0.2,
                        lineWidth: 0.5,
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                });
                break;
            case 'dpo':
                var id = addAxistoChart(key, indicator);
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var plotData = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[0], data.data[i].v[1]])
                    }
                    chart.addSeries({
                        type: 'area',
                        name: data.seriesConfig && data.seriesConfig[0] ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig && data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        data: plotData,
                        // fillOpacity: 0.2,
                        lineWidth: 0.5,
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                });
                break;
            case 'forceIndex':
                var id = addAxistoChart(key, indicator);
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var plotData = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v]);
                    }
                    chart.addSeries({
                        type: 'areaspline',
                        name: data.seriesConfig && data.seriesConfig[0] ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig && data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        data: plotData,
                        fillOpacity: 0.2,
                        lineWidth: 0.5,
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                });
                break;
            case 'bollingerBandwidth':
                var id = addAxistoChart(key, indicator);
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var plotData = [],
                        plotData1 = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[0], data.data[i].v[1]])
                        plotData1.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[2]]);
                    }
                    chart.addSeries({
                        type: 'arearange',
                        name: data.seriesConfig[0] ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        data: plotData,
                        fillOpacity: 0.1,
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        },
                    });
                    chart.addSeries({
                        type: 'line',
                        data: plotData1,
                        name: data.seriesConfig[2] ? data.seriesConfig[2].name : key,
                        color: data.seriesConfig[2] ? data.seriesConfig[2].color : '',
                        dashStyle: data.seriesConfig[2] ? data.seriesConfig[2].dashStyle : '',
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        },
                    });

                });
                break;
            case 'cog':
            case 'cmo':
            case 'fisherTransform':
            case 'kst':
            case 'pmo':
            case 'trix':
            case 'tsi':
            case 'vtx':
                var id = addAxistoChart(key, indicator);
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var plotData = [],
                        plotData1 = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[0]])
                        plotData1.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[1]]);
                    }
                    chart.addSeries({
                        type: 'line',
                        name: data.seriesConfig[0] ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        data: plotData,
                        fillOpacity: 0.2,
                        lineWidth: 1,
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                    chart.addSeries({
                        type: 'line',
                        // name: 'EMA',
                        data: plotData1,
                        lineWidth: 1,
                        name: data.seriesConfig[1] && data.seriesConfig[1].name ? data.seriesConfig[1].name : key,
                        color: data.seriesConfig[1] ? data.seriesConfig[1].color : '',
                        dashStyle: data.seriesConfig[1] ? data.seriesConfig[1].dashStyle : '',
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });

                });
                break;
            case 'elderBBPower':
                var id = addAxistoChart(key, indicator);
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var plotData = [],
                        plotData1 = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[0]])
                        plotData1.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[1]]);
                    }
                    chart.addSeries({
                        type: 'column',
                        name: data.seriesConfig[0] ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        data: plotData,
                        fillOpacity: 0.2,
                        lineWidth: 1,
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                    chart.addSeries({
                        type: 'column',
                        // name: 'EMA',
                        data: plotData1,
                        lineWidth: 1,
                        name: data.seriesConfig[1] && data.seriesConfig[1].name ? data.seriesConfig[1].name : key,
                        color: data.seriesConfig[1] ? data.seriesConfig[1].color : '',
                        dashStyle: data.seriesConfig[1] ? data.seriesConfig[1].dashStyle : '',
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                });
                break;
            case 'ppo':
                var id = addAxistoChart(key, indicator);
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var plotData = [],
                        plotData1 = [],
                        plotData2 = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[0]])
                        plotData1.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[1]]);
                        plotData2.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[2]]);
                    }
                    chart.addSeries({
                        type: 'column',
                        name: data.seriesConfig[0] ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        data: plotData,
                        fillOpacity: 0.2,
                        lineWidth: 1,
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                    chart.addSeries({
                        type: 'line',
                        // name: 'EMA',
                        data: plotData1,
                        lineWidth: 1,
                        name: data.seriesConfig[1] && data.seriesConfig[1].name ? data.seriesConfig[1].name : key,
                        color: data.seriesConfig[1] ? data.seriesConfig[1].color : '',
                        dashStyle: data.seriesConfig[1] ? data.seriesConfig[1].dashStyle : '',
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                    chart.addSeries({
                        type: 'line',
                        // name: 'EMA',
                        data: plotData2,
                        lineWidth: 1,
                        name: data.seriesConfig[2] && data.seriesConfig[2].name ? data.seriesConfig[2].name : key,
                        color: data.seriesConfig[2] ? data.seriesConfig[2].color : '',
                        dashStyle: data.seriesConfig[2] ? data.seriesConfig[2].dashStyle : '',
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                });
                break;
            case 'pvo':
                var id = addAxistoChart(key, indicator);
                $.getJSON('json/' + indicator + ".json", function(data) {
                    console.log(data);
                    var plotData = [],
                        plotData1 = [],
                        plotData2 = [];
                    for (var i = 0; i < data.data.length; i++) {
                        plotData.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[2]])
                        plotData1.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[1]]);
                        plotData2.push([(new Date(data.data[i].t)).getTime(), data.data[i].v[0]]);
                    }
                    chart.addSeries({
                        type: 'column',
                        name: data.seriesConfig[2] ? data.seriesConfig[2].name : key,
                        color: data.seriesConfig[2] ? data.seriesConfig[2].color : '',
                        data: plotData,
                        fillOpacity: 0.2,
                        lineWidth: 1,
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                    chart.addSeries({
                        type: 'line',
                        // name: 'EMA',
                        data: plotData1,
                        lineWidth: 1,
                        name: data.seriesConfig[1] && data.seriesConfig[1].name ? data.seriesConfig[1].name : key,
                        color: data.seriesConfig[1] ? data.seriesConfig[1].color : '',
                        dashStyle: data.seriesConfig[1] ? data.seriesConfig[1].dashStyle : '',
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                    chart.addSeries({
                        type: 'line',
                        // name: 'EMA',
                        data: plotData2,
                        lineWidth: 1,
                        name: data.seriesConfig[0] && data.seriesConfig[0].name ? data.seriesConfig[0].name : key,
                        color: data.seriesConfig[0] ? data.seriesConfig[0].color : '',
                        dashStyle: data.seriesConfig[0] ? data.seriesConfig[0].dashStyle : '',
                        yAxis: id,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    });
                });
                break;
            default:
                var id = addAxistoChart("indicator");
                $.getJSON("json/" + indicator + ".json", function(data) {
                    console.log(data);
                });
                break;
        }

    };
    $('#myModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        console.log(button.context.innerHTML);
        var recipient = button.context.innerHTML + ":" + button.data('key') + ""; // Extract info from data-* attributes
        var modal = $(this);
        modal.find('.modal-title').text(recipient);
        // modal.find('.modal-body input').val(recipient);
    });
    $('#save_changes').on('click', function(event) {
        $('#myModal').modal('hide');
        var modal = $('#myModal');
        var key = modal.find('.modal-title').text().split(":")[1];
        var text = modal.find('.modal-title').text() + '<button class="close">x</button>';
        $('.active-list').append('<li class="active-list-item">' + text + '</li>');
        addIndicator(key);
    });
    $('.active-list').on('click', 'button', function(el) {

        $(this).parent().remove();
        var key = $(this).parent().text().split(":")[1];
        key = key.slice(0, key.length - 1);
        switch (key) {
            case 'sma':
            case 'ema':
            case 'bollinger':
                chart.options.overlay = _.reject(chart.options.overlay, function(item) {
                    if (item.code == key) {
                        return true;
                    } else {
                        return false;
                    }
                });

                chart.get(key).remove();
                if (chart.get(key)) {
                    chart.get(key).remove();
                }
                chart.redraw();
                break;
            case 'chandelierExit':
            case 'dailyPivot':
            case 'emaEnvelope':
            case 'ichimokuCloud':
            case 'keltnerChannels':
            case 'priceChannels':
            case 'smaEnvelope':
            case 'wma':

                $.each(chart.series, function(i, item) {
                    if (item && item.userOptions.id && item.userOptions.id.indexOf(key) != -1) {
                        item.hide(false);
                    }
                });
                chart.redraw();
                $.each(chart.series, function(i, item) {
                    if (item && item.userOptions.id && item.userOptions.id.indexOf(key) != -1) {
                        item.remove(false);
                    }
                });
                chart.redraw();
                break;
            default:
                activeIndicators = _.reject(activeIndicators, function(item) {
                    if (item.indicator == key) {
                        chart.get(item.id).remove();
                        return true;
                    } else {
                        return false;
                    }
                });


                chart.options.activeIndicators = activeIndicators;
                // chart.yAxis[0].update({
                //     height: (100 - ((activeIndicators.length + 1) * 20)) + "%"
                // });
                break;
        }

        // console.log(activeIndicators);

    });

});

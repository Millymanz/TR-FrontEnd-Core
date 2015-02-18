// JavaScript Document



//$(document).ready(function (e) {


    function SelectMiniChart(selectChartKey, presentationTypeIndex, obj,
        upperBollingerBand, lowerBollingerBand, smaOverlay, aroonOsc,
        aroonUp, aroonDown, rsiData, MACDHistogram, MACDline, avtrInd, higlighters, dataLookUp
        ) {


        switch (selectChartKey) {
            case 'Aroon Up':
            case 'Aroon Down':
            case 'Aroon Oscillator':
            case 2335:
            case 3286:
                {
                    var chartClassName = 'chartspace dialogchart' + presentationTypeIndex;

                    var classOnly = '.dialogchart' + presentationTypeIndex;

                    $("#resultCanvas").append($('<br/>' + '<table width="95%" cellpadding="30" cellspacing="1" border="1" style="border-color:#E0E0E0;  margin: 0 auto;"><tr><td>   <div class="' + chartClassName + '"style="height: 610px; width: 100%;"></div><br/><br/>    </td></tr></table>'));


                    var dataPrep = [];
                    var d, datePoint;


                    var dataResultsT = dataLookUp["RAW"];

                    if (dataResultsT != null || dataResultsT !== undefined) {

                        var lineSeriesOptions = [],
                            symbolNames = [];

                        var ohlc_CandleStick = [], volume_CandleStick = [];

                        for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
                            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
                        }

                        var c = 0;
                        var dataLength = dataResultsT.length;

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

                        //// set the allowed units for data grouping
                        var groupingUnits = [[
                            'week',                         // unit name
                            [1]                             // allowed multiples
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]];

                        var volume = volume_CandleStick;


                        $(classOnly).highcharts('StockChart', {
                            rangeSelector: {
                                selected: 1
                            },
                            title: {
                                text: symbolNames[0]
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
                                }
                            },
                            yAxis: [{
                                title: {
                                    text: 'OHLC'
                                },
                                height: 300,
                                lineWidth: 2
                            }, {
                                title: {
                                    text: 'Volume'
                                },
                                top: 400,
                                height: 100,
                                offset: 0,
                                lineWidth: 1
                            }                          

                            , {
                                title: {
                                    text: 'Aroon',
                                },
                                top: 400,
                                offset: 0,
                                height: 100,
                                opposite: true

                            }



                            ],
                            series: [
                              {
                                  type: 'candlestick',
                                  name: symbolNames[0],
                                  data: ohlc_CandleStick,
                                  dataGrouping: {
                                      units: groupingUnits
                                  }
                                }
                                ,

                                {
                                    type: 'line',
                                    name: 'Aroon Down',
                                    data: aroonDown,
                                    yAxis: 2,
                                    dataGrouping: {
                                        units: groupingUnits
                                    }
                                }, {
                                    type: 'line',
                                    name: 'Aroon Up',
                                    data: aroonUp,
                                    yAxis: 2,
                                    dataGrouping: {
                                        units: groupingUnits
                                    }
                                }, {
                                    type: 'area',
                                    name: 'Aroon Oscillator',
                                    data: aroonOsc,
                                    yAxis: 2,
                                    dataGrouping: {
                                        units: groupingUnits
                                    }
                                }

                                ,
                                
                                {
                                    type: 'column',
                                    yAxis: 1,
                                    name: 'Volume',
                                    color: "rgba(176, 35, 123,0.3)",
                                    data: volume,
                                    dataGrouping: {
                                        units: groupingUnits
                                    }
                                }
                            ],                           
                            highlighted: true,
                            highlightRegion: higlighters                         

                        });


                    }
                }
                break;

            case 'Aroon Up_MACD':
            case 'Aroon Down_MACD':
            case 'Aroon Oscillator_MACD':
                {

                }
                break;

            case 'Aroon Up_RSI':
            case 'Aroon Down_RSI':
            case 'Aroon Oscillator_RSI':
            case 1189:
            case 978:
            case 1833: /*Aroon OscillatorRSI*/
                {
                    var chartClassName = 'chartspace dialogchart' + presentationTypeIndex;

                    var classOnly = '.dialogchart' + presentationTypeIndex;

                    $("#resultCanvas").append($('<br/>' + '<table width="95%" cellpadding="30" cellspacing="1" border="1" style="border-color:#E0E0E0;  margin: 0 auto;"><tr><td>   <div class="' + chartClassName + '"style="height: 870px; width: 100%;"></div><br/>   </td></tr></table>'));


                    var dataPrep = [];
                    var d, datePoint;


                    var dataResultsT = dataLookUp["RAW"];

                    if (dataResultsT != null || dataResultsT !== undefined) {

                        var lineSeriesOptions = [],
                            symbolNames = [];

                        var ohlc_CandleStick = [], volume_CandleStick = [];

                        for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
                            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
                        }

                        var c = 0;
                        var dataLength = dataResultsT.length;

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

                        //// set the allowed units for data grouping
                        var groupingUnits = [[
                            'week',                         // unit name
                            [1]                             // allowed multiples
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]];

                        var volume = volume_CandleStick;


                        $(classOnly).highcharts('StockChart', {
                            rangeSelector: {
                                selected: 1
                            },
                            title: {
                                text: symbolNames[0]
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
                                }
                            },
                            yAxis: [{
                                title: {
                                    text: 'OHLC'
                                },
                                height: 300,
                                lineWidth: 2
                            }, {
                                title: {
                                    text: 'Volume'
                                },
                                top: 400,
                                height: 100,
                                offset: 0,
                                lineWidth: 1
                            }

                            ,

                             {
                                 title: {
                                     text: 'RSI'
                                 },
                                 top: 525,
                                 height: 100,
                                 offset: 0,
                                 lineWidth: 2
                             }

                             , {
                                 title: {
                                     text: 'Aroon'
                                 },
                                 top: 650,
                                 height: 100,
                                 offset: 0,
                                 lineWidth: 2
                             }
                            ],
                            series: [
                              {
                                  type: 'candlestick',
                                  name: symbolNames[0],
                                  data: ohlc_CandleStick,
                                  dataGrouping: {
                                      units: groupingUnits
                                  }
                              }
                                ,

                               {
                                   type: 'column',
                                   yAxis: 1,
                                   name: 'Volume',
                                   color: 'blue',
                                   data: volume,
                                   dataGrouping: {
                                       units: groupingUnits
                                   }
                               }
                               ,
                                 {
                                     type: 'line',
                                     name: 'RSI',
                                     data: rsiData,
                                     yAxis: 2,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }
                                ,
                                 
                                 {
                                     type: 'line',
                                     name: 'Aroon Down',
                                     data: aroonDown,
                                     yAxis: 3,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }, {
                                     type: 'line',
                                     name: 'Aroon Up',
                                     data: aroonUp,
                                     yAxis: 3,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }, {
                                     type: 'area',
                                     name: 'Aroon Oscillator',
                                     data: aroonOsc,
                                     yAxis: 3,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }

                            ],
                            highlighted: true,
                            highlightRegion: higlighters
                        });
                    }


                }
                break;

            case 'Aroon UpAroon DownAroon Oscillator':
                {
                    var chartClassName = 'chartspace dialogchart' + presentationTypeIndex;

                    var classOnly = '.dialogchart' + presentationTypeIndex;

                    $("#resultCanvas").append($('<br/>' + '<table width="95%" cellpadding="30" cellspacing="1" border="1" style="border-color:#E0E0E0;  margin: 0 auto;"><tr><td>   <div class="' + chartClassName + '"style="height: 670px; width: 100%;"></div><br/>   </td></tr></table>'));


                    var dataPrep = [];
                    var d, datePoint;

                    var dataResultsT = dataLookUp["RAW"];

                    if (dataResultsT != null || dataResultsT !== undefined) {

                        var lineSeriesOptions = [],
                            symbolNames = [];

                        var ohlc_CandleStick = [], volume_CandleStick = [];

                        for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
                            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
                        }

                        var c = 0;
                        var dataLength = dataResultsT.length;

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

                        //// set the allowed units for data grouping
                        var groupingUnits = [[
                            'week',                         // unit name
                            [1]                             // allowed multiples
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]];

                        var volume = volume_CandleStick;


                        $(classOnly).highcharts('StockChart', {
                            rangeSelector: {
                                selected: 1
                            },
                            title: {
                                text: symbolNames[0]
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
                                }
                            },
                            yAxis: [{
                                title: {
                                    text: 'OHLC'
                                },
                                height: 300,
                                lineWidth: 2
                            }, {
                                title: {
                                    text: 'Volume'
                                },
                                top: 400,
                                height: 100,
                                offset: 0,
                                lineWidth: 1
                            }

                            ,

                             {
                                 title: {
                                     text: 'Aroon'
                                 },
                                 top: 525,
                                 height: 100,
                                 offset: 0,
                                 lineWidth: 2
                             }
                             
                            ],
                            series: [
                              {
                                  type: 'candlestick',
                                  name: symbolNames[0],
                                  data: ohlc_CandleStick,
                                  dataGrouping: {
                                      units: groupingUnits
                                  }
                              }
                                ,

                               {
                                   type: 'column',
                                   yAxis: 1,
                                   name: 'Volume',
                                   color: 'blue',
                                   data: volume,
                                   dataGrouping: {
                                       units: groupingUnits
                                   }
                               }
                               ,
                                {
                                     type: 'line',
                                     name: 'Aroon Down',
                                     data: aroonDown,
                                     yAxis: 2,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }, {
                                     type: 'line',
                                     name: 'Aroon Up',
                                     data: aroonUp,
                                     yAxis: 2,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }, {
                                     type: 'area',
                                     name: 'Aroon Oscillator',
                                     data: aroonOsc,
                                     yAxis: 2,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }

                            ],
                            highlighted: true,
                            highlightRegion: higlighters
                        });
                    }


                }
                break;

            case 'Aroon UpAroon Down':
            case 1691:
                {
                    var chartClassName = 'chartspace dialogchart' + presentationTypeIndex;

                    var classOnly = '.dialogchart' + presentationTypeIndex;

                    $("#resultCanvas").append($('<br/>' + '<table width="95%" cellpadding="30" cellspacing="1" border="1" style="border-color:#E0E0E0;  margin: 0 auto;"><tr><td>   <div class="' + chartClassName + '"style="height: 670px; width: 100%;"></div><br/>   </td></tr></table>'));


                    var dataPrep = [];
                    var d, datePoint;

                    var dataResultsT = dataLookUp["RAW"];

                    if (dataResultsT != null || dataResultsT !== undefined) {

                        var lineSeriesOptions = [],
                            symbolNames = [];

                        var ohlc_CandleStick = [], volume_CandleStick = [];

                        for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
                            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
                        }

                        var c = 0;
                        var dataLength = dataResultsT.length;

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

                        //// set the allowed units for data grouping
                        var groupingUnits = [[
                            'week',                         // unit name
                            [1]                             // allowed multiples
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]];

                        var volume = volume_CandleStick;


                        $(classOnly).highcharts('StockChart', {
                            rangeSelector: {
                                selected: 1
                            },
                            title: {
                                text: symbolNames[0]
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
                                }
                            },
                            yAxis: [{
                                title: {
                                    text: 'OHLC'
                                },
                                height: 300,
                                lineWidth: 2
                            }, {
                                title: {
                                    text: 'Volume'
                                },
                                top: 400,
                                height: 100,
                                offset: 0,
                                lineWidth: 1
                            }

                            ,

                             {
                                 title: {
                                     text: 'Aroon'
                                 },
                                 top: 525,
                                 height: 100,
                                 offset: 0,
                                 lineWidth: 2
                             }

                            ],
                            series: [
                              {
                                  type: 'candlestick',
                                  name: symbolNames[0],
                                  data: ohlc_CandleStick,
                                  dataGrouping: {
                                      units: groupingUnits
                                  }
                              }
                                ,

                               {
                                   type: 'column',
                                   yAxis: 1,
                                   name: 'Volume',
                                   color: 'blue',
                                   data: volume,
                                   dataGrouping: {
                                       units: groupingUnits
                                   }
                               }
                               ,
                                {
                                    type: 'line',
                                    name: 'Aroon Down',
                                    data: aroonDown,
                                    yAxis: 2,
                                    dataGrouping: {
                                        units: groupingUnits
                                    }
                                }, {
                                    type: 'line',
                                    name: 'Aroon Up',
                                    data: aroonUp,
                                    yAxis: 2,
                                    dataGrouping: {
                                        units: groupingUnits
                                    }
                                }

                            ],
                            highlighted: true,
                            highlightRegion: higlighters
                        });
                    }


                }
                break;

            case 'Aroon Up_AVTRI':
            case 'Aroon Down_AVTRI':
            case 'Aroon Oscillator_AVTRI':
            case 971:
            case 1182:
            case 1826:
                {
                    var chartClassName = 'chartspace dialogchart' + presentationTypeIndex;

                    var classOnly = '.dialogchart' + presentationTypeIndex;

                    $("#resultCanvas").append($('<br/>' + '<table width="95%" cellpadding="30" cellspacing="1" border="1" style="border-color:#E0E0E0;  margin: 0 auto;"><tr><td>   <div class="' + chartClassName + '"style="height: 870px; width: 100%;"></div><br/>   </td></tr></table>'));


                    var dataPrep = [];
                    var d, datePoint;


                    var dataResultsT = dataLookUp["RAW"];

                    if (dataResultsT != null || dataResultsT !== undefined) {

                        var lineSeriesOptions = [],
                            symbolNames = [];

                        var ohlc_CandleStick = [], volume_CandleStick = [];

                        for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
                            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
                        }

                        var c = 0;
                        var dataLength = dataResultsT.length;

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

                        //// set the allowed units for data grouping
                        var groupingUnits = [[
                            'week',                         // unit name
                            [1]                             // allowed multiples
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]];

                        var volume = volume_CandleStick;


                        $(classOnly).highcharts('StockChart', {
                            rangeSelector: {
                                selected: 1
                            },
                            title: {
                                text: symbolNames[0]
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
                                }
                            },
                            yAxis: [{
                                title: {
                                    text: 'OHLC'
                                },
                                height: 300,
                                lineWidth: 2
                            }, {
                                title: {
                                    text: 'Volume'
                                },
                                top: 400,
                                height: 100,
                                offset: 0,
                                lineWidth: 1
                            }

                            ,

                             {
                                 title: {
                                     text: 'RSI'
                                 },
                                 top: 525,
                                 height: 100,
                                 offset: 0,
                                 lineWidth: 2
                             }

                             , {
                                 title: {
                                     text: 'Aroon'
                                 },
                                 top: 650,
                                 height: 100,
                                 offset: 0,
                                 lineWidth: 2
                             }
                            ],
                            series: [
                              {
                                  type: 'candlestick',
                                  name: symbolNames[0],
                                  data: ohlc_CandleStick,
                                  dataGrouping: {
                                      units: groupingUnits
                                  }
                              }
                                ,

                               {
                                   type: 'column',
                                   yAxis: 1,
                                   name: 'Volume',
                                   color: 'blue',
                                   data: volume,
                                   dataGrouping: {
                                       units: groupingUnits
                                   }
                               }
                               ,
                                 {
                                     type: 'line',
                                     name: 'ATR',
                                     data: avtrInd,
                                     yAxis: 2,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }
                                ,

                                 {
                                     type: 'line',
                                     name: 'Aroon Down',
                                     data: aroonDown,
                                     yAxis: 3,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }, {
                                     type: 'line',
                                     name: 'Aroon Up',
                                     data: aroonUp,
                                     yAxis: 3,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }, {
                                     type: 'area',
                                     name: 'Aroon Oscillator',
                                     data: aroonOsc,
                                     yAxis: 3,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }

                            ],
                            highlighted: true,
                            highlightRegion: higlighters
                        });
                    }


                }
                break;

            case 'Aroon Up_AVTRI_MACD':
            case 'Aroon Down_AVTRI_MACD':
            case 'Aroon Oscillator_AVTRI_MACD':
                {

                }
                break;

            case 'Aroon Up_AVTRI_RSI':
            case 'Aroon Down_AVTRI_RSI':
            case 'Aroon Oscillator_AVTRI_RSI':
                {

                }
                break;

            case 'Aroon Up_AVTRI_MACD_RSI':
            case 'Aroon Down_AVTRI_MACD_RSI':
            case 'Aroon Oscillator_AVTRI_MACD_RSI':
                {

                }
                break;

                //----------------------------------------------//
            case 'MACD':
                {

                }
                break;

            case 'MACD_AVTRI':
                {

                }
                break;

            case 'MACD_RSI':
                {

                }
                break;

            case 'MACD_AVTRI_RSI':
                {

                }
                break;
                //----------------------------------------------//
            case 'RSI':
                {
                    var chartClassName = 'chartspace dialogchart' + presentationTypeIndex;

                    var classOnly = '.dialogchart' + presentationTypeIndex;

                    $("#resultCanvas").append($('<br/>' + '<table width="95%" cellpadding="30" cellspacing="1" border="1" style="border-color:#E0E0E0;  margin: 0 auto;"><tr><td>   <div class="' + chartClassName + '"style="height: 740px; width: 100%;"></div><br/>   </td></tr></table>'));


                    var dataPrep = [];
                    var d, datePoint;


                    var dataResultsT = dataLookUp["RAW"];

                    if (dataResultsT != null || dataResultsT !== undefined) {

                        var lineSeriesOptions = [],
                            symbolNames = [];

                        var ohlc_CandleStick = [], volume_CandleStick = [];

                        for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
                            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
                        }

                        var c = 0;
                        var dataLength = dataResultsT.length;

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

                        //// set the allowed units for data grouping
                        var groupingUnits = [[
                            'week',                         // unit name
                            [1]                             // allowed multiples
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]];

                        var volume = volume_CandleStick;


                        $(classOnly).highcharts('StockChart', {
                            rangeSelector: {
                                selected: 1
                            },
                            title: {
                                text: symbolNames[0]
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
                                }
                            },
                            yAxis: [{
                                title: {
                                    text: 'OHLC'
                                },
                                height: 300,
                                lineWidth: 2
                            }, {
                                title: {
                                    text: 'Volume'
                                },
                                top: 400,
                                height: 100,
                                offset: 0,
                                lineWidth: 1
                            }

                            ,

                             {
                                 title: {
                                     text: 'RSI'
                                 },
                                 top: 525,
                                 height: 100,
                                 offset: 0,
                                 lineWidth: 2
                             }



                            ],
                            series: [
                              {
                                  type: 'candlestick',
                                  name: symbolNames[0],
                                  data: ohlc_CandleStick,
                                  dataGrouping: {
                                      units: groupingUnits
                                  }
                              }
                                ,

                               {
                                    type: 'column',
                                    yAxis: 1,
                                    name: 'Volume',
                                    color: 'blue',
                                    data: volume,
                                    dataGrouping: {
                                    units: groupingUnits
                                    }
                               }
                               ,

                                 {
                                    type: 'line',
                                    name: 'RSI',
                                    data: rsiData,
                                    yAxis: 2,
                                    dataGrouping: {
                                        units: groupingUnits
                                    }
                                 }                                
                            ],
                            highlighted: true,
                            highlightRegion: higlighters
                        });
                    }
                }
                break;

            case 'RSIATR':
            case 469:
                {
                    var chartClassName = 'chartspace dialogchart' + presentationTypeIndex;

                    var classOnly = '.dialogchart' + presentationTypeIndex;

                    $("#resultCanvas").append($('<br/>' + '<table width="95%" cellpadding="30" cellspacing="1" border="1" style="border-color:#E0E0E0;  margin: 0 auto;"><tr><td>   <div class="' + chartClassName + '"style="height: 870px; width: 100%;"></div><br/>   </td></tr></table>'));


                    var dataPrep = [];
                    var d, datePoint;


                    var dataResultsT = dataLookUp["RAW"];

                    if (dataResultsT != null || dataResultsT !== undefined) {

                        var lineSeriesOptions = [],
                            symbolNames = [];

                        var ohlc_CandleStick = [], volume_CandleStick = [];

                        for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
                            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
                        }

                        var c = 0;
                        var dataLength = dataResultsT.length;

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

                        //// set the allowed units for data grouping
                        var groupingUnits = [[
                            'week',                         // unit name
                            [1]                             // allowed multiples
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]];

                        var volume = volume_CandleStick;


                        $(classOnly).highcharts('StockChart', {
                            rangeSelector: {
                                selected: 1
                            },
                            title: {
                                text: symbolNames[0]
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
                                }
                            },
                            yAxis: [{
                                title: {
                                    text: 'OHLC'
                                },
                                height: 300,
                                lineWidth: 2
                            }, {
                                title: {
                                    text: 'Volume'
                                },
                                top: 400,
                                height: 100,
                                offset: 0,
                                lineWidth: 1
                            }

                            ,

                             {
                                 title: {
                                     text: 'RSI'
                                 },
                                 top: 525,
                                 height: 100,
                                 offset: 0,
                                 lineWidth: 2
                             }

                             , {
                                 title: {
                                     text: 'ATR'
                                 },
                                 top: 650,
                                 height: 100,
                                 offset: 0,
                                 lineWidth: 2
                             }
                            ],
                            series: [
                              {
                                  type: 'candlestick',
                                  name: symbolNames[0],
                                  data: ohlc_CandleStick,
                                  dataGrouping: {
                                      units: groupingUnits
                                  }
                              }
                                ,

                               {
                                   type: 'column',
                                   yAxis: 1,
                                   name: 'Volume',
                                   color: 'blue',
                                   data: volume,
                                   dataGrouping: {
                                       units: groupingUnits
                                   }
                               }
                               ,
                                 {
                                     type: 'line',
                                     name: 'RSI',
                                     data: rsiData,
                                     yAxis: 2,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }
                                ,

                                 {
                                     type: 'line',
                                     name: 'ATR',
                                     data: avtrInd,
                                     yAxis: 3,
                                     dataGrouping: {
                                         units: groupingUnits
                                     }
                                 }
                            ],
                            highlighted: true,
                            highlightRegion: higlighters
                        });
                    }

                }
                break;
                //----------------------------------------------//

            case 'ATR':
             case 231:
                 {
                     var chartClassName = 'chartspace dialogchart' + presentationTypeIndex;

                     var classOnly = '.dialogchart' + presentationTypeIndex;

                     $("#resultCanvas").append($('<br/>' + '<table width="95%" cellpadding="30" cellspacing="1" border="1" style="border-color:#E0E0E0;  margin: 0 auto;"><tr><td>   <div class="' + chartClassName + '"style="height: 740px; width: 100%;"></div><br/>   </td></tr></table>'));


                     var dataPrep = [];
                     var d, datePoint;

                     var dataResultsT = dataLookUp["RAW"];

                     if (dataResultsT != null || dataResultsT !== undefined) {

                         var lineSeriesOptions = [],
                             symbolNames = [];

                         var ohlc_CandleStick = [], volume_CandleStick = [];

                         for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
                             symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
                         }

                         var c = 0;
                         var dataLength = dataResultsT.length;

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

                         //// set the allowed units for data grouping
                         var groupingUnits = [[
                             'week',                         // unit name
                             [1]                             // allowed multiples
                         ], [
                             'month',
                             [1, 2, 3, 4, 6]
                         ]];

                         var volume = volume_CandleStick;


                         $(classOnly).highcharts('StockChart', {
                             rangeSelector: {
                                 selected: 1
                             },
                             title: {
                                 text: symbolNames[0]
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
                                 }
                             },
                             yAxis: [{
                                 title: {
                                     text: 'OHLC'
                                 },
                                 height: 300,
                                 lineWidth: 2
                             }, {
                                 title: {
                                     text: 'Volume'
                                 },
                                 top: 400,
                                 height: 100,
                                 offset: 0,
                                 lineWidth: 1
                             }

                             ,

                              {
                                  title: {
                                      text: 'ATR'
                                  },
                                  top: 525,
                                  height: 100,
                                  offset: 0,
                                  lineWidth: 2
                              }



                             ],
                             series: [
                               {
                                   type: 'candlestick',
                                   name: symbolNames[0],
                                   data: ohlc_CandleStick,
                                   dataGrouping: {
                                       units: groupingUnits
                                   }
                               }
                                 ,

                                {
                                    type: 'column',
                                    yAxis: 1,
                                    name: 'Volume',
                                    color: 'blue',
                                    data: volume,
                                    dataGrouping: {
                                        units: groupingUnits
                                    }
                                }
                                ,

                                  {
                                      type: 'line',
                                      name: 'ATR',
                                      data: avtrInd,
                                      yAxis: 2,
                                      dataGrouping: {
                                          units: groupingUnits
                                      }
                                  }
                             ],
                             highlighted: true,
                             highlightRegion: higlighters
                         });
                     }
                 }
                break;

            case 'ALL':
                {
                    var chart = $('#container').highcharts('StockChart', {
                        rangeSelector: {
                            selected: 1
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
                            }
                        },
                        yAxis: [{
                            title: {
                                text: 'OHLC'
                            },
                            height: 300,
                            lineWidth: 2
                        }, {
                            title: {
                                text: 'Aroon'
                            },
                            top: 400,
                            height: 100,
                            offset: 0,
                            lineWidth: 1
                        }, {
                            title: {
                                text: 'MACD'
                            },
                            top: 525,
                            height: 100,
                            offset: 0,
                            lineWidth: 2
                        }, {
                            title: {
                                text: 'AVTRI'
                            },
                            top: 650,
                            height: 100,
                            offset: 0,
                            lineWidth: 2
                        }, {
                            title: {
                                text: 'Volume',
                            },
                            top: 400,
                            // right: 100,
                            offset: 0,
                            height: 100,
                            opposite: true

                        }, {
                            title: {
                                text: 'Volume',
                            },
                            top: 525,
                            // right: 100,
                            offset: 0,
                            height: 100,
                            opposite: true

                        }, {
                            title: {
                                text: 'Volume',
                            },
                            top: 650,
                            // right: 100,
                            offset: 0,
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
                                data: rsiData,
                                yAxis: 1,
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
                                type: 'column',
                                yAxis: 4,
                                name: 'Volume',
                                color: "rgba(176, 35, 123,0.3)",
                                data: volume,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }, {
                                type: 'column',
                                yAxis: 5,
                                name: 'Volume',
                                enableMouseTracking: false,
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
                            }
                        ],

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
                            data: [smaOverlay],
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
                                data: [lowerBollingerBand, upperBollingerBand],
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }
                        ]
                    });



                }
                break;

            default:
                {
                    var chartClassName = 'chartspace dialogchart' + presentationTypeIndex;

                    var classOnly = '.dialogchart' + presentationTypeIndex;

                    var dataPrep = [];
                    var d, datePoint;


                    var dataResultsT = dataLookUp["RAW"];

                    if (dataResultsT != null || dataResultsT !== undefined) {

                        var lineSeriesOptions = [],
                            symbolNames = [];

                        var ohlc_CandleStick = [], volume_CandleStick = [];

                        for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[presentationTypeIndex].length; bb++) {
                            symbolNames.push(obj.CurrentResult.ResultSymbols[presentationTypeIndex][bb]);
                        }

                        var c = 0;
                        var dataLength = dataResultsT.length;

                        if (dataLength > 0) {

                            var dateTimeTemp = dataResultsT[1][0] - dataResultsT[0][0];
                           
                            var bIntradayChart = true;

                            if (dateTimeTemp >= 86400000)
                            {
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

                            //// set the allowed units for data grouping
                            var groupingUnits = [[
                                'week',                         // unit name
                                [1]                             // allowed multiples
                            ], [
                                'month',
                                [1, 2, 3, 4, 6]
                            ]];


                            if (bIntradayChart) {

                                // create the chart
                                $(classOnly).highcharts('StockChart', {

                                    title: {
                                        text: symbolNames[0]
                                    },
                                    rangeSelector: {
                                        buttons: [{
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
                                        }],
                                        selected: 2,
                                        inputEnabled: false
                                    },

                                    series: [{
                                        name: symbolNames[0],
                                        type: 'candlestick',
                                        data: ohlc_CandleStick,
                                        tooltip: {
                                            valueDecimals: 2
                                        }
                                    }],

                                    highlighted: true,
                                    highlightRegion: higlighters

                                });
                            }
                            else {
                                ///end of day data
                                $(classOnly).highcharts('StockChart', {
                                    rangeSelector: {
                                        selected: 1
                                    },

                                    title: {
                                        text: symbolNames[0]
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
                                        }
                                    },
                                    yAxis: [{
                                        title: {
                                            text: 'OHLC'
                                        },
                                        height: 310,
                                        lineWidth: 2
                                    }, {
                                        title: {
                                            text: 'Volume'
                                        },
                                        top: 400,
                                        height: 100,
                                        offset: 0,
                                        lineWidth: 2
                                    }],

                                    series: [
                                    {
                                        type: 'candlestick',
                                        name: symbolNames[0],
                                        data: ohlc_CandleStick,
                                        dataGrouping: {
                                            units: groupingUnits
                                        }
                                    }
                                    ,

                                    {
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
                                    },

                                    {
                                        type: 'area',
                                        name: 'Aroon Oscillator',
                                        data: aroonOsc,
                                        yAxis: 1,
                                        dataGrouping: {
                                            units: groupingUnits
                                        }
                                    },

                                    {
                                        type: 'line',
                                        name: 'RSI',
                                        data: rsiData,
                                        yAxis: 1,
                                        dataGrouping: {
                                            units: groupingUnits
                                        }
                                    }]


                                    ,
                                	highlighted: true,
                                	highlightRegion: higlighters,

                                    overlay: [
                                        {
                                            code: 'sma',
                                            name: 'SMA',
                                            color: 'red',
                                            data: [smaOverlay],
                                            dataGrouping: {
                                                units: groupingUnits
                                            }
                                        }
                                      ,

                                        {
                                            code: 'bbands',
                                            name: 'Bollinger Bands',
                                            color: 'blue',
                                            data: [lowerBollingerBand, upperBollingerBand],
                                            dataGrouping: {
                                                units: groupingUnits
                                            }
                                        }
                                    ]
                                });
                                //-------------------//

                            }

                        }

                    }


                }




        }


        //why does more than 1 chart appear in the listing?
        for (var iterItem = 0; iterItem < Highcharts.charts.length; iterItem++) {
            Highcharts.charts[iterItem].highlighted = true;
            Highcharts.charts[iterItem].redraw();
        }




        //switch (selectChartKey) {
        //    case 'Aroon Up':
        //    case 'Aroon Down':
        //    case 'Aroon Oscillator':
        //        {

        //        }
        //        break;

        //    case 'MACD':
        //        {

        //        }
        //        break;

        //    case 'RSI':
        //        {

        //        }
        //        break;

        //    case 'AVTRI':
        //        {

        //        }
        //        break;

        //    default:
        //        {
        //            //if no chart is found then change the combination of the 
        //            //chartkey so that you can match it up

        //        }


        //}




    }
//}
    
   // );
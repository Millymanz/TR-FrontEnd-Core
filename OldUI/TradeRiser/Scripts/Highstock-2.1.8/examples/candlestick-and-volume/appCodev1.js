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
  }


  var buttonsArray = [{
    type: 'day',
    count: 16,
    text: '- (Out)'
  }, {
    type: 'day',
    count: 7,
    text: '+ (In 1x)'
  }, {
    type: 'day',
    count: 3,
    text: '+ (In 2x)'
  }];

  var buttonSetup = {
    buttons: buttonsArray,
    selected: 0,
    inputEnabled: false,
    buttonTheme: {
      width: 60
    }
  }
  var highlighterArray = [];
  for (var hl = 0; hl < higlighters.length; hl++) {


    var highlighterItem = {
      colour: higlighters[hl].Colour,
      axisIndex: higlighters[hl].AxisIndex,
      seriesIndex: higlighters[hl].SeriesIndex,
      startDate: higlighters[hl].StartDateTime,
      endDate: higlighters[hl].EndDateTime,
      speechBubbleHtml: higlighters[hl].Comment
    }
    highlighterArray.push(highlighterItem);
  }


  var chart = $('#container').highcharts('StockChart', {
    rangeSelector: buttonSetup,
    navigator: {
      enabled: false
    },
    plotOptions: {
      series: {
        dataGrouping: {
          enabled: false
        }
      }
    },

    title: {
      text: 'Eurjpy 1hour'
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
        text: 'STD'
      },
      top: 575,
      height: 100,
      offset: 0,
      lineWidth: 2
    }],
    overlay: overlayArrayTest,
    series: [{
      type: 'candlestick',
      name: 'EurJpy',
      data: ohlc
    }, {
      type: 'line',
      name: 'Standard Deviation Ind',
      data: stanDevData,
      yAxis: 1
    }],
    highlighted: true,
    highlightRegion: highlighterArray
  });
  // console.log(Highcharts.charts[0]);
  // $('#highlighted').prop('checked',true);
  function addClickEvent() {
    $("#records_table").find("tr").on("click", function(evt, x) {
      selectHighlighter(this.getAttribute('data-index'));
    });
  }
  $("#highlighted").on("change", function(evt) {
    Highcharts.charts[0].highlighted = $('#highlighted').prop('checked');
    Highcharts.charts[0].redraw();
    var trHTML = "";
    $.each(higlighters, function(i, item) {
      trHTML += '<tr data-index="' + i + '" class="rowItem"><td>' + item.StartDateTime + '</td><td>' + item.EndDateTime + '</td></tr>';
    });
    if ($('#highlighted').prop('checked')) {
      $("#records_table").find("tbody").remove();
      $('#records_table').append("<tbody>" + trHTML + "</tbody>");
      // addClickEvent();


      function myRowWriter(rowIndex, record, columns, cellWriter) {
        var tr = '';

        // grab the record's attribute for each column
        for (var i = 0, len = columns.length; i < len; i++) {
          tr += cellWriter(columns[i], record);
        }

        return '<tr data-index=' + rowIndex + '>' + tr + '</tr>';
      };
      $("#records_table").dynatable({
        writers: {
          _rowWriter: myRowWriter
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
    // console.log(chart.xAxis[0].getExtremes());
    if (highlightersLength < 0) {
      highlightersLength = higlighters.length - 1;
    }
    if (highlightersLength > higlighters.length - 1) {
      highlightersLength = highlightersLength % (higlighters.length);
    }


    selectHighlighter(highlightersLength);

    // chart.showResetZoom();
  });
  var selectHighlighter = function(highlightersLength) {
    var val = highlightersLength;
    var chart = Highcharts.charts[0];

    var xtrem = chart.xAxis[0].getExtremes();
    var diff = xtrem.userMax - xtrem.userMin;
    chart.xAxis[0].setExtremes(
      higlighters[val].StartDateTime - diff / 2,
      higlighters[val].StartDateTime + diff / 2
    );
    // var region = chart.highlightedRegions[val].element;
    // var pinLeft = ($(region).attr("x") + ($(region).attr("w") / 2) - (chart.pinsConf.width / 2));
    // var pinTop = ($(region).attr("y") - chart.pinsConf.height);

    for (var i = 0; i < chart.pins.length; i++) {
      if (higlighters[val].Comment == chart.pins[i].attr('data-comment')) {
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

});

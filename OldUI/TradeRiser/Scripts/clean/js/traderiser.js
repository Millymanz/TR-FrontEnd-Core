// JavaScript Document

// Main Function 
(function ($) {

	var delay = 200;
	var bShow = 0;

	$('.sidebar')
        .addClass('closed');
        $('.content').animate({ left: 0 });


    //var differenceSet = $('.titleleftHeader').height() - 150;
    //$('.titleleftHeader').height(differenceSet);
      

       var preferredHeight = $('.sidebar').height() * 0.70;  

        $('#savedQueries').height(preferredHeight);

        $('#historicQueries').height(preferredHeight);
        $('#followedQueries').height(preferredHeight);

        $('#emergingResults').height(preferredHeight);
        $('#queryResults').height(preferredHeight);

        var outerHeight = $('.testIndex').outerHeight();
        $('#compute').height(outerHeight);

        //All of this should be in the view model
        //$("#autoSuggest").click(function () {

        //    if (document.getElementById('autoSuggestTicker').checked) {
        //        $("#autoSuggestTicker").prop('checked', false);
        //    }
        //    else {
        //        $("#autoSuggestTicker").prop('checked', true);
        //    }

	        
        //});

        $("#logOffAction").click(function () {
	        document.getElementById('logoutForm').submit();
	    });





	//Creating Modal Chart 
	createChartSecond();
	
	function createChartSecond() {

		$(function () {

			$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlcv.json&callback=?',

				function (data) {

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

					// set the allowed units for data grouping
					var groupingUnits = [[
						'week',                         // unit name
						[1]                             // allowed multiples
					], [
						'month',
						[1, 2, 3, 4, 6]
					]];


					$('#highStockCustom').chartRegionSelector('StockChart', {

					    rangeSelector: {
					        selected: 1
					    },

					    title: {
					        text: 'GBP/USD',                           
					    },

					    yAxis: [{
					        title: {
					            text: 'OHLC'
					        },
					        // top: 200,
                           // left : 3,
					        height: 300,
					        lineWidth: 2
					    },


                        {
					       

					        title: {
					            text: 'Volume'
					        },
					        top: 380,
					        height: 50,
					        offset: 0,
					        lineWidth: 2
					    }],

					    series: [{
					        type: 'candlestick',
					        name: 'AAPL',
					        data: ohlc,
					        dataGrouping: {
					            units: groupingUnits
					        }
					    }, {
					        type: 'column',
					        name: 'Volume',
					        data: volume,
					        yAxis: 1,
					        dataGrouping: {
					            units: groupingUnits
					        }
					    }]
					});


                     
					// create the chart
					//$('#highStockCustom').highcharts('StockChart', {

					//$('#highStockCustom').chartRegionSelector('StockChart', {

					//	rangeSelector: {
					//		selected: 1
					//	},

					//	title: {
					//		text: 'AAPL Historical'
					//	},

					//	yAxis: [{
					//		title: {
					//			text: 'OHLC'
					//		},
					//		height: 300,
					//		lineWidth: 2
					//	}, {
					//		title: {
					//			text: 'Volume'
					//		},
					//		top: 380,
					//		height: 50,
					//		offset: 0,
					//		lineWidth: 2
					//	}],

					//	series: [{
					//		type: 'candlestick',
					//		name: 'AAPL',
					//		data: ohlc,
					//		dataGrouping: {
					//			units: groupingUnits
					//		}
					//	}, {
					//		type: 'column',
					//		name: 'Volume',
					//		data: volume,
					//		yAxis: 1,
					//		dataGrouping: {
					//			units: groupingUnits
					//		}
					//	}]
					//});
					
					
				});
		});
		
	}


	// Search dropdown control 
	var delay = 200;
	// run the currently selected effect
	//function runEffect() {
	//	$(".queryDropDown").css("display", "block");
	//};
	//function runEffectHide() {
	//	$(".queryDropDown").css("display", "none");
	//};

	
	//var bShowQuery = 0;
	//// set effect from select menu value
	//$(".btn-drop").click(function () {
		
	//$(this).toggleClass('open');

	//	if (bShowQuery == 1) {
	//		runEffectHide();
	//		bShowQuery = 0;
	//	}
	//	else {
	//		runEffect();
	//		bShowQuery = 1;
	//	}
	//	return false;
	//});


	//-----------------------------//
	var loadtimeout = 1000;

	var delayRP = 200;
	// run the currently selected effect
	function runEffectS() {
		$("#container").css("display", "none");
		$("#container").css("width", 1390);
		$("#loadingsign").css("display", "block"),

		createChart();


		$("#loadingsign").css("display", "block"),

		setTimeout(function () {
			$("#loadingsign").css("display", "none"),
			$("#container").css("display", "block")
		}, loadtimeout);
	};
	function runEffectHideS() {
		$("#container").css("display", "none");
		$("#container").css("width", 1870);
		$("#loadingsign").css("display", "block"),

		createChart();
		
		$("#loadingsign").css("display", "block"),


		setTimeout(function () {
			$("#loadingsign").css("display", "none"),
			$("#container").css("display", "block")
		}, loadtimeout);
	};
	var bShow = 1;
	// set effect from select menu value
	

	$("#resultsPanel").show();
	

})(jQuery);


$(document).ready(function(e) {

  

var panewidth = $('.pane').width();
var paneheight = $('.pane').height();
/*var dwidth = $('.pane').width() - 50;*/

var dwidth = 900;

var dheight = $('.pane').height();



//-- Initializing four windows
var dialog1 = $('.dialog1').dialog({
    autoOpen: true,
    draggable: true,
    resizable: false,
    width: "96%",
    height: dheight,
    appendTo: '#pane',
    dialogClass: 'd1'
});

$(".dialog .ui-dialog-titlebar-close").hide();

//-- Adding Maximize/Restore buttons to dialog boxes
//$('.d1, .d2, .d3, .d4').children('.ui-dialog-titlebar').append('<button class="btn-expand"></button>');

//$('.d1, .d2, .d3, .d4').children('.ui-dialog-titlebar').append('<button class="btn-expand"></button>');


var oldPositionX;
var oldPositionY;
var oldPositionW;
var oldPositionH;




//-- Servicing Maximize/Restore clicks
$('.btn-expand').click(function(e) {
	
	var dialog = $(this).parents('.ui-dialog');
	var dialogbody = dialog.find('.ui-dialog-content');

	var chartspace = dialog.find('#resultCanvas');

	//var chartspace = $('.resultCanvas');

	//-- If dialog is already maximized, 
	//-- minimize it
	if (dialog.hasClass('maximized'))
	{
		
		dialog.animate({'width': oldPositionW, 'left': oldPositionX, 'height': oldPositionH, top:oldPositionY}, 300, function()
		{
		    $(this).toggleClass('maximized');

		    for (var h = 0; h < Highcharts.charts.length; h++) {
		        var hchart = Highcharts.charts[h];
		        
		        if (typeof hchart !== 'undefined' && hchart !== null) {

		        var widthOffset = (5 * chartspace[0].clientWidth) / 100;
		        var heightOffset = (20 * chartspace[0].clientHeight) / 100;

		        hchart.setSize(chartspace[0].clientWidth - widthOffset,
                   chartspace[0].clientHeight - heightOffset);
		        }
		    }



		})	
	}
	else
	{
		oldPositionX = dialog.css('left');
		oldPositionY = dialog.css('top');
		oldPositionW = dialog.width();
		oldPositionH = dialog.height();	
	
		dialog.animate({'width': $('#pane').innerWidth()- 40, 'left': 10, 'height': $('#pane').innerHeight() - 40, top:10}, 300, function()
		{
			$(this).toggleClass('maximized');
			dialogbody.css('height', '98%');

			

			for (var h = 0; h < Highcharts.charts.length; h++) {
			    var hchart = Highcharts.charts[h];

			    if (typeof hchart !== 'undefined' && hchart !== null) {

			        var widthOffset = (5 * chartspace[0].clientWidth) / 100;
			        var heightOffset = (20 * chartspace[0].clientHeight) / 100;

			        hchart.setSize(chartspace[0].clientWidth - widthOffset,
                       chartspace[0].clientHeight - heightOffset);
			    }
			}

			
			//var hchart = chart.highcharts();
			//hchart.setSize(chart.innerWidth(), chart.innerHeight());			
		})			
	}
    
});




//-- Constraining windows to parent pane
$('.dialog1, .dialog2, .dialog3, .dialog4').parent().draggable({
	containment: '#pane'
})

//-- Positioning windows into parent pane
$('.dialog1').dialog('option', 'position', {my: "left top", at: "left+10 top+10", of: '#pane'});

$('.dialog2').dialog('option', 'position', {my: "right top", at: "right+6 top+10", of: '#pane'});

$('.dialog3').dialog('option', 'position', {my: "left bottom", at: "left+10 bottom-10", of: '#pane'});

$('.dialog4').dialog('option', 'position', {my: "right bottom", at: "right+6 bottom-10", of: '#pane'});


//-- Resizing charts within dialogs
$('.dia').each(function(index, element) {
	var cont = $(this).children('.chartspace');
	var chartname = '.dialogchart' + index;
	
	$(this).dialog({
		resizeStop: function(event, ui){
			var chart = $(chartname).highcharts();	
			chart.setSize(cont.innerWidth(), cont.innerHeight());
		}
	});
});


$('.dialog1').dialog({
    resizeStop: function (event, ui) {

	    //var chart1 = $('.dialogchart1').highcharts();
        //chart1.setSize($('.dialogchart1').innerWidth(), $('.dialogchart1').innerHeight());

        var chartspace = $('.dialog1').find('#resultCanvas');


        for (var h = 0; h < Highcharts.charts.length; h++) {
            var hchart = Highcharts.charts[h];

            if (typeof hchart !== 'undefined' && hchart !== null) {

                var widthOffset = (5 * chartspace[0].clientWidth) / 100;
                var heightOffset = (20 * chartspace[0].clientHeight) / 100;

                hchart.setSize(chartspace[0].clientWidth - widthOffset,
                   chartspace[0].clientHeight - heightOffset);
            }
        }



	}
});

$('.dialog2').dialog({
	resizeStop: function(event, ui){
		var chart2 = $('.dialogchart2').highcharts();	
		chart2.setSize($('.dialogchart2').innerWidth(), $('.dialogchart2').innerHeight());
	}
});

$('.dialog3').dialog({
	resizeStop: function(event, ui){
		var chart3 = $('.dialogchart3').highcharts();	
		chart3.setSize($('.dialogchart3').innerWidth(), $('.dialogchart3').innerHeight());
	}
});

$('.dialog4').dialog({
	resizeStop: function(event, ui){
		var chart4 = $('.dialogchart4').highcharts();	
		chart4.setSize($('.dialogchart4').innerWidth(), $('.dialogchart4').innerHeight());
	}
});


//$('.dialog1').dialog({width: '1510', height:'800' });


//*$('.dialog1').dialog({width: '1522', height:'820' });

//createChart();

//var seriesOptions = [],
//    yAxisOptions = [],
//    seriesCounter = 0,
//    names = ['MSFT', 'AAPL', 'GOOG'],
//    colors = Highcharts.getOptions().colors;

//$.each(names, function(i, name) {

//    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename='+ name.toLowerCase() +'-c.json&callback=?',	function(data) {

//        seriesOptions[i] = {
//            name: name,
//            data: data
//        };

//        // As we're loading the data asynchronously, we don't know what order it will arrive. So
//        // we keep a counter and create the chart when all the data is loaded.
//        seriesCounter++;

//        if (seriesCounter == names.length) {
//            createChartLine();
//        }
//    });
//});

//var temp = 3;

  //-- Make clicked element selected
  $('.d1').addClass('selected');
  var activeDialog = $('.d1');

  $('.d1, .d2, .d3, .d4').on('click', function(e) {
    $('.d1, .d2, .d3, .d4').removeClass('selected');
    $(this).addClass('selected');
	
	    activeDialog = $(this);
  });



    // create the chart when all data is loaded
function createChartLine() {

    $('#container').highcharts('StockChart', {
        chart: {
        },

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function() {
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
		    
        series: seriesOptions
    });
}

//createChartLine();



	function createChart() {

		$(function () {

			$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlcv.json&callback=?',

				function (data) {

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

					// set the allowed units for data grouping
					var groupingUnits = [[
						'week',                         // unit name
						[1]                             // allowed multiples
					], [
						'month',
						[1, 2, 3, 4, 6]
					]];

					// create the chart 1
					$('.dialogchart1').highcharts('StockChart', {

						rangeSelector: {
							selected: 1
						},

						title: {
							text: 'AAPL Historical'
						},
						credits: {
							enabled: false
						},

						yAxis: [{
							title: {
								text: 'OHLC'
							},
							height: 450,
							lineWidth: 2
						}, {
							title: {
								text: 'Volume'
							},
							top: 560,
							height: 100,
							offset: 0,
							lineWidth: 2
						}],

						series: [{
							type: 'candlestick',
							name: 'AAPL',
							data: ohlc,
							dataGrouping: {
								units: groupingUnits
							}
						}, {
							type: 'column',
							name: 'Volume',
							data: volume,
							yAxis: 1,
							dataGrouping: {
								units: groupingUnits
							}
						}]
					});
					
					// create the chart 2
					$('.dialogchart2').highcharts('StockChart', {

						rangeSelector: {
							selected: 1
						},

						title: {
							text: 'AAPL Historical'
						},
						credits: {
							enabled: false
						},
						yAxis: [{
							title: {
								text: 'OHLC'
							},
							height: 450,
							lineWidth: 2
						}, {
							title: {
								text: 'Volume'
							},
							top: 560,
							height: 100,
							offset: 0,
							lineWidth: 2
						}],

						series: [{
							type: 'candlestick',
							name: 'AAPL',
							data: ohlc,
							dataGrouping: {
								units: groupingUnits
							}
						}, {
							type: 'column',
							name: 'Volume',
							data: volume,
							yAxis: 1,
							dataGrouping: {
								units: groupingUnits
							}
						}]
					});
					
					// create the chart 4
					$('.dialogchart3').highcharts('StockChart', {

						rangeSelector: {
							selected: 1
						},

						title: {
							text: 'AAPL Historical'
						},
						credits: {
							enabled: false
						},
						yAxis: [{
							title: {
								text: 'OHLC'
							},
							height: 450,
							lineWidth: 2
						}, {
							title: {
								text: 'Volume'
							},
							top: 560,
							height: 100,
							offset: 0,
							lineWidth: 2
						}],

						series: [{
							type: 'candlestick',
							name: 'AAPL',
							data: ohlc,
							dataGrouping: {
								units: groupingUnits
							}
						}, {
							type: 'column',
							name: 'Volume',
							data: volume,
							yAxis: 1,
							dataGrouping: {
								units: groupingUnits
							}
						}]
					});
					
					
					// create the chart 4
					$('.dialogchart4').highcharts('StockChart', {

						rangeSelector: {
							selected: 1
						},

						title: {
							text: 'AAPL Historical'
						},
						credits: {
							enabled: false
						},
						yAxis: [{
							title: {
								text: 'OHLC'
							},
							height: 450,
							lineWidth: 2
						}, {
							title: {
								text: 'Volume'
							},
							top: 560,
							height: 100,
							offset: 0,
							lineWidth: 2
						}],

						series: [{
							type: 'candlestick',
							name: 'AAPL',
							data: ohlc,
							dataGrouping: {
								units: groupingUnits
							}
						}, {
							type: 'column',
							name: 'Volume',
							data: volume,
							yAxis: 1,
							dataGrouping: {
								units: groupingUnits
							}
						}]
					});
					
										
				});
		});
	}	


//-- Sidebar click action handler
$('.sidebar .blob').on('click', 
function(e){
	e.preventDefault();
	
	// Add code for handling sidebar
	// click here
})





//-- User Settings drop
$('.btn-user').on('click', function(e){
	e.preventDefault();
	e.stopPropagation()
	$('.drop').toggle();
	
	$('html').on('click', function(e){
		e.preventDefault();
		$('.drop').hide();
	})
});


//-- Pane width global variable used
//-- for resizing dialogs
var oldPane;
setTimeout(function(){
	oldPane = $('.pane').width();
}, 500);

$(window).on('resize', function(){
	oldPane = $('.pane').width();	
});




    //-- Splitter control
$('.btn-splitter').on('click',
function (e) {
    if (!$('.sidebar').hasClass('closed')) {
        $('.sidebar')
        .addClass('closed')
        .animate({ 'left': -340 });

        $('.bottomSidebar')
        .addClass('closed')
        .animate({ 'left': 0 });

        //$('.content').animate({ left: 0 });

        $('#summaryResults').animate({ left: 0 });
        $('#summaryResults').width('96%');



        //-- Resize dialogs on pane visibility change
        /*$('.pane .ui-dialog').each(function (index, element) {
            resizeDialog($(this), true);
        });*/

    }
    else {
        $('.sidebar')
        .removeClass('closed')
        .animate({ 'left': 0 });

        $('.bottomSidebar')
        .addClass('closed')
        .animate({ 'left': 340 });

        //$('.content').animate({ left: 340 });

        $('#summaryResults').animate({ left: 340 });
        $('#summaryResults').width('70%');

        //$('#summaryResults').width('80%');



        //-- Resize dialogs on pane visibility change
        /*$('.pane .ui-dialog').each(function (index, element) {
            resizeDialog($(this), false);
        });*/
    }
});




    //-- Right Splitter control
$('.btnRight-splitter').on('click',
function (e) {
    if (!$('.rightSidebar').hasClass('closed')) {
        $('.rightSidebar')
        .addClass('closed')
        .animate({ 'right': -340 });

       /*$('.content').animate({ right: 0 });
        $('#summaryResults').animate({ right: 0 });

        $('#summaryResults').width('90%');*/


        //-- Resize dialogs on pane visibility change
        /*$('.pane .ui-dialog').each(function (index, element) {
            resizeDialog($(this), true);
        });*/

    }
    else {
        $('.rightSidebar')
        .removeClass('closed')
        .animate({ 'right': 0 });

       /* $('.content').animate({ right: 340 });
        $('#summaryResults').animate({ right: 340 });*/



        //-- Resize dialogs on pane visibility change
        /*$('.pane .ui-dialog').each(function (index, element) {
            resizeDialog($(this), false);
        });*/
    }
});




    //-- Bottom Splitter control
    /*$('.btnBottom-splitter').on('click', */

$(".bottomSidebar").hide();

$('#bottombtn-splitter').on('click',
function (e) {
    if (!$('.bottomSidebar').hasClass('closed')) {
        $(".bottomSidebar").addClass('closed');
        $(".bottomSidebar").hide("slow");
    }
    else {
        $(".bottomSidebar").removeClass('closed');
        $(".bottomSidebar").show();
    }
});

$('.btn-chart').on('click',

function (e) {
    if (!$('.bottomSidebar').hasClass('closed')) {
        $(".bottomSidebar").addClass('closed');
        $(".bottomSidebar").hide("slow");
    }
    else {
        $(".bottomSidebar").removeClass('closed');
        $(".bottomSidebar").show();
    }
});





//-- Resizing dialog function
function resizeDialog(dialog, enlarge)
{	
	var newPane;
	var oldWidth = dialog.width();
	var oldX = dialog.position();
	var oldposX = oldX.left;
	var newWidth;
	var newX;

	if(enlarge)
	{
		oldPane = $('.pane').width();
		newPane = $('.pane').width() + 340;
		newWidth = (oldWidth * newPane / oldPane);		
		newX = oldposX * newPane / oldPane;	
	}
	else
	{
		oldPane = $('.pane').width();
		newPane = $('.pane').width() - 340;
		newWidth = (oldWidth * newPane) / oldPane;
		newX = (oldposX * newPane) / oldPane;

	
	}
	
	//var chartspace = dialog.find('.resultCanvas');

	var chartspace = dialog.find('#resultCanvas');
	//console.log(chartspace);

	dialog.animate({'width': newWidth, 'left': newX}, function()
	{		
		var chart = chartspace.highcharts();		
		//chart.setSize(chartspace.innerWidth(), chartspace.innerHeight());

		for (var h = 0; h < Highcharts.charts.length; h++) {
		    var hchart = Highcharts.charts[h];

		    if (typeof hchart !== 'undefined' && hchart !== null) {

		        var widthOffset = (5 * chartspace.context.clientWidth) / 100;
		        var heightOffset = (5 * chartspace.context.clientHeight) / 100;

		        hchart.setSize(chartspace.context.clientWidth - widthOffset,
                    hchart.containerHeight);
		    }
		}

		
	});	

}

//-- Tabs activation
$('.side-tabs').easytabs({
	animationSpeed: 50,
	wheelSpeed: 10
});

//$('.side-tabs').easytabs({
//    animationSpeed: 200,
//    wheelSpeed: 40
//});

//-- Play button control
$('.btn-play').on('click', function(e){
	e.preventDefault();
	$(this).toggleClass('active');
})


//-- Scrollbar init
$('.tabbable').perfectScrollbar();
$('.tabbable').height($('.sidebar').height() - 135);
$('.tabbable').perfectScrollbar('update');

//-- Windows resize control
$(window).on('resize', function(e){
	$('.tabbable').height($('.sidebar').height() - 135);
	$('.tabbable').perfectScrollbar('update');
})

//----------------------------Dennis Add---------------------------------------//



        //$('#compute').click(function (event) {

        //    if (pCall != null || pCall != 'defined')
        //    {
        //        //btnChannel.src ="";
        //        //btnChannel.src = "/Images/play.png";
        //        pCall["StockDemo"].LeaveChannel();               
        //    }

            
        //    var loadchart = document.getElementById("loadchartDia");
        //    if (loadchart != null || loadchart != 'defined') {
        //        loadchart.style.display = 'block';
        //    }

        //    var dataContents = document.getElementById("testIndex").value;

        //    var dataResults = [];
            

        //    $.ajax({
        //        url: "/Forex/GetAnswer", 
        //        type: "POST", 
        //        dataType: "text",
        //        data: { searchQuery: dataContents },
        //        success: function (dataInterm) {

        //            loadchart.style.display = 'none';

        //            var json = dataInterm;
        //            var obj = JSON && JSON.parse(json) || $.parseJSON(json);

        //            if (obj != "")
        //            {
        //                if (obj != null || obj != 'undefined')
        //                {
        //                    var assetClassName = obj.ResultSummaries[0].SymbolID;

        //                    $("#resultArea").empty();
        //                    //$("#resultCanvas").empty();

        //                    //$("#resultCanvas").append($('<br/><br/>'));
        //                  //  $("#resultCanvas").append($('<br/>'));


        //                    $("#resultArea").append($(
        //                        '<div class = "resultItemDD" id ="first" style="display: none;">'
        //                        + '<div class="blob transition">'
        //                        + '<div class="blobhead">'
        //                        + '<p class="date"></p><br />'
        //                        + '<p class="date"></p>'
        //                        + '<div class="blobuser">'
        //                        + '<span class="imgbox"><img src="../Images/user-avatar.png" width="35" height="35" alt="John Doe"></span>'
        //                        + '<p></p>'
        //                        + '</div>'
        //                        + '</div>'                      
        //                        + '<div class="blobcontent">'
        //                        + '<p></p>'
        //                        + 'more..'
        //                        + '</div>'
        //                        + '</div>'
        //                        + '</div>'
        //                        )
        //                        );

        //                    for (var i = 0; i < obj.ResultSummaries.length; i++)
        //                    {
        //                        var str = JSON.stringify(obj.ResultSummaries[i].KeyResultField);
        //                        var res = str.replace(':',' ');
        //                        var resn = res.replace('"',' ');
        //                        var resv = resn.replace('}',' ');
        //                        var resf = resv.replace('{',' ');
        //                        var ress = resf.replace(',',' ');
        //                        var resultsData = ress.replace(':',' ');

        //                        var resFirst = obj.ResultSummaries[i].KeyResultField.Object;
        //                        var resSecond = obj.ResultSummaries[i].KeyResultField[1];
        //                        var count = i + 1;
        //                        var storedID = obj.CurrentResult.QueryID +'*'+ obj.ResultSummaries[i].SymbolID;

        //                        $("#resultArea").append($(
        //                        '<div class = "resultItemDD" id ='+ storedID +'>'
        //                        + '<div class="blob transition">'
        //                        + '<div class="blobhead">'
        //                        + '<p class="date">'+ obj.ResultSummaries[i].EndDateTime + '</p><br />'
        //                        + '<p class="date">' + obj.ResultSummaries[i].StartDateTime + '</p><br />'
                                
        //                        + '<p class="timeframe">'+  obj.ResultSummaries[i].TimeFrame.replace(/([A-Z])/g, ' $1') +'</p>'


        //                        + '<div class="blobuser">'
        //                        + '<span class="imgbox">'+ count +'. </span>'
        //                        + '<p>'+ obj.ResultSummaries[i].SymbolID + '-' + obj.ResultSummaries[i].Source + '</p>'
        //                        + '</div>'
        //                        + '</div>'                      
        //                        + '<div class="blobcontent">'
        //                        + '<p><span>' + resultsData.replace(/([A-Z])/g, ' $1') +'</span></p>'
        //                       // + 'more..'
        //                        + '</div>'
        //                        + '</div>'
        //                        + '</div>'
        //                        )
        //                        );                     
        //                    }

        //                    /*$('.resultItemDD').click(function (event) {
        //                        GetChartData(event.currentTarget.id);
        //                    })*/

        //                    $('.resultItemDD').click(function (event) {
        //                        GetDataResult(event.currentTarget.id);
        //                    })
							
		//					DisplayResult(obj);
							

                           
        //                }
        //            }
        //            else{
        //                alert('No Results');
        //            }

        //        },
        //        error: function (data) {
        //            // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
        //            alert('ajax call  failed');
        //        }
        //    })
        //})
		
		
		//-------------------------------------------//
		
		//class
		function ResultsData()
		{
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
			this.trendsOverlayArray = [];
		}
		

        var allCount = 8;
                            var allCountIter = 0;
                            var selectChartKey = '';
                            var presentationTypeIndex = 0;


                            function InitalizeSubWidgetsData(presentationTypes, index, obj, dataLookUp, resultsData)
                            {
                                //create selectChartKey from loop

                                var bSubWidgetSet = false;

                                for (var ss = 0; ss < presentationTypes.SubWidgets.length; ss++)
                                {
                                    switch (presentationTypes.SubWidgets[ss])
                                    {
                                        case 'CorrelationTable':
                                            {
                                                var indOne = obj.CurrentResult.ProcessedResults.KeyFieldIndex[0];
                                                var indTwo = obj.CurrentResult.ProcessedResults.KeyFieldIndex[1];

                                                //var resultValue = obj.CurrentResult.ProcessedResults.ComputedResults[0][indOne[1]];

                                                var resultValue = dataLookUp["CorrelationRatio"];

                                                var lineSeriesOptions = [],
                                                    symbolNames = [];

                                                for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[index].length; bb++)
                                                {
                                                    symbolNames.push(obj.CurrentResult.ResultSymbols[index][bb]);
                                                }



                                                var correlTabStr = '<table cellpadding="12" cellspacing="12" border="1" style="border-color:#E0E0E0;"><tr style="border-color:#E0E0E0;"><td></td><td>'+ symbolNames[0] +'</td></tr>'; 
                                                var tempStr = '<tr style="border-color:#E0E0E0;"><td>'+ symbolNames[1] +'</td><td>'+ resultValue +'</td></tr></table>';

                                                var final = correlTabStr + tempStr;
                                                        
                                                $("#resultCanvas").append($('<br/>'+ final));

                                                dataResults = obj.CurrentResult.RawDataResults[0].ChartReadyDataResults;

                                                bSubWidgetSet = true;

                                                allCountIter++;                                                        
                                            }
                                            break;

                                        case 'SMA':
                                            {
                                                var dataResults = dataLookUp["SMA"];  
                                                        
                                                if (dataResults != null || dataResults !== undefined)
                                                {
                                                    var dataLength = dataResults.length; 

                                                    for (var ri = 0; ri < dataLength; ri++) {                                                                
                                                        resultsData.smaOverlay.push([
                                                            dataResults[ri][0], // the date
                                                            dataResults[ri][1] // the close
                                                        ])
                                                    } 
                                                    //bSubWidgetSet = true;
                                                    allCountIter++;                                                        
                                                }
                                            }
                                            break;

                                        case 'BollingerBands':
                                            {
                                                var dataUpperBand = dataLookUp["UpperBand"];
                                                var dataLowerBand = dataLookUp["LowerBand"];
                                                var dataMiddleBand = dataLookUp["MiddleBand"];

                                                if (dataMiddleBand != null || dataMiddleBand !== undefined)
                                                { 
                                                                                        
                                                    var dataLength = dataMiddleBand.length;                                   

                                                    for (var ri = 0; ri < dataLength; ri++) {                                                                
                                                        resultsData.smaOverlay.push([
                                                            dataMiddleBand[ri][0], // the date
                                                            dataMiddleBand[ri][1] // the close
                                                        ])

                                                        resultsData.upperBollingerBand.push([
                                                            dataUpperBand[ri][0], // the date
                                                            dataUpperBand[ri][1] // the close
                                                        ])

                                                        resultsData.lowerBollingerBand.push([
                                                            dataLowerBand[ri][0], // the date
                                                            dataLowerBand[ri][1] // the close
                                                        ])
                                                    }  
                                                    //bSubWidgetSet = true;
                                                    allCountIter++;                                                        
                                                }
                                            }
                                            break;

                                        case 'Aroon Oscillator':
                                            {
                                                selectChartKey = selectChartKey + "Aroon Oscillator";

                                                var dataResults = dataLookUp["Aroon Oscillator"];

                                                if (dataResults != null || dataResults !== undefined)
                                                { 
                                                    var  dataLength = dataResults.length;                                   

                                                    for (var ri = 0; ri < dataLength; ri++) {                                                                
                                                        resultsData.aroonOsc.push([
                                                            dataResults[ri][0], // the date
                                                            dataResults[ri][1] // the close
                                                        ])
                                                    } 
                                                    //bSubWidgetSet = true;
                                                    allCountIter++;                                                        
                                                }
                                            }
                                            break;

                                        case 'Aroon Up':
                                            {
                                                selectChartKey = selectChartKey + "Aroon Up";

                                                var dataResults = dataLookUp["Aroon Up"];                                                      
                                                        
                                                if (dataResults != null || dataResults !== undefined)
                                                { 
                                                    var  dataLength = dataResults.length;                               

                                                    for (var ri = 0; ri < dataLength; ri++) {                                                                
                                                        resultsData.aroonUp.push([
                                                            dataResults[ri][0], // the date
                                                            dataResults[ri][1] // the close
                                                        ])
                                                    }  
                                                   // bSubWidgetSet = true;
                                                    allCountIter++;                                                        
                                                }
                                            }
                                            break;

                                        case 'Aroon Down':
                                            {
                                                selectChartKey = selectChartKey + "Aroon Down";

                                                var dataResults = dataLookUp["Aroon Down"]; 
                                                        
                                                if (dataResults != null || dataResults !== undefined)
                                                { 
                                                    var  dataLength = dataResults.length;                               

                                                    for (var ri = 0; ri < dataLength; ri++) {                                                                
                                                        resultsData.aroonDown.push([
                                                            dataResults[ri][0], // the date
                                                            dataResults[ri][1] // the close
                                                        ])
                                                    }  
                                                  //  bSubWidgetSet = true;
                                                    allCountIter++;                                                        
                                                }
                                            }
                                            break;

                                        case 'RSI':
                                            {
                                                selectChartKey = selectChartKey + "RSI";

                                                var dataResults = dataLookUp["RSI"];  
                                                        
                                                if (dataResults != null || dataResults !== undefined)
                                                { 
                                                    var  dataLength = dataResults.length;                               

                                                    for (var ri = 0; ri < dataLength; ri++) {                                                                
                                                        resultsData.rsiData.push([
                                                            dataResults[ri][0], // the date
                                                            dataResults[ri][1] // the close
                                                        ])
                                                    }  
                                                    //bSubWidgetSet = true;
                                                    allCountIter++;                                                        
                                                }
                                            }
                                            break;

                                        case 'ATR':
                                            {
                                                selectChartKey = selectChartKey + "ATR";

                                                var dataResults = dataLookUp["ATR"];  
                                                        
                                                if (dataResults != null || dataResults !== undefined)
                                                { 
                                                    var  dataLength = dataResults.length;                               

                                                    for (var ri = 0; ri < dataLength; ri++) {                                                                
                                                        resultsData.avtrInd.push([
                                                            dataResults[ri][0], // the date
                                                            dataResults[ri][1] // the close
                                                        ])
                                                    }  
                                                    //bSubWidgetSet = true;
                                                    allCountIter++;                                                        
                                                }
                                            }
                                            break;
                                    }
                                }

                                if (bSubWidgetSet === true)
                                {
                                    $("#resultCanvas").append($('<br/><hr style="border: 0; color: #9E9E9E; background-color: #9E9E9E; height: 1px; width: 100%; text-align: left;" />'));
                                }
                            }

                            if (allCount == allCountIter)
                            {
                                selectChartKey = 'ALL';
                            }


                            function ConvertToNumericKeyID(selectChartKey)
                            {
                                var accumulated = "";
                                var total = 0;
                                for (var i = 0; i < selectChartKey.length; i++)
                                {
                                    var n = selectChartKey.charCodeAt(i);
                                    accumulated = accumulated + n;
                                    total = total + n;
                                }
                                return total;
                                //alert(total);
                            }
                            //-------------------------------------------//
							
							



							function DisplayResult(obj)
							{
								//Change complex json to visuals
								//assuming chart for now
								//parse json object    
								$("#resultCanvas").empty();

								var resultsData = new ResultsData();

								var presentationTypeCount = obj.CurrentResult.PresentationTypes.length;
								
								console.log('Getting Data');

								var rawDataResults = obj.CurrentResult.RawDataResults;                              

								//Main widget
								try 
								{
									for (var pp = 0; pp < presentationTypeCount; pp++)
									{
										var json = rawDataResults[pp].ChartReadyDataResults;                                    
										var dataLookUp = {};
										// generate the lookup table for reuse
										json.forEach(function (el, i, arr) {
											dataLookUp[el.Key] = el.Value;
										});

										switch (obj.CurrentResult.PresentationTypes[pp].MainWidget)
										{
											case 'Table':
												{
													var indOne = obj.CurrentResult.ProcessedResults.KeyFieldIndex[0];
													var indTwo = obj.CurrentResult.ProcessedResults.KeyFieldIndex[1];

													var resultValue = obj.CurrentResult.ProcessedResults.ComputedResults[0][5];

													$("#resultCanvas").append($('<table cellpadding="10" cellspacing="1000" border="2"><tr><td>Change</td><td>'+ resultValue + '</td></tr><tr><td>Percentage Change</td><td>test</td></tr></table>'));

		

													dataResults = obj.CurrentResult.RawDataResults[0].ChartReadyDataResults;

													var lineSeriesOptions = [],
														symbolNames = [];

													for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[pp].length; bb++)
													{
														symbolNames.push(obj.CurrentResult.ResultSymbols[pp][bb]);
													}

													InitalizeSubWidgetsData(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, resultsData);
																		   

												} break;

											case 'LineSeriesChart':
												{
													$("#resultCanvas").append($('<br/>'+ '<table width="100%" cellpadding="30" cellspacing="1" border="1" style="border-color:#E0E0E0;"><tr><td> Correlation <div class="chartspace dialogchart5"></div><br/><br/>  </td></tr></table>'));

													var lengthCount = obj.CurrentResult.RawDataResults[0].ChartReadyDataResults.length;

													var lineSeriesOptions = [],
														symbolNames = [];

													for (var bb = 0; bb < obj.CurrentResult.ResultSymbols[pp].length; bb++)
													{
														symbolNames.push(obj.CurrentResult.ResultSymbols[pp][bb]);
													}

													for (var c = 0; c < lengthCount; c++)
													{
														var dataKey = "RAW_COMPARISON" +"_"+ symbolNames[c];
														dataResults = dataLookUp[dataKey];

														if (dataResults != null || dataResults !== undefined)
														{ 

															var ohlc = [],
															volume = [], lineSeriesData = [], 
															dataLength = dataResults.length;                                                     

															for (i = 0; i < dataLength; i++) {
																ohlc.push([
																	dataResults[i][0], // the date
																	dataResults[i][1], // open
																	dataResults[i][2], // high
																	dataResults[i][3], // low
																	dataResults[i][4] // close
																]);

																volume.push([
																	dataResults[i][0], // the date
																	dataResults[i][5] // the volume
																])


																lineSeriesData.push([
																	dataResults[i][0], // the date
																	dataResults[i][4] // the volume
																])
															}

															lineSeriesOptions[c] = {
																name: symbolNames[c],
																data: lineSeriesData 
															}
													   
														}//for loop end


														// set the allowed units for data grouping
														var groupingUnits = [[
															'week',                         // unit name
															[1]                             // allowed multiples
														], [
															'month',
															[1, 2, 3, 4, 6]
														]];


														$('.dialogchart5').highcharts('StockChart', {
															chart: {
															},
															rangeSelector: {
																selected: 4
															},
															yAxis: {
																labels: {
																	formatter: function() {
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

													InitalizeSubWidgetsData(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, resultsData);

												} break;

											case 'CandleStickChart':
												{
													
													presentationTypeIndex = pp;
													InitalizeSubWidgetsData(obj.CurrentResult.PresentationTypes[pp], pp, obj, dataLookUp, resultsData);
													
													var numericKeyID = ConvertToNumericKeyID(selectChartKey);
													//Change code to use resultsData object only for method parameter

													SelectMiniChart(numericKeyID, presentationTypeIndex, obj,
													   resultsData.upperBollingerBand, resultsData.lowerBollingerBand, resultsData.smaOverlay, resultsData.aroonOsc,
													   resultsData.aroonUp, resultsData.aroonDown, resultsData.rsiData, resultsData.MACDHistogram, resultsData.MACDline, resultsData.avtrInd, resultsData.higlighters, dataLookUp,
													   resultsData.trendsOverlayArray); 

												} break;
										}	
									}                          
								}                          
								catch (err)
								{
									alert(err);
								}
							}



                            

        function GetDataResult(selectionID) {

            var symbolIDCriteria = "";
           
            var loadchart = document.getElementById("loadchartDia");
            if (loadchart != null || loadchart != 'defined') {
                loadchart.style.display = 'block';
            }



            $.ajax({
                url: "/Forex/GetDataResult",
                type: "POST",
                dataType: "json",
                data: { selectionID: selectionID },
                success: function (dataInterm) {
					try
					{
						loadchart.style.display = 'none';
						var obj = dataInterm;

						if (obj != "")
						{
							if (obj != null || obj != 'undefined')
							{
								DisplayResult(obj);
							}					
						}
					}
					catch(error)
					{
						alert(error);
					}
                },
                error: function (dataInterm) {
                    // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
                    alert('ajax call  failed');
                }
            })      
        };

       
         function GetChartData(symbol) {

                       var symbolIDCriteria = symbol;
           
           var loadchart = document.getElementById("loadchartDia");
           if (loadchart != null || loadchart != 'defined') {
               loadchart.style.display = 'block';
           }



           $.ajax({
               url: "/TradeRiser/GetChartData",
               type: "POST",
               dataType: "json",
               data: { symbolID: symbolIDCriteria },
               success: function (data) {

                   //alert("Your blesse" + event.currentTarget.id);

                   loadchart.style.display = 'none';

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

                   // set the allowed units for data grouping
                   var groupingUnits = [[
                       'week',                         // unit name
                       [1]                             // allowed multiples
                   ], [
                       'month',
                       [1, 2, 3, 4, 6]
                   ]];

                   // create the chart 1
                   $('.dialogchart1').highcharts('StockChart', {

                       rangeSelector: {
                           selected: 1
                       },

                       title: {
                           text: symbolIDCriteria
                       },
                       credits: {
                           enabled: false
                       },

                       yAxis: [{
                           title: {
                               text: 'OHLC'
                           },
                           height: 450,
                           lineWidth: 2
                       }, {
                           title: {
                               text: 'Volume'
                           },
                           top: 560,
                           height: 100,
                           offset: 0,
                           lineWidth: 2
                       }],

                       series: [{
                           type: 'candlestick',
                           name: symbolIDCriteria,
                           data: ohlc,
                           dataGrouping: {
                               units: groupingUnits
                           }
                       }, {
                           type: 'column',
                           name: 'Volume',
                           data: volume,
                           yAxis: 1,
                           dataGrouping: {
                               units: groupingUnits
                           }
                       }]
                   });



               },
               error: function (data) {
                   // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
                   alert('ajax call  failed');
               }
           })      
        };




        $('.resultItemDD').click(function (event) {

         //$('.resultItemDD').on( "click", function(event) {

        //$('#resultsArea').on('click', '.resultItemDD', function (event) {


                alert('was here');

                var symbolIDCriteria = "NXR";
                //var symbolIDCriteria = event.currentTarget.id;

                /*Ajax to call to get chart data*/
                /*$.ajax({
                  url: "/SideDroid/GetChartData/trent", 
                  type: "GET", contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function (data) {
      
                       alert("Your blesse" + event.currentTarget.id);
      
                  },
                  error: function (data) {
                      // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
                      alert('ajax call  failed');
                  }
              })*/

                var loadchart = document.getElementById("loadchartDia");
                if (loadchart != null || loadchart != 'defined') {
                    loadchart.style.display = 'block';
                }



                $.ajax({
                    url: "/SideDroid/GetChartData",
                    type: "POST",
                    dataType: "json",
                    data: { symbolID: symbolIDCriteria },
                    success: function (data) {

                        //alert("Your blesse" + event.currentTarget.id);

                        loadchart.style.display = 'none';

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

                        // set the allowed units for data grouping
                        var groupingUnits = [[
                            'week',                         // unit name
                            [1]                             // allowed multiples
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]];

                        // create the chart 1
                        $('.dialogchart1').highcharts('StockChart', {

                            rangeSelector: {
                                selected: 1
                            },

                            title: {
                                text: symbolIDCriteria
                            },
                            credits: {
                                enabled: false
                            },

                            yAxis: [{
                                title: {
                                    text: 'OHLC'
                                },
                                height: 450,
                                lineWidth: 2
                            }, {
                                title: {
                                    text: 'Volume'
                                },
                                top: 560,
                                height: 100,
                                offset: 0,
                                lineWidth: 2
                            }],

                            series: [{
                                type: 'candlestick',
                                name: symbolIDCriteria,
                                data: ohlc,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }, {
                                type: 'column',
                                name: 'Volume',
                                data: volume,
                                yAxis: 1,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }]
                        });



                    },
                    error: function (data) {
                        // Failure here is valid if the there are no groups in the database, e.g. soon after the database has been cleared.
                        alert('ajax call  failed');
                    }
                })
			})
			

});
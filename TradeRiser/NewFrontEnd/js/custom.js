// JavaScript Document

<!-- Main Function -->
(function ($) {

	var delay = 200;
	var bShow = 0;


	<!-- Creating Modal Chart -->
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

					// create the chart
					$('#highStockCustom').highcharts('StockChart', {

						rangeSelector: {
							selected: 1
						},

						title: {
							text: 'AAPL Historical'
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


	<!-- Search dropdown control -->
	var delay = 200;
	// run the currently selected effect
	function runEffect() {
		$("#queryDropDown").css("display", "block");

/*		$("#expand").attr('src', "/Images/collapse.png"); */
	};
	function runEffectHide() {
		$("#queryDropDown").css("display", "none");

/*		 $("#expand").attr('src', "/Images/collapse_arrow.png"); */
	};

	
	var bShowQuery = 0;
	// set effect from select menu value
	$(".btn-drop").click(function () {
		
	$(this).toggleClass('open');

		if (bShowQuery == 1) {
			runEffectHide();
			bShowQuery = 0;
		}
		else {
			runEffect();
			bShowQuery = 1;
		}
		return false;
	});

/*
	var bButtonChange = 0;
	$("#streambuttonWrapper").click(function () {
		if (bButtonChange == 1) {
			$("#streambutton").attr('src', "/Images/pause.png");
			bButtonChange = 0;
		}
		else {
			$("#streambutton").attr('src', "/Images/play.png");
			bButtonChange = 1;
		}
	});
*/


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
	
/*var panewidth = $('.pane').width();
var paneheight = $('.pane').height();
var dwidth = (panewidth - 36) / 2;
var dheight = (paneheight - 10) / 2;*/


var panewidth = $('.pane').width();
var paneheight = $('.pane').height();
var dwidth = $('.pane').width() - 50;
var dheight = $('.pane').height();

//-- Initializing four windows
var dialog1 = $('.dialog1').dialog({
	autoOpen: true,
	draggable: true,
	resizable: true,
	width: dwidth,
	height: dheight,
	appendTo:'#pane',
	dialogClass: 'd1'
});

/*
var dialog2 = $('.dialog2').dialog({
	autoOpen: true,
	draggable: true,
	resizable: true,
	width: dwidth,
	height: dheight,
	appendTo:'#pane',
	dialogClass: 'd2'
});

var dialog3 = $('.dialog3').dialog({
	autoOpen: true,
	draggable: true,
	resizable: true,
	width: dwidth,
	height: dheight,
	appendTo:'#pane',
	dialogClass: 'd3'
});

var dialog4 = $('.dialog4').dialog({
	autoOpen: true,
	draggable: true,
	resizable: true,
	width: dwidth,
	height: dheight,
	appendTo:'#pane',
	dialogClass: 'd4'
});*/

//-- Adding Maximize/Restore buttons to dialog boxes
$('.d1, .d2, .d3, .d4').children('.ui-dialog-titlebar').append('<button class="btn-expand"></button>');

var oldPositionX;
var oldPositionY;
var oldPositionW;
var oldPositionH;


//-- Servicing Maximize/Restore clicks
$('.btn-expand').click(function(e) {
	
	var dialog = $(this).parents('.ui-dialog');
	var dialogbody = dialog.find('.ui-dialog-content');
	var chart = dialog.find('.chartspace');

	//-- If dialog is already maximized, 
	//-- minimize it
	if (dialog.hasClass('maximized'))
	{
		
		dialog.animate({'width': oldPositionW, 'left': oldPositionX, 'height': oldPositionH, top:oldPositionY}, 300, function()
		{
			$(this).toggleClass('maximized');
			var hchart = chart.highcharts();
			hchart.setSize(chart.innerWidth(), chart.innerHeight());			
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
			
			var hchart = chart.highcharts();
			hchart.setSize(chart.innerWidth(), chart.innerHeight());			
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
	resizeStop: function(event, ui){
		var chart1 = $('.dialogchart1').highcharts();	
		chart1.setSize($('.dialogchart1').innerWidth(), $('.dialogchart1').innerHeight());
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


createChart();

<!-- Creating Main Chart -->
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




//-- Opening dialog box
/*$('.btn-chart').click(function () {
    $("#criteriaDialog").dialog("open");

});*/

$("#criteriaDialog").dialog({
    height: 640,
    width: 920,
    resizable: false,
    show: "clip",
    hide: "clip",
    autoOpen: false,
    modal: false
});


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
function(e){	
  if(!$('.sidebar').hasClass('closed'))
  {
    $('.sidebar')
	.addClass('closed')
	.animate({'left':-340});
	
	$('.bottomSidebar')
	.addClass('closed')
	.animate({'left':0});
	
    $('.content').animate({left:0});
	
	//-- Resize dialogs on pane visibility change
	$('.pane .ui-dialog').each(function(index, element){			
		resizeDialog($(this), true);
	});
	
  }
  else
  {
    $('.sidebar')
	.removeClass('closed')
	.animate({'left':0});
	
	$('.bottomSidebar')
	.addClass('closed')
	.animate({'left':340});
	
    $('.content').animate({left:340});

	//-- Resize dialogs on pane visibility change
	$('.pane .ui-dialog').each(function(index, element){
		resizeDialog($(this), false);
	});
  }
});




//-- Right Splitter control
$('.btnRight-splitter').on('click', 
function(e){	
  if(!$('.rightSidebar').hasClass('closed'))
  {
    $('.rightSidebar')
	.addClass('closed')
	.animate({'right':-340});
	
    $('.content').animate({right:0});
	
	//-- Resize dialogs on pane visibility change
	$('.pane .ui-dialog').each(function(index, element){			
		resizeDialog($(this), true);
	});
	
  }
  else
  {
    $('.rightSidebar')
	.removeClass('closed')
	.animate({'right':0});
    $('.content').animate({right:340});

	//-- Resize dialogs on pane visibility change
	$('.pane .ui-dialog').each(function(index, element){
		resizeDialog($(this), false);
	});
  }
});




//-- Bottom Splitter control
/*$('.btnBottom-splitter').on('click', */

$(".bottomSidebar" ).hide();

$('.btn-chart').on('click', 

function(e){	
  if(!$('.bottomSidebar').hasClass('closed'))
  {
	$(".bottomSidebar" ).addClass('closed');
	$(".bottomSidebar" ).hide( "slow" );
	  
    /*$('.bottomSidebar')
	.addClass('closed')
	.animate({'bottom':-340});*/
	
    /*$('.content').animate({left:0});*/
	
	//-- Resize dialogs on pane visibility change
	/*$('.pane .ui-dialog').each(function(index, element){			
		resizeDialog($(this), true);
	});
	*/
  }
  else
  {
	 $(".bottomSidebar" ).removeClass('closed');
	 $(".bottomSidebar" ).show();
	  
	  
    /*$('.bottomSidebar')
	.removeClass('closed')
	.animate({'bottom':0});
    $('.content').animate({bottom:340});*/

	//-- Resize dialogs on pane visibility change
	
	/*$('.pane .ui-dialog').each(function(index, element){
		resizeDialog($(this), false);
	});
	*/
	
	
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
	
	var chartspace = dialog.find('.chartspace');		
	console.log(chartspace);

	dialog.animate({'width': newWidth, 'left': newX}, function()
	{
		console.log($(this).find('.dia').innerWidth());
		console.log($(this).find('.chartspace').width());
		
		var chart = chartspace.highcharts();
		
		chart.setSize(chartspace.innerWidth(), chartspace.innerHeight());
		x = true;
	});	

}

//-- Tabs activation
$('.side-tabs').easytabs({
	animationSpeed: 200,
	wheelSpeed: 40
});

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

});
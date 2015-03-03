/*global app:true */

var browser = $.browser;
var userDevice;
var captureChart;
var updatedText = '';
var copyInfo = '';
var sectionActive = false;
var currentSection = 1;
var furthestSection = 1;
var lastActiveDropDown = null;

$().ready(
	function(){
		setTimeout(loaded, 100); //slight delay for loading graphic
		function loaded(){setup();}
	}
);

function setup(){
	if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
		userDevice = getUserDevice();
		//$(document).on('contextmenu', function(){return false;});
		preCacheImages();
	}else{
		$('body').html('<div style="margin:10px;font-weight:bold; font-size:18px;">Please use Google Chrome</div>');
	}
}

function getUserDevice(){
	var device = 'computer';
	var iPad = navigator.userAgent.match(/iPad/i) !== null;
	var iPhone = (navigator.userAgent.match(/iPhone/i) !== null) || (navigator.userAgent.match(/iPod/i) !== null);
	if(iPad){iPhone = false; device = 'iPad';}
	if(iPhone){device = 'iPhone';}
	if(navigator.userAgent.indexOf('Mac OS X') !== -1){/*pc*/}else{/*mac*/}

	return device;
}

function preCacheImages(a){
	if(a && a.length > 0){
		for(var i = 0; i < a.length; i++){
			$('#precache').append($('<img />').attr({src: a[i],onload: imageCached([i, a.length - 1])}));
		}
	}else{
		imageCached();
	}
}

function imageCached(n){
	if(n === undefined || n[0] === n[1]){
		credits();
	}
}

function credits(){
	init();
}

function init(){
	reveal();

	$('.icons').on('mouseover', function(e){
		//console.log('hovering');
	});

	var startSize = $('.icons:eq(0)').css('font-size');

	$('#resetIcons').on(inputType(), function(e){
		location.reload();
	});

	var $section1 = $('#section1');

	$('.icons').on(inputType(), function(e){
		hideBookmark();

		var $this = $(this);

		if($this.attr('enabled') === 'true' && !$this.hasClass('iconActive')){
			removeChart();

			$this.siblings('.icons').addClass('disabled').attr('enabled','false');

			$('.icons').removeClass('iconActive');
			$this.addClass('iconActive');

			//$('.icons').removeClass('iconActive').addClass('disabled').attr('enabled','false');
			//$(this).addClass('iconActive').removeClass('disabled').attr('enabled','true');

			//console.log($(this).children('.iconTitle').text());

			if(!sectionActive && startSize === $this.css('font-size')){
				sectionActive = true;
				$('.iconTitle').stop().animate({
					fontSize: '0px'
					}, 400, function(){
					$('.iconTitle').css('display', 'none');
				});

				$('.icons').stop().animate({
					fontSize: '24px',
					'min-width': '24px'
					}, 500, function(){
					$('#section2').css('display', 'block');					
					currentSection = 2;
					$('#resetIcons').addClass('enabled');
				});
			}else{ //chose a different one
				$.each($('.section'), function(i, w){
					if(i > 1){
						$(w).children().off();
						$(w).remove();
					}
				});

				$('label').children('.optionText').removeClass('activeText');
				$('input:radio').attr('checked', false);
				$('.rangeSlider').attr('activated','false');

				for(var i = 0; i < $('.rangeSlider').length; i++){
					$($('.rangeSlider')[i]).slider({});
				}
			}

			furthestSection = 2;
			currentSection = 2;

			if($this.children('.iconTitle').text() === 'FRED chart'){
				fredchart();
				//console.log('fred');
			}else if($this.children('.iconTitle').text() === 'Custom chart'){
				customchart();
				//console.log('custom');
			}else if($this.children('.iconTitle').text() === 'Custom audio'){
				setTimeout(audioPlayer, 500);
			}else if($this.children('.iconTitle').text() === 'Podcast'){
				audioRSS();
			}else if($this.children('.iconTitle').text() === 'Dual-axis chart'){
				setTimeout(dualAxis, 500);
			}
			$section1.find('.instructions span').text('Widget: ' + $this.children('.iconTitle').text());
		}else if($this.attr('enabled').indexOf('link::') > -1 && !$this.hasClass('iconActive')){ //it's an external link
			//window.location = $this.attr('enabled').split('link::').join('');
			window.open($this.attr('enabled').split('link::').join(''));
		}
	});

	if(document.URL.indexOf('?#') > -1){	
		if(document.URL.indexOf('wd1=grapher') > document.URL.indexOf('?#')){
			autoActivateCustomChart();
			customchart(true);
		}
	}
}

function autoActivateCustomChart(){
	sectionActive = true;
	$('i.fa-pencil').addClass('iconActive');

	$('.iconTitle').css('font-size', '0px');
	$('.iconTitle').css('display', 'none');

	$('.icons').css('font-size', '24px').css('min-width','24px');
	$('#section2').css('display', 'block');
}

function initScrolling($what){
	$('.scrollbar').remove();

	var contentsHeight = innerContentHeight();

	function innerContentHeight(){
		for(var all = 0, i = 0; i < $what.children().length; i++){
			all += $($what.children()[i]).outerHeight();
		}

		return all;
	}

	function scrollBarHandleHeight(){
		return Math.round((parseInt(maxHeight, 10) / contentsHeight) * parseInt(maxHeight, 10));
	}

	var maxHeight = $what.css('max-height');

	if(contentsHeight > parseInt(maxHeight, 10)){
		$what.children().css('padding-right','20px');

		var startingPoint = $what.children(0).css('top');

		if(startingPoint === 'auto'){
			startingPoint = 0;
		}else{
			startingPoint = parseInt(startingPoint, 10);
		}

		$what.off('mousewheel').prepend('<div class="scrollbar"></div>').attr('pos', startingPoint);
		$('.scrollbar').css('height', maxHeight).append('<div class="scrollbarHandle" style="height:' + scrollBarHandleHeight() + 'px"></div>');
		//$('.scrollbarHandle').css('top', handlePosition + 'px');

		//console.log(startingPoint, parseInt(maxHeight), contentsHeight);
		var handlePosition = -startingPoint / (contentsHeight - parseInt(maxHeight, 10)) * (parseInt(maxHeight, 10) - $('.scrollbarHandle').height());

		$('.scrollbarHandle').css('top', handlePosition + 'px').on('mousedown', function(e){
			var start = {x:e.pageX, y:e.pageY};
			var $handle = $(this);
			var handleStart = parseInt($handle.css('top'), 10);

			$(document).on('mousemove.scrolling', function(ev){
				//console.log(ev.pageX, ev.pageY);
				var newVal = ev.pageY - start.y;
					newVal += handleStart;

				if(newVal < 0){ //if you reach the bottom
					newVal = 0;
				}else if(newVal > parseInt(maxHeight, 10) - $handle.outerHeight()){ //if you reach the bottom
					newVal = parseInt(maxHeight, 10) - $handle.outerHeight();
				}

				$handle.css('top', newVal + 'px');
				var newValPercentage = newVal / (parseInt(maxHeight, 10) - $handle.outerHeight());
				$what.attr('pos', newValPercentage * (-contentsHeight + parseInt(maxHeight, 10)));
				$what.children('.dropDownOption').css('top', (newValPercentage * (-contentsHeight + parseInt(maxHeight, 10))) + 'px');
			});

			$(document).on('mouseup.scrolling', function(ev){
				$(document).off('mouseup.scrolling').off('mousemove.scrolling');
			});
		});

		$what.on('mousewheel', function(event, delta, deltaX, deltaY){
			//console.log(delta, deltaX, deltaY);

			var currentPos = parseInt($(this).attr('pos'), 10);
			var posY = (delta * $what.children().last().outerHeight()) + currentPos;

			if(posY > 0){ //if you reach the top
				posY = 0;
			}else if(posY < parseInt(maxHeight, 10) - contentsHeight){ //if you reach the bottom
				posY = parseInt(maxHeight, 10) - contentsHeight;
			}else{
				event.preventDefault(); //allow you to scroll without the page moving
			}

			$(this).attr('pos', posY);
			$(this).children('.dropDownOption').css('top', posY + 'px');
			

			handlePosition = (posY / (parseInt(maxHeight, 10) - contentsHeight)) * (parseInt(maxHeight, 10) - $('.scrollbarHandle').height());
			$('.scrollbarHandle').css('top', handlePosition + 'px');
		});
	}
}

function reveal(){
	$('div').first().css('visibility', 'visible');
	$('.loader').remove();
}

//UTILITY FUNCTIONS
function inputType(){
	return userDevice !== 'computer' ? 'touchend': 'click';
}

function createInputPopup($where, type){
	var top = $(window).scrollTop() + ($(window).height() / 2);

	$('body').css('overflow','hidden').append('<div class="popupShell" style="position:absolute; top:0px; z-index:999; background-color:rgba(255, 241, 223, .9); left:0px; width:100%; height:100%;"></div>');
	$('.popupShell').attr('type', type).append('<div class="customCaution" style="position:absolute; background-color:#fff1e0; padding:25px; margin-left:200px; margin-right:200px"><div class="cautionTitle">Caution</div><div style="text-align:left">Custom entries are more prone to user error and may cause unpredictable or undesirable chart results. Please make sure the information you have entered is correct before accepting.</div><div style="text-align:center"><button class="boolean inactive acceptButton">Accept</button><button class="boolean cancelButton">Cancel</button></div></div>');

	if(type === 'dateRange'){
		$('.customCaution').empty().append(dateRangeHTML());

		var dateRangePicker = dateRange('#fromList', '#toList');
	}else if(type === 'phrase'){
		$('.customCaution').prepend('<div style="text-align:left; font-weight:bold">Chart feed</div><div style="margin-bottom:20px">' + 
			'<div class="optionTitle" style="display:inline-block">Enter your data feed code</div>' + 
			'<input id="customOptionField" class="userText" type="text" maxlength="18" />' + 
		'</div>');
	}else if(type === 'word'){
		$('.customCaution').prepend('<div style="text-align:left; font-weight:bold">' + $where.parent().parent().siblings('.optionTitle').text() + '</div><div style="margin-bottom:20px">' + 
			'<div class="optionTitle" style="display:inline-block">' + reworkInstructions($where.attr('default')) + '</div>' + 
			'<input id="customOptionField" class="userText" type="text" maxlength="18" />' + 
		'</div>');
	}

	$('.customCaution').css('top', (top - ($('.customCaution').outerHeight() / 2)) + 'px');

	$('#customOptionField').on('keydown', function(e){
		toggleButton(this);
	}).on('keyup', function(e){
		toggleButton(this);
	});

	function reworkInstructions(t){
		var a = t.split(' ');
		a.shift();
		a = a.join(' ');

		if(a === 'your data feed'){ //exception to the rule 
			a += ' code';
		}

		return 'Enter ' + a;
	}

	function toggleButton(t){
		if($(t).val().length > 0){
			$('.boolean.acceptButton').removeClass('inactive');
			$('#customOptionField').addClass('activeInput');
		}else{
			$('.boolean.acceptButton').addClass('inactive');
			$('#customOptionField').removeClass('activeInput');
		}
	}

	$('.cancelButton').on(inputType(), function(e){
		$('body').css('overflow', 'auto'); //remove doesn't work in chrome
		$('.popupShell').remove();
	});

	$('.acceptButton').on(inputType(), function(e){
		if($('#customOptionField').val().length > 0 && $('.boolean.acceptButton').hasClass('inactive') === false){
			$where.text($('#customOptionField').val()).parent().parent().addClass('entered');

			if($('.popupShell').attr('type') === 'dateRange'){ //translate the time period into something short enough to fit into the dropdown field
				var date = $('#customOptionField').val();
				var dateArray = [];

				if(date === 'Earliest available - No end date'){
					date = 'All available';
				}else if(date.indexOf('Earliest available') >= 0){
					dateArray = date.split(' - ');
					dateArray[1] = dateArray[1].split(' ');
					dateArray[1][0] = dateArray[1][0].substring(0, 3);
					dateArray[1][1] = dateArray[1][1] + ',';
					dateArray[1] = dateArray[1].join(' ');
					dateArray[0] = 'Before:';

					date = dateArray.join(' ');
				}else if(date.indexOf('No end date') >= 0){
					dateArray = date.split(' - ');
					dateArray[1] = dateArray[0].split(' ');
					dateArray[1][0] = dateArray[1][0].substring(0, 3);
					dateArray[1][1] = dateArray[1][1] + ',';
					dateArray[1] = dateArray[1].join(' ');
					dateArray[0] = 'After:';
					
					date = dateArray.join(' ');
				}else{
					console.log(date);
					dateArray = date.split(' - ');
					dateArray[0] = dateArray[0].split(' ');
					dateArray[1] = dateArray[1].split(' ');
					dateArray[0][0] = dateArray[0][0].substring(0, 3);
					dateArray[0][1] = dateArray[0][1] + ',';
					dateArray[1][0] = dateArray[1][0].substring(0, 3);
					dateArray[1][1] = dateArray[1][1] + ',';
					dateArray[0] = dateArray[0].join(' ');
					dateArray[1] = dateArray[1].join(' ');

					date = dateArray.join(' - ');
					//date = 'User-defined range';
				}

				$where.text(date);
			}

			checkSection();

			$('body').css('overflow', 'auto'); //remove doesn't work in chrome
			$('.popupShell').remove();
		}
	});

	$('.warning').css('top', ($where.position().top - Math.floor($('.warning').outerHeight() / 2)) + 'px');
}

function createDisplayPopup(html){
	var top = $(window).scrollTop() + ($(window).height() / 2);

	$('body').css('overflow','hidden').append('<div class="popupShell" style="position:absolute; top:0px; z-index:999; background-color:rgba(255, 241, 223, .9); left:0px; width:100%; height:100%;"></div>');
	$('.popupShell').append('<div class="customCaution" style="position:relative; background-color:#fff1e0; padding:25px; margin-left:200px; margin-right:200px"><div class="cautionTitle">Caution</div><div style="text-align:left">X values must all be the same type - either <span class="activeText"><b>date</b></span>, <span class="activeText"><b>category</b></span> or <span class="activeText"><b>number</b></span>.</div><div style="text-align:center"><button class="boolean cancelButton">Okay</button></div></div>');

	$('.cancelButton').on(inputType(), function(e){
		$('body').css('overflow', 'auto'); //remove doesn't work in chrome
		$('.popupShell').remove();
	});

	$('.customCaution').prepend('<div style="text-align:left; font-weight:bold">' + 'Example data types' + '</div>' + 
		'<div style="margin-bottom:20px; display:inline-block; margin-right:25px">' + 
			'<div class="optionTitle" style="display:inline-block; margin-top:20px">' + 'Date example' + '</div><br/>' + 
			'<div style="display:inline-block; margin-top:5px"><div style="display:inline-block"><div class="optionTitle">X values</div><textarea disabled class="active disableSelect" style="cursor:default !important; margin-right:5px; height:58px; text-align:right">2012-05-22\n2012-06-25\n2012-08-28</textarea></div><div style="display:inline-block"><div class="optionTitle">Y values</div><textarea disabled class="active disableSelect" style="cursor:default !important; height:58px;">192.6\n133\n167.801</textarea></div><div id="dataEntryWarning" style="font-size: 16px; font-weight:bold; color:#c36256; margin-right: 10px; margin-bottom: 10px; display: none;"><span class="errorEntryText">Letters are not permitted</span></div></div>' + 
		'</div>' + 
		'<div style="margin-bottom:20px; display:inline-block;">' + 
			'<div class="optionTitle" style="display:inline-block">Category example</div><br>' + 
			'<div style="display:inline-block; margin-top:5px"><div style="display:inline-block"><div class="optionTitle">X values</div><textarea disabled="" class="active disableSelect" style="cursor:default !important; margin-right:5px; height:58px; text-align:right">Cisco\nIBM\nGoogle</textarea></div><div style="display:inline-block"><div class="optionTitle">Y values</div><textarea disabled="" class="active disableSelect" style="cursor:default !important; height:58px;">14.2\n36.21\n42.5</textarea></div><div id="dataEntryWarning" style="font-size: 16px; font-weight:bold; color:#c36256; margin-right: 10px; margin-bottom: 10px; display: none;"><span class="errorEntryText">Letters are not permitted</span></div></div>' + 
		'</div><br/>' + 
		'<div style="margin-bottom:20px; display:inline-block;">' + 
			'<div class="optionTitle" style="display:inline-block">Number example</div><br>' + 
			'<div style="display:inline-block; margin-top:5px"><div style="display:inline-block"><div class="optionTitle">X values</div><textarea disabled="" class="active disableSelect" style="cursor:default !important; margin-right:5px; height:58px; text-align:right">21\n45\n53</textarea></div><div style="display:inline-block"><div class="optionTitle">Y values</div><textarea disabled="" class="active disableSelect" style="cursor:default !important; height:58px;">2404\n1905.1\n2037.33</textarea></div><div id="dataEntryWarning" style="font-size: 16px; font-weight:bold; color:#c36256; margin-right: 10px; margin-bottom: 10px; display: none;"><span class="errorEntryText">Letters are not permitted</span></div></div>' + 
		'</div>');

	$('.customCaution').css('top', (($(window).height() / 2) - Math.floor($('.customCaution').outerHeight() / 2)) + 'px');
}

function checkSection(){
	if(currentSection === 3){
		if($('#section' + currentSection).children('.dropDownMenuContainer').children('.dropDownMenu.entered').length === 3){
			nextSection();
		}
	}else if(currentSection === 4){
		if($('#section' + currentSection).children('.dropDownMenuContainer').children('.dropDownMenu.entered').length === 2){
			if($('#section' + currentSection).children('.inputContainer').children('input').hasClass('active') === true){
				nextSection();
			}
		}
	}
}

function nextSection(){
	currentSection++;
	if(furthestSection < currentSection){
		furthestSection = currentSection;
	}else{
		while(currentSection < furthestSection){
			$('#section' + currentSection).css('display', 'block');
			currentSection++;
		}
	}

	//console.log('currentSection: ' + currentSection);
	//console.log('furthestSection: ' + furthestSection);

	$('#section' + currentSection).css('display', 'block');

	for(var i = 0; i < $('.section').length; i++){
		if(i > currentSection){
			$('#section' + i).css('display', 'none');
		}
	}

	checkBookmark();
}

function prevSection(){
	hideBookmark();
	$('#section' + currentSection).css('display', 'none');
	currentSection--;
}

function removeChart(){
	$('.autoChartHolder').remove();
	$('.generateButton').css('display','block');
}

function allowBookmark(){
	$('#bookmark').addClass('enabled');
}

function hideBookmark(){
	$('#bookmark').removeClass('enabled');
}

function checkBookmark(){
	console.log('checking...');

	if($('#onDocs').is(':checked') && currentSection >= 6){
		allowBookmark();
	}else{
		hideBookmark();
	}
}

captureChart = function(w,h){
	var timeout = setTimeout(function(){
		var tableData = '<table><tr><td>Date</td><td>Value</td></tr>';
		var i;

		for(i = 0; i < $('#iframeChart').get(0).contentWindow.dataSet.chart.observation.length; i++){
			tableData += '<tr><td>' + $('#iframeChart').get(0).contentWindow.dataSet.chart.observation[i].date + '</td>';
			tableData += '<td>' + $('#iframeChart').get(0).contentWindow.dataSet.chart.observation[i].value + '</td></tr>';
		}

		tableData += '</table>';

		$('#saveChart').removeClass('disabled').on(inputType(), function(){
			var canvas;

			$(this).attr('download', function(){
				var $iframeChart = $('#iframeChart');

				$iframeChart.contents().find('.highcharts-container').children('div').remove(); //not implemented yet - breaks
				$iframeChart.contents().find('.highcharts-container').find('.highcharts-markers').remove(); //breaks
				$iframeChart.contents().find('.highcharts-container').find('.highcharts-tooltip').remove(); //annoyance

				$iframeChart.contents().find('.highcharts-container').find('svg').prepend('<rect id="ground" width="1024" height="768" style="fill: #fff1e0; stroke: none;"></rect>'); //add pink behind graph for image
				$iframeChart.contents().find('.highcharts-container').find('.highcharts-legend').children('rect').removeAttr('stroke-opacity'); //remove for when there is a legend

				for(i = 0; i < $iframeChart.contents().find('.highcharts-grid').find('path').length; i++){
					$iframeChart.contents().find('.highcharts-grid').find('path:eq(' + i + ')').css('opacity', $iframeChart.contents().find('.highcharts-grid').find('path:eq(' + i + ')').css('stroke-opacity')).removeAttr('stroke-opacity');
				}

				for(i = 0; i < $iframeChart.contents().find('.highcharts-axis:eq(1)').find('path').length; i++){
					$iframeChart.contents().find('.highcharts-axis:eq(1)').find('path:eq(' + i + ')').css('opacity', $iframeChart.contents().find('.highcharts-axis:eq(1)').find('path:eq(' + i + ')').css('stroke-opacity')).removeAttr('stroke-opacity');
				}

				$.each($iframeChart.contents().find('.highcharts-series').find('path'), function (i, w){
					$(w).siblings().length > 0 ? $(w).attr('fill').toLowerCase() !== 'none' ? $(w).css('opacity', $(w).css('fill-opacity')) : 0 : 0;
					$(w).removeAttr('fill-opacity');
				});

				for(i = 0; i < $iframeChart.contents().find('.highcharts-series').find('rect').length; i++){
					$iframeChart.contents().find('.highcharts-series').find('rect:eq(' + i + ')').css('opacity', $iframeChart.contents().find('.highcharts-series').find('rect:eq(' + i + ')').css('stroke-opacity')).removeAttr('stroke-opacity');
				
					if($iframeChart.get(0).contentWindow.dataSet.chart.observation.length > w / 2){
						$iframeChart.contents().find('.highcharts-series').find('rect:eq(' + i + ')').css('stroke-width','0');
					}
				}

				if(updatedText.length > 0){
					$iframeChart.contents().find('svg').append('<text x="0" y="20" id="udText" style="font-family:Arial;font-size:10px;font-style:italic;fill:#74736c;width:556px;" text-anchor="end" zIndex="4"><tspan x="' + ($iframeChart.contents().find('svg').outerWidth() - 5) + '">Updated: ' + updatedText + '</tspan></text>');
				}
				
				var contentToRender = $.trim($('#iframeChart').contents().find('.highcharts-container')[0].innerHTML);
				canvas = document.getElementById('imageCanvas');
				canvas.width = w;
				canvas.height = h;

				var canvasContext = canvas.getContext('2d');
				canvasContext.drawSvg(contentToRender,0,0);

				return 'chartFRED-' + w + 'x' + h + '.png'
				

				$iframeChart.get(0).contentWindow.captureChart(); //uses highcharts image capture, issue with the font
			});

			this.href = canvas.toDataURL('png');

			$('#iframeChart').contents().find('#chart').remove();
			$('#iframeChart').contents().find('#updatedText').remove();
			$('#iframeChart').get(0).contentWindow.dataSet.chart.settings.animTime = 0;
			$('#iframeChart').get(0).contentWindow.createHighchart($('#iframeChart').get(0).contentWindow.dataSet.chart.settings.graphType);
		});

		if($('#spreadsheetWarning').length < 1){
			$('#saveSpreadsheet').removeClass('disabled').on(inputType(), function(e){
				exportTableToCSV.apply(this, [$('.autoChartHolder').attr('chartTitle') + '.xls']);
			});
		}

		function exportTableToCSV(filename){
            var csvData = 'data:application/vnd.ms-excel;base64,';
            var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>';

            function format(s,c){
            	return s.replace(/{(\w+)}/g, function(m, p){return c[p];});
            }

            function base64(s){
            	return window.btoa(unescape(encodeURIComponent(s)));
            }

        	$(this)
            	.attr({
            	'download': filename,
                'href': csvData + base64(format(template, {worksheet: $('.autoChartHolder').attr('chartTitle') || 'Worksheet', table: tableData})),
                'target': '_blank'
        	});
    	}
	}, 1100);
}

function dateRangeHTML(){
	return '<input id="customOptionField" class="userText" style="position:absolute; display:none" type="text" value="Enter the title"><div class="listsHolder"><div class="optionTitle" style="text-align:left; font-weight:bold; color: #74736c">Date range</div><div class="treelistHolder" id="treelistHolder1"><div class="optionTitle" style="margin-top: 10px">Select the start</div><div id="fromList" class="treelist"><div class="groupBorder" style="margin-right:3px"><div class="selector months"></div><div class="group"><ul class="date" id="datePickerMonth" style="text-align:right"><li>January</li><li>February</li><li>March</li><li>April</li><li>May</li><li>June</li><li>July</li><li>August</li><li>September</li><li>October</li><li>November</li><li>December</li></ul></div></div><div class="groupBorder" style="margin-right:3px; margin-left:0px"><div class="selector days"></div><div class="group"><ul class="date" id="datePickerDay"><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>10</li><li>11</li><li>12</li><li>13</li><li>14</li><li>15</li><li>16</li><li>17</li><li>18</li><li>19</li><li>20</li><li>21</li><li>22</li><li>23</li><li>24</li><li>25</li><li>26</li><li>27</li><li>28</li><li>29</li><li>30</li><li>31</li></ul></div></div><div class="groupBorder" style="margin-left:0px"><div class="selector years"></div><div class="group"><ul class="date" id="datePickerYear" style="text-align:left"><li>1900</li><li>1901</li><li>1902</li><li>1903</li><li>1904</li><li>1905</li><li>1906</li><li>1907</li><li>1908</li><li>1909</li><li>1910</li><li>1911</li><li>1912</li><li>1913</li><li>1914</li><li>1915</li><li>1916</li><li>1917</li><li>1918</li><li>1919</li><li>1920</li><li>1921</li><li>1922</li><li>1923</li><li>1924</li><li>1925</li><li>1926</li><li>1927</li><li>1928</li><li>1929</li><li>1930</li><li>1931</li><li>1932</li><li>1933</li><li>1934</li><li>1935</li><li>1936</li><li>1937</li><li>1938</li><li>1939</li><li>1940</li><li>1941</li><li>1942</li><li>1943</li><li>1944</li><li>1945</li><li>1946</li><li>1947</li><li>1948</li><li>1949</li><li>1950</li><li>1951</li><li>1952</li><li>1953</li><li>1954</li><li>1955</li><li>1956</li><li>1957</li><li>1958</li><li>1959</li><li>1960</li><li>1961</li><li>1962</li><li>1963</li><li>1964</li><li>1965</li><li>1966</li><li>1967</li><li>1968</li><li>1969</li><li>1970</li><li>1971</li><li>1972</li><li>1973</li><li>1974</li><li>1975</li><li>1976</li><li>1977</li><li>1978</li><li>1979</li><li>1980</li><li>1981</li><li>1982</li><li>1983</li><li>1984</li><li>1985</li><li>1986</li><li>1987</li><li>1988</li><li>1989</li><li>1990</li><li>1991</li><li>1992</li><li>1993</li><li>1994</li><li>1995</li><li>1996</li><li>1997</li><li>1998</li><li>1999</li><li>2000</li><li>2001</li><li>2002</li><li>2003</li><li>2004</li><li>2005</li><li>2006</li><li>2007</li><li>2008</li><li>2009</li><li>2010</li><li>2011</li><li>2012</li><li>2013</li><li>2014</li><li>2015</li><li>2016</li><li>2017</li><li>2018</li><li>2019</li><li>2020</li></ul></div></div></div><div class="orText"><div>or</div><div class="radioCheckboxHolder" id="radioCheckBoxStart"><label for="startAll"><input type="checkbox" id="startAll"><div class="radioCircle"></div><span class="optionText"><span>Earliest available</span><span class="optionDetail"></span></span></label></div></div></div><div class="treelistHolder disabled" id="treelistHolder2" style="margin-left:5px"><div class="optionTitle">Select the end</div><div id="toList" class="treelist"><div class="groupBorder" style="margin-right:3px"><div class="selector months"></div><div class="group"><ul class="date" id="datePickerMonth2" style="text-align:right"><li>January</li><li>February</li><li>March</li><li>April</li><li>May</li><li>June</li><li>July</li><li>August</li><li>September</li><li>October</li><li>November</li><li>December</li></ul></div></div><div class="groupBorder" style="margin-right:3px; margin-left:0px"><div class="selector days"></div><div class="group"><ul class="date" id="datePickerDay2"><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>10</li><li>11</li><li>12</li><li>13</li><li>14</li><li>15</li><li>16</li><li>17</li><li>18</li><li>19</li><li>20</li><li>21</li><li>22</li><li>23</li><li>24</li><li>25</li><li>26</li><li>27</li><li>28</li><li>29</li><li>30</li><li>31</li></ul></div></div><div class="groupBorder" style="margin-left:0px"><div class="selector years"></div><div class="group"><ul class="date" id="datePickerYear2" style="text-align:left"><li>1900</li><li>1901</li><li>1902</li><li>1903</li><li>1904</li><li>1905</li><li>1906</li><li>1907</li><li>1908</li><li>1909</li><li>1910</li><li>1911</li><li>1912</li><li>1913</li><li>1914</li><li>1915</li><li>1916</li><li>1917</li><li>1918</li><li>1919</li><li>1920</li><li>1921</li><li>1922</li><li>1923</li><li>1924</li><li>1925</li><li>1926</li><li>1927</li><li>1928</li><li>1929</li><li>1930</li><li>1931</li><li>1932</li><li>1933</li><li>1934</li><li>1935</li><li>1936</li><li>1937</li><li>1938</li><li>1939</li><li>1940</li><li>1941</li><li>1942</li><li>1943</li><li>1944</li><li>1945</li><li>1946</li><li>1947</li><li>1948</li><li>1949</li><li>1950</li><li>1951</li><li>1952</li><li>1953</li><li>1954</li><li>1955</li><li>1956</li><li>1957</li><li>1958</li><li>1959</li><li>1960</li><li>1961</li><li>1962</li><li>1963</li><li>1964</li><li>1965</li><li>1966</li><li>1967</li><li>1968</li><li>1969</li><li>1970</li><li>1971</li><li>1972</li><li>1973</li><li>1974</li><li>1975</li><li>1976</li><li>1977</li><li>1978</li><li>1979</li><li>1980</li><li>1981</li><li>1982</li><li>1983</li><li>1984</li><li>1985</li><li>1986</li><li>1987</li><li>1988</li><li>1989</li><li>1990</li><li>1991</li><li>1992</li><li>1993</li><li>1994</li><li>1995</li><li>1996</li><li>1997</li><li>1998</li><li>1999</li><li>2000</li><li>2001</li><li>2002</li><li>2003</li><li>2004</li><li>2005</li><li>2006</li><li>2007</li><li>2008</li><li>2009</li><li>2010</li><li>2011</li><li>2012</li><li>2013</li><li>2014</li><li>2015</li><li>2016</li><li>2017</li><li>2018</li><li>2019</li><li>2020</li></ul></div></div></div><div class="orText"><div>or</div><div class="radioCheckboxHolder" id="radioCheckBoxEnd"><label for="endAll"><input type="checkbox" id="endAll"><div class="radioCircle"></div><span class="optionText"><span>No end date</span><span class="optionDetail"></span></span></label></div></div></div><div style="height:0px; width:20px; clear:both"></div><div id="dateRangeWarning" style="font-size:16px; color: #74736c; margin-right:10px; margin-top:10px; display:none"><div style="text-align:center; color:#c36256; font-weight:bold">End date cannot be earlier than start date.</div></div><div style="text-align:center"><button class="boolean inactive acceptButton">Accept</button><button class="boolean cancelButton">Cancel</button></div></div>';
}

function copyText(){
	return copyInfo;
}
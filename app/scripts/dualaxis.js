function dualAxis(){
	function testRetrieve(data){
		$dualContent.find('#dualaxisSection2').remove();
		$dualContent.find('#dualaxisSection3').remove();

		if(!data.statusText){
			//console.log('retrieved okay!');
			//lastURL = section2.split('[[bKey]]').join('http://editorial.ft.com/widgets/dualAxis/?#' + bKey); //http://ft.com/ig/widgets/widgetBrowser/dualAxis doesn't work

			lastURL = sectionOptional + section2.split('[[bKey]]').join('http://editorial.ft.com/widgets/dualAxis/?#' + bKey); //http://ft.com/ig/widgets/widgetBrowser/dualAxis doesn't work

			$dualContent.append(lastURL).find('.expandContract').on('click', function (e){
				var $this = $(this);

				$this.addClass('noDisplay').siblings('.noDisplay').removeClass('noDisplay');

				if(!$this.hasClass('expand')){
					$this.parent().siblings('.inputs').addClass('noDisplay');
				}else{
					$this.parent().siblings('.inputs').removeClass('noDisplay');
				}
			});

			$dualContent.find('.inputValues').on('keypress keyup', function (e){
				if(e.keyCode < 48 && e.keyCode > 57){
					return false;
				}else{
					var startPos = this.selectionStart;
					var endPos = this.selectionEnd;
					var a;
					var b;

					if(startPos !== endPos && this.value){
						//a = this.value.subtring(0, startPos);
						//b = this.value.subtring(endPos, this.value.length);
					}

					console.log(startPos, endPos);

					console.log('result:', a, b);

					//this.value = this.value.replace(/[^0-9.-]+/g, '');
					$('#iframeChart').attr('src', '');

					try{
						clearTimeout(setTimeoutKeyPress);
					}catch(error){
						//hasn't been set yet
					}

					setTimeoutKeyPress = setTimeout(function (e){ //add in the Y settings
						var val1 = $dualContent.find('.inputValues.value1').val();
						var val2 = $dualContent.find('.inputValues.value2').val();
						var val3 = $dualContent.find('.inputValues.value3').val();
						var val4 = $dualContent.find('.inputValues.value4').val();

						var s = '';

						if(val1 && !isNaN(val1)){
							s = s + '&y0m1i2n3l4e5f6t7=' + val1;
						}

						if(val2 && !isNaN(val2)){
							s = s + '&y0m1a2x3l4e5f6t7=' + val2;
						}

						if(val3 && !isNaN(val3)){
							s = s + '&y0m1i2n3r4i5g6h7t8=' + val3;
						}

						if(val4 && !isNaN(val4)){
							s = s + '&y0m1a2x3r4i5g6h7t8=' + val4;
						}

						$('#iframeChart').attr('src', 'http://editorial.ft.com/widgets/dualAxis/?#' + bKey + s);
					}, 1000);
				}
			});
		}else{
			//console.log('something wrong with the spreadsheet!');
			$dualContent.find('.cautionTitle').css('display', 'block').html('Unable to load Bertha spreadsheet. <br>Please check the url and make sure the bertha spreadsheet is in the proper format.</br></br>(It should look like either of the example formats).');
		}

		$anim.css('visibility', 'hidden').removeClass('fa-spin');
		$dualContent.find('#dualaxisSection1 button.retrieve').removeClass('disabled');
	}

	var width = 600;
	var height = 338;
	var section1 = '<div class="section" id="dualaxisSection1" style="display:block;"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">2</div><span>Enter the bertha spreadsheet url <a target="_blank" style="margin-left:10px;" href="https://docs.google.com/a/ft.com/spreadsheet/ccc?key=0AksTHVCen_U-dDgxakJGQlJDSXp5TnprN2tQdW9nNFE#gid=72">(Example 1: FRED data)</a> <a target="_blank" style="margin-left:10px;" href="https://docs.google.com/a/ft.com/spreadsheet/ccc?key=0AksTHVCen_U-dGNFdThJZHBnbk1lUkFVUkJqQ1RQdEE">(Example 2: manual entry)</a></span></div><div class="berthaInputHolder" style="margin-left: 25px; display: block;"><input id="berthaRetrieveInput" class="userText" type="text" style="width:450px"><button class="generic retrieve" style="margin-left:5px">Retrieve</button><i class="retrieveAnim fa fa-cog" style="font-size:26px; margin-left:2px; position:relative; top:4px; color:rgba(0,0,0,0.25); visibility:hidden"></i><div class="cautionTitle" style="display:none; font-size:16px; margin-bottom:10px"></div></div></div>';
	var section2 = '<div class="section" id="dualaxisSection3" style="display:block;"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">3</div><iframe onload="captureDualAxis(' + width + ',' + height + ',' + "'[[bKey]]'" + ')" id="iframeChart" class="autoChart" style="margin:0px; background-color:#fff1e0" src="' + '[[bKey]]' + '" scrolling="no" width="' + width + 'px" height="' + height + 'px" seamless="seamless"></iframe></div><div class="buttonAligner" style="float: left; margin:15px 0 25px 0"><a class="afterButton" id="saveChart">Save chart as image</a></div></div>';
	var sectionOptional = '<div class="section" id="dualaxisSection2" style="display: block;"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">3</div><div>Additional settings<span class="expandContract expand"><i class="fa fa-plus-square"></i></span><span class="expandContract contract noDisplay"><i class="fa fa-minus-square"></i></span></div><div class="inputs noDisplay" style="margin: 10px 0 0 25px;"><div style="display: inline-block; margin-right: 20px;"><div style="display:inline-block"><div class="optionTitle">Y-Axis Left</div><div class="optionTitle">Min</div><input class="inputValues value1" type="text" style="margin-right: 5px; text-align: right; max-width: 110px;min-width: initial;text-align: left;" class=""></div><div style="display:inline-block"><div class="optionTitle">Max</div><input class="inputValues value2" type="text" style="margin-right: 5px; text-align: right; max-width: 110px;min-width: initial;text-align: left;" class=""></div><div id="dataEntryWarning" style="font-size: 16px; font-weight: bold; color: rgb(195, 98, 86); margin-right: 10px; margin-bottom: 10px; display: none;"><span class="errorEntryText">Y values must be numbers</span></div></div><div style="display: inline-block"><div style="display:inline-block"><div class="optionTitle">Y-Axis Right</div><div class="optionTitle">Min</div><input class="inputValues value3" type="text" style="margin-right: 5px; text-align: right; max-width: 110px;min-width: initial;text-align: left;" class=""></div><div style="display:inline-block"><div class="optionTitle">Max</div><input class="inputValues value4" type="text" style="margin-right: 5px; text-align: right; max-width: 110px;min-width: initial;text-align: left;" class=""></div><div id="dataEntryWarning" style="font-size: 16px; font-weight: bold; color: rgb(195, 98, 86); margin-right: 10px; margin-bottom: 10px; display: none;"><span class="errorEntryText">Y values must be numbers</span></div></div></div><!--<div class="optionDetail">X values can be either <b>dates</b>, <b>categories</b> or <b>numbers</b>. Y values must be <b>numbers</b>.</div>--></div></div>';
	var $dualContent = $('#FTi .contents .content');
	var $anim;
	var bKey;
	var lastURL;
	var setTimeoutKeyPress;

	$dualContent.append(section1).find('#dualaxisSection1 button.retrieve').on(inputType(), function (e){
		bKey = $dualContent.find('#berthaRetrieveInput').val();
		$dualContent.find('#dualaxisSection2').remove();
		$dualContent.find('#dualaxisSection3').remove();

		if(bKey.length > 0){
			if(bKey.indexOf('key=') > -1){
				bKey = bKey.substring(bKey.indexOf('key=') + 4, bKey.indexOf('#'));
			}

			if(bKey.indexOf('&') > -1){
				bKey = bKey.substring(0, bKey.indexOf('&'));
			}

			$(this).addClass('disabled').siblings('.fa-cog');
			
			if(!$anim){
				$anim = $(this).addClass('disabled').siblings('.fa-cog');
			}

			$anim.css('visibility', 'visible').addClass('fa-spin');

			Bertha.getSpreadsheet({id:bKey, sheets:['settings', 'series', 'events']}).done(testRetrieve).fail(testRetrieve);
		}
	});

	$dualContent.find('#berthaRetrieveInput').on('keypress keyup', function (e){
		var $this = $(this);

		if($this.val().length > 0){
			$this.addClass('active');
		}else{
			$this.removeClass('active');
		}

		$dualContent.find('#dualaxisSection2').remove();
		$dualContent.find('#dualaxisSection3').remove();
		$dualContent.find('.cautionTitle').css('display', 'none');
	});
}

var captureDualAxis = function(w,h,url){
	var timeout = setTimeout(function(){
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

				//console.log('ben', $iframeChart.contents().find('.highcharts-axis').length);

				for(var j = 0; j < $iframeChart.contents().find('.highcharts-axis').length; j++){
					for(i = 0; i < $iframeChart.contents().find('.highcharts-axis:eq(' + j + ')').find('path').length; i++){
						$iframeChart.contents().find('.highcharts-axis:eq(' + j + ')').find('path:eq(' + i + ')').css('opacity', $iframeChart.contents().find('.highcharts-axis:eq(' + j + ')').find('path:eq(' + i + ')').css('stroke-opacity')).removeAttr('stroke-opacity');
					}
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

				return 'chartFRED-' + w + 'x' + h + '.png';
				
				$iframeChart.get(0).contentWindow.captureChart(); //uses highcharts image capture, issue with the font
			});

			this.href = canvas.toDataURL('png');

			//$('#iframeChart').contents().find('#chart').remove();
			//$('#iframeChart').contents().find('#updatedText').remove();
			//$('#iframeChart').get(0).contentWindow.createHighchart($('#iframeChart').get(0).contentWindow.dataSet.chart.settings.graphType);
		

			$('#iframeChart').attr('src', '');
			setTimeout(function(){$('#iframeChart').attr('src', url);}, 25);
			console.log('did this happen?');
		});
	}, 1100);
};
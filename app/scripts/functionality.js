////////////////////////////////////////////////////
// FRED ////////////////////////////////////////////
////////////////////////////////////////////////////

function fredchart(){
	$('#FTi .contents .content').append(htmlFredChart);

	$('#section2').find('ul').children('.optionText').on(inputType(), function(e){
		$('#section2').find('ul').children('.optionText').removeClass('activeText');
		$(this).addClass('activeText');
		removeChart();

		var $sizeDefault = $('#sizeDefault');
		var anyActive = false;

		if(this.id.indexOf('default') > -1){
			//console.log('default');
			$('#sizeCustom').css('display','none');
			$sizeDefault.css('display','block');

			anyActive = false;

			$.each($sizeDefault.children('label'), function(i){
				//console.log($sizeDefault.children('label:nth-child(' + i + ')').is(':checked'));

				if($sizeDefault.children('label:nth-child(' + i + ')').children('input').is(':checked') === true){
					anyActive = true;
				}
			});

			if(anyActive){ //something is already checked off
				if(currentSection === 2){
					nextSection();
				}
			}else{
				while(currentSection > 2){
					prevSection();
				}
			}
		}else{ //not default
			$('#sizeDefault').css('display','none');
			$('#sizeCustom').css('display','block');

			anyActive = false;

			$.each($sizeDefault.children('label'), function(i){
				//console.log($sizeDefault.children('label:nth-child(' + i + ')').is(':checked'));

				if($sizeDefault.children('label:nth-child(' + i + ')').children('input').is(':checked') === true){
					anyActive = true;
				}
			});

			if(anyActive === true){
				while(currentSection > 2){
					prevSection();
				}
			}

			for(var h = 0, i = 0; i < $('#section' + currentSection).find('.rangeSlider').length; i++){ //number of rangeSliders inside div '#section2'
				if($($('#section' + currentSection).find('.rangeSlider')[i]).attr('activated') === 'true'){
					h++;
				}
			}

			if(h === 2){
				nextSection();
			}
		}
	});

	$('#section5').find('ul').children('.optionText').on(inputType(), function(e){
		$('#section5').find('ul').children('.optionText').removeClass('activeText');

		var $this = $(this);

		$this.addClass('activeText');
		removeChart();
		var sectionNumber = parseInt($this.parent().parent().parent()[0].id.split('section').join(''), 10);
		var $customContent = $(this).parent().parent().siblings('.inputContainer');

		if(this.id.indexOf('default') > -1){ //default
			$customContent.css('display', 'none');

			if(currentSection < 6){
				nextSection();
			}
		}else if(this.id.indexOf('custom') > -1){ //custom
			$customContent.css('display', 'block');

			if(currentSection > sectionNumber){
				if($('#section5').find('input').val() === $('#section5').find('input').attr('default')){
					prevSection();
				}
			}
		}
	});

	$('label').on(inputType(), function(e){ //selecting an option
		$this = $(this);
		removeChart();

		$('label').children('.optionText').removeClass('activeText');
		$this.children('.optionText').addClass('activeText');

		var sectionNumber = parseInt($this.parent().parent()[0].id.split('section').join(''));

		if(sectionNumber === currentSection){
			nextSection();
		}
	});

	$('.generateButton').on(inputType(), function(e){
		var str = ['fred/#?t0i1t2l3e4=', '&g0r1a2p3h4t5y6p7e8=', '&w0i1d2t3h4=', 'px&h0e1i2g3h4t5=', 'px&s0o1u2r3c4e5t6e7x8t9=', '&f0e1e2d3=', '&y0a1x2i3s4=', '&u0p1d2a3t4e5d6=', '&g0u1n2i3t4b=', '&g0u1n2i3t4a=', '&r0e1a2l3t4i5m6e7_8s9t0a1r2t3=', '&r0e1a2l3t4i5m6e7_8e9n0d1='];
		var width = 0;
		var height = 0;
		var i = 0;

		//console.log('building chart');


		//SECTION 2
		var $section2 = $('#section2');

		if($section2.find('ul').children('#2default').hasClass('activeText')){ //default
			for(i = 0; i < $('#section2').find('input').length; i++){
				var $input = $section2.find('input:eq(' + i + ')');

				if($input.is(':checked') === true){
					var a = $input.siblings('.optionText').children('.optionDetail').text().split(' pixels)').join('').split('(').join('').split(' x ');
					width = Number(a[0]);
					height = Number(a[1]);
				}
			}
		}else{ //custom
			width = $section2.children('#sizeCustom').find('.ui-slider-handle:eq(0)').text();
			height = $section2.children('#sizeCustom').find('.ui-slider-handle:eq(1)').text();
		}

		//SECTION 3
		var $section3 = $('#section3');
		var feedKeyWord = $section3.children('.dropDownMenuContainer:eq(0)').find('.dropDownMenuTitleContents').children('.dropDownMenuTitle').text();
		var feedName = feedKeyWord;
		var chartType = $section3.children('.dropDownMenuContainer:eq(1)').find('.dropDownMenuTitleContents').children('.dropDownMenuTitle').text();
		var chartTimePeriod = $section3.children('.dropDownMenuContainer:eq(2)').find('.dropDownMenuTitleContents').children('.dropDownMenuTitle').text();
		var chartDateStart = '';
		var chartDateEnd = '';

		for(i = 0; i < $section3.children('.dropDownMenuContainer:eq(0)').children('.dropDownContents').children().length - 1; i++){
			if(feedKeyWord === $section3.children('.dropDownMenuContainer:eq(0)').children('.dropDownContents').children('div:eq(' + i + ')').text()){
				feedKeyWord = $section3.children('.dropDownMenuContainer:eq(0)').children('.dropDownContents').children('div:eq(' + i + ')').attr('value');
				break;
			}
		}

		if(chartTimePeriod.length < 1 || chartTimePeriod === 'All available'){ //don't need a starting date
			chartDateStart = '';
			chartDateEnd = '';
			//str[10] = '';
			//str[11] = '';
		}else{ //need a starting date
			if(chartTimePeriod.indexOf('Before:') >= 0){ //earliest available
				var latestDateArray = chartTimePeriod.split(': ');
					latestDateArray = latestDateArray[1].split(',').join('').split(' ');

				chartDateEnd = latestDateArray[2] + '-' + addZeroToMonth(monthPosition(latestDateArray[0]) + 1) + '-' + latestDateArray[1];
				chartDateStart = '1777-01-01'; //earliest date FRED allows (basically)
			}else if(chartTimePeriod.indexOf('After:') >= 0){ //no end date
				var earliestDateArray = chartTimePeriod.split(': ');
					earliestDateArray = earliestDateArray[1].split(',').join('').split(' ');

				chartDateStart = earliestDateArray[2] + '-' + addZeroToMonth(monthPosition(earliestDateArray[0]) + 1) + '-' + earliestDateArray[1];
				chartDateEnd = '2099-01-01';
			}else if(chartTimePeriod.indexOf(' - ') >= 0){ //both dates custom
				var customDates = chartTimePeriod.split(' - ');
					customDates[0] = customDates[0].split(',').join('').split(' ');
					customDates[1] = customDates[1].split(',').join('').split(' ');

				chartDateStart = customDates[0][2] + '-' + addZeroToMonth(monthPosition(customDates[0][0]) + 1) + '-' + customDates[0][1];
				chartDateEnd = customDates[1][2] + '-' + addZeroToMonth(monthPosition(customDates[1][0]) + 1) + '-' + customDates[1][1];
			}else{ //chose option from dropdown (not including all available)
				var todaysDate = new Date();
				var todaysDateArray = String(todaysDate).split(' ');
				var earlierDateArray = [];
				var dateValueString = '';

				todaysDate = todaysDateArray[3] + '-' + addZeroToMonth(monthPosition(todaysDateArray[1])) + '-' + todaysDateArray[2];

				if(chartTimePeriod.indexOf('day') >= 0){
					dateValueString = parseFloat(chartTimePeriod);
					earlierDateArray = todaysDateArray[3] + '-' + addZeroToMonth(monthPosition(todaysDateArray[1])) + '-' + (todaysDateArray[2] - dateValueString);
				}else if(chartTimePeriod.indexOf('month') >= 0){ //this one should be working well
					dateValueString = parseFloat(chartTimePeriod);

					earlierDateArray = dateAlteration(todaysDateArray[3] + '-' + monthPosition(todaysDateArray[1]) + '-' + todaysDateArray[2], {years:0, months:Number(dateValueString) * -1, days:0});
				}else if(chartTimePeriod.indexOf('Year to date') >= 0){
					earlierDateArray = todaysDateArray[3] + '-01-01';
				}else if(chartTimePeriod.indexOf('year') >= 0){
					dateValueString = parseFloat(chartTimePeriod);
					earlierDateArray = (todaysDateArray[3] - dateValueString) + '-' + addZeroToMonth(monthPosition(todaysDateArray[1])) + '-' + todaysDateArray[2];
				}

				chartDateStart = earlierDateArray;
				chartDateEnd = todaysDate;
			}
		}

		//console.log(chartDateStart, chartDateEnd);

		//SECTION 4
		var $section4 = $('#section4');
		var chartTitle = $section4.find('input:eq(0)').val();
		var chartSubTitle = $section4.find('input:eq(1)').val();
		var updatedDate = $section4.find('input:eq(2)').val();
		var prefixUnits = $section4.find('.dropDownMenuTitle:eq(0)').text();
		var suffixUnits = $section4.find('.dropDownMenuTitle:eq(1)').text();

		if(chartSubTitle.length < 1 || $section4.find('input:eq(1)').hasClass('untouched')){
			chartSubTitle = '';
			str[6] = '';
		}

		if(updatedDate.length < 1 || $section4.find('input:eq(2)').hasClass('untouched')){
			updatedDate = '';
			str[7] = '';
		}

		if(prefixUnits == '(none)'){
			prefixUnits = '';
			str[8] = '';
		}

		if(suffixUnits == '(none)'){
			suffixUnits = '';
			str[9] = '';
		}

		//SECTION 5
		var $section5 = $('#section5');
		var sourceText = 'FRED® Economic Data';

		if($section5.find('ul').find('#5custom').hasClass('activeText')){
			sourceText = $section5.children('.inputContainer').find('input').val();
		}

		///////////////////////////////////

		str[0] += chartTitle.replace(/"/g, "''").replace('&', '[$amperand]');
		str[1] += chartType;
		str[2] += width;
		str[3] += height;
		str[4] += sourceText.replace(/"/g, "''").replace('&', '[$amperand]');
		str[5] += feedKeyWord.replace('&', '[$amperand]');
		str[6] += chartSubTitle.replace(/"/g, "''").replace('&', '[$amperand]');
		str[7] += updatedDate.replace(/"/g, "''").replace('&', '[$amperand]');
		str[8] += prefixUnits.replace(/"/g, "''").replace('&', '[$amperand]');
		str[9] += suffixUnits.replace(/"/g, "''").replace('&', '[$amperand]');
		//str[10] += chartDateStart;
		//str[11] += chartDateEnd;

		console.log('start:', chartDateStart);
		console.log('end:', chartDateEnd);

		if(chartDateStart === ''){
			chartDateStart = '1777-01-01';
			console.log('here?');
		}

		if(chartDateEnd === ''){
			console.log('or here?');
			chartDateEnd = '2099-01-01';
		}

		str[10] += chartDateStart;
		str[11] += chartDateEnd;

		updatedText = updatedDate;

		$('.generateButton').css('display', 'none');
		$('.autoChartHolder').remove();
		$('#section6').append('<div class="autoChartHolder" chartTitle="' + feedName + '" style="width:' + width + 'px"><iframe onload="captureChart(' + width + ',' + height + ')" id="iframeChart" class="autoChart" style="background-color:#fff1e0" src="' + str.join('') + '" scrolling="no" width="' + width + 'px" height="' + height + 'px" seamless="seamless"></iframe><div class="buttonAligner" style="text-align:center; margin-top:10px; margin-bottom:10px; margin-left:15px; width:100%"><button class="afterButton" id="copyEmbed">Copy embed code</button><a class="afterButton disabled" id="saveChart">Save chart as image</a><a class="afterButton disabled" id="saveSpreadsheet">Save data as .xls</a></div></div>');
		//$('#section6').append('<object style="display:none" id="copyInject" width="1" height="1" id="copy" align="middle"><param name="movie" value="embed/copy.swf"><param name="quality" value="high"><param name="bgcolor" value="#ffffff"><param name="play" value="true"><param name="loop" value="true"><param name="wmode" value="window"><param name="scale" value="showall"><param name="menu" value="false"><param name="devicefont" value="false"><param name="salign" value=""><param name="allowScriptAccess" value="always"><!--[if !IE]>--><object type="application/x-shockwave-flash" data="copyInject" width="1" height="1"><param name="movie" value="embed/copy.swf"><param name="quality" value="high"><param name="bgcolor" value="#ffffff"><param name="play" value="true"><param name="loop" value="true"><param name="wmode" value="window"><param name="scale" value="showall"><param name="menu" value="true"><param name="devicefont" value="false"><param name="salign" value=""><param name="allowScriptAccess" value="always"><!--[if !IE]>--></object><!--<![endif]--></object>');
		
		copyInfo = document.URL + str.join('');
		graphButtons(width);
	});

	$('input:radio').attr('checked', false); //this is needed for FireFox. FireFox has an issue with using labels around radio button - it's valid html but doesn't work properly in FF
	//$('.dropDownContents').css('max-height', );

	//if you want the dropdown lists to float over content beneath them
	$.each($('.dropDownContents'), function(i){
		$('.dropDownContents:eq(' + i + ')').css('position','absolute').css('width', $('.dropDownContents:eq(' + i + ')').parent().css('width'));
	});

	for(var i = 0; i < $('.rangeSlider').length; i++){
		var s = $('.rangeSlider')[i];
		var min = Number($(s).attr('min'));
		var max = Number($(s).attr('max'));

		$(s).slider({
			range: 'min',
			value: Math.round((max - min) / 2),
			min: min,
			max: max,
			slide: function(event, ui){
				var handle = $(this).children('.ui-slider-handle');
				handle.text(ui.value);
				removeChart();

				$(this).attr('activated','true');
				for(var h = 0, i = 0; i < $('#section' + currentSection + ' .rangeSlider').length; i++){ //number of rangeSliders inside div '#section2'
					//console.log(i);

					if($($('#section' + currentSection + ' .rangeSlider')[i]).attr('activated') == 'true'){
						h++;
					}
				}

				if(h === 2 && currentSection === 2){
					nextSection();
				}
			}
		});

		var sHandle = $(s).children('.ui-slider-handle');
			sHandle.text(Math.round((max - min) / 2));
	}

	$('.dropDownMenu').on(inputType(), function(e){
		//check to see user is clicking between two different inputs of the same input type
		var $this = $(this);

		if(lastActiveDropDown){
			if(lastActiveDropDown.html() === $(this).siblings('.dropDownContents').html()){
				//you clicked on the same element - do nothing // <-- it is possible to make two identical drop-down menus which will confuse this logic
			}else{
				//console.log('you clicked different inputs of the same type');
				$(lastActiveDropDown).css('display','none').siblings('.dropDownMenu').removeClass('active');
			}
		}

		lastActiveDropDown = $this.siblings('.dropDownContents');
		/*
		$(function(){
			var wtf    = $('#scroll')[0];
			var height = wtf.scrollHeight;
			wtf.scrollTop(height);
		});
		*/

		if($this.position().top + $this.outerHeight() + $this.siblings('.dropDownContents').outerHeight() > $(window).height() + $(window).scrollTop()){
			var t = setTimeout(function(){$(document).scrollTop(($this.position().top + $this.outerHeight() + $this.siblings('.dropDownContents').outerHeight() - $(window).height()) + 4);}, 1); //this needs a microsecond delay otherwise it doesn't scroll to the right place for some dropdowns - jquery bug?
		}

		$('body').off(inputType()).on(inputType(), function(e){
			//console.log(e.target);
			if($(e.target).hasClass('dropDownOption') !== true){
				//console.log(lastActiveDropDown);
				//console.log($(e.target).attr('class'));

				if($(lastActiveDropDown).css('display') === 'none'){
					$(lastActiveDropDown).css('display','block');
					$(lastActiveDropDown).siblings('.dropDownMenu').addClass('active');

					//initScrolling($(this).siblings('.dropDownContents'));
					//console.log(lastActiveDropDown);
					initScrolling(lastActiveDropDown);
				}else{
					if($(e.target).hasClass('scrollbarHandle') !== true){
						$(lastActiveDropDown).css('display','none');
						$(lastActiveDropDown).siblings('.dropDownMenu').removeClass('active');
						lastActiveDropDown = null;
					}else{
						//you grabbed the scrollbarHandle
					}
				}

			}else{
				//console.log('you selected an option');
			}
		});
	});

	$('.dropDownOption').on(inputType(), function(e){
		var $this = $(this);
		removeChart();

		$this.parent()
			.css('display','none')
			.siblings('.dropDownMenu')
				.removeClass('active')
				.addClass('entered')
				.children('.dropDownMenuTitleContents')
					.children('.dropDownMenuTitle')
						.text($this.attr('value') === 'custom' ? $this.parent().siblings('.dropDownMenu').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle').text() : $this.text())
						.attr('dummyAttribute', function(){
							if($this.attr('value') === 'custom'){
								createInputPopup($this.parent().siblings('.dropDownMenu').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle'), $this.parent().attr('type'));
							}

							return '';
						});

		if($this.attr('value') === 'custom'){
			if($this.parent().siblings('.dropDownMenu').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle').text() === $this.parent().siblings('.dropDownMenu').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle').attr('default')){
				$this.parent().siblings('.dropDownMenu').removeClass('entered');
			}else{
				$this.parent().siblings('.dropDownMenu').addClass('entered');
			}
			//$this.parent().siblings('.dropDownMenu').removeClass('entered').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle').text($this.parent().siblings('.dropDownMenu').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle').attr('default'));
		}

		lastActiveDropDown = null;
		checkSection();
	});

	$('input:text').on(inputType(), function(e){
		var $this = $(this);
		$this.attr('value', '').removeClass('untouched');

		if($this.attr('default') == $this.val()){
			$this.val('');
		}		
	}).on('keypress', function(e){
		//e.preventDefault();
		var $this = $(this);
		removeChart();

		$this.addClass('active');
		$this.attr('value', '').removeClass('untouched');

	}).on('keyup', function(e){
		var $this = $(this);
		var inputSection = Number($this.parent().parent().attr('id').split('section').join(''));
		removeChart();
		//console.log(inputSection);
		//console.log($this.hasClass('optional'));

		$this.attr('value', '').removeClass('untouched').addClass('active');

		if($this.hasClass('optional') === false && $('#section' + inputSection).children('.inputContainer').children('input').val().length < 1){
			$(this).removeClass('active');
			currentSection = inputSection + 1;
			prevSection();

			for(var i = 1; i < $('.section').length + 1; i++){
				if(i> inputSection){
					$('#section' + i).css('display', 'none');
				}
			}
		}else if($this.val().length < 1){
			$this.removeClass('active');
		}

		if(currentSection === 4){
			if($('#section' + currentSection).children('.dropDownMenuContainer').children('.dropDownMenu.entered').length === 2){
				if($this.hasClass('active') && $this.hasClass('optional') === false && $('#section' + currentSection).children('.inputContainer').children('input').val().length > 0){
					nextSection();
				}
			}
		}else if(currentSection === 5 && inputSection === 5){
			if($this.hasClass('active') && $this.hasClass('optional') === false && $('#section' + currentSection).children('.inputContainer').children('input').val().length > 0){
				nextSection();
			}
		}
	}).on('blur', function(e){ //blur is lose focus
		var $this = $(this);
		if($this.val().length < 1){
			$this.val($this.attr('default')).addClass('untouched');
		}
	});
}

////////////////////////////////////////////////////
// GRAPHER /////////////////////////////////////////
////////////////////////////////////////////////////

function customchart(isTemplate){
	var table = [];
	var tableSettings = {};

	$('#FTi .contents .content').append(htmlCustomChart);

	$('#section2').find('ul').children('.optionText').on(inputType(), function(e){
		$('#section2').find('ul').children('.optionText').removeClass('activeText');
		$(this).addClass('activeText');
		removeChart();

		var $sizeDefault = $('#sizeDefault');
		var anyActive = false;

		if(this.id.indexOf('default') > -1){
			//console.log('default');
			$('#sizeCustom').css('display','none');
			$sizeDefault.css('display','block');

			anyActive = false;

			$.each($sizeDefault.children('label'), function(i){
				//console.log($sizeDefault.children('label:nth-child(' + i + ')').is(':checked'));

				if($sizeDefault.children('label:nth-child(' + i + ')').children('input').is(':checked') === true){
					anyActive = true;
				}
			});

			if(anyActive){ //something is already checked off
				if(currentSection === 2){
					nextSection();
					nextSectionAdjust();
				}
			}else{
				while(currentSection > 2){
					prevSection();
				}
			}
		}else{ //not default
			$('#sizeDefault').css('display','none');
			$('#sizeCustom').css('display','block');

			anyActive = false;

			$.each($sizeDefault.children('label'), function(i){
				//console.log($sizeDefault.children('label:nth-child(' + i + ')').is(':checked'));

				if($sizeDefault.children('label:nth-child(' + i + ')').children('input').is(':checked') === true){
					anyActive = true;
				}
			});

			if(anyActive === true){
				while(currentSection > 2){
					prevSection();
				}
			}

			for(var h = 0, i = 0; i < $('#section' + currentSection).find('.rangeSlider').length; i++){ //number of rangeSliders inside div '#section2'
				if($($('#section' + currentSection).find('.rangeSlider')[i]).attr('activated') === 'true'){
					h++;
				}
			}

			if(h === 2){
				nextSection();
				nextSectionAdjust();
				checkEnteredValues();
			}
		}
	});

	$('#section6').find('ul').children('.optionText').on(inputType(), function(e){
		var $this = $(this);

		$this.addClass('activeText').siblings('.optionText').removeClass('activeText');
		removeChart();
		var sectionNumber = parseInt($this.parent().parent().parent()[0].id.split('section').join(''), 10);
		var $customContent = $this.parent().parent().parent().siblings('.inputContainer');
		var $moveSource = $this.parent().parent().siblings('.optional');

		$moveSource.removeClass('disableInactive');

		switch(this.id){
			case '6custom2' :
				$moveSource.addClass('disableInactive');
			case '6default' :
				while(currentSection < 7){
					nextSection();
					nextSectionAdjust();
				}

				$customContent.css('display', 'none');
				break;
			case '6custom' :
				$customContent.css('display', 'block');

				if(currentSection > sectionNumber){
					if($('#section6').find('input').val() === $('#section6').find('input').attr('default')){
						prevSection();
					}
				}
			default:
				break;
		}
	});

	$('#section6').find('.expandContract').on(inputType(), function(e){
		var $this = $(this);

		$this.addClass('noDisplay').siblings('.expandContract').removeClass('noDisplay').parent().parent().siblings('.inputContainer').removeClass('noDisplay').css('display', 'none');

		if($this.hasClass('expand')){
			$this.parent().siblings('.option').removeClass('noDisplay');

			if($this.parent().siblings('.option').eq(3).find('#6custom').hasClass('activeText')){
				$this.parent().parent().siblings('.inputContainer').css('display', 'block');
			}

		}else{
			$this.parent().siblings('.option').addClass('noDisplay');
			$this.parent().parent().siblings('.inputContainer').addClass('noDisplay');
		}
	});

	$('label').on(inputType(), function(e){ //selecting an option
		$this = $(this);
		removeChart();

		$('label').children('.optionText').removeClass('activeText');
		$this.children('.optionText').addClass('activeText');

		var sectionNumber = parseInt($this.parent().parent()[0].id.split('section').join(''));

		if(sectionNumber === currentSection && currentSection !== 4){
			nextSection();
			nextSectionAdjust();
			checkEnteredValues();
		}

		if(currentSection === 6){
			nextSection();
		}
	});

	$('#userDateLocation').children('label').on(inputType(), function(e){
		var $this = $(this);

		removeChart();
		$('#userDateLocation').children('label').children('.optionText').removeClass('activeText');

		$this.children('.optionText').addClass('activeText');
		$('.fileInputHolder').css('display', 'none');
		$('.berthaInputHolder').css('display', 'none');

		if($this.attr('for') === 'onComp'){
			$('.fileInputHolder').css('display', 'block');
			if($('.fileUploadText').text().length < 1){
				$('#section5').css('display','none').children('.instructions').children('.stepNumber').text('5');
				while(currentSection > 4){
					prevSection();
				}
			}else{
				while(currentSection < 6){
					nextSection();
					nextSectionAdjust();
				}
				$('#section5').css('display','none');
				$('#section6').css('display','block').children('.instructions').children('.stepNumber').text('5');
				$('#section7').children('.instructions').children('.stepNumber').text('6');
			}
		}else if($this.attr('for') === 'onPaste'){
			while(currentSection < 5){
				nextSection();
				nextSectionAdjust();
				checkEnteredValues();
			}

			var lineCount1 = $('#inputDates').val(); //.match(/\n/g).length + 1);
			var lineCount2 = $('#inputValues').val(); //.match(/\n/g).length + 1);

			$('#section5').css('display','block');
			$('#section6').css('display','none').children('.instructions').children('.stepNumber').text('6');
			$('#section7').children('.instructions').children('.stepNumber').text('7');

			if(lineCount1.length > 0 && lineCount1.match(/\n/g)){
				lineCount1 = lineCount1.match(/\n/g).length + 1;

				while(currentSection > 5){
					prevSection();
				}

				if(lineCount2.length > 0 && lineCount2.match(/\n/g)){
					lineCount2 = lineCount2.match(/\n/g).length + 1;

					if(lineCount1 == lineCount2){
						nextSection();
						nextSectionAdjust();
						$('#section6').css('display','block');
					}
				}
			}else{
				while(currentSection > 5){
					prevSection();
				}
			}

			if($('#dataEntryWarning').css('display') === 'block'){
				while(currentSection > 5){
					prevSection();
				}
			}
		}else if($this.attr('for') === 'onDocs'){
			$('#section5').css('display','none');
			$('#section6').children('.instructions').children('.stepNumber').text('5');
			$('#section7').children('.instructions').children('.stepNumber').text('6');
			$('.berthaInputHolder').css('display', 'block');

			if($('#berthaRetrieveInput').val().length < 1){
				while(currentSection > 4){
					prevSection();
				}
			}else{
				if($('#berthaRetrieveInput').data('berthaData')){ //bertha data found
					while(currentSection < 6){
						nextSection();
						nextSectionAdjust();
					}

					$('#section5').css('display','none');
				}else{ //no bertha data found

				}
			}

			checkBookmark();
		}
	});

	$('.fileUploadCoverup').on(inputType(), function(e){
		removeChart();
		$(this).siblings('input').trigger('click');
		//$("input[name=myfile]").trigger('click');
	});

	$('.retrieve').on(inputType(), function(e){
		berthaGet($(this));
	});

	$('.fileUpload').on('change', function(e){
		//console.log('changed');
		//console.log($(this).val());

		$('#fileUploadWarning').css('display','none');
		$('.fileUploadText').text(this.files[0] ? this.files[0].name : '');

		var files = e.target.files;
		for(var i = 0, f; f = files[i]; i++){
			var reader = new FileReader();
			reader.onload = (function(theFile){
				return function(e){
					parseCSV(e.target.result, '\n', ';', theFile.name);
				};
			})(f);
			
			reader.readAsText(f);
		}

		//console.log('change');

		if($('.fileUploadText').text().length < 1){
			$('#section5').css('display','none');
			$('#section6').css('display','none').children('.instructions').children('.stepNumber').text('5');
		}
	});

	function shortMonthNumber(d){
		d = d.toLowerCase()
		.split('jan').join('1')
		.split('feb').join('2')
		.split('mar').join('3')
		.split('apr').join('4')
		.split('may').join('5')
		.split('jun').join('6')
		.split('jul').join('7')
		.split('aug').join('8')
		.split('sep').join('9')
		.split('oct').join('10')
		.split('nov').join('11')
		.split('dec').join('10');

		return d;
	}

	function parseCSV(text, lineTerminator, cellTerminator, name){
		var extension = name.substring(name.indexOf('.'), name.length);

		table = [];
		tableSettings = {};

		if(extension === '.xls' || extension === '.csv' || extension === '.tsv' || extension === '.txt'){
			var correctFormat = false;

			if(extension === '.xls'){
				var settings = [];
				table = text.substring(text.indexOf('<table')).split('<table').join('');
				table = table.substring(table.indexOf('<'));
				table = table.substr(0, table.indexOf('</table>'));
				settings = $(table).slice(1).map(function(i,el){
					var tds = $(el).find("td");
					return {'label' : tds.eq(2).text(), 'graphtype' : tds.eq(3).text()};
				}).get();
				table = $(table).slice(1).map(function(i,el){
					var tds = $(el).find("td");
					return {'date' : tds.eq(0).text(), 'value' : Number(tds.eq(1).text())};
				}).get();

				for(var i = table.length - 1; i > -1; i--){
					if(table[i].date.length < 1 || table[i].date.length < 1){
						table.splice(i, 1);
					}
				}

				if(table instanceof Object && table.length > 1){
					correctFormat = true;
				}

				settings = settings[1];

				if(settings){
					if(settings.graphtype === undefined || settings.graphtype.split(' ').join('').length < 1){
						tableSettings.graphtype = 'line';
					}else{
						tableSettings.graphtype = settings.graphtype;
					}
				}else{
					correctFormat = false;
					$('#fileUploadWarning').css('display','block').text('Excel file could not be processed. Please make sure the data is properly formatted.');
				}

			}else if(extension === '.csv'){
				table = [];

				var textArray = text.split('\n');
				var categories = textArray[0].split(',');
				var categoryValues = textArray[1].split(',');
					textArray.shift();

				$.each(textArray, function(i, w){
					var d = w.split(',');
					table.push({date: d[0], value: d[1]});
				});

				//console.log(categoryValues);

				//categories.shift(); //x
				//categories.shift(); //y
				//categoryValues.shift(); //x
				//categoryValues.shift(); //y

				$.each(categories, function(i, w){
					var c = w.split(',');
					var w = String(c[0]);
					var q = String(categoryValues[i]);

					tableSettings[w] = q;
				});

				console.log(tableSettings);

				if(tableSettings.graphtype === undefined){
					tableSettings.graphtype = 'line';
				}

				//console.log(tableSettings.graphtype);

				if(table instanceof Array && table.length > 1){
					correctFormat = true;
				}
			}else if(extension === '.tsv' || extension === '.txt'){
				//console.log('tsv / txt'); //txt is often actually a tsv
				table = [];

				var textArray = text.split('\n');
					textArray.shift();


				var contentArray = [];
				var settingsArray = [];

				//console.log(textArray);

				$.each(textArray, function(i, w){
					var a = w.split('\t');

					if(a[0].length > 0 && a[1].length > 0){
						if(a[0].indexOf('&') === 0){
							var setting = a[0].substr(1, a[0].length);
								setting = setting.split('=');

							settingsArray.push(setting);
						}else{
							contentArray.push(a);
						}
					}
				});


				$.each(contentArray, function(i, w){
					var date = w[0].split(' ');
					var newDate = date[2] + '-' + shortMonthNumber(date[1] + '-' + date[0]);

					table.push({date: newDate, value: w[1]});
				});

				$.each(settingsArray, function(i, w){
					tableSettings[w[0]] = w[1];
				});

				//var b = textArray[0].split('\t');

				//console.log(contentArray);
				//console.log(settingsArray);

				if(table instanceof Array && table.length > 1){
					correctFormat = true;
				}

				if(!tableSettings.graphtype){
					tableSettings.graphtype = 'line';
				}

				console.log(table);
				console.log(tableSettings);
			}

			if(correctFormat && table[table.length - 1].value === undefined || correctFormat && table[table.length - 1].value === null){
				table.pop();
			}

			if($('.fileUploadText').text().length > 1 && correctFormat){
				while(currentSection < 6){
					nextSection();
					nextSectionAdjust();
				}
				$('#section5').css('display','none');
				$('#section6').css('display','block').children('.instructions').children('.stepNumber').text('5');
				$('#section7').children('.instructions').children('.stepNumber').text('6');
			}else if(!correctFormat){
				$('#fileUploadWarning').css('display','block').text('File could not be processed. Please make sure the data is properly formatted.');
			}
		}else{
			//
			$('#fileUploadWarning').css('display','block').text('File format not recognized');
		}
	}

	$('#berthaRetrieveInput').keyup(function(e){
		removeChart();
	});

	$('#dataExamples').on(inputType(), function(e){
		var someHTML = '<div></div>'

		createDisplayPopup(someHTML);
	});

	$('textarea').keyup(function(e){
		var $this = $(this);
		var $inputDates = $('#inputDates');
		var $inputValues = $('#inputValues');
		var key = String.fromCharCode(e.keyCode);

		removeChart();

		if(this.value.match(/\n/g)){ //if it's more than 1 line long
			var lineCount = Number(this.value.match(/\n/g).length + 1);
			$this.css('height',(lineCount * 19) + 'px');
		}else{
			$this.css('height','38px'); //default
		}
		$('#dataEntryWarning').css('display','none');

		if($inputDates.length > 0 && $inputValues.length > 0){
			$('#dataEntryWarning').css('display','none');
		}else{
			while(currentSection > 5){
				prevSection();
			}
		}

		$('#dataEntryWarning').css('display','none');
		checkEnteredValues();

		if($inputDates.val().length === 0 && $inputValues.val().length === 0){
			$('#dataEntryWarning').css('display','none');
		}
	});

	$('.generateButton').on(inputType(), function(e){
		//console.log('clicked');
		$('.generateButton').css('display','none');
		var str = ['grapher/#?t0i1t2l3e4=', '&g0r1a2p3h4t5y6p7e8=', '&w0i1d2t3h4=', 'px&h0e1i2g3h4t5=', 'px&s0o1u2r3c4e5t6e7x8t9=', '&f0e1e2d3=', '&y0a1x2i3s4=', '&u0p1d2a3t4e5d6=', '&g0u1n2i3t4b=', '&g0u1n2i3t4a=', '&r0e1a2l3t4i5m6e7_8s9t0a1r2t3=', '&r0e1a2l3t4i5m6e7_8e9n0d1=', '&u0s1e2r3d4a5t6a7=', '&y0q1l2=', '&s0i1n2g3l4e5D6a7t8a9S0e1t2=', '&r0e1v2e3r4s5e6y7=', '&h0i1d2e3X4=', '&i0s1p2o3l4a5r6='];
		
		var width = 600;
		var height = 350;
		var sourceText = 'my source';
		var feedName = 'GNPCA';
		var chartTitle = 'my title';
		var chartType = 'line';
		var chartSubTitle = 'secondary';
		var updatedDate = 'March 2013';
		var prefixUnits = '';
		var suffixUnits = '';
		var chartDateStart = '';
		var chartDateEnd = '';
		var data = [];
		var dataJSON;
		var singleDataSet = true;
		var invertY = false;
		var hideXAxis = false;

		//SECTION: Specify the size
		var $section2 = $('#section2');
		if($section2.find('ul').children('#2default').hasClass('activeText')){ //default
			for(i = 0; i < $('#section2').find('input').length; i++){
				var $input = $section2.find('input:eq(' + i + ')');

				if($input.is(':checked') === true){
					var a = $input.siblings('.optionText').children('.optionDetail').text().split(' pixels)').join('').split('(').join('').split(' x ');
					width = Number(a[0]);
					height = Number(a[1]);
				}
			}
		}else{ //custom
			width = $section2.children('#sizeCustom').find('.ui-slider-handle:eq(0)').text();
			height = $section2.children('#sizeCustom').find('.ui-slider-handle:eq(1)').text();
		}

		//SECTION: Enter the labels and units
		var $section4 = $('#section3');
		var chartTitle = $section4.find('input:eq(0)').val();
		var chartSubTitle = $section4.find('input:eq(1)').val();
		var updatedDate = $section4.find('input:eq(2)').val();
		var prefixUnits = $section4.find('.dropDownMenuTitle:eq(0)').text();
		var suffixUnits = $section4.find('.dropDownMenuTitle:eq(1)').text();

		if(chartSubTitle.length < 1 || $section4.find('input:eq(1)').hasClass('untouched')){
			chartSubTitle = '';
			str[6] = '';
		}

		if(updatedDate.length < 1 || $section4.find('input:eq(2)').hasClass('untouched')){
			updatedDate = '';
			str[7] = '';
		}

		if(prefixUnits == '(none)'){
			prefixUnits = '';
			str[8] = '';
		}

		if(suffixUnits == '(none)'){
			suffixUnits = '';
			str[9] = '';
		}

		var $inputDates = $('#inputDates');
		var $inputValues = $('#inputValues');
		var a = $inputDates.val().split('-').join('/').split('\n');
		var b = $inputValues.val().split('\n');

		for(var i = 0; i < a.length; i++){
			data.push({date:a[i], value:b[i]});
		}

		if($('.fileUploadText').text().length > 1 && $('#userDateLocation').children('label:eq(0)').children('.optionText').hasClass('activeText')){
			data = table;

			for(var i = 0; i < table.length; i++){
				table[i].date = table[i].date.split('-').join('/');
			}
			if(tableSettings.graphtype){
				chartType = tableSettings.graphtype;
			}

			console.log(chartType);
		}else if($('#onDocs').is(':checked') && $('#berthaRetrieveInput').data('berthaData')){
			//$.data($('#berthaRetrieveInput'), 'berthaObject', data);
			var berthaData = $('#berthaRetrieveInput').data('berthaData');
			data = [];

			if(berthaData instanceof Array){
				for(var i = 0; i < berthaData.length; i++){
					data.push({date:berthaData[i].x, value:berthaData[i].y});
				}

				berthaData[0].graphtype ? chartType = berthaData[0].graphtype : 0;

			}else if(berthaData instanceof Object){
				var categories = [], key;

				if(berthaData._order){
					for(var i = 0; i < berthaData._order.length; i++){
						if(berthaData[berthaData._order[i]]){
							categories.push(berthaData._order[i]);
						}
					}
				}else{
					for(key in berthaData){
						if(berthaData.hasOwnProperty(key) && key.indexOf('_') === -1){
							categories.push(key);
						}
					}
				}

				//console.log(categories);

				for(var i = 0; i < categories.length; i++){
					var a = {};
						a.data = [];
						a.label = berthaData[categories[i]][0].label;
						a.graphType = berthaData[categories[i]][0].graphtype;
					for(var j = 0; j < berthaData[categories[i]].length; j++){
						var b = {};
							b.x = berthaData[categories[i]][j].x;
							b.y = berthaData[categories[i]][j].y;

						a.data.push(b);
					}
					data.push(a);
				}

				singleDataSet = false;
			}
		}else{
			//SECTION: Enter the data - chart type only
			chartType = $('#section5').find('.dropDownMenuTitle').text();
		}


		//SECTION: Custom source
		var $section6 = $('#section6');
		var sourceText = 'FT research';

		if($section6.find('ul').find('#6custom').hasClass('activeText')){
			sourceText = $section6.children('.inputContainer').find('input').val();
		}else if($section6.find('ul').find('#6custom2').hasClass('activeText')){
			str[4] = 'px';
			sourceText = '';
		}

		if($section6.find('ul').find('#6acustom').hasClass('activeText')){
			invertY = true;
		}

		if($section6.find('ul').find('#6bcustom').hasClass('activeText')){
			hideXAxis = true;
		}

		//console.log(data);

		dataJSON = JSON.stringify(data);
		dataJSON = dataJSON.split('"').join('✈'); //airplane - &#9992;

		//console.log(dataJSON);

		str[0] += chartTitle.replace(/"/g, "''").replace('&', '[$amperand]');
		str[1] += chartType;
		str[2] += width;
		str[3] += height;
		str[4] += sourceText.replace(/"/g, "''").replace('&', '[$amperand]');
		str[5] += feedName.replace('&', '[$amperand]');
		str[6] += chartSubTitle.replace(/"/g, "''").replace('&', '[$amperand]');
		str[7] += updatedDate.replace(/"/g, "''").replace('&', '[$amperand]');
		str[8] += prefixUnits.replace(/"/g, "''").replace('&', '[$amperand]');
		str[9] += suffixUnits.replace(/"/g, "''").replace('&', '[$amperand]');
		str[10] += chartDateStart;
		str[11] += chartDateEnd;
		str[12] += dataJSON;
		//13 is not used since not using YQL
		str[14] += singleDataSet;
		str[15] += invertY;
		str[16] += hideXAxis;
		
		str[10] = '';
		str[11] = '';

		updatedText = updatedDate;

		if($section6.find('ul').find('#6ccustom').hasClass('activeText')){
			str.push('&s0o1u2r3c4e5l6o7c8=true');
		}

		if($section6.find('ul').find('#6dcustom').hasClass('activeText')){
			str[17] += 'true';
		}else{
			str[17] += 'false';
		}

		$('.generateButton').css('display', 'none');
		$('.autoChartHolder').remove();
		hideBookmark();
		$('#section7').append('<div class="autoChartHolder" chartTitle="' + chartTitle + '" style="width:' + width + 'px"><iframe onload="captureChart(' + width + ',' + height + ')" id="iframeChart" class="autoChart" style="background-color:#fff1e0" src="' + str.join('') + '" scrolling="no" width="' + width + 'px" height="' + height + 'px" seamless="seamless"></iframe><div class="buttonAligner" style="text-align:center; margin-top:10px; margin-bottom:10px; margin-left:15px; width:100%"><button class="afterButton" id="copyEmbed">Copy embed code</button><a class="afterButton disabled" id="saveChart">Save chart as image</a><a class="afterButton disabled" id="saveSpreadsheet">Save data as .xls</a></div></div>');
		
		if(!singleDataSet){
			$('.buttonAligner').append('<div id="spreadsheetWarning" style="font-size: 16px; font-weight: bold; color: rgb(195, 98, 86); margin-left: 25px; margin-top: 10px; display: block;"><span class="errorEntryText">Chart contains multiple data sets. Cannot save to one xls file.</span></div>');
		}

		copyInfo = document.URL + str.join('');
		graphButtons(width);
		checkBookmark();
	});

	$('input:radio').attr('checked', false); //this is needed for FireFox. FireFox has an issue with using labels around radio button - it's valid html but doesn't work properly in FF
	//$('.dropDownContents').css('max-height', );

	//if you want the dropdown lists to float over content beneath them
	$.each($('.dropDownContents'), function(i){
		$('.dropDownContents:eq(' + i + ')').css('position','absolute').css('width', $('.dropDownContents:eq(' + i + ')').parent().css('width'));
	});

	for(var i = 0; i < $('.rangeSlider').length; i++){
		var s = $('.rangeSlider')[i];
		var min = Number($(s).attr('min'));
		var max = Number($(s).attr('max'));

		$(s).slider({
			range: 'min',
			value: Math.round((max - min) / 2),
			min: min,
			max: max,
			slide: function(event, ui){
				var handle = $(this).children('.ui-slider-handle');
				handle.text(ui.value);
				removeChart();

				$(this).attr('activated','true');
				for(var h = 0, i = 0; i < $('#section' + currentSection + ' .rangeSlider').length; i++){ //number of rangeSliders inside div '#section2'
					//console.log(i);

					if($($('#section' + currentSection + ' .rangeSlider')[i]).attr('activated') == 'true'){
						h++;
					}
				}

				if(h === 2 && currentSection === 2){
					nextSection();
					nextSectionAdjust();
					checkEnteredValues();
				}
			}
		});

		var sHandle = $(s).children('.ui-slider-handle');
			sHandle.text(Math.round((max - min) / 2));
	}

	$('.dropDownMenu').on(inputType(), function(e){
		//check to see user is clicking between two different inputs of the same input type
		var $this = $(this);

		if(lastActiveDropDown){
			if(lastActiveDropDown.html() === $(this).siblings('.dropDownContents').html()){
				//you clicked on the same element - do nothing // <-- it is possible to make two identical drop-down menus which will confuse this logic
			}else{
				//console.log('you clicked different inputs of the same type');
				$(lastActiveDropDown).css('display','none').siblings('.dropDownMenu').removeClass('active');
			}
		}

		lastActiveDropDown = $this.siblings('.dropDownContents');
		/*
		$(function(){
			var wtf    = $('#scroll')[0];
			var height = wtf.scrollHeight;
			wtf.scrollTop(height);
		});
		*/

		if($this.position().top + $this.outerHeight() + $this.siblings('.dropDownContents').outerHeight() > $(window).height() + $(window).scrollTop()){
			var t = setTimeout(function(){$(document).scrollTop(($this.position().top + $this.outerHeight() + $this.siblings('.dropDownContents').outerHeight() - $(window).height()) + 4);}, 1); //this needs a microsecond delay otherwise it doesn't scroll to the right place for some dropdowns - jquery bug?
		}

		$('body').off(inputType()).on(inputType(), function(e){
			//console.log(e.target);
			if($(e.target).hasClass('dropDownOption') !== true){
				//console.log(lastActiveDropDown);
				//console.log($(e.target).attr('class'));

				if($(lastActiveDropDown).css('display') === 'none'){
					$(lastActiveDropDown).css('display','block');
					$(lastActiveDropDown).siblings('.dropDownMenu').addClass('active');

					//initScrolling($(this).siblings('.dropDownContents'));
					//console.log(lastActiveDropDown);
					initScrolling(lastActiveDropDown);
				}else{
					if($(e.target).hasClass('scrollbarHandle') !== true){
						$(lastActiveDropDown).css('display','none');
						$(lastActiveDropDown).siblings('.dropDownMenu').removeClass('active');
						lastActiveDropDown = null;
					}else{
						//you grabbed the scrollbarHandle
					}
				}

			}else{
				//console.log('you selected an option');
			}
		});
	});

	$('.dropDownOption').on(inputType(), function(e){
		var $this = $(this);
		removeChart();

		$this.parent()
			.css('display','none')
			.siblings('.dropDownMenu')
				.removeClass('active')
				.addClass('entered')
				.children('.dropDownMenuTitleContents')
					.children('.dropDownMenuTitle')
						.text($this.attr('value') === 'custom' ? $this.parent().siblings('.dropDownMenu').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle').text() : $this.text())
						.attr('dummyAttribute', function(){
							if($this.attr('value') === 'custom'){
								createInputPopup($this.parent().siblings('.dropDownMenu').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle'), $this.parent().attr('type'));
							}

							return '';
						});

		if($this.attr('value') === 'custom'){
			if($this.parent().siblings('.dropDownMenu').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle').text() === $this.parent().siblings('.dropDownMenu').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle').attr('default')){
				$this.parent().siblings('.dropDownMenu').removeClass('entered');
			}else{
				$this.parent().siblings('.dropDownMenu').addClass('entered');
			}
			//$this.parent().siblings('.dropDownMenu').removeClass('entered').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle').text($this.parent().siblings('.dropDownMenu').children('.dropDownMenuTitleContents').children('.dropDownMenuTitle').attr('default'));
		}

		lastActiveDropDown = null;
		checkSectionCustom();
	});

	$('input:text').on(inputType(), function(e){
		var $this = $(this);
		$this.attr('value', '').removeClass('untouched');

		if($this.attr('default') == $this.val()){
			$this.val('');
		}		
	}).on('keypress', function(e){
		//e.preventDefault();
		var $this = $(this);
		removeChart();

		$this.addClass('active');
		$this.attr('value', '').removeClass('untouched');

	}).on('keyup', function(e){
		var $this = $(this);
		var inputSection = Number($this.parent().parent().attr('id').split('section').join(''));
		removeChart();
		//console.log(inputSection);
		//console.log($this.hasClass('optional'));

		if(this.id === 'berthaRetrieveInput'){
			$this.siblings('.cautionTitle').css('display', 'none');
			$('#berthaRetrieveInput').removeData('berthaData');

			while(currentSection > 4){
				prevSection();
			}
		}

		$this.attr('value', '').removeClass('untouched').addClass('active');

		if($this.hasClass('optional') === false && $this.val().length < 1){
			$(this).removeClass('active');
			currentSection = inputSection + 1;
			prevSection();

			for(var i = 1; i < $('.section').length + 1; i++){
				if(i> inputSection){
					$('#section' + i).css('display', 'none');
				}
			}
		}else if($this.val().length < 1){
			$this.removeClass('active');
		}

		if(currentSection === 3){
			if($('#section' + currentSection).children('.dropDownMenuContainer').children('.dropDownMenu.entered').length === 2){
				if($this.hasClass('active') && $this.hasClass('optional') === false && $('#section' + currentSection).children('.inputContainer').children('input').val().length > 0){
					nextSection();
					nextSectionAdjust();
				}
			}
		}else if(currentSection === 5 && inputSection === 5){
			if($this.hasClass('active') && $this.hasClass('optional') === false && $('#section' + currentSection).children('.inputContainer').children('input').val().length > 0){
				nextSection();
				nextSectionAdjust();
			}
		}else if(currentSection === 6){
			if($this.val().length > 0){
				nextSection();
				nextSectionAdjust();
			}
		}
	}).on('blur', function(e){ //blur is lose focus
		var $this = $(this);
		if($this.val().length < 1){
			$this.val($this.attr('default')).addClass('untouched');
		}
	});

	function checkEnteredValues(){
		var $this = $('#inputDates'); //doesn't matter if it's inputDates or inputValues
		var $inputDates = $this;
		var $inputValues = $('#inputValues');

		var a = $inputDates.val().split('\n');
		var b = $inputValues.val().split('\n');

		for(var i = a.length; i--;){
			if(a[i] === '') a.splice(i, 1);
		}

		for(i = b.length; i--;){
			if(b[i] === '') b.splice(i, 1);
		}
		
		//console.log(a.length, b.length);
		//console.log(a,b);

		if(a.length === b.length && a.length > 1 && $this.parent().siblings('.dropDownMenuContainer').children('.dropDownMenu').hasClass('entered')){
			$('#section6').children('.instructions').children('.stepNumber').text('6');
			$inputDates.addClass('active');
			$inputValues.addClass('active');
			while(currentSection < 6){
				nextSection();
			}
			nextSectionAdjust();
		}else if(a.length === b.length && a.length > 1){
			$inputDates.addClass('active');
			$inputValues.addClass('active');
		}else{
			$('#section6').children('.instructions').children('.stepNumber').text('6');
			$('#section7').children('.instructions').children('.stepNumber').text('6');
			$inputDates.removeClass('active');
			$inputValues.removeClass('active');
			while(currentSection > 5){
				prevSection();
			}
		}

		if(!/^[\d.\-\n\/]*$/.test($inputValues.val())){
			$('#dataEntryWarning').css('display','block').children('.errorEntryText').text('Y values must be numbers');
			$('#section6').css('display','none').children('.instructions').children('.stepNumber').text('6');
			$('#section7').css('display','none').children('.instructions').children('.stepNumber').text('6');

			while(currentSection > 5){
				prevSection();
			}

			$inputDates.removeClass('active');
			$inputValues.removeClass('active');
		}

		if(currentSection === 6){
			nextSection();
		}
	}

	function checkSectionCustom(){
		if(currentSection === 3){
			if($('#section' + currentSection).children('.dropDownMenuContainer').children('.dropDownMenu.entered').length === 2){
				if($('#section' + currentSection).children('.inputContainer').children('input').hasClass('active') === true){
					nextSection();
					nextSectionAdjust();
				}
			}
		}else if(currentSection === 5 && $('#onPaste').is(':checked')){
			checkEnteredValues();
		}
	}

	function nextSectionAdjust(){ //this is needed because there are different paths
		if($('#onComp').is(':checked') || $('#onDocs').is(':checked')){
			$('#section5').css('display','none');
			$('#section6').children('.instructions').children('.stepNumber').text('5');
			$('#section7').children('.instructions').children('.stepNumber').text('6');

			checkBookmark();
		}else if($('#onPaste').is(':checked')){
			$('#section6').children('.instructions').children('.stepNumber').text('6');
			$('#section7').children('.instructions').children('.stepNumber').text('7');

			if($('#dataEntryWarning').css('display') === 'block'){
				while(currentSection > 5){
					prevSection();
				}
			}
		}
	}

	$('#bookmark').on(inputType(), function(e){
		var str = document.URL + '?#wd1=grapher&';

		//SECTION: Size
		var $section = $('#section2');

		if($section.find('#2default').hasClass('activeText')){
			str += '2a=0&';

			if($section.find('#sizeLG').is(':checked')){
				str += '2b=0&';
			}else if($section.find('#sizeMD').is(':checked')){
				str += '2b=1&';
			}else{
				str += '2b=2&';
			}
		}else{
			str += '2a=1&2b=' + $section.children('#sizeCustom').find('.ui-slider-handle:eq(0)').text() + 'x' + $section.children('#sizeCustom').find('.ui-slider-handle:eq(1)').text() + '&';
		}

		//SECTION: Labels and units
		$section = $('#section3');
		str += '3a=' + $section.find('input:eq(0)').val() + '&';

		if($section.find('input:eq(1)').hasClass('active')){
			str += '3b=' + $section.find('input:eq(1)').val() + '&';
		}else{
			str += '3b=null&';
		}

		if($section.find('input:eq(2)').hasClass('active')){
			str += '3c=' + $section.find('input:eq(2)').val() + '&';
		}else{
			str += '3c=null&';
		}

		str += '3d=' + $section.find('.dropDownMenuTitle:eq(0)').text() + '&';
		str += '3e=' + $section.find('.dropDownMenuTitle:eq(1)').text() + '&';

		//SECTION: Data
		if($('#onDocs').is(':checked')){
			str += '4a=1&';

			var spreadsheetKey =  $('#berthaRetrieveInput').val();

			if(spreadsheetKey.indexOf('key=') > -1){
				spreadsheetKey = spreadsheetKey.substring(spreadsheetKey.indexOf('key=') + 4, spreadsheetKey.indexOf('#'));
			}

			if(spreadsheetKey.indexOf('&') > -1){
				spreadsheetKey = spreadsheetKey.substring(0, spreadsheetKey.indexOf('&'));
			}

			str += '4b=' + spreadsheetKey + '&';
		}else{
			console.log('should not be here, something wrong with values in the DATA SECTION');
		}

		//SECTION: Additional settings
		$section = $('#section6');

		if($section.find('#6ddefault').hasClass('activeText')){
			str += '5a=0&';
		}else{
			str += '5a=1&';
		}

		if($section.find('#6adefault').hasClass('activeText')){
			str += '5b=0&';
		}else{
			str += '5b=1&';
		}

		if($section.find('#6bdefault').hasClass('activeText')){
			str += '5c=0&';
		}else{
			str += '5c=1&';
		}

		if($section.find('#6default').hasClass('activeText')){
			str += '5d=0&';
		}else if($section.find('#6custom2').hasClass('activeText')){
			str += '5d=1&';
		}else{
			str += '5d=' + $section.children('.inputContainer').find('input').val() + '&';
		}

		if($section.find('#6cdefault').hasClass('activeText')){
			str += '5e=0';
		}else{
			str += '5e=1';
		}

		window.open(str,'_blank');
	});

	if(isTemplate){
		//console.log('it is a template');
		var str = document.URL.slice(document.URL.indexOf('?#wd1=grapher') + 1, document.URL.length);
		var arr = str.split('&');
			arr.shift();

		//console.log(arr);

		for(var i = 0; i < arr.length; i++){
			var v = arr[i].slice(arr[i].indexOf('=') + 1, arr[i].length);

			//console.log(v);

			if(i === 0){
				//$('#section2').css('display', 'block');

				if(Number(v) === 0){ //size = default
					$('#2custom').removeClass('activeText').siblings('#2default').addClass('activeText');
					$('#section2').find('#sizeCustom').css('display', 'none').siblings('#sizeDefault').css('display', 'block');
				}else{ //size = custom
					$('#2custom').addClass('activeText').siblings('#2default').removeClass('activeText');
					$('#section2').find('#sizeCustom').css('display', 'block').siblings('#sizeDefault').css('display', 'none');
				}
				nextSection();
			}else if(i === 1){
				if(v.length < 2){ //large/medium/small
					var n = Number(v);

					if(n === 0){
						$('#section2').find('#sizeLG').attr('checked', true).siblings('.optionText').addClass('activeText');
					}else if(n === 1){
						$('#section2').find('#sizeMD').attr('checked', true).siblings('.optionText').addClass('activeText');
					}else{
						$('#section2').find('#sizeSM').attr('checked', true).siblings('.optionText').addClass('activeText');
					}
				}else{ //custom dimensions
					var d = v.split('x');

					$('#section2').find('.rangeSlider').eq(0).slider('value', d[0]).children('a').text(d[0]);
					$('#section2').find('.rangeSlider').eq(1).slider('value', d[1]).children('a').text(d[1]);
				}
				nextSection();
			}else if(i === 2){ //title
				$('#section3').find('input:eq(0)').attr('class', 'active').val(v);
			}else if(i === 3){ //subtitle
				if(v !== 'null'){
					$('#section3').find('input:eq(1)').attr('class', 'active').val(v);
				}
			}else if(i === 4){ //updated date
				if(v !== 'null'){
					$('#section3').find('input:eq(2)').attr('class', 'active').val(v);
				}
			}else if(i === 5){ //prefix
				if(Number(v) > -1){
					$('#section3').find('.dropDownMenuContainer:eq(0)').children('.dropDownMenu').addClass('entered').find('.dropDownMenuTitle').text($('#section3').find('.dropDownMenuContainer:eq(0)').find('.dropDownOption:eq(' + v + ')').text());
				}else{
					$('#section3').find('.dropDownMenuContainer:eq(0)').children('.dropDownMenu').addClass('entered').find('.dropDownMenuTitle').text(v);
				}
			}else if(i === 6){ //suffix
				if(Number(v) > -1){
					$('#section3').find('.dropDownMenuContainer:eq(1)').children('.dropDownMenu').addClass('entered').find('.dropDownMenuTitle').text($('#section3').find('.dropDownMenuContainer:eq(1)').find('.dropDownOption:eq(' + v + ')').text());

				}else{
					$('#section3').find('.dropDownMenuContainer:eq(1)').children('.dropDownMenu').addClass('entered').find('.dropDownMenuTitle').text(v);
				}
				nextSection();
			}else if(i === 7){ //where is the data - only bertha for now
				if(Number(v) === 1){
					$('#section4').find('#onDocs').attr('checked', true).siblings('.optionText').addClass('activeText');
					$('#section4').children('.berthaInputHolder').css('display', 'block');
				}else{

				}
			}else if(i === 8){ //bertha url
				$('#berthaRetrieveInput').attr('class', 'userText active').val(v);
				nextSection();
				nextSection();
				nextSectionAdjust();
			}else if(i === 9){ //make polar chart
				$('#section6').find('.option').removeClass('noDisplay');
				$('.expand').addClass('noDisplay').siblings('.contract').removeClass('noDisplay');

				if(Number(v) === 0){
					$('#section6').find('#6ddefault').addClass('activeText').siblings('#6dcustom').removeClass('activeText');
				}else{
					$('#section6').find('#6ddefault').removeClass('activeText').siblings('#6dcustom').addClass('activeText');
				}
			}else if(i === 10){ //invert y-axis
				if(Number(v) === 0){
					$('#section6').find('#6adefault').addClass('activeText').siblings('#6acustom').removeClass('activeText');
				}else{
					$('#section6').find('#6adefault').removeClass('activeText').siblings('#6acustom').addClass('activeText');
				}
			}else if(i === 11){ //hide the x-axis label
				if(Number(v) === 0){
					$('#section6').find('#6bdefault').addClass('activeText').siblings('#6bcustom').removeClass('activeText');
				}else{
					$('#section6').find('#6bdefault').removeClass('activeText').siblings('#6bcustom').addClass('activeText');
				}
			}else if(i === 12){ //custom source?
				$('#section6').find('.option.optional').removeClass('disableInactive');

				if(Number(v) === 0){
					$('#section6').find('#6default').addClass('activeText').siblings('#6custom').removeClass('activeText').siblings('#6custom2').removeClass('activeText');
				}else if(Number(v) === 1){
					$('#section6').find('#6custom2').addClass('activeText').siblings('#6custom').removeClass('activeText').siblings('#6default').removeClass('activeText');
					$('#section6').find('.option.optional').addClass('disableInactive');
				}else{
					$('#section6').find('#6custom').addClass('activeText').siblings('#6custom2').removeClass('activeText').siblings('#6default').removeClass('activeText');
					$('#section6').find('.inputContainer').css('display','block').children('input').attr('class','active').val(v);
				}
			}else if(i === 13){ //source in upper right-hand corner?
				if(Number(v) === 0){
					$('#section6').find('#6cdefault').addClass('activeText').siblings('#6ccustom').removeClass('activeText');
				}else{
					$('#section6').find('#6cdefault').removeClass('activeText').siblings('#6ccustom').addClass('activeText');
				}

				//nextSection();
				//nextSectionAdjust();

				berthaGet($('.retrieve'));
			}

			function berthaGet($this){
				if(!$this.hasClass('disabled') && $('#berthaRetrieveInput').val().length > 0){
					$this.addClass('disabled');
					$this.siblings('.retrieveAnim').css('visibility','visible').addClass('fa-spin');
					removeChart();

					var spreadsheetKey = $('#berthaRetrieveInput').val();
					var s = [];

					if(spreadsheetKey.indexOf('key=') > -1){
						spreadsheetKey = spreadsheetKey.substring(spreadsheetKey.indexOf('key=') + 4, spreadsheetKey.indexOf('#'));
					}

					if(spreadsheetKey.indexOf('&') > -1){
						spreadsheetKey = spreadsheetKey.substring(0, spreadsheetKey.indexOf('&'));
					}

					$this.siblings('.cautionTitle').css('display', 'none');
					getSheetList();

					function getSheetList(){
						Bertha.getSpreadsheet({id:spreadsheetKey, sheets:['sheetlist']}).done(getSheets).fail(getSheets);
					}

					function getSheets(data){

						console.log(data);

						if(!data.statusText){ //if it didn't recieve a fail status text
							//console.log(data);

							$.each(data, function(i, w){
								if(data.length < 8){
									s.push(w.activesheets);
								}else{
									if(i === 8){
										alert('Too many series to plot. \n\nPlease make sure there are 7 or fewer activesheets in the bertha sheetlist. \n\nActivesheets found: ' + data.length);
									}
								}
							});

							//console.log('series length: ' + s.length);

							Bertha.getSpreadsheet({id:spreadsheetKey, sheets:s}).done(translateData).fail(translateData);
						}else{
							console.log(data.statusText);

							if(data.statusText === 'Not Found'){
								$('.berthaInputHolder').children('.cautionTitle').css('display','block').html('Unable to load Bertha spreadsheet. <br/>Please check the url and make sure the bertha spreadsheet contains a "sheetlist" sheet.');
							}else{
								$('.berthaInputHolder').children('.cautionTitle').css('display','block').text('Spreadsheet is improperly formatted');
							}

							//alert('Unable to find the list of sheets! You must specify which sheets you want to use!');
							$this.removeClass('disabled');
							$this.siblings('.retrieveAnim').css('visibility','hidden').removeClass('fa-spin');
						}
					}

					function translateData(data){
						data._order = s;

						if(!data.statusText){ //if it didn't recieve a fail status text

							while(currentSection < 7){
								nextSection();
								nextSectionAdjust();
							}

							$('#section5').css('display','none');
							$('#section7').children('.instructions').children('.stepNumber').text('6');
							if(data instanceof Array){
								//console.log('loaded successfully');
								$this.removeClass('disabled');
								$('#section6').css('display','block').children('.instructions').children('.stepNumber').text('5');
								//$.data($('#berthaRetrieveInput'), 'sfg');
								$('#berthaRetrieveInput').data('berthaData', data);
							}else if(data instanceof Object){ //multiple sets of data
								//console.log('object');
								$('#berthaRetrieveInput').data('berthaData', data);
								$this.removeClass('disabled');
								$('#section6').css('display','block').children('.instructions').children('.stepNumber').text('5');
							}else{
								console.log('failed - other type');
								$this.removeClass('disabled');
							}
						}else{
							//console.log('failed!!!');
							$this.removeClass('disabled');
							$this.siblings('.cautionTitle').css('display', 'block');
						}
						$this.siblings('.retrieveAnim').css('visibility','hidden').removeClass('fa-spin');
					}
				}
			}
		}
	}
}

///////////////////////
// graph buttons
///////////////////////

function graphButtons(width){
	if(width < 584){
		$('.autoChartHolder').css('width', '650px');
		$('.buttonAligner').css('text-align', 'left').css('margin-left','0px');
		$('.afterButton').css('display','inline-block');
	}

	//var t = setTimeout(function(){$(window).scrollTop($('.autoChartHolder').position().top - $('#documentBottomPadding').outerHeight())}, 1); //this needs a microsecond delay otherwise it doesn't scroll to the right place for some dropdowns - jquery bug?

	$('body').stop()
		.animate({
			scrollTop: ($('#section6').position().top - 100) + 'px'
		}, 250, function(){
			$(document).off('mousewheel.autoAnim');
		});

	$(document).on('mousewheel.autoAnim', function(){
		$('body').stop();
		$(document).off('mousewheel.autoAnim');
	});

	$('#copyEmbed').on('mousedown', function(e){
		var $this = $(this);
		var flashObj = document.getElementById('copyInject');

		$this.addClass('downState');

		$(flashObj).css('display', 'block')
			.css('position','absolute')
			.css('top', $this.position().top + 1)
			.css('left', $this.position().left + 25)
			.css('z-index', 9999)
			.css('height', $this.outerHeight())
			.css('width', $this.outerWidth())
			.focus();

		$(document).on('mouseup.fl', function(e){ //released
			if(e.target.id === 'copyInject'){
				$('.autoChart').css('opacity', 0.05).stop()
				.animate({
					opacity: 1
				}, 200, function(){
					//
				});
			}

			$this.removeClass('downState');
			$(this).off('mouseup.fl').off('mousemove.fl');
			$(flashObj).css('display', 'none').css('z-index', 0);
		});

		$(document).on('mousemove.fl', function(e){
			if(e.target.id === 'copyInject'){
				$this.addClass('downState');
			}else{
				$this.removeClass('downState');
			}
		});
	});
}
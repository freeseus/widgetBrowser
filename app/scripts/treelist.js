var treelist = function(listContainer, monthUL, dayUL, yearUL, device, input, animateToDate, completeFunction){
 	// private vars
	var privateVar = 'test';
	var userDevice = device;
	var inputType = input;

	var $daysUL = dayUL;
	var $monthUL = monthUL;
	var $yearUL = yearUL;
	var $daysSelector = $daysUL.parent().siblings('.selector');
	var $monthSelector = $monthUL.parent().siblings('.selector');
	var $yearSelector = $yearUL.parent().siblings('.selector');

	var values = [];

	var date = Date();
	var dateArray = date.split(' ');
	var dateObject = {time:dateArray[4], dayWord:dateArray[0], dayNumber:dateArray[2], month:dateArray[1], year:dateArray[3], timeGMT:dateArray[5], timeZone:dateArray[6]};

	var selectorOffset = 2; //grey line is 2 selections from the top
	var targetMonthElementNumber;
	var targetDayElementNumber;
	var targetYearElementNumber;

	function checkPrivate(){
		//console.log(privateVar);
	}

	function monthPosition(m){
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

		for(var i = 0; i < months.length; i++){
			if(months[i] === m){
				break;
			}
		}

		return i;
	}

	function wheelHandler(event, delta, deltaX, deltaY){
		event.preventDefault();

		var $this = $(this).children('ul').stop();
		var $thisBorder = $this.parent().parent();
		var currentPos = $this.css('top');
			currentPos = parseInt(currentPos, 10);

		if($.isNumeric(currentPos) == false){
			currentPos = 0;
		}

		var posY = (delta * $this.children().last().outerHeight()) + currentPos;
			posY = Math.round(posY / $this.children().last().outerHeight()) * $this.children().last().outerHeight(); // this is needed in case the dial is spinning and you decide to mouse wheel

		if(posY > $this.children().last().outerHeight() * 2){
			posY = $this.children().last().outerHeight() * 2;
		}else if(posY < -$this.height() + ($this.children().last().outerHeight() * 3)){
			posY = -$this.height() + ($this.children().last().outerHeight() * 3);
		}

		$this.css('top', posY + 'px');
		$this.children('li').removeClass('active').removeClass('mousemove');

		var centeredChild = ($this.position().top - ($this.children().last().outerHeight() * 3)) / -$this.children().last().outerHeight();

		if(centeredChild > -1){
			$this.children('li:nth-child(' + centeredChild + ')').addClass('active');
			$thisBorder.addClass('active').children('.selector').addClass('active');

			var currentValue = $this.children('li:nth-child(' + centeredChild + ')').text();

			adjustDaysToShow($this, currentValue);
		}
	};

	function activeValue($what){
		var val = false;

		if($what.hasClass('active')){
			var centeredYearChild;
			//console.log(); //$daysUL.parent().siblings('.selector')

			if($what.siblings('.group').children('ul').attr('id') == $daysUL.attr('id')){
				centeredYearChild = (Math.round($daysUL.position().top / $daysUL.children().last().outerHeight()) * $daysUL.children().last().outerHeight() - ($daysUL.children().last().outerHeight() * 3)) / -$daysUL.children().last().outerHeight();
				val = $daysUL.children('li:nth-child(' + centeredYearChild + ')').text();
			}else if($what.siblings('.group').children('ul').attr('id') == $monthUL.attr('id')){
				centeredYearChild = (Math.round($monthUL.position().top / $monthUL.children().last().outerHeight()) * $monthUL.children().last().outerHeight() - ($monthUL.children().last().outerHeight() * 3)) / -$monthUL.children().last().outerHeight();
				val = $monthUL.children('li:nth-child(' + centeredYearChild + ')').text();
			}else if($what.siblings('.group').children('ul').attr('id') == $yearUL.attr('id')){
				centeredYearChild = (Math.round($yearUL.position().top / $yearUL.children().last().outerHeight()) * $yearUL.children().last().outerHeight() - ($yearUL.children().last().outerHeight() * 3)) / -$yearUL.children().last().outerHeight();
				val = $yearUL.children('li:nth-child(' + centeredYearChild + ')').text();
			}
		}

		return val;
	}

	function adjustDaysToShow(what, currentValue){
		var daysToShow;
		var $this = what;

		if($this.attr('id') === $monthUL.attr('id')){
			var activeYear;
			var centeredYearChild = (Math.round($yearUL.position().top / $yearUL.children().last().outerHeight()) * $yearUL.children().last().outerHeight() - ($yearUL.children().last().outerHeight() * 3)) / -$yearUL.children().last().outerHeight();
			activeYear = Number($yearUL.children('li:nth-child(' + centeredYearChild + ')').text());
			daysToShow = checkMonth(currentValue, activeYear);
			$daysUL.children('li').removeClass('disabled');
		}else if($this.attr('id') === $yearUL.attr('id')){
			var activeMonth;
			var centeredMonthChild = (Math.round($monthUL.position().top / $monthUL.children().last().outerHeight()) * $monthUL.children().last().outerHeight() - ($monthUL.children().last().outerHeight() * 3)) / -$monthUL.children().last().outerHeight();
			activeMonth = $monthUL.children('li:nth-child(' + centeredMonthChild + ')').text();
			daysToShow = checkMonth(activeMonth, currentValue);
			$daysUL.children('li').removeClass('disabled');
		}else{
			daysToShow = 31;
		}
		
		if(daysToShow < $daysUL.children('li').length){
			for(var i = $daysUL.children('li').length; i > daysToShow; i--){ //console.log('disable days');
				$daysUL.children('li:nth-child(' + i + ')').addClass('disabled');
			}

			var toBottom = -$daysUL.height() + ((0 + $daysUL.children('li').length - daysToShow) * $daysUL.children().last().outerHeight());

			if($daysUL.position().top <= toBottom){
				if(daysToShow === 29){ //leap year, where the user has previously picked a date after the 29th
					toBottom += $daysUL.children().last().outerHeight();
				}
			}else{
				if(daysToShow === 29){ //leap year
					toBottom = -$daysUL.height() + ((1 + $daysUL.children('li').length - daysToShow) * $daysUL.children().last().outerHeight());
				}else{ //28 days
					toBottom = -$daysUL.height() + ((2 + $daysUL.children('li').length - daysToShow) * $daysUL.children().last().outerHeight());
				}
			}

			if($daysUL.position().top < toBottom){ //if the day you've selected is a day that does not exist in the calendar of the current month
				if($daysUL.children('li.active').length > 0){
					$daysUL.children('li').removeClass('active');
					$daysUL.children('li:nth-child(' + i + ')').addClass('active');
				}

				$daysUL.stop()
					.animate({
						top: toBottom + 'px'
					}, 0, 'easeOutSine', function(){
						//console.log($daysUL.children().last());
						$this.siblings('li').removeClass('mousemove');
					});
			}
		}

		completeFunction(listContainer, activeValue($daysSelector), activeValue($monthSelector), activeValue($yearSelector)); //do this here because every time you adjust a tree element, this is called
	}

	function groupHandlers(){
		var allowClick = true;
		var distanceData = {distance:[], milliseconds:[]};

		$daysUL.on('mousedown.grab', groupHandler);
		$monthUL.on('mousedown.grab', groupHandler);
		$yearUL.on('mousedown.grab', groupHandler);

		function groupHandler(e){ //down;
			allowClick = true;

			var $this = $(this).stop();
			var $thisBorder = $this.parent().parent();
			var $thisStartTop = $this.position().top;
			var start = {x:e.pageX, y:e.pageY};
			var end = {x:0, y:0};
			var laststart = 0;
			var lastend = 0;
			var moved = false;
			var timeLapsed = setInterval(getDistance, 25);
			var distanceTravelled = 0;

			function getDistance(){
				//laststart
				//console.log(this.pageY);

				laststart = lastend;
				lastend = end.y;

				if(laststart == lastend){
					distanceTravelled = 0;
					//console.log('stayed in the same place');
				}else{
					distanceTravelled = lastend - laststart;
				}

				//console.log(distanceTravelled);

				distanceData.distance.push(distanceTravelled);
				distanceData.milliseconds.push(25); //25 milliseconds - rate of interval

				if(distanceData.distance.length > 10){
					distanceData.distance.shift();
					distanceData.milliseconds.shift();
				}

				//console.log(laststart, lastend);
			}

			$(document).on('mousemove.grab', function(ev){
				//console.log(ev.pageX, ev.pageY);
				end = {x:ev.pageX - start.x, y:ev.pageY - start.y};
				$thisBorder.children('.selector').removeClass('active');

				var newPos = $thisStartTop + end.y;
				var top = $this.children().last().outerHeight() * 2;
				var bottom = -$this.height() + ($this.children().last().outerHeight() * 3);

				if(newPos > top){ //if you reach the bottom
					newPos = top;
				}else if(newPos < bottom){
					newPos = bottom;
				}

				$this.css('top', newPos + 'px');
				$this.children('li').addClass('mousemove');
				
				allowClick = false;
			});

			$(document).on('mouseup.grab', function(ev){ //up;
				var totalDistance = 0;
				var totalMilliseconds = 0;

				$this.children('li').removeClass('active').removeClass('mousemove');
				$thisBorder.addClass('active').children('.selector').removeClass('active');

				for(var i = 0; i < distanceData.distance.length; i++){
					totalDistance += distanceData.distance[i];
					totalMilliseconds += distanceData.milliseconds[i];
				}

				$(document).off('mouseup.grab').off('mousemove.grab');
				clearInterval(timeLapsed);

				var animationTime = 750;
				var delta = totalDistance / totalMilliseconds * animationTime;
				var destination = Math.round(($thisStartTop + delta) / $this.children().last().outerHeight()) * $this.children().last().outerHeight();
				var top = $this.children().last().outerHeight() * 2;
				var bottom = -$this.height() + ($this.children().last().outerHeight() * 3);

				if(destination > top){
					animationTime -= ((destination - top) / destination) * animationTime; //shorten animation duration if user flings it way past end
					destination = top;
				}else if(destination < bottom){
					animationTime = ($thisStartTop - bottom) / ($thisStartTop - destination) * animationTime;
					destination = bottom;
				}

				if(distanceData.distance.length >= 2){
					//console.log(distanceData.distance.length);

					if(distanceData.distance[distanceData.distance.length - 1] === distanceData.distance[distanceData.distance.length - 2]){
						//console.log('not a fling', distanceData.distance.length, distanceData.distance);
						delta = 0;
						animationTime = 50;
					}
				}

				if(delta !== 0){
					$this.stop()
					.animate({
						top: destination + 'px'
					}, animationTime, 'easeOutSine', function(){
						distanceData.distance = [];
						distanceData.milliseconds = [];
						allowClick = true;
						//console.log('anim complete - fling');

						var centeredChild = (destination - ($this.children().last().outerHeight() * 3)) / -$this.children().last().outerHeight();
						$this.children('li').removeClass('mousemove');
						$this.children('li:nth-child(' + centeredChild + ')').addClass('active');
						$thisBorder.addClass('active').children('.selector').addClass('active');


						//if($this.attr('id') == $monthUL.attr('id') || $this.attr('id') == $yearUL.attr('id')){
							adjustDaysToShow($this, $this.children('li:nth-child(' + centeredChild + ')').text());
						//}
					});
				}else{
					if(distanceData.distance.length >= 10){
						destination = Math.round($this.position().top / $this.children().last().outerHeight()) * $this.children().last().outerHeight();

						if(destination > top){
							animationTime -= ((destination - top) / destination) * animationTime; //shorten animation duration if user flings it way past end
							destination = top;
						}else if(destination < bottom){
							animationTime = ($thisStartTop - bottom) / ($thisStartTop - destination) * animationTime;
							destination = bottom;
						}else{
							animationTime = 50; //basically, you were very close to being on a number when you released outside after holding down the mouse for a while
						}

						$this.stop()
						.animate({
							top: destination + 'px'
						}, animationTime, 'easeOutSine', function(){
							distanceData.distance = [];
							distanceData.milliseconds = [];
							allowClick = true;
							//console.log('anim complete - released outside after 250ms or long drag');

							var centeredChild = (destination - ($this.children().last().outerHeight() * 3)) / -$this.children().last().outerHeight();
							$this.children('li').removeClass('mousemove');
							$this.children('li:nth-child(' + centeredChild + ')').addClass('active');
							$thisBorder.addClass('active').children('.selector').addClass('active');

							//if($this.attr('id') == $monthUL.attr('id') || $this.attr('id') == $yearUL.attr('id')){
								adjustDaysToShow($this, $this.children('li:nth-child(' + centeredChild + ')').text());
							//}
						});
					}else{
						destination = Math.round($this.position().top / $this.children().last().outerHeight()) * $this.children().last().outerHeight();

						if(destination > top){
							destination = top;
						}else if(destination < bottom){
							destination = bottom;
						}

						$this.stop()
						.animate({
							top: destination + 'px'
						}, animationTime, 'easeOutSine', function(){
							distanceData.distance = [];
							distanceData.milliseconds = [];
							allowClick = true;
							//console.log('anim complete - after quick pause (< 250ms)');

							var centeredChild = (destination - ($this.children().last().outerHeight() * 3)) / -$this.children().last().outerHeight();
							$this.children('li').removeClass('mousemove');
							$this.children('li:nth-child(' + centeredChild + ')').addClass('active');
							$thisBorder.addClass('active').children('.selector').addClass('active');

							//if($this.attr('id') == $monthUL.attr('id') || $this.attr('id') == $yearUL.attr('id')){
								adjustDaysToShow($this, $this.children('li:nth-child(' + centeredChild + ')').text());
							//}
						});
					}
				}
			});
		};	
	
		function listHandler(e){
			distanceData.distance = [];
			distanceData.milliseconds = [];

			var idNumber = parseInt(this.id.substring(1, this.id.length));
			var $this = $(this);
			var $parent = $this.parent();
			var posY = (idNumber - 2) * -$this.outerHeight();

			if(allowClick){
				$this.siblings('li').removeClass('active').removeClass('mousemove');
				$this.addClass('active');

				//console.log('click to destination: ' + $this.text());

				$parent.parent().siblings('.selector').addClass('active').parent().addClass('active');
				$parent.stop()
					.animate({
						top: posY + 'px'
					}, 250, 'easeOutSine', function(){
						//console.log('anim complete - click');
						var currentValue = $this.text();
						adjustDaysToShow($this.parent(), currentValue);
						//console.log(currentValue);
					});
			}

			return false;
		};

		//contextmenu for right-click to prevent bug in chrome
		$daysUL.children('li').on('contextmenu', listHandler).on(inputType, listHandler);
		$monthUL.children('li').on('contextmenu', listHandler).on(inputType, listHandler);
		$yearUL.children('li').on('contextmenu', listHandler).on(inputType, listHandler);
	}
	

	function checkMonth(m, y){
		var months30 = ['April', 'June', 'September', 'November'];
		var daysToShow = 31;
		var $yearUL = $('#datePickerYear');
		var centeredYearChild;
		var year = 0;

		for(var i = 0; i < months30.length; i++){
			if(m == months30[i]){
				daysToShow = 30;
				break;
			}
		}

		if(m == 'February'){
			daysToShow = 28;

			if(y % 4 === 0){
				//console.log('leap year');
				daysToShow++;
			}
		}

		return daysToShow;
	}

	function spinToDate(){
		var animationTime = 1000;

		for(var i = 0; i < $monthUL.children().length; i++){
			$monthUL.children()[i].id = 'm' + i;

			if($($monthUL.children()[i]).text().indexOf(dateObject.month) > -1){
				//console.log('match:', $($monthUL.children()[i]).text());
				targetMonthElementNumber = i;
				//break;
			}
		}

		if(dateObject.dayNumber.charAt(0) === '0'){
			dateObject.dayNumber = String(dateObject.dayNumber.substring(1,2));
		}

		for(var i = 0; i < $daysUL.children().length; i++){
			$daysUL.children()[i].id = 'd' + i;

			if($($daysUL.children()[i]).text() == dateObject.dayNumber){
				targetDayElementNumber = i;
			}
		}

		for(var i = 0; i < $yearUL.children().length; i++){
			$yearUL.children()[i].id = 'y' + i;

			if($($yearUL.children()[i]).text() == dateObject.year){
				targetYearElementNumber = i;
			}
		}

		if(animateToDate === false){
			animationTime = 0;
		}

		$monthUL.stop()
			.animate({
				top: (-$($monthUL.children()[targetMonthElementNumber]).position().top + (selectorOffset * $monthUL.children().last().outerHeight())) + 'px'
			}, animationTime, 'easeOutQuint', function(){

			});

		$daysUL.stop()
			.animate({
				top: (-$($daysUL.children()[targetDayElementNumber]).position().top + (selectorOffset * $daysUL.children().last().outerHeight())) + 'px'
			}, animationTime, 'easeOutQuint', function(){
				
			});

		$yearUL.stop()
			.animate({
				top: (-$($yearUL.children()[targetYearElementNumber]).position().top + (selectorOffset * $yearUL.children().last().outerHeight())) + 'px'
			}, animationTime, 'easeOutQuint', function(){
				
			});
	}

	groupHandlers();
	spinToDate();

	$daysUL.parent().on('mousewheel', wheelHandler);
	$monthUL.parent().on('mousewheel', wheelHandler);
	$yearUL.parent().on('mousewheel', wheelHandler);


 
	/* public variables and methods (can access private vars and methods ) */
	return{
		publicMethod: function(){
			checkPrivate();
		},
		update: function(m1,d1,y1,m2,d2,y2,noEndDateIsActive){
			//console.log('this happen');

			var hideAcceptButton = false;
			dateObject.month = m1.substring(0, 3);
			dateObject.dayNumber = d1;
			dateObject.year = y1;

			//console.log(m2, d2, y2);
			if(m2){
				m2 = m2.substring(0, 3);
			}

			if(!m2 && !d2 && !y2){
				animateToDate = true;
				//spinToDate();
			}else{
				var earlierOrSame = false;

				if(dateObject.year <= y2){
					if(dateObject.year < y2){
						earlierOrSame = true;
					}else if(dateObject.year === y2){ //same year
						if(monthPosition(dateObject.month) < monthPosition(m2)){
							earlierOrSame = true;
						}else if(monthPosition(dateObject.month) === monthPosition(m2)){ //same year, same month
							if(d1 <= d2){
								earlierOrSame = true;
							}
						}
					}
				}

				//console.log(dateObject.year, dateObject.month, dateObject.dayNumber);
				//console.log(y2, m2, d2);

				if(!earlierOrSame){
					//$daysUL.children('li').removeClass('active');
					//$monthUL.children('li').removeClass('active');
					//$yearUL.children('li').removeClass('active');

					//$daysSelector.removeClass('active');
					//$monthSelector.removeClass('active');
					//$yearSelector.removeClass('active');

					//$daysSelector.parent().removeClass('active');
					//$monthSelector.parent().removeClass('active');
					//$yearSelector.parent().removeClass('active');

					if(!noEndDateIsActive){
						hideAcceptButton = true;
						animateToDate = true;
					}else{
						animateToDate = false;
					}
					
					hideAcceptButton = true;

					//spinToDate();
				}
			}
			return hideAcceptButton;
		},
		publicVar: 'this is publicly accessible'
	}
}
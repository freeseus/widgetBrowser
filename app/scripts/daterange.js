var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var startDateList;
var endDateList;
var completedTrees;
var date1;
var date2;

var dateRange = function(list1, list2){
	completedTrees = [];
	startDateList = null;
	endDateList = null;

	date1 = list1;
	date2 = list2;
	createDateLists();
	dateToggles();
};

function monthPosition(m){
	if(m.length > 3){
		m = m.substring(0, 3);
	}

	for(var i = 0; i < months.length; i++){
		if(months[i] === m){
			break;
		}
	}

	return i;
}

function numberToMonth(n){
	for(var i = 0; i < months.length; i++){
		if(months[i] === n){
			break;
		}
	}

	return months[i];
}

function addZeroToMonth(n){
	if(n < 10){
		n = '0' + n;
	}

	return n;
}

function dateAlteration(date, valuesObject){
	var datesArray = date.split('-');
		datesArray[0] = Number(datesArray[0]);
		datesArray[1] = Number(datesArray[1]);
		datesArray[2] = Number(datesArray[2]);

		console.log(datesArray);
		console.log(valuesObject);

	//you need to do days

	if(datesArray[1] + valuesObject.months < 1){ //if it's before january
		//console.log('before january');

		var yearsInMonths = valuesObject.months / 12;
			yearsInMonths < 0 ? yearsInMonths *= -1 : yearsInMonths = yearsInMonths;
			yearsInMonths = Math.floor(yearsInMonths);

		datesArray[0] = datesArray[0] - yearsInMonths;

		var under = datesArray[1] + valuesObject.months;

		if(under < 1){
			datesArray[1] = 12 + under;
			datesArray[0] = datesArray[0] - 1;
		}

		//console.log('new month:', valuesObject.months);

		//console.log(yearsInMonths, under);
	}else if(datesArray[1] + valuesObject.months > 12){ //if it's past december

	}else{
		datesArray[1] = datesArray[1] + valuesObject.months;
	}

	date = datesArray.join('-');

	console.log(date);

	return date;
}

var treeListComplete = function(what, d, m, y){
	//console.log(what, d, m, y);

	$('#dateRangeWarning').css('display','none');

	if(d !== false && m !== false && y !== false){
		var found = false;
		var i = 0;

		for(i; i < completedTrees.length; i++){
			if(completedTrees[i][0] == what){
				found = true;
				break;
			}
		}

		if(found){
			completedTrees[i] = [what, d, m, y];
		}else{
			completedTrees.push([what, d, m, y]);
		}
	}

	if(completedTrees.length > 0 && what === '#fromList' || $('#startAll').is(':checked') && what === '#fromList'){
		if($('#endAll').is(':checked')){
			$('#radioCheckBoxEnd').removeClass('disabled');
		}else{
			$('#toList').removeClass('disabled');
		}
		
		$('#treelistHolder2').removeClass('disabled');
	}

	checkRange();
};

function checkRange(){
	var rangeOkay = false;
	var toArray = [];
	var fromArray = [];

	if(completedTrees.length === 2){
		if(completedTrees[0][0] === '#fromList'){
			fromArray = completedTrees[0];
			toArray = completedTrees[1];
		}else{
			fromArray = completedTrees[1];
			toArray = completedTrees[0];
		}
	}

	if(completedTrees.length === 2 && !$('#startAll').is(':checked') && !$('#endAll').is(':checked')){
		if(fromArray[3] <= toArray[3]){
			if(fromArray[3] < toArray[3]){
				rangeOkay = true;
			}else if(fromArray[3] === toArray[3]){ //same year
				if(monthPosition(fromArray[2]) < monthPosition(toArray[2])){
					rangeOkay = true;
				}else if(monthPosition(fromArray[2]) === monthPosition(toArray[2])){ //same year, same month
					if(fromArray[1] <= toArray[1]){
						rangeOkay = true;
					}
				}
			}
		}

		if(rangeOkay){
			enableAccept();
			$('#dateRangeWarning').css('display','none');
			$('#customOptionField').val(fromArray[2] + ' ' + fromArray[1] + ' ' + fromArray[3] + ' - ' + toArray[2] + ' ' + toArray[1] + ' ' + toArray[3]);
		}else{
			disableAccept();
			$('#dateRangeWarning').css('display','block');
		}
	}else if(completedTrees.length === 2 && $('#startAll').is(':checked') && !$('#endAll').is(':checked')){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val('Earliest available - ' + toArray[2] + ' ' + toArray[1] + ' ' + toArray[3]);
	}else if(completedTrees.length === 2 && !$('#startAll').is(':checked') && $('#endAll').is(':checked')){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val(fromArray[2] + ' ' + fromArray[1] + ' ' + fromArray[3] + ' - No end date');
	}else if($('#startAll').is(':checked') && $('#endAll').is(':checked')){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val('Earliest available - No end date');
	}else if($('#startAll').is(':checked') && completedTrees.length === 1 && completedTrees[0][0] === '#toList'){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val('Earliest available - ' + completedTrees[0][2] + ' ' + completedTrees[0][1] + ' ' + completedTrees[0][3]);
	}else if($('#endAll').is(':checked') && completedTrees.length === 1 && completedTrees[0][0] === '#fromList'){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val('flip' + ' - No end date');
		$('#customOptionField').val(completedTrees[0][2] + ' ' + completedTrees[0][1] + ' ' + completedTrees[0][3] + ' - No end date');
	}else{
		disableAccept();
	}

	//console.log(completedTrees);
	//console.log('checked range');
	//console.log($('#customOptionField').val());
}

function checkTreeArrays(){
	if(completedTrees.length === 2 && !$('#startAll').is(':checked') && !$('#endAll').is(':checked')){
		checkRange();
	}else if($('#startAll').is(':checked') && completedTrees.length === 1 && completedTrees[0][0] === '#toList'){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val('Earliest available - ' + completedTrees[0][2] + ' ' + completedTrees[0][1] + ' ' + completedTrees[0][3]);
	}else if($('#startAll').is(':checked') && completedTrees.length === 2 && completedTrees[0][0] === '#toList'){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val('Earliest available - ' + completedTrees[0][2] + ' ' + completedTrees[0][1] + ' ' + completedTrees[0][3]);
	}else if($('#startAll').is(':checked') && completedTrees.length === 2 && completedTrees[1][0] === '#toList'){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val('Earliest available - ' + completedTrees[1][2] + ' ' + completedTrees[1][1] + ' ' + completedTrees[1][3]);
	}else if($('#endAll').is(':checked') && completedTrees.length === 1 && completedTrees[0][0] === '#fromList'){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val(completedTrees[0][2] + ' ' + completedTrees[0][1] + ' ' + completedTrees[0][3] + ' - No end date');
	}else if($('#endAll').is(':checked') && completedTrees.length === 2 && completedTrees[0][0] === '#fromList'){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val(completedTrees[0][2] + ' ' + completedTrees[0][1] + ' ' + completedTrees[0][3] + ' - No end date');
	}else if($('#endAll').is(':checked') && completedTrees.length === 2 && completedTrees[1][0] === '#fromList'){
		enableAccept();
		$('#dateRangeWarning').css('display','none');
		$('#customOptionField').val(completedTrees[1][2] + ' ' + completedTrees[1][1] + ' ' + completedTrees[1][3] + ' - No end date');
	}else{
		checkRange();
	}

	if($('#startAll').is(':checked') && $('#endAll').is(':checked')){
		checkRange();
	}
}

function enableAccept(){
	$('button.boolean.acceptButton.inactive').removeClass('inactive');
}

function disableAccept(){
	$('button.boolean.acceptButton').addClass('inactive');
}

function createDateLists(){
	var $daysUL = $('#datePickerDay');
	var $monthUL = $('#datePickerMonth');
	var $yearUL = $('#datePickerYear');

	var $daysUL2 = $('#datePickerDay2');
	var $monthUL2 = $('#datePickerMonth2');
	var $yearUL2 = $('#datePickerYear2');

	var date = Date();
	var dateArray = date.split(' ');
	var dateObject = {time:dateArray[4], dayWord:dateArray[0], dayNumber:dateArray[2], month:dateArray[1], year:dateArray[3], timeGMT:dateArray[5], timeZone:dateArray[6]};

	//console.log(dateObject.month, dateObject.dayNumber, dateObject.year);

	startDateList = treelist(date1, $monthUL, $daysUL, $yearUL, userDevice, inputType(), true, treeListComplete);
	endDateList = treelist(date2, $monthUL2, $daysUL2, $yearUL2, userDevice, inputType(), false, treeListComplete);

	startDateList.daysRestrict = dateObject.dayNumber;
	startDateList.monthRestrict = dateObject.month;
	startDateList.yearRestrict = dateObject.year;

	endDateList.daysRestrict = dateObject.dayNumber;
	endDateList.monthRestrict = dateObject.month;
	endDateList.yearRestrict = dateObject.year;
}

function dateToggles(){
	$('#startAll').on(inputType(), function(e){
		if($(this).is(':checked')){ //checked
			$('#fromList').addClass('disabled');
			$('#treelistHolder2').removeClass('disabled');
			$(this).siblings('.optionText').addClass('activeText');
		}else{ //unchecked
			$('#fromList').removeClass('disabled');
			$(this).siblings('.optionText').removeClass('activeText');
			if(completedTrees.length === 2){
				$('#treelistHolder2').removeClass('disabled');
			}else if(completedTrees.length === 1 && completedTrees[0][0] === '#fromList'){
				$('#treelistHolder2').removeClass('disabled');
			}else{
				//$('#treelistHolder2').addClass('disabled');
			}
			checkRange();	
		}

		checkTreeArrays();

		//console.log(completedTrees);
	});

	$('#endAll').on(inputType(), function(e){
		if($(this).is(':checked')){
			$('#toList').addClass('disabled');
			$(this).siblings('.optionText').addClass('activeText');
		}else{
			$('#toList').removeClass('disabled');
			$(this).siblings('.optionText').removeClass('activeText');
			checkRange();
		}

		checkTreeArrays();
	});
}

function reveal(){
	$('div').first().css('visibility', 'visible');
}

//UTILITY FUNCTIONS
function inputType(){
	return userDevice !== 'computer' ? 'touchend': 'click';
}
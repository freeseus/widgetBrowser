//*////////////////////////////////////////////////////////////////////////////////////////////*//
//   AUTHOR: MY NAME             //////////////////////////////////////////////////////////////
//   DATE: FEBRUARY 07, 2012        /////////////////////////////////////////////////////////
//*////////////////////////////////////////////////////////////////////////////////////////////*//

////////////////////////////////////////////////////////////////////////////////////////////////////
//   VARIABLES   ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//   DON'T TOUCH   /////////////////////////////////////////////////////////////////////////////
var browser = $.browser, userDevice, requiredArray = [], supports_SVG = false, supports_Media = false, supports_Canvas = false, supports_CSS3 = false, dataSet, console;

//   YOUR VARIABLES   /////////////////////////////////////////////////////////////////////////
var preventContentSelection = true;
var dataURL = ""; //http://network-spreadsheet.herokuapp.com/spreadsheet/tfcMm6fZCc3OBDqUvgVWn3Q/entities; //"http://interactive.ftdata.co.uk/data/ft.interactive.data_v2.php?_cf=226&id=303"; //"https://docs.google.com/spreadsheet/pub?key=0Aq-Knoj398N1dHliZklaRU5DRUNhUGMzRW9CZ1dvSmc&output=html";
var dataType = ""; //googleDrive, interactiveDB, jsonp (heroku), json

////////////////////////////////////////////////////////////////////////////////////////////////////
//   SETUP   //////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

$().ready(
	function(){
		setup();
	}
);

function setup(){
	userDevice = getUserDevice();
       if(preventContentSelection){document.onselectstart = function(){return false;};$('#FTi').css("-moz-user-select", "none");} //prevents Chrome, IE and some webkit browsers from "grabbing" elements such as DIVS and SPANS
	if(browser.msie){browser.type = "Internet Explorer";browser.version = $.browser.version; console = {};console.log = function(t){alert(t);}}else if(browser.mozilla){browser.type = "FireFox";}else if(navigator.userAgent.toLowerCase().indexOf("chrome") >= 0){browser.type = "Chrome";}else if(browser.opera){browser.type = "Opera"; document.body.onmousedown=function(){return false}}else if(browser.webkit){browser.type = "WebKit";}else{browser.type = "Other";}if(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){if(userDevice == "computer"){browser.type = "Safari";}};//alert(browser.type + " (" + browser.version + ")"); //detects browers
	loadData();
}

function getUserDevice(){
       var device = "computer", iPad = navigator.userAgent.match(/iPad/i) != null, iPhone = (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null);
       if(iPad){iPhone = false, device = "iPad"}if(iPhone){device = "iPhone";}return device;
}

function inputType(){
	if(userDevice != "computer"){return "touchend";}else{return "click";}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//   LOAD RESOURCES   ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
	if(dataURL.length > 0){
              if(dataType == "googleDrive"){
                     Tabletop.init({key: dataURL, callback: processData, simpleSheet: true});
              }else if(dataType == "interactiveDB"){                     
                     $.getJSON('http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from xml where url='" + dataURL + "'") + '&format=json&diagnostics=true&callback=?', function(ds){}).success(processData);  
              }else if(dataType == "jsonp"){
                     $.getJSON(dataURL + "?callback=?", function(ds){}).success(processData);
		}else if(dataType == "json"){
                     $.getJSON(dataURL, function(ds){}).success(processData);
              }else{
                     alert("dataURL: " + dataURL + "has been assigned either an incorrect dataType or no dataType. Please check script.js");
              }
	}else{
		processData(null);
	}
	
	function processData(ds){
              if(dataType == "interactiveDB" && ds != null){
                     dataSet = ds.query.results.dataset;
              }else{
                     dataSet = ds;
              }
		
		//ideally the images are all listed inside the dataset. you simply need to put them into an array and feed it into the preCacheImages function
		//if not, you can make an array variable (exampleImages) and manually list the images before feeding it into the preCacheImages function
		
		preCacheImages(); //if you have no image, simply use preCacheImages();
	}
}

function preCacheImages(a){
	if(a && a.length > 0){
		for(var i = 0; i < a.length; i++){
			$("#precache").append($("<img />").attr({src: a[i],onload: imageCached([i, a.length - 1])}));
		}
	}else{
		imageCached(); //no images needed to cache
	}
}

function imageCached(n){
	if(n == undefined || n[0] == n[1]){
		init();
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//   INIT & FUNCTIONS   ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function init(){										
	////////////////////////////////////////////////////////////////////////////////////////////////////									
	// YOUR CODE GOES HERE !!!!				
	////////////////////////////////////////////////////////////////////////////////////////////////////				
	
	var bufferInterval;
	var bufferCount = 0; //this is for resetting the audio stream in the event jPlayer breaks (from a user hammering on the play/pause button)
	var bufferArray = [];
	var progressFill = true;
	var progressTime = true;
	var audioData = {};

	if(document.URL.indexOf('#') > -1){		
		var str = document.URL.slice(document.URL.indexOf('#') + 1, document.URL.length);
		var arr = str.split(',');
		
		for(var i = 0; i < arr.length; i++){
			if(arr[i].indexOf('$title') > -1){
				audioData.title = arr[i].split('$title').join('').split('=').join('');
			}else if(arr[i].indexOf('$audioURL') > -1){
				audioData.audioURL = arr[i].split('$audioURL').join('').split('=').join('');				
			}else if(arr[i].indexOf('$about') > -1){
				audioData.about = arr[i].split('$about').join('').split('=').join('');
			}else if(arr[i].indexOf('$subscribe') > -1){
				audioData.subscribe = arr[i].split('$subscribe').join('').split('=').join('');
			}else if(arr[i].indexOf('$download') > -1){
				audioData.download = arr[i].split('$download').join('').split('=').join('');

			}
		}
	}
	
	var stream = {mp3: audioData.audioURL}, ready = true;
	$('.title').html(replaceChars(audioData.title));
	$('.audioAbout').html(replaceChars(audioData.about));

	if(audioData.subscribe){
		$('.audioAbout').append('<div><a href="' + replaceChars(audioData.subscribe) + '" target="_blank">Subscribe to this podcast <span style="position:relative; top:1px; font-size:1.5em; line-height:1">&raquo;</span></a></div>');
	}

	if(audioData.download && audioData.download === 'true'){
		$('.audioAbout').append('<div><a href="' + replaceChars(audioData.audioURL) + '" download>Save podcast <span style="position:relative; top:1px; font-size:1.5em; line-height:0">&raquo;</span></a></div>');
	}

	$(this).jPlayer("setMedia", stream);

	if(stream.mp3 && stream.mp3 != ""){
		$("#jquery_jplayer_1").jPlayer({
			error: function(event) {
				if(ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
					// Setup the media stream again and play it.
					$(this).jPlayer("setMedia", stream).jPlayer("play");
				}
			},
			swfPath: "js",
			supplied: "mp3",
			preload: "metadata",
			wmode: "window",
			ended: function(){
				$(".audioPlayBtn").attr("status", "paused").empty().html($(".audioPlayBtn").attr("play"));
				clearInterval(bufferInterval);
				bufferInterval = null;
				bufferCount = 0;
				$('.audioProgress').css("width", "0%");
				$('.audioTime').html("<span style='color:#74736c'>" + secondsToTime($("#jquery_jplayer_1").data("jPlayer").status.currentTime) + "</span>" + " / " + secondsToTime($("#jquery_jplayer_1").data("jPlayer").status.duration));
			}
		});
		
		$('.audioPlayBtn').bind(inputType(), playPause);
		
		$("#jquery_jplayer_1").bind($.jPlayer.event.timeupdate, function(event){
			if(event.jPlayer.status.duration == 0){
				//console.log("this only seems to happen in Chrome");
			}
		});
	}else{
		showBufferScreen(true);
		$(".audioBuffer").empty().html("No audio file specified");
	}
	
	function replaceChars(s){
		return s.split('%20').join(' ').split('&amp;%23044;').join(',').split('%3C').join('<').split('%3E').join('>');
	}

	function playPause(e){
		if($(this).attr("status") == "paused"){
			$(this).attr("status", "playing").empty().html($(this).attr("pause"));
			//console.log("playing");
			$("#jquery_jplayer_1").jPlayer("play");
			
			if(!bufferInterval){
				bufferInterval = setInterval(checkAudioStream, 500);
			}
		}else{
			$(this).attr("status", "paused").empty().html($(this).attr("play"));
			//console.log("paused");
			$("#jquery_jplayer_1").jPlayer("pause");
		}
	}
	
	function checkAudioStream(){
		//console.log($("#jquery_jplayer_1").data("jPlayer").status.currentTime);
		var isBuffering = false;
		
		bufferArray.push($("#jquery_jplayer_1").data("jPlayer").status.currentTime);
		
		if(bufferArray.length > 2){
			bufferArray.shift();
		}
		
		if(bufferArray.length == 2 && $(".audioPlayBtn").attr("status") == "playing"){ // don't use $("#jquery_jplayer_1").data("jPlayer").status.paused - if the stream breaks, this will break the interval (jPlayer bug)
			if(bufferArray[0] == bufferArray[1]){
				//console.log("audio is buffering");
				isBuffering = true;
			}
			
			if(progressFill){
				$('.audioProgress').css("width", ((Number(bufferArray[1]) / Number($("#jquery_jplayer_1").data("jPlayer").status.duration)) * 100) + "%");
			}
			
			if(progressTime){
				$('.audioTime').html("<span style='color:#74736c'>" + secondsToTime($("#jquery_jplayer_1").data("jPlayer").status.currentTime) + "</span>" + " / " + secondsToTime($("#jquery_jplayer_1").data("jPlayer").status.duration));
			}
		}
		
		showBufferScreen(isBuffering);
	}
	
	function showBufferScreen(s){
		if(s){
			$(".audioBuffer").css("visibility", "visible");
			$(".audioPlayBtn").css("visibility", "hidden");
			$(".audioTime").css("visibility", "hidden");
			
			bufferCount++;
			
			if(bufferCount >= 30){ //30 tries to buffer
				bufferCount = 0;
				$("#jquery_jplayer_1").jPlayer("play"); //restart the audio
			}
		}else{
			$(".audioBuffer").css("visibility", "hidden");
			$(".audioPlayBtn").css("visibility", "visible");
			$(".audioTime").css("visibility", "visible");
			
			bufferCount = 0;
		}
	}
			
	function secondsToTime(d){
		d = parseFloat(d);
		var h = Math.floor(d / 3600), m = Math.floor(d % 3600 / 60), s = Math.floor(d % 3600 % 60);
		return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
		//return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "0") + m + ":" : "00:") + (s < 10 ? "0" : "") + s); //double zeros for minutes
	}
	
	////////////////////////////////////////////////////////////////////////////////////////////////////									
	// AFTER YOUR CODE IS EXECUTED:			
	////////////////////////////////////////////////////////////////////////////////////////////////////	
	
	reveal();
	
	function reveal(){
		$('div').first().css("visibility", "visible");
	}
}

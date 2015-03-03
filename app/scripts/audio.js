function audioPlayer(){
	//console.log('creating audio player');

	function getAudioURL(){
		var url = $audioInputs.eq(0).val();
		var title = $audioInputs.eq(1).val();
		var body = $audioInputs.eq(2).val();
		var subscribe = $audioContent.find('#audioSection3 .optionText.default').hasClass('activeText') ? $audioContent.find('#audioSection3 .optionText.default').siblings('.inputContainer').find('input.audio').val() : '';
		var download = $audioContent.find('#audioSection4 .optionText.default').hasClass('activeText');

		if(url === ''){
			url = 'http://ig.ft.com/audio/ClintonFinal_Edit.mp3';
		}

		if($audioContent.find('#audioSection3 .optionText.default').hasClass('activeText') && subscribe === ''){
			subscribe = 'http://podcast.ft.com/s/60';
		}

		if(title.length === 0){
			title = 'Enter the title';
		}

		if(!subscribe){
			subscribe = '';
		}

		return 'audio/index.html#$title=' + title + ',$audioURL=' + url + ',$about=' + body + ',$subscribe=' + subscribe + ',$download=' + download;
	}

	function updateAudioWidget(){
		$audioContent.find('.autoChartHolder').empty().append('<iframe id="iframeChart" scrolling="no" class="autoChart" style="background-color:#fff1e0; padding:10px; width:inherit; height:inherit" src="' + getAudioURL() +'"></iframe>');
		$('#iframeChart').load(function (e){
			console.log('loaded');
			$audioContent.find('.autoChartHolder').css('width', $audioContent.find('#iframeChart')[0].contentWindow.document.body.offsetWidth).css('height', $audioContent.find('#iframeChart')[0].contentWindow.document.body.offsetHeight);
			$audioContent.find('.retrieveAnim').removeClass('fa-spin').css('visibility','hidden');
		});

		$audioContent.find('.audioCopyText').val('http://ft.com/ig/widgets/widgetBrowser/' + getAudioURL());
	}

	function resetTimeout(n){
		clearTimeout(audioRefreshTimeout);
		audioRefreshTimeout = setTimeout(updateAudioWidget, n ? n : 500);

		if(!n){
			$audioContent.find('.retrieveAnim').removeClass('fa-spin').addClass('fa-spin').css('visibility','visible');
		}
	}

	var audioSection1 = '<div class="section" id="audioSection1" style="display:block;"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">2</div><span>Enter the audio file URL</span></div><div class="inputContainer"><input type="text" class="audio" placeholder="Example: http://ig.ft.com/audio/ClintonFinal_Edit.mp3" style="width: 450px;"></div></div>';
	var audioSection2 = '<div class="section" id="audioSection2" style="display:block"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">3</div><span>Enter title and body text</span></div><div class="inputContainer"><div class="optionTitle">Title text</div><input type="text" class="audio" placeholder="Enter the title"></div><div class="inputContainer"><div class="optionTitle">Body text</div><input type="text" class="audio" class="optional" placeholder="Enter body text (optional)"></div></div>';
	var audioSection3 = '<div class="section" id="audioSection3" style="display:block"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">4</div><span>Allow user to subscribe?</span><ul><li class="optionText">No</li><span>•</span><li class="optionText default activeText">Yes</li><div class="inputContainer" style="margin-left:32px;"><div class="optionTitle">Subscribe URL</div><input type="text" style="width:325px" class="audio" placeholder="Example: http://podcast.ft.com/s/60" style="margin-bottom: 0px;"></div></ul></div></div>';
	var audioSection4 = '<div class="section" id="audioSection4" style="display:block"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">5</div><span>Allow user to download?</span><ul><li class="optionText">No</li><span>•</span><li class="optionText default activeText">Yes</li></ul></div></div>';
	var audioSection5 = '<div class="section" id="audioSection5" style="margin-bottom:10px; padding-bottom:20px"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">6</div><span style="vertical-align:top">Audio widget</span><i class="retrieveAnim fa fa-cog" style="font-size:26px; margin-left: 6px; position:relative; top: -3px; color:rgba(0,0,0,0.25); visibility:hidden;"></i></div><div class="autoChartHolder" style="width:250px; margin-bottom:20px"></div></div><div class="inputContainer" style="display:block"><div class="optionTitle" style="margin-top:10px">Embed code</div><textarea class="audioCopyText" type="text" style="width: 50%; height:125px" value="Some url here" readonly></div>';

	var $audioContent = $('#FTi .contents .content');
	var $audio;
	var $optionTexts;
	var audioRefreshTimeout = setTimeout(function(){}, 100);

	$audioContent.append(audioSection1 + audioSection2 + audioSection3 + audioSection4 + audioSection5);
	$audioInputs = $audioContent.find('input.audio');
	$optionTexts = $audioContent.find('li.optionText');
	resetTimeout(100);

	$audioInputs.on(inputType() + ' keypress keyup', function(e){
		var $this = $(this);

		if(this.value.length > 0){
			$this.addClass('active');
		}else{
			$this.removeClass('active');
		}

		if(e.type === 'keyup'){
			resetTimeout();
		}
	});

	$optionTexts.on(inputType(), function(e){
		$(this).addClass('activeText').siblings('.optionText').removeClass('activeText');
		resetTimeout();
	});
}

function audioRSS(){
	var audioSection1 = '<div class="section" id="audioSection1" style="display:none;"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">2</div><span>Podcast groups</span></div><div class="dropDownMenuContainer" style="width:425px"><div class="dropDownMenu"><div class="dropDownMenuTitleContents" style="padding: 10px;"><span class="dropDownMenuTitle" default="Select the podcast group">Select the podcast group</span><div class="dropDownArrow" style="float:right"></div></div></div><div class="dropDownContents audio" type="word" style="position: absolute; width: 425px; display: none;"></div></div></div>';
	var $audioContent = $('#FTi .contents .content');
		$audioContent.append(audioSection1);
	var $dropdown;
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	function createRSSDropDown(){
		var s = '';

		for(var i = 0; i < rssData.feeds.length; i++){
			s += '<div class="dropDownOption" value="' + i + '">' + rssData.feeds[i].showtitle + '</div>';
		}

		$dropdown = $audioContent.find('.dropDownMenu');
		$dropdown.siblings('.dropDownContents').append(s);
		$audioContent.find('#audioSection1').css('display', 'block');
		$dropdown.on(inputType(), function (e){
			var $this = $(this);
			
			if($this.hasClass('active')){
				$this.removeClass('active');
				$this.siblings('.dropDownContents').css('display', 'none');
			}else{
				$this.addClass('active');
				$this.siblings('.dropDownContents').css('display', 'block');

				$dropdown.siblings('.dropDownContents').find('.dropDownOption').off(inputType()).on(inputType(), function (e){
					$this.find('.dropDownMenuTitle').text(this.innerText);
					$this.removeClass('active').addClass('entered');
					$this.siblings('.dropDownContents').css('display', 'none');

					$audioContent.find('#audioSection2').remove();
					getRSS($(this).attr('value'));
				});
			}

			$('body').off(inputType()).on(inputType(), function (e){
				if(String(e.target.className).indexOf('dropDown') === -1){
					//console.log('clicked the body!');
					$this.removeClass('active');
					$this.siblings('.dropDownContents').css('display', 'none');
				}
			});
		});
	}

	function getSheets(data){
		if(!data.statusText){ //if it didn't recieve a fail status text
			rssData.feeds = data;
			console.log(rssData);

			createRSSDropDown();
		}
	}

	function getRSS(i){
		$.get(rssData.feeds[i].rssfeed, function (data){
			var o = xmlToJSON(data).rss.channel;

			$audioContent.append('<div class="section" id="audioSection2" style="display:block;"><div class="sectionDivider"></div><div class="instructions"><div class="stepNumber">3</div><span>Podcasts</span></div><div class="podcastHolder"></div></div>');
		
			s = '<div class="rssFeedTitle">' + rssData.feeds[i].showtitle + '</div>';


			for(var j = 0; j < o.item.length; j++){
				var d = new Date(o.item[j].pubDate['#text']);
				var m = d.getMonth();
				var n = d.getDate();
				var y = d.getFullYear();
				var h = Number(d.getHours());
				var k = Number(d.getMinutes());
				var a = months[m] + ' ' + n + ', ' + y + ' - ' + (h > 12 ? (h - 12) : h) + ':' + (k < 10 ? '0' + k : k) + (h >= 12 ? ' pm' : ' am');
				
				//var ituneslink = 'i0t1u2n3e4s5=' + rssData.feeds[i].itunes;
				var ituneslink = 'i0t1u2n3e4s5=' + rssData.feeds[i].showurl;
				var image = 'i0m1a2g3e4=' + o.image.url['#text'];
				var title = 't0i1t2l3e4=' + o.item[j].title['#text'];
				var date = 'd0a1t2e3=' + a;
				var body = 'b0o1d2y3=' + o.item[j]['itunes:summary']['#text'];
				var audio = 'a0u1d2i3o4=' + o.item[j].enclosure['@attributes'].url;

				var str = [ituneslink, image, title, date, body, audio];
					str = encodeURI(str.join('&&&&&'));

				s += '<div class="podcast"><div class="hoverActivate"><div class="text"><i class="fa fa-play"></i><div>Preview</div></div></div><div class="widgetLink"><a target="_blank" href="http://ft.com/ig/widgets/widgetBrowser/audio/podcast.html?#' + str + '"">Use this podcast</a></div><div class="rssTop"><div class="rssImage"><a target="_blank" href="' + rssData.feeds[i].showurl + '"><img src="' + o.image.url['#text'] + '"</img></a></div><div class="rssTopText"><div class="rssTitle">' + o.item[j].title['#text'] + '</div><div class="rssDate">' + a + '</div></div></div><div class="rssBody">' + o.item[j]['itunes:summary']['#text'] + '</div><audio style="width: 100%; height: 30px;" autoplay controls="controls"><source audiosource = "' + o.item[j].enclosure['@attributes'].url + '" src=""></audio></div>';
			}

			$audioContent.find('.podcastHolder').append(s).find('.hoverActivate').on('click', function (e){
				$audioContent.find('audio').attr('src', '');
				$audioContent.find('.hoverActivate').removeClass('noHover');

				var $audioSibling = $(this).siblings('audio');

				$audioSibling.siblings('.hoverActivate').addClass('noHover');
				$audioSibling.attr('src', $audioSibling.children('source').attr('audiosource'));
			});
			console.log(o.item.length, 'processed');
		});
	}

	function xmlToJSON(xml){
		// Create the return object
		var obj = {};

		if(xml.nodeType == 1){ // element
			// do attributes
			if (xml.attributes.length > 0){
			obj["@attributes"] = {};
				for (var j = 0; j < xml.attributes.length; j++){
					var attribute = xml.attributes.item(j);
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		}else if(xml.nodeType == 3){ // text
			obj = xml.nodeValue;
		}

		// do children
		if(xml.hasChildNodes()){
			for(var i = 0; i < xml.childNodes.length; i++){
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if(typeof(obj[nodeName]) == "undefined"){
					obj[nodeName] = xmlToJSON(item);
				}else{
					if(typeof(obj[nodeName].push) == "undefined"){
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xmlToJSON(item));
				}
			}
		}
		return obj;
	}

	//this is the real one that is now the new spreadsheet and doesn't work with bertha
	//Bertha.getSpreadsheet({id:'1lDMj-yTn7u_-AUuGLTqMOwTdk55iPi2TJymZZ-Qvml0', sheets:['data']}).done(getSheets).fail(getSheets);
	
	//this is the "fix" one
	//Bertha.getSpreadsheet({id:'0AksTHVCen_U-dHNSMkdZNDJqVFNnX21VMHRNaHJQRHc', sheets:['data']}).done(getSheets).fail(getSheets);

	//this is a hack since the bertha thing is broken!
	var savedData = [{"showid":44,"showtitle":"FT Banking Weekly","showurl":"http://podcast.ft.com/index.php?sid=44","rssfeed":"http://podcast.ft.com/rss/44/","itunes":"https://itunes.apple.com/gb/podcast/banking-weekly/id374270310?mt=2&ign-mpt=uo%3D4","stitcher":null,"audioboom":"http://audioboom.com/channel/bankingweekly","tunein":null,"secondaryimage":null},{"showid":47,"showtitle":"FT Arts","showurl":"http://podcast.ft.com/index.php?sid=47","rssfeed":"http://podcast.ft.com/rss/47/","itunes":"https://itunes.apple.com/gb/podcast/ft-arts/id402479253?mt=2&ign-mpt=uo%3D4","stitcher":null,"audioboom":"http://audioboom.com/FTarts","tunein":null,"secondaryimage":null},{"showid":22,"showtitle":"FT Money Show","showurl":"http://podcast.ft.com/index.php?sid=22","rssfeed":"http://podcast.ft.com/rss/22/","itunes":"https://itunes.apple.com/gb/podcast/ft-money-show/id287031335?mt=2&ign-mpt=uo%3D4","stitcher":null,"audioboom":"http://audioboom.com/channel/ftmoneyshow","tunein":null,"secondaryimage":null},{"showid":29,"showtitle":"FT News","showurl":"http://podcast.ft.com/index.php?sid=29","rssfeed":"http://podcast.ft.com/rss/29/","itunes":"https://itunes.apple.com/gb/podcast/ft-news/id379613801?mt=2&ign-mpt=uo%3D4","stitcher":"http://www.stitcher.com/podcast/financial-times/ft-news","audioboom":"http://audioboom.com/channel/ftnews","tunein":null,"secondaryimage":null},{"showid":57,"showtitle":"FT Hard Currency","showurl":"http://podcast.ft.com/index.php?sid=57","rssfeed":"http://podcast.ft.com/rss/57/","itunes":"https://itunes.apple.com/gb/podcast/hard-currency/id527135392?mt=2&ign-mpt=uo%3D4","stitcher":null,"audioboom":"http://audioboom.com/channel/hardcurrency","tunein":null,"secondaryimage":null},{"showid":45,"showtitle":"FT World Weekly with Gideon Rachman","showurl":"http://podcast.ft.com/index.php?sid=45","rssfeed":"http://podcast.ft.com/rss/45/","itunes":"https://itunes.apple.com/gb/podcast/world-weekly-gideon-rachman/id377218713?mt=2&ign-mpt=uo%3D4","stitcher":null,"audioboom":"http://audioboom.com/channel/worldweeklywithgideonrachman","tunein":null,"secondaryimage":null},{"showid":18,"showtitle":"Listen to Lucy","showurl":"http://podcast.ft.com/index.php?sid=18","rssfeed":"http://podcast.ft.com/rss/18/","itunes":"https://itunes.apple.com/gb/podcast/listen-to-lucy/id201455746?mt=2&ign-mpt=uo%3D4","stitcher":null,"audioboom":"http://audioboom.com/channel/listentolucy","tunein":null,"secondaryimage":null},{"showid":60,"showtitle":"FT Big Read","showurl":"http://podcast.ft.com/index.php?sid=60","rssfeed":"http://podcast.ft.com/rss/60/","itunes":"https://itunes.apple.com/gb/podcast/ft-analysis/id878656889","stitcher":null,"audioboom":"http://audioboom.com/channel/ftbigread","tunein":null,"secondaryimage":null},{"showid":52,"showtitle":"FT Alphachat","showurl":"http://podcast.ft.com/index.php?sid=52","rssfeed":"http://podcast.ft.com/rss/52/","itunes":"https://itunes.apple.com/gb/podcast/ft-alphachat/id448302257?mt=2&ign-mpt=uo%3D4","stitcher":null,"audioboom":"http://audioboom.com/channel/ftalphachat","tunein":null,"secondaryimage":null}];

	getSheets(savedData);
}

var rssData = {};
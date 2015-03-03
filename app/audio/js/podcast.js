$(function(){
	var data = document.URL.slice(document.URL.indexOf('?#') + 2, document.URL.length);
	var $content = $('#podcast');

	/*
	for(var j = 0; j < o.item.length; j++){
		var d = new Date(o.item[j].pubDate['#text']);
		var m = d.getMonth();
		var n = d.getDate();
		var y = d.getFullYear();
		var h = Number(d.getHours());
		var k = Number(d.getMinutes());
		var a = months[m] + ' ' + n + ', ' + y + ' - ' + (h > 12 ? (h - 12) : h) + ':' + (k < 10 ? '0' + k : k) + (h >= 12 ? ' pm' : ' am');
		
		s += '<div class="podcast"><div class="rssTop"><div class="rssImage"><a target="_blank" href="' + rssData.feeds[i].itunes + '"><img src="' + o.image.url['#text'] + '"</img></a></div><div class="rssTopText"><div class="rssTitle">' + o.item[j].title['#text'] + '</div><div class="rssDate">' + a + '</div></div></div><div class="rssBody">' + o.item[j]['itunes:summary']['#text'] + '</div><audio controls="controls"><source src="' + o.item[j].enclosure['@attributes'].url + '"></audio></div>';
	}
	*/

	if(document.URL.indexOf('?#') > -1 && data){
		var splitter = '&&&&&';
		var arr = decodeURI(data).split(splitter);
		var o = {ituneslink:0, image:0, title:0, date:0, body:0, audio:0};

		for(var i = 0; i < arr.length; i++){
			if(arr[i].indexOf('i0t1u2n3e4s5=') > -1){
				o.ituneslink = arr[i].split('i0t1u2n3e4s5=').join('');
			}else if(arr[i].indexOf('i0m1a2g3e4=') > -1){
				o.image = arr[i].split('i0m1a2g3e4=').join('');
			}else if(arr[i].indexOf('t0i1t2l3e4=') > -1){
				o.title = arr[i].split('t0i1t2l3e4=').join('');
			}else if(arr[i].indexOf('d0a1t2e3=') > -1){
				o.date = arr[i].split('d0a1t2e3=').join('');
			}else if(arr[i].indexOf('b0o1d2y3=') > -1){
				o.body = arr[i].split('b0o1d2y3=').join('');
			}else if(arr[i].indexOf('a0u1d2i3o4=') > -1){
				o.audio = arr[i].split('a0u1d2i3o4=').join('');
			}
		}

		//console.log(o);

		$content.append('<div class="podcast"><div class="rssTop"><div class="rssImage"><a target="_blank" href="' + o.ituneslink + '"><img src="' + o.image + '"</img></a></div><div class="rssTopText"><div class="rssTitle">' + o.title + '</div><div class="rssDate">' + o.date + '</div></div></div><div class="rssBody">' + o.body + '</div><audio controls="controls"><source src="' + o.audio + '"></audio></div>');
	}
});
let star = document.getElementById('starImage');

function switchChannelName(channelName, channelLocation) {
	document.getElementById('channelName').innerHTML = channelName;
	document.getElementById('channelLocation').innerHTML = `by: ${channelLocation}`;
	document.getElementById('channelLocation').href = `http://what3words.com/${channelLocation}`;
	star.src = 'https://ip.lfe.mw.tum.de/sections/star-o.png';
}


function switchFavoChannel(){
	if(star.src == 'https://ip.lfe.mw.tum.de/sections/star-o.png'){
		star.src = 'https://ip.lfe.mw.tum.de/sections/star.png';
	}else{
		star.src = 'https://ip.lfe.mw.tum.de/sections/star-o.png';
	}
}
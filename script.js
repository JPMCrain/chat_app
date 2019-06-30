function switchChannelName(channelName, channelLocation) {
	document.getElementById('channelName').innerHTML = channelName;
	document.getElementById('channelLocation').innerHTML = `by: ${channelLocation}`;
	document.getElementById('channelLocation').href = `http://what3words.com/${channelLocation}`;
}


function switchFavoChannel(){
	
}
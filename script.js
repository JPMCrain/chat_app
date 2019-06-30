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

function selectedTab(button){
	let tab1 = document.getElementById('Tab1');
	let tab2 = document.getElementById('Tab2');
	let tab3 = document.getElementById('Tab3');

	if(button == 'tab1'){
		tab1.classList.add('tabBtn__active');
		tab2.classList.remove('tabBtn__active');
		tab3.classList.remove('tabBtn__active');
	}else if(button == 'tab2'){
		tab1.classList.remove('tabBtn__active');
		tab2.classList.add('tabBtn__active');
		tab3.classList.remove('tabBtn__active');
	}else if (button == 'tab3'){
		tab1.classList.remove('tabBtn__active');
		tab2.classList.remove('tabBtn__active');
		tab3.classList.add('tabBtn__active');
	}
}


function toggleEmoji(){
	let emojis = document.getElementById('emojis');

	if(emojis.style.display == 'none'){
		emojis.style.display = 'block';
	}else {
		emojis.style.display = 'none';
	}
}
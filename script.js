let star = document.getElementById('starImage');
let channelList = document.getElementById('channelList');

function switchChannelName(channelName, channelLocation) {
	document.getElementById('channelName').innerHTML = channelName;
	document.getElementById('channelLocation').innerHTML = `by: ${channelLocation}`;
	document.getElementById('channelLocation').href = `http://what3words.com/${channelLocation}`;
	star.src = 'https://ip.lfe.mw.tum.de/sections/star-o.png';
}

const channels = [
	{title: '#Dog Box', location: 'eggs.jumpy.cheeses'},
	{title: '#Cheesy Jokes', location: 'buzz.coverage.rank'},
	{title: '#Book Lovers', location: 'drop.protest.powers'},
	{title: `#Food Guru's`, location: 'slang.themes.plotting'},
	{title: '#Movie Fanatics', location: 'pointer.grudges.shock'},
];

let topFavoStar = document.createElement('i'); 
topFavoStar.classList.add(`far`, `fa-star`); 
document.getElementById('starImage').appendChild(topFavoStar);

topFavoStar.addEventListener('click', () => {
	if(topFavoStar.classList.contains('fas')){
		topFavoStar.classList.remove('fas', 'fa-star');
		topFavoStar.classList.add('far', 'fa-star');
	}else{
		topFavoStar.classList.remove('far', 'fa-star');
		topFavoStar.classList.add('fas', 'fa-star');
	}
});

channels.forEach(function(element) {
	console.log(element);
	let name = element.title;
	let location = element.location;

	let li = document.createElement('li');
	let h2 = document.createElement('h2');
	let a = document.createElement('div');

	let imageDiv = document.createElement('div');
	imageDiv.classList.add('channel__images')

	let favStarImage = document.createElement('i'); 
	favStarImage.classList.add(`far`, `fa-star`); 

	let image2 = document.createElement('i'); 
	image2.classList.add(`fas`, `fa-angle-right`); 

	a.classList.add('a');

	a.innerHTML = name;
	a.href = '#';
	li.addEventListener('click', () => {
			document.getElementById('channelName').innerHTML = name;
			document.getElementById('channelLocation').innerHTML = `by: ${location}`;
			document.getElementById('channelLocation').href = `http://what3words.com/${location}`;
			star.src = 'https://ip.lfe.mw.tum.de/sections/star-o.png';
			for (const li of channelList.getElementsByTagName('li')) {
				li.classList.remove('selected');
			}
			li.classList.add('selected');
	});

	favStarImage.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		if(favStarImage.classList.contains('fas')){
			favStarImage.classList.remove('fas', 'fa-star');
			favStarImage.classList.add('far', 'fa-star');
		}else{
			favStarImage.classList.remove('far', 'fa-star');
			favStarImage.classList.add('fas', 'fa-star');
		}
	});
	
	h2.appendChild(a);
	li.appendChild(h2);
	imageDiv.appendChild(favStarImage);
	imageDiv.appendChild(image2);
	li.appendChild(imageDiv);
	channelList.appendChild(li);
});


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
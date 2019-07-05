let userPosition;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
			userPosition = position;
		});
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

window.onload = () => {
	getLocation();
	updateScroll();
}

//Channel pannel set up
let channelList = document.getElementById('channelList');

const channels = [
	{title: '#Dog Box', location: 'eggs.jumpy.cheeses'},
	{title: '#Cheesy Jokes', location: 'buzz.coverage.rank'},
	{title: '#Book Lovers', location: 'drop.protest.powers'},
	{title: `#Food Guru's`, location: 'slang.themes.plotting'},
	{title: '#Movie Fanatics', location: 'pointer.grudges.shock'},
	{title: '#Dog Box', location: 'eggs.jumpy.cheeses'},
	{title: '#Cheesy Jokes', location: 'buzz.coverage.rank'},
	{title: '#Book Lovers', location: 'drop.protest.powers'},
	{title: `#Food Guru's`, location: 'slang.themes.plotting'},
	{title: '#Movie Fanatics', location: 'pointer.grudges.shock'},
];

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

//Subit a message
let message = document.getElementById('messageInput');
let submit = document.getElementById('messageSubit');

function Message(createdBy, own, text, position) {
	this.createdBy = createdBy;
	this.createdOn = new Date();
	this.expiresOn = 15;
	this.text = text;
	this.own = own;

	if(position) {
		this.longitude = position.coords.longitude;
		this.latitude = position.coords.latitude;
	}
}

// function sendMessageToServer(message) {
// 	// TODO later on
// }

function displayMessage(msg) {
	let messageDiv = document.createElement('div');
	let messageArrowDiv = document.createElement('div');
	let messageArrow = document.createElement('div');
	if(!msg.own){
		messageDiv.classList.add('message');
		messageArrowDiv.classList.add('other__message');
		messageArrow.classList.add('arrow-left');
	}else{
		messageDiv.classList.add('first__message');
		messageArrowDiv.classList.add('own__message');
		messageArrow.classList.add('arrow-right');
	}

	let messageTitle = document.createElement('div');
	messageTitle.classList.add('message__title');
	let what3words = document.createElement('h3');
	what3words.classList.add('h3Hover');
	let dateOfMsg = document.createElement('h3');
	let timeLeft = document.createElement('h3');
	let em = document.createElement('em');

	what3words.innerHTML = msg.createdBy;
	what3words.href = `http://what3words.com/${msg.createdBy}`;
	let day = new Array( "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun" );
	let month = new Array( "January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	dateOfMsg.innerHTML = `${day[msg.createdOn.getDay() - 1]}, ${month[msg.createdOn.getMonth()]}, ${msg.createdOn.getHours()}:${msg.createdOn.getMinutes()} `;
	em.innerHTML = `${msg.expiresOn} mins left`;
	
	let messageWrapper = document.createElement('div');
	messageWrapper.classList.add('message__wrapper');
	
	let message = document.createElement('p');
	let addTime = document.createElement('button');
	addTime.classList.add('BTN5');
	
	message.innerHTML = msg.text;
	addTime.innerHTML = "+5 MIN"

	messageTitle.appendChild(what3words);
	messageTitle.appendChild(dateOfMsg);
	timeLeft.appendChild(em);
	messageTitle.appendChild(timeLeft);
	messageArrowDiv.appendChild(messageWrapper);
	messageArrowDiv.appendChild(messageArrow);
	messageWrapper.appendChild(message);
	messageWrapper.appendChild(addTime);
	messageDiv.appendChild(messageTitle);
	messageDiv.appendChild(messageArrowDiv);
	document.getElementById('messages').appendChild(messageDiv);
	updateScroll();
}

function updateScroll(){
	var element = document.getElementById("messages");
	element.scrollTop = element.scrollHeight;
}

submit.addEventListener('click', (e) => {
	e.preventDefault();
	e.stopPropagation();
	let text = message.value
	if (!text || text.length < 5){
		alert('message to short!!')
	} else {
		const newMessage = new Message('buzz.coverage.rank', true, text);
		// sendMessageToServer(newMessage)
		displayMessage(newMessage);
	}
});

let topFavoStar = document.createElement('i'); 
topFavoStar.classList.add(`far`, `fa-star`); 
document.getElementById('starImage').appendChild(topFavoStar);

topFavoStar.addEventListener('click', () => {
	if(topFavoStar.classList.contains('fas')) {
		topFavoStar.classList.remove('fas', 'fa-star');
		topFavoStar.classList.add('far', 'fa-star');
	} else {
		topFavoStar.classList.remove('far', 'fa-star');
		topFavoStar.classList.add('fas', 'fa-star');
	}
});

//Show selected Tab in Channel Pannel
function selectedTab(button) {
	let tab1 = document.getElementById('Tab1');
	let tab2 = document.getElementById('Tab2');
	let tab3 = document.getElementById('Tab3');

	if(button == 'tab1') {
		tab1.classList.add('tabBtn__active');
		tab2.classList.remove('tabBtn__active');
		tab3.classList.remove('tabBtn__active');
	} else if(button == 'tab2') {
		tab1.classList.remove('tabBtn__active');
		tab2.classList.add('tabBtn__active');
		tab3.classList.remove('tabBtn__active');
	} else if (button == 'tab3') {
		tab1.classList.remove('tabBtn__active');
		tab2.classList.remove('tabBtn__active');
		tab3.classList.add('tabBtn__active');
	}
}

// Toggle Emoji Button
function toggleEmoji() {
	let emojis = document.getElementById('emojis');

	if(emojis.style.display == 'none'){
		emojis.style.display = 'block';
	} else {
		emojis.style.display = 'none';
	}
}
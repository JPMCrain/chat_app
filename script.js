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
	//getLocation();
	updateScroll();
}

//Channel pannel set up
let addChannel = document.getElementById('addBTN');
let createChannel = document.getElementById('createChannel');
let channelList = document.getElementById('channelList');
let channelName = document.getElementById('channelName');
let channelLocation = document.getElementById('channelLocation');
let starImage = document.getElementById('starImage');
let headerDiv = document.createElement('div');
headerDiv.classList.add('addChannelInput__wrapper');
let inputDiv = document.createElement('div');
inputDiv.classList.add('addChannel');
let abortDiv = document.createElement('div');
abortDiv.classList.add('addChannel');
let input = document.createElement('input');
input.classList.add('addChannelInput');
let abort = document.createElement('button');
abort.classList.add('abortBTN');
let create = document.createElement('button');
create.classList.add('createBTN');

const channels = {};

// new channel constructor object
function NewChannel(channelId, channelName){
	this.channelId = channelId
	this.channelName = channelName;
	this.location = "varied.groom.outliving"
	this.favourite = false;
	this.date = new Date();
	this.messages = [];
}

// display the add channel input section
function displayAddChannelInput() {
	input.placeholder = '#Channel Name?';
	input.id = "newChannelInput";
	input.minLength = 1;
	input.maxLength = 25;
	abort.innerHTML = 'x ABORT';
	create.innerHTML = 'CREATE';
	
	inputDiv.appendChild(input);
	abortDiv.appendChild(abort);
	createChannel.style.display = 'flex';
	createChannel.appendChild(create);
	headerDiv.appendChild(inputDiv);
	headerDiv.appendChild(abortDiv);
	document.getElementById('header2').appendChild(headerDiv);
}

// remove channel input section
function removeAddChannelInput() {
	input.value = "";
	createChannel.style.display = 'none';
	createChannel.removeChild(create);
	document.getElementById('header2').removeChild(headerDiv);
}

// create new channel
create.addEventListener('click', (e) => {
	e.preventDefault();
	e.stopPropagation();
	var channelId = Object.keys(channels).length + 1;
	let newChannelName = `#${document.getElementById('newChannelInput').value}`;
	let newChannel = new NewChannel(channelId, newChannelName);
	channels[channelId] = newChannel 
	displayChannelList();
	removeAddChannelInput();
	addChannel.classList.remove('addBTN__active');
	addChannel.classList.add('addBTN');
});

// abort removing channel input section
abort.addEventListener('click', () => {
	removeAddChannelInput();
	addChannel.classList.remove('addBTN__active');
	addChannel.classList.add('addBTN');
});

// display channel input section and abort removing channel input section
addChannel.addEventListener('click', () => {
	if(addChannel.classList.contains('addBTN')){
		addChannel.classList.remove('addBTN');
		addChannel.classList.add('addBTN__active');
		channelName.innerHTML = "";
		channelLocation.innerHTML = "";
		displayAddChannelInput();
	}else{
		addChannel.classList.remove('addBTN__active');
		addChannel.classList.add('addBTN');
		removeAddChannelInput();
	}	
});

// display channel list and refresh 
function displayChannelList() {
	channelList.innerHTML = null; 

	for (const channelId in channels) {
		let channel = channels[channelId];
		let name = channel.channelName;
		let location = channel.location;
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
		channelName.innerHTML = name;
		channelLocation.innerHTML = `by: ${location}`;
		channelLocation.href = `http://what3words.com/${location}`;
		
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
				channel.favourite = false;
			}else{
				favStarImage.classList.remove('far', 'fa-star');
				favStarImage.classList.add('fas', 'fa-star');
				channel.favourite = true;
			}
		});

		h2.appendChild(a);
		li.appendChild(h2);
		imageDiv.appendChild(favStarImage);
		imageDiv.appendChild(image2);
		li.appendChild(imageDiv);
		channelList.appendChild(li);
	}
} 

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

let tab1 = document.getElementById('Tab1');
let tab2 = document.getElementById('Tab2');
let tab3 = document.getElementById('Tab3');
//Show selected Tab in Channel Pannel
function selectedTab(button) {
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
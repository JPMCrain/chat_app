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
let currentChannelId;

// new channel constructor object
function NewChannel(channelId, channelName) {
	this.channelId = channelId
	this.channelName = channelName;
	this.location = "varied.groom.outliving"
	this.favourite = false;
	this.date = new Date();
	this.messages = {};
	this.messagesCount = 0;
	this.timerIntervalIds = {};
}

// display the add channel input section
function displayAddChannelInput() {
	addChannel.classList.remove('addBTN');
	addChannel.classList.add('addBTN__active');
	channelName.innerHTML = "";
	channelLocation.innerHTML = "";
	starImage.innerHTML = "";

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
	addChannel.classList.remove('addBTN__active');
	addChannel.classList.add('addBTN');
	input.value = "";
	createChannel.style.display = 'none';
	if(createChannel.getElementsByClassName('createBTN').length > 0) {
		createChannel.removeChild(create);	
	}
	const header2 = document.getElementById('header2');
	if(header2.getElementsByClassName('addChannelInput__wrapper').length > 0) { 
		header2.removeChild(headerDiv);
	}
	
}

function clearSelectedChannel() {
	clearChannelMessageIntervals();
	currentChannelId = null;
	allMessages.innerHTML = null;
	for (const li of channelList.getElementsByTagName('li')) {
		li.classList.remove('selected');
	}
}

function clearChannelMessageIntervals() {
	if(!currentChannelId) {
		return
	}
	const channel = channels[currentChannelId];
	Object.values(channel.timerIntervalIds).forEach((timerIntervalId) => {
		try {
			clearInterval(timerIntervalId)
			console.log(`Cleared interval ${timerIntervalId}!`);
		} catch(err) {
			console.log(`Failed to clear interval ${timerIntervalId}!`);
			console.log(err);
		}
	});
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
	if (addChannel.classList.contains('addBTN')) {
		clearSelectedChannel();		
		displayAddChannelInput();
	} else {
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
		imageDiv.classList.add('channel__images');

		let favStarImage = document.createElement('i');
		favStarImage.classList.add(`far`, `fa-star`);
		favStarImage.id = channel.channelId;
		console.log(favStarImage.id);
		let image2 = document.createElement('i');
		image2.classList.add(`fas`, `fa-angle-right`);

		a.classList.add('a');

		a.innerHTML = name;
		a.href = '#';

		li.addEventListener('click', () => {
			channelName.innerHTML = name;
			channelLocation.innerHTML = `by: ${location}`;
			channelLocation.href = `http://what3words.com/${location}`;
			starImage.innerHTML = null;
			const favStar = imageDiv.childNodes[1].cloneNode(true);
			starImage.appendChild(favStar);
			
			removeAddChannelInput();
			clearSelectedChannel();

			li.classList.add('selected');

			displayAllMessage(channel.messages);

			currentChannelId = channel.channelId;
		});

		favStarImage.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			favStarImage.classList.remove('fas', 'fa-star', 'far');
			let classes = ['fa-star'];
			if (channel.favourite) {
				classes.push('far');
				channel.favourite = false;
			} else {
				classes.push('fas');
				channel.favourite = true;
			}
			console.log(channel);
			favStarImage.classList.add(...classes);
			if (li.classList.contains('selected')) {
				const currentChannelFavStar = starImage.firstChild;
				currentChannelFavStar.classList.remove('fas', 'fa-star', 'far');
				currentChannelFavStar.classList.add(...classes);
			}
		});
		
		let messageCount = document.createElement('div');
		messageCount.classList.add('messageCount');
		let count = document.createElement('p');
		count.id = "messageCount";
		count.innerHTML = channel.messagesCount;

		h2.appendChild(a);
		li.appendChild(h2);
		messageCount.appendChild(count);
		imageDiv.appendChild(messageCount);
		imageDiv.appendChild(favStarImage);
		imageDiv.appendChild(image2);
		li.appendChild(imageDiv);
		channelList.appendChild(li);
	}
}

//Subit a message
let message = document.getElementById('messageInput');
let submit = document.getElementById('messageSubit');

function Message(messageId, createdBy, own, text, position) {
	this.messageId = messageId;
	this.createdBy = createdBy;
	this.createdOn = new Date();
	this.expiresOn = 15;
	this.text = text;
	this.own = own;

	if (position) {
		this.longitude = position.coords.longitude;
		this.latitude = position.coords.latitude;
	}
}

// function sendMessageToServer(message) {
// 	// TODO later on
// }
let allMessages = document.getElementById('messages');

function displayAllMessage(messages) {
	allMessages.innerHTML = null;
	for (const messageId in messages) {
		let msg = messages[messageId];
		let messageDiv = document.createElement('div');
		messageDiv.id = `message_${msg.messageId}`;
		let messageArrowDiv = document.createElement('div');
		let messageArrow = document.createElement('div');
		if (!msg.own) {
			messageDiv.classList.add('message');
			messageArrowDiv.classList.add('other__message');
			messageArrow.classList.add('arrow-left');
		} else {
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
		let day = new Array("Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat");
		let month = new Array("January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
		dateOfMsg.innerHTML = `${day[msg.createdOn.getDay()]}, ${month[msg.createdOn.getMonth()]}, ${msg.createdOn.getHours()}:${msg.createdOn.getMinutes()} `;
		let expiresOn = msg.expiresOn;
		em.innerHTML = `${expiresOn} mins left`;
		em.id = `timer_${msg.messageId}`;
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
		allMessages.appendChild(messageDiv);
	};
	updateScroll();
}

function updateScroll() {
	var element = document.getElementById("messages");
	element.scrollTop = element.scrollHeight;
}

function createNewMessage(e){
	e.preventDefault();
	e.stopPropagation();
	let text = message.value
	if (!text || text.length < 1) {
		alert('message to short!!')
	} else if(currentChannelId) {
		let channel = channels[currentChannelId];
		let location = channel.location;
		let messages = channel.messages;
		channel.messagesCount = Object.keys(messages).length + 1;
		let messageId = channel.messagesCount;
		const newMessage = new Message(messageId, location, true, text);
		// sendMessageToServer(newMessage)
		messages[messageId] = newMessage
		displayAllMessage(messages);
		updateMessageCount(messageId);
		const handleUpdateMessageFunc = handleUpdateMessage.bind(null, currentChannelId, messageId);
		const timerIntervalId = setInterval(handleUpdateMessageFunc, 1000);
		channel.timerIntervalIds[messageId] = timerIntervalId
	}
	message.value = "";
}

function handleUpdateMessage(channelId, messageId) {
	const channel = channels[channelId];
	const message = channel.messages[messageId];
	let count = message.expiresOn;
	if(message.expiresOn <= 0) {
		clearInterval(channel.timerIntervalIds[messageId])
		delete channel.timerIntervalIds[messageId]; 
		delete channel.messages[messageId];		
		const messageDiv = document.getElementById(`message_${messageId}`);
		console.log(messageDiv);
		if(messageDiv) {
			allMessages.removeChild(messageDiv);
		}
	} else {
		console.log(count);
		--count;
		const timer = document.getElementById(`timer_${messageId}`);
		timer.innerHTML = `${count} mins left`;
		message.expiresOn = count;
	}
}

submit.addEventListener('click', createNewMessage);

message.addEventListener("keydown", (event) => {
	if (event.keyCode === 13) {
			createNewMessage(event);
	}
}, false);

let tab1 = document.getElementById('Tab1');
let tab2 = document.getElementById('Tab2');
let tab3 = document.getElementById('Tab3');
//Show selected Tab in Channel Pannel
function selectedTab(button) {
	if (button == 'tab1') {
		tab1.classList.add('tabBtn__active');
		tab2.classList.remove('tabBtn__active');
		tab3.classList.remove('tabBtn__active');
	} else if (button == 'tab2') {
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

	if (emojis.style.display == 'none') {
		emojis.style.display = 'block';
	} else {
		emojis.style.display = 'none';
	}
}

function updateMessageCount(messageId){
	document.getElementById('messageCount').innerHTML = null;
	document.getElementById('messageCount').innerHTML = messageId;
}

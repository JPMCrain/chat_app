"use strict";
let userPosition;
let serverURL = 'http://localhost:3001';

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			userPosition = position;
		}, showError(error));
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
}

function showError(error) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			console.log("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			console.log("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			console.log("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			console.log("An unknown error occurred.");
			break;
	}
}
let serverChannels;

function getChannels() {
	fetch(`${serverURL}/channel/list`, { mode: 'cors' })
		.then(function (response) {
			return response.text();
		}).then(function (text) {
			serverChannels = JSON.parse(text);
			delete serverChannels.count
			console.log(serverChannels);
			displayChannelList(serverChannels);
			return serverChannels;
		})
		.catch(function (error) {
			console.log('Request failed', error)
		});
}

window.onload = () => {
	//getLocation()
	getChannels();
	createEmojiSection();
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
	if (createChannel.getElementsByClassName('createBTN').length > 0) {
		createChannel.removeChild(create);
	}
	const header2 = document.getElementById('header2');
	if (header2.getElementsByClassName('addChannelInput__wrapper').length > 0) {
		header2.removeChild(headerDiv);
	}

}

function clearSelectedChannel() {
	clearChannelMessageTimers();
	currentChannelId = null;
	allMessages.innerHTML = "";
	for (let li of channelList.querySelectorAll('li')) {
		li.classList.remove('selected');
	}
}

function clearChannelMessageTimers() {
	if (!currentChannelId) {
		return
	}
	const channel = serverChannels[currentChannelId];
	Object.values(channel.timerIntervalIds).forEach((timerIntervalId) => {
		try {
			clearInterval(timerIntervalId);
		} catch (err) {
			console.log(`Failed to clear interval ${timerIntervalId}!`);
			console.log(err);
		}
	});
}

function sendChannelToServer(channel) {
	let data = channel;
	const method = {
		method: 'POST', // or 'PUT'
		body: JSON.stringify(data), // channel {object}!
		headers: {
			'Content-Type': 'application/json'
		}
	}

	fetch(`${serverURL}/channel`, method)
		.then(res => {
			return res.text()
		})
		.then((text) => {
			console.log(text);
		})
		.catch((err) => {
			console.log(err);
		});
}

// create new channel
create.addEventListener('click', (e) => {
	e.preventDefault();
	e.stopPropagation();
	var channelId = Object.keys(serverChannels).length + 1;
	let newChannelName = `#${document.getElementById('newChannelInput').value}`;
	let newChannel = new NewChannel(channelId, newChannelName);
	serverChannels[channelId] = newChannel
	sendChannelToServer(newChannel);
	displayChannelList(serverChannels);
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
	newChannelTab.classList.remove('tabBtn__active');
	trendingTab.classList.remove('tabBtn__active');
	favouritesTab.classList.remove('tabBtn__active');
	hideMessageElements();
	if (addChannel.classList.contains('addBTN')) {
		clearSelectedChannel();
		displayAddChannelInput();
	} else {
		removeAddChannelInput();
	}
});

function getChannelMessages(channelId){
	fetch(`${serverURL}/channel/message/${channelId}`, { mode: 'cors' })
	.then((res) => {
		return res.text()
	})
	.then((text) => {
		let channel = serverChannels[channelId];
		let channelMessages = JSON.parse(text);
		delete channelMessages.count
		let channelMessagesArray = Object.values(channelMessages);
		channelMessagesArray.forEach((prop) => {
			let createdOn = new Date(prop.createdOn);
			prop.createdOn = createdOn;
			let expiresOn = new Date(prop.expiresOn);
			prop.expiresOn = expiresOn;
		});
		let channelMessagesRefreshed = {};
		for (let i = 0; i < channelMessagesArray.length; ++i) {
			channelMessagesRefreshed[i] = channelMessagesArray[i];
		}
		channel.messages = channelMessagesRefreshed;
		displayAllMessages(channel.channelId);
	})
	.catch(err => console.log(err));
}

// display channel list and refresh 
function displayChannelList(serverChannels) {
	channelList.innerHTML = "";
	for (const channelId in serverChannels) {
		let channel = serverChannels[channelId];
		let name = channel.channelName;
		let location = channel.location;
		let li = document.createElement('li');
		let h2 = document.createElement('h2');
		let a = document.createElement('div');

		let imageDiv = document.createElement('div');
		imageDiv.classList.add('channel__images');

		let favStarImage = document.createElement('i');
		favStarImage.id = channel.channelId;
		if (!channel.favourite) {
			favStarImage.classList.add(`far`, `fa-star`);
		} else {
			favStarImage.classList.add(`fas`, `fa-star`);
		}

		let image2 = document.createElement('i');
		image2.classList.add(`fas`, `fa-angle-right`);

		a.classList.add('a');

		a.innerHTML = name;
		a.href = '#';

		li.addEventListener('click', onChannelItemClick);

		function onChannelItemClick(e) {
			e.preventDefault();
			e.stopPropagation();
			channelName.innerHTML = name;
			channelLocation.innerHTML = `by: ${location}`;
			channelLocation.href = `http://what3words.com/${location}`;
			starImage.innerHTML = "";
			const favStar = imageDiv.childNodes[1].cloneNode(true);
			starImage.appendChild(favStar);

			unhideMessageElements();

			removeAddChannelInput();
			clearSelectedChannel();

			li.classList.add('selected');
			getChannelMessages(channel.channelId);
			currentChannelId = channel.channelId;
		}

		favStarImage.addEventListener('click', checkForFavStarImage);

		function checkForFavStarImage(e) {
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
			favStarImage.classList.add(...classes);
			if (li.classList.contains('selected')) {
				const currentChannelFavStar = starImage.firstChild;
				currentChannelFavStar.classList.remove('fas', 'fa-star', 'far');
				currentChannelFavStar.classList.add(...classes);
			}
		}

		let messageCount = document.createElement('div');
		messageCount.classList.add('messageCount');
		let count = document.createElement('p');
		count.id = `messageCount_${channel.channelId}`;
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

let newChannelTab = document.getElementById('Tab1');
let trendingTab = document.getElementById('Tab2');
let favouritesTab = document.getElementById('Tab3');

function displayTrendingChannelList() {
	newChannelTab.classList.remove('tabBtn__active');
	trendingTab.classList.add('tabBtn__active');
	favouritesTab.classList.remove('tabBtn__active');
	let trendingArray = Object.values(serverChannels);
	trendingArray.sort((count1, count2) => {
		return count2.messagesCount - count1.messagesCount;
	});
	let trendingChannels = {};
	for (let i = 0; i < trendingArray.length; ++i) {
		trendingChannels[i] = trendingArray[i];
	}
	displayChannelList(trendingChannels);
}

function displayFavoChannelList() {
	newChannelTab.classList.remove('tabBtn__active');
	trendingTab.classList.remove('tabBtn__active');
	favouritesTab.classList.add('tabBtn__active');
	let favoArray = Object.values(serverChannels);
	function filterByFavourites(item) {
		if (item.favourite === true) {
			return true;
		}
	}
	let favoArraytrue = favoArray.filter(filterByFavourites);
	let favoChannels = {};
	for (let i = 0; i < favoArraytrue.length; ++i) {
		favoChannels[i] = favoArraytrue[i];
	}
	displayChannelList(favoChannels);
}

function displayNewChannelList() {
	newChannelTab.classList.add('tabBtn__active');
	trendingTab.classList.remove('tabBtn__active');
	favouritesTab.classList.remove('tabBtn__active');
	let newArray = Object.values(serverChannels);
	newArray.sort((date1, date2) => {
		return date2.date.getTime() - date1.date.getTime();
	});
	let newChannels = {};
	for (let i = 0; i < newArray.length; ++i) {
		newChannels[i] = newArray[i];
	}
	displayChannelList(newChannels);
}

newChannelTab.addEventListener('click', displayNewChannelList);

trendingTab.addEventListener('click', displayTrendingChannelList);

favouritesTab.addEventListener('click', displayFavoChannelList);

//create emoji list && and section
let emojiSection = document.getElementById('emoji__section');
let emojis = document.getElementById('emojis');

let emojiList = [
	[128513, 128591], [9986, 10160], [128640, 128704]
];

function createEmojiSection() {
	for (let i = 0; i < emojiList.length; i++) {
		let list = emojiList[i];
		for (let x = list[0]; x < list[1]; x++) {
			let emoji = document.createElement('div');
			emoji.classList.add('emoji');
			emoji.id = "emojis";
			emoji.value = x;
			emoji.addEventListener('click', () => {
				let messageString = messageInput.value;
				let startPosition = messageInput.selectionStart;
				let emojiString = emoji.innerHTML
				let cursorIndex = startPosition;
				let startString = messageString.slice(0, cursorIndex);
				let endString = messageString.slice(cursorIndex);

				messageInput.value = startString + emojiString + endString

				toggleEmojiSection();
			});
			emoji.innerHTML = `&#${x};`;
			emojis.appendChild(emoji);
		}
	}
	emojiSection.appendChild(emojis);
}

function toggleEmojiSection() {
	if (emojis.style.display == 'flex') {
		emojis.style.display = 'none';
	} else {
		emojis.style.display = 'flex';
	}
}

//Subit a message
let messageInput = document.getElementById('messageInput');
let submit = document.getElementById('messageSubit');
let emojiButton = document.getElementById('emojis__button');

emojiButton.addEventListener('click', toggleEmojiSection);

function Message(messageId, createdBy, own, text, position) {
	this.messageId = messageId;
	this.createdBy = createdBy;
	this.createdOn = new Date();
	this.expiresOn = new Date(this.createdOn);
	this.expiresOn.setMinutes(this.expiresOn.getMinutes() + 5);
	this.text = text;
	this.own = own;

	if (position) {
		this.longitude = position.coords.longitude;
		this.latitude = position.coords.latitude;
	}
}

function hideMessageElements() {
	messageInput.style.display = 'none';
	submit.style.display = 'none';
	emojiButton.style.display = 'none';
}

function unhideMessageElements() {
	messageInput.style.display = 'block';
	submit.style.display = 'block';
	emojiButton.style.display = 'block';
}

let allMessages = document.getElementById('messages');

function displayAllMessages(channelId) {
	clearChannelMessageTimers();
	const channel = serverChannels[channelId];
	const messages = channel.messages;
	allMessages.innerHTML = "";
	for (const messageId in messages) {
		let message = messages[messageId];
		allMessages.appendChild(createMessageElement(message, channelId));
		startMessageExpirationTimer(channelId, messageId);
	};
	updateScroll();
}

function getMessageAuthorElement(message) {
	let what3words = document.createElement('h3');
	what3words.classList.add('h3Hover');
	what3words.innerHTML = "JAMES";
	// what3words.href = `http://what3words.com/${message.createdBy}`;
	return what3words;
}

function getMessageCreatedDateElement(message) {
	let day = new Array("Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat");
	let month = new Array("January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	let dateOfMsg = document.createElement('h3');
	dateOfMsg.innerHTML = `${day[message.createdOn.getDay()]}, ${month[message.createdOn.getMonth()]}, ${message.createdOn.getHours()}:${message.createdOn.getMinutes()} `;
	return dateOfMsg;
}

function getMessageTimeLeftElement(message) {
	let timeLeft = document.createElement('h3');
	let em = document.createElement('em');

	em.innerHTML = `${getExpiresOnMinutesLeft(message)} mins left`;
	em.id = `timer_${message.messageId}`;
	timeLeft.appendChild(em);
	return timeLeft;
}

function getMessageTextElement(message) {
	let messageText = document.createElement('p');
	messageText.innerHTML = message.text;
	return messageText;
}

function getMessageAddToTimer(message) {
	let addTime = document.createElement('button');
	addTime.classList.add('BTN5');
	addTime.addEventListener('click', () => {
		message.expiresOn.setMinutes(message.expiresOn.getMinutes() + 5);
		document.getElementById(`timer_${message.messageId}`).innerHTML = `${getExpiresOnMinutesLeft(message)} mins left`;
	});

	addTime.innerHTML = "+5 MIN"
	return addTime;
}

function getMessageTitle(message) {
	let messageTitle = document.createElement('div');
	messageTitle.classList.add('message__title');
	messageTitle.appendChild(getMessageAuthorElement(message));
	messageTitle.appendChild(getMessageCreatedDateElement(message));
	messageTitle.appendChild(getMessageTimeLeftElement(message));
	return messageTitle;
}

function createMessageElement(message) {
	let messageArrowDiv = document.createElement('div');
	let messageArrow = document.createElement('div');
	let messageWrapper = document.createElement('div');
	messageWrapper.classList.add('message__wrapper');
	let messageDiv = document.createElement('div');
	messageDiv.id = `message_${message.messageId}`;
	if (!message.own) {
		messageDiv.classList.add('message');
		messageArrowDiv.classList.add('other__message');
		messageArrow.classList.add('arrow-left');
	} else {
		messageDiv.classList.add('first__message');
		messageArrowDiv.classList.add('own__message');
		messageArrow.classList.add('arrow-right');
	}

	messageArrowDiv.appendChild(messageWrapper);
	messageArrowDiv.appendChild(messageArrow);
	messageWrapper.appendChild(getMessageTextElement(message));
	messageWrapper.appendChild(getMessageAddToTimer(message));
	messageDiv.appendChild(getMessageTitle(message));
	messageDiv.appendChild(messageArrowDiv);
	return messageDiv;
}

function startMessageExpirationTimer(channelId, messageId) {
	const handleUpdateMessageFunc = handleUpdateMessage.bind(null, channelId, messageId);
	const timerIntervalId = setInterval(handleUpdateMessageFunc, 1000);
	const channel = serverChannels[channelId];
	channel.timerIntervalIds[messageId] = timerIntervalId;
}

function handleUpdateMessage(channelId, messageId) {
	const channel = serverChannels[channelId];
	const message = channel.messages[messageId];
	if (isMessageExpired(message)) {
		clearInterval(channel.timerIntervalIds[messageId])
		delete channel.timerIntervalIds[messageId];
		delete channel.messages[messageId];
		const messageDiv = document.getElementById(`message_${messageId}`);
		if (messageDiv) {
			allMessages.removeChild(messageDiv);
		}
		decreaseMessageCount(channelId);
	} else {
		const timer = document.getElementById(`timer_${messageId}`);
		timer.innerHTML = `${getExpiresOnMinutesLeft(message)} mins left`;
	}
}

function getExpiresOnMinutesLeft(message) {
	const now = new Date();
	return Math.round((message.expiresOn - now) / (60 * 1000))
}

function isMessageExpired(message) {
	const now = new Date();
	const expiresOn = message.expiresOn;
	return now.getTime() >= expiresOn.getTime();
}

function updateScroll() {
	var element = document.getElementById("messages");
	element.scrollTop = element.scrollHeight;
}

function sendMessageToServer(message, channelId) {
	let data = message;
	const method = {
		method: 'POST', // or 'PUT'
		body: JSON.stringify({
			message: data,
			channelId: channelId,
		}), // message {object}!
		headers: {
			'Content-Type': 'application/json'
		}
	};
	console.log(method.body.message);
	console.log(method.body.currentChannelId);
	fetch(`${serverURL}/channel/message`, method)
		.then(function (res) {
			return res.text()
		})
		.then(function (text) {
			console.log(text);
		})
		.catch(function (err) {
			console.log(err);
		});
}

function createNewMessage(e) {
	e.preventDefault();
	e.stopPropagation();
	let text = messageInput.value
	if (!text || text.length < 1) {
		alert('message to short!!')
	} else if (currentChannelId) {
		let channel = serverChannels[currentChannelId];
		let location = channel.location;
		let messages = channel.messages;
		channel.messagesCount = Object.keys(messages).length + 1;
		let messageId = channel.messagesCount;
		const newMessage = new Message(messageId, location, true, text);
		sendMessageToServer(newMessage, currentChannelId);
		messages[messageId] = newMessage;
		displayAllMessages(channel.channelId);
		increaseMessageCount(currentChannelId);
	}
	messageInput.value = "";
}

function increaseMessageCount(channelId) {
	let channel = serverChannels[channelId];
	let count = channel.messagesCount - 1;
	count++;
	channel.messagesCount = count;
	const messageCount = document.getElementById(`messageCount_${channel.channelId}`);
	messageCount.innerHTML = '';
	messageCount.innerHTML = channel.messagesCount;
}

function decreaseMessageCount(channelId) {
	let channel = serverChannels[channelId];
	let count = channel.messagesCount;
	while (count > 0) {
		--count
	}
	channel.messagesCount = count;
	const messageCount = document.getElementById(`messageCount_${channel.channelId}`);
	messageCount.innerHTML = "";
	messageCount.innerHTML = channel.messagesCount;
}

submit.addEventListener('click', createNewMessage);

messageInput.addEventListener("keydown", (event) => {
	if (event.keyCode === 13) {
		createNewMessage(event);
	}
}, false);


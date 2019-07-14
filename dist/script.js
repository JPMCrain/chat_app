"use strict";

var userPosition;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
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

window.onload = function () {
  //getLocation()
  displayChannelList(channels);
  createEmojiSection();
  updateScroll();
}; //Channel pannel set up


var addChannel = document.getElementById('addBTN');
var createChannel = document.getElementById('createChannel');
var channelList = document.getElementById('channelList');
var channelName = document.getElementById('channelName');
var channelLocation = document.getElementById('channelLocation');
var starImage = document.getElementById('starImage');
var headerDiv = document.createElement('div');
headerDiv.classList.add('addChannelInput__wrapper');
var inputDiv = document.createElement('div');
inputDiv.classList.add('addChannel');
var abortDiv = document.createElement('div');
abortDiv.classList.add('addChannel');
var input = document.createElement('input');
input.classList.add('addChannelInput');
var abort = document.createElement('button');
abort.classList.add('abortBTN');
var create = document.createElement('button');
create.classList.add('createBTN');

function addDummyMessages(testChannel, amount) {
  var messageCount = Object.keys(testChannel.messages).length;

  for (var i = 0; i < amount; i++) {
    testChannel.messagesCount = messageCount + i;
    var messageId = testChannel.messagesCount;
    var testMessage = new Message(messageId, location, true, "Fake text " + messageId);
    testChannel.messages[messageId] = testMessage;
  }
}

function getDummyChannels() {
  var channels = {};
  var testChannel = new NewChannel(1, "Test channel");
  addDummyMessages(testChannel, 4);
  channels[testChannel.channelId] = testChannel;
  testChannel = new NewChannel(2, "Test channel 2");
  addDummyMessages(testChannel, 3);
  channels[testChannel.channelId] = testChannel;
  testChannel = new NewChannel(3, "Test channel 3");
  addDummyMessages(testChannel, 8);
  channels[testChannel.channelId] = testChannel;
  return channels;
}

var channels = getDummyChannels();
var currentChannelId; // new channel constructor object

function NewChannel(channelId, channelName) {
  this.channelId = channelId;
  this.channelName = channelName;
  this.location = "varied.groom.outliving";
  this.favourite = false;
  this.date = new Date();
  this.messages = {};
  this.messagesCount = 0;
  this.timerIntervalIds = {};
} // display the add channel input section


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
} // remove channel input section


function removeAddChannelInput() {
  addChannel.classList.remove('addBTN__active');
  addChannel.classList.add('addBTN');
  input.value = "";
  createChannel.style.display = 'none';

  if (createChannel.getElementsByClassName('createBTN').length > 0) {
    createChannel.removeChild(create);
  }

  var header2 = document.getElementById('header2');

  if (header2.getElementsByClassName('addChannelInput__wrapper').length > 0) {
    header2.removeChild(headerDiv);
  }
}

function clearSelectedChannel() {
  clearChannelMessageTimers();
  currentChannelId = null;
  allMessages.innerHTML = "";
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = channelList.querySelectorAll('li')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var li = _step.value;
      li.classList.remove('selected');
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function clearChannelMessageTimers() {
  if (!currentChannelId) {
    return;
  }

  var channel = channels[currentChannelId];
  Object.values(channel.timerIntervalIds).forEach(function (timerIntervalId) {
    try {
      clearInterval(timerIntervalId);
    } catch (err) {
      console.log("Failed to clear interval ".concat(timerIntervalId, "!"));
      console.log(err);
    }
  });
} // create new channel


create.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  var channelId = Object.keys(channels).length + 1;
  var newChannelName = "#".concat(document.getElementById('newChannelInput').value);
  var newChannel = new NewChannel(channelId, newChannelName);
  channels[channelId] = newChannel;
  displayChannelList(channels);
  removeAddChannelInput();
  addChannel.classList.remove('addBTN__active');
  addChannel.classList.add('addBTN');
}); // abort removing channel input section

abort.addEventListener('click', function () {
  removeAddChannelInput();
  addChannel.classList.remove('addBTN__active');
  addChannel.classList.add('addBTN');
}); // display channel input section and abort removing channel input section

addChannel.addEventListener('click', function () {
  newChannelTab.classList.remove('tabBtn__active');
  trendingTab.classList.remove('tabBtn__active');
  favouritesTab.classList.remove('tabBtn__active');

  if (addChannel.classList.contains('addBTN')) {
    clearSelectedChannel();
    displayAddChannelInput();
  } else {
    removeAddChannelInput();
  }
}); // display channel list and refresh 

function displayChannelList(channels) {
  channelList.innerHTML = "";

  var _loop = function _loop(channelId) {
    var channel = channels[channelId];
    var name = channel.channelName;
    var location = channel.location;
    var li = document.createElement('li');
    var h2 = document.createElement('h2');
    var a = document.createElement('div');
    var imageDiv = document.createElement('div');
    imageDiv.classList.add('channel__images');
    var favStarImage = document.createElement('i');
    favStarImage.id = channel.channelId;

    if (!channel.favourite) {
      favStarImage.classList.add("far", "fa-star");
    } else {
      favStarImage.classList.add("fas", "fa-star");
    }

    var image2 = document.createElement('i');
    image2.classList.add("fas", "fa-angle-right");
    a.classList.add('a');
    a.innerHTML = name;
    a.href = '#';
    li.addEventListener('click', onChannelItemClick);

    function onChannelItemClick(e) {
      e.preventDefault();
      e.stopPropagation();
      channelName.innerHTML = name;
      channelLocation.innerHTML = "by: ".concat(location);
      channelLocation.href = "http://what3words.com/".concat(location);
      starImage.innerHTML = "";
      var favStar = imageDiv.childNodes[1].cloneNode(true);
      starImage.appendChild(favStar);
      removeAddChannelInput();
      clearSelectedChannel();
      li.classList.add('selected');
      displayAllMessages(channel.channelId);
      currentChannelId = channel.channelId;
    }

    favStarImage.addEventListener('click', checkForFavStarImage);

    function checkForFavStarImage(e) {
      var _favStarImage$classLi;

      e.preventDefault();
      e.stopPropagation();
      favStarImage.classList.remove('fas', 'fa-star', 'far');
      var classes = ['fa-star'];

      if (channel.favourite) {
        classes.push('far');
        channel.favourite = false;
      } else {
        classes.push('fas');
        channel.favourite = true;
      }

      (_favStarImage$classLi = favStarImage.classList).add.apply(_favStarImage$classLi, classes);

      if (li.classList.contains('selected')) {
        var _currentChannelFavSta;

        var currentChannelFavStar = starImage.firstChild;
        currentChannelFavStar.classList.remove('fas', 'fa-star', 'far');

        (_currentChannelFavSta = currentChannelFavStar.classList).add.apply(_currentChannelFavSta, classes);
      }
    }

    var messageCount = document.createElement('div');
    messageCount.classList.add('messageCount');
    var count = document.createElement('p');
    count.id = "messageCount_".concat(channel.channelId);
    count.innerHTML = channel.messagesCount;
    h2.appendChild(a);
    li.appendChild(h2);
    messageCount.appendChild(count);
    imageDiv.appendChild(messageCount);
    imageDiv.appendChild(favStarImage);
    imageDiv.appendChild(image2);
    li.appendChild(imageDiv);
    channelList.appendChild(li);
  };

  for (var channelId in channels) {
    _loop(channelId);
  }
}

var newChannelTab = document.getElementById('Tab1');
var trendingTab = document.getElementById('Tab2');
var favouritesTab = document.getElementById('Tab3');

function displayTrendingChannelList() {
  newChannelTab.classList.remove('tabBtn__active');
  trendingTab.classList.add('tabBtn__active');
  favouritesTab.classList.remove('tabBtn__active');
  var trendingArray = Object.values(channels);
  trendingArray.sort(function (count1, count2) {
    return count2.messagesCount - count1.messagesCount;
  });
  var trendingChannels = {};

  for (var i = 0; i < trendingArray.length; ++i) {
    trendingChannels[i] = trendingArray[i];
  }

  displayChannelList(trendingChannels);
}

function displayFavoChannelList() {
  newChannelTab.classList.remove('tabBtn__active');
  trendingTab.classList.remove('tabBtn__active');
  favouritesTab.classList.add('tabBtn__active');
  var favoArray = Object.values(channels);

  function filterByFavourites(item) {
    if (item.favourite === true) {
      return true;
    }
  }

  var favoArraytrue = favoArray.filter(filterByFavourites);
  var favoChannels = {};

  for (var i = 0; i < favoArraytrue.length; ++i) {
    favoChannels[i] = favoArraytrue[i];
  }

  displayChannelList(favoChannels);
}

function displayNewChannelList() {
  newChannelTab.classList.add('tabBtn__active');
  trendingTab.classList.remove('tabBtn__active');
  favouritesTab.classList.remove('tabBtn__active');
  var newArray = Object.values(channels);
  newArray.sort(function (date1, date2) {
    return date2.date.getTime() - date1.date.getTime();
  });
  var newChannels = {};

  for (var i = 0; i < newArray.length; ++i) {
    newChannels[i] = newArray[i];
  }

  displayChannelList(newChannels);
}

newChannelTab.addEventListener('click', displayNewChannelList);
trendingTab.addEventListener('click', displayTrendingChannelList);
favouritesTab.addEventListener('click', displayFavoChannelList); //create emoji list && and section

var emojiSection = document.getElementById('emoji__section');
var emojis = document.getElementById('emojis');
var emojiList = [[128513, 128591], [9986, 10160], [128640, 128704]];

function createEmojiSection() {
  for (var i = 0; i < emojiList.length; i++) {
    var list = emojiList[i];

    var _loop2 = function _loop2(x) {
      var emoji = document.createElement('div');
      emoji.classList.add('emoji');
      emoji.id = "emojis";
      emoji.value = x;
      emoji.addEventListener('click', function () {
        var messageString = messageInput.value;
        var startPosition = messageInput.selectionStart;
        var emojiString = emoji.innerHTML;
        var cursorIndex = startPosition;
        var startString = messageString.slice(0, cursorIndex);
        var endString = messageString.slice(cursorIndex);
        messageInput.value = startString + emojiString + endString;
        toggleEmojiSection();
      });
      emoji.innerHTML = "&#".concat(x, ";");
      emojis.appendChild(emoji);
    };

    for (var x = list[0]; x < list[1]; x++) {
      _loop2(x);
    }
  }

  emojiSection.appendChild(emojis);
}

document.getElementById('emojis__button').addEventListener('click', toggleEmojiSection);

function toggleEmojiSection() {
  if (emojis.style.display == 'flex') {
    emojis.style.display = 'none';
  } else {
    emojis.style.display = 'flex';
  }
} //Subit a message


var messageInput = document.getElementById('messageInput');
var submit = document.getElementById('messageSubit');

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
} // function sendMessageToServer(message) {
// 	// TODO later on
// }


var allMessages = document.getElementById('messages');

function displayAllMessages(channelId) {
  clearChannelMessageTimers();
  var channel = channels[channelId];
  allMessages.innerHTML = "";
  var messages = channel.messages;

  for (var messageId in messages) {
    var message = messages[messageId];
    allMessages.appendChild(createMessageElement(message, channelId));
    startMessageExpirationTimer(channelId, messageId);
  }

  ;
  updateScroll();
}

function getMessageAuthorElement(message) {
  var what3words = document.createElement('h3');
  what3words.classList.add('h3Hover');
  what3words.innerHTML = "JAMES"; // what3words.href = `http://what3words.com/${message.createdBy}`;

  return what3words;
}

function getMessageCreatedDateElement(message) {
  var day = new Array("Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat");
  var month = new Array("January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
  var dateOfMsg = document.createElement('h3');
  dateOfMsg.innerHTML = "".concat(day[message.createdOn.getDay()], ", ").concat(month[message.createdOn.getMonth()], ", ").concat(message.createdOn.getHours(), ":").concat(message.createdOn.getMinutes(), " ");
  return dateOfMsg;
}

function getMessageTimeLeftElement(message) {
  var timeLeft = document.createElement('h3');
  var em = document.createElement('em');
  em.innerHTML = "".concat(getExpiresOnMinutesLeft(message), " mins left");
  em.id = "timer_".concat(message.messageId);
  timeLeft.appendChild(em);
  return timeLeft;
}

function getMessageTextElement(message) {
  var messageText = document.createElement('p');
  messageText.innerHTML = message.text;
  return messageText;
}

function getMessageAddToTimer(message) {
  var addTime = document.createElement('button');
  addTime.classList.add('BTN5');
  addTime.addEventListener('click', function () {
    message.expiresOn.setMinutes(message.expiresOn.getMinutes() + 5);
    document.getElementById("timer_".concat(message.messageId)).innerHTML = "".concat(getExpiresOnMinutesLeft(message), " mins left");
  });
  addTime.innerHTML = "+5 MIN";
  return addTime;
}

function getMessageTitle(message) {
  var messageTitle = document.createElement('div');
  messageTitle.classList.add('message__title');
  messageTitle.appendChild(getMessageAuthorElement(message));
  messageTitle.appendChild(getMessageCreatedDateElement(message));
  messageTitle.appendChild(getMessageTimeLeftElement(message));
  return messageTitle;
}

function createMessageElement(message) {
  var messageArrowDiv = document.createElement('div');
  var messageArrow = document.createElement('div');
  var messageWrapper = document.createElement('div');
  messageWrapper.classList.add('message__wrapper');
  var messageDiv = document.createElement('div');
  messageDiv.id = "message_".concat(message.messageId);

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
  var handleUpdateMessageFunc = handleUpdateMessage.bind(null, channelId, messageId);
  var timerIntervalId = setInterval(handleUpdateMessageFunc, 1000);
  var channel = channels[channelId];
  channel.timerIntervalIds[messageId] = timerIntervalId;
}

function handleUpdateMessage(channelId, messageId) {
  var channel = channels[channelId];
  var message = channel.messages[messageId];

  if (isMessageExpired(message)) {
    clearInterval(channel.timerIntervalIds[messageId]);
    delete channel.timerIntervalIds[messageId];
    delete channel.messages[messageId];
    var messageDiv = document.getElementById("message_".concat(messageId));

    if (messageDiv) {
      allMessages.removeChild(messageDiv);
    }

    decreaseMessageCount(channelId);
  } else {
    var timer = document.getElementById("timer_".concat(messageId));
    timer.innerHTML = "".concat(getExpiresOnMinutesLeft(message), " mins left");
  }
}

function getExpiresOnMinutesLeft(message) {
  var now = new Date();
  return Math.round((message.expiresOn - now) / (60 * 1000));
}

function isMessageExpired(message) {
  var now = new Date();
  var expiresOn = message.expiresOn;
  return now.getTime() >= expiresOn.getTime();
}

function updateScroll() {
  var element = document.getElementById("messages");
  element.scrollTop = element.scrollHeight;
}

function createNewMessage(e) {
  e.preventDefault();
  e.stopPropagation();
  var text = messageInput.value;

  if (!text || text.length < 1) {
    alert('message to short!!');
  } else if (currentChannelId) {
    var channel = channels[currentChannelId];
    var _location = channel.location;
    var messages = channel.messages;
    channel.messagesCount = Object.keys(messages).length + 1;
    var messageId = channel.messagesCount;
    var newMessage = new Message(messageId, _location, true, text); // sendMessageToServer(newMessage)

    messages[messageId] = newMessage;
    displayAllMessages(channel.channelId);
    increaseMessageCount(currentChannelId);
  }

  messageInput.value = "";
}

function increaseMessageCount(channelId) {
  var channel = channels[channelId];
  var count = channel.messagesCount - 1;
  ++count;
  channel.messagesCount = count;
  var messageCount = document.getElementById("messageCount_".concat(channel.channelId));
  messageCount.innerHTML = "";
  messageCount.innerHTML = channel.messagesCount;
}

function decreaseMessageCount(channelId) {
  var channel = channels[channelId];
  var count = channel.messagesCount;
  count--;
  channel.messagesCount = count;
  var messageCount = document.getElementById("messageCount_".concat(channel.channelId));
  messageCount.innerHTML = "";
  messageCount.innerHTML = channel.messagesCount;
}

submit.addEventListener('click', createNewMessage);
messageInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    createNewMessage(event);
  }
}, false);

function hideMessageElements() {}
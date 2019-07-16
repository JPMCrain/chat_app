const express = require('express');
const cors = require('cors');
const fs = require('fs');

const server = express();
const port = 3001;

server.use(cors());
server.use(express.json());

let channelFilePath;

const getChannelListFilePath = () => {
	const filePath = './channel_list.json';
	if(!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, '[]');
	}
	return filePath;
};

const isChannelValid = (channel) => {
	return channel && 
	channel.channelId && 
	channel.channelName &&
	channel.location &&
	channel.favourite &&
	channel.date &&
	channel.messages &&
	channel.messagesCount &&
	channel.timerIntervalIds; 
};

const getChannels = () => {
	const channels = JSON.parse(fs.readFileSync(channelFilePath));
	return channels.filter(isChannelValid);
};

// Create channel
server.post('/channel_list', (req, res) => {
	const channel = req.body;
	if(channel) {
		const channels = JSON.parse(fs.readFileSync(channelFilePath));
		channels.push(channel);
		fs.writeFileSync(channelFilePath, JSON.stringify(channels));
		res.send('Channel is successfully saved');
	} else {
		res.send('Invalid channel');
	}
});

server.post('/channel_list', (req, res) => {
	const message = req.body;
	const channelId = req.body.currentChannelId
	if(message) {
		const channels = JSON.parse(fs.readFileSync(channelFilePath));
		console.log(channels);
		const channel = channels.filter((channel) => {
			channel.channelId == channelId;
		});
		console.log(channel);
		let currentChannelMessage = channel.messages
		currentChannelMessage = message;
		fs.writeFileSync(channelFilePath, JSON.stringify(currentChannelMessage));
		res.send('message is successfully saved');
	} else {
		res.send('Invalid message');
	}
});

// Read channels
server.get('/channel_list', (req, res) => {
	const channels = getChannels();
	res.send(channels);
});






const onOpened = () => {
	channelFilePath = getChannelListFilePath();
	console.log('Server is up and running!');
};

server.listen(port, onOpened);
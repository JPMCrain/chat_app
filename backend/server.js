const express = require('express');
const cors = require('cors');
const fs = require('fs');

const DATA_DIR_PATH = './data'

const server = express();
const port = 3001;

server.use(cors());
server.use(express.json());

let channelFilePath;

const initDataDirPath = () => {
	if(!fs.existsSync(DATA_DIR_PATH)) {
		fs.mkdirSync(DATA_DIR_PATH);
	}
};

const tryCreateFile = (filePath) => {
	if(!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, '{}');
	}
	return filePath;
}

const getChannelListFilePath = () => {
	const filePath = './data/channels.json';
	return tryCreateFile(filePath);
};

const getChannelMessagesListFilePath = (channelId) => {
	const filePath = `./data/channel_messages_${channelId}.json`;
	return tryCreateFile(filePath);
};

const getChannels = () => {
	const channels = JSON.parse(fs.readFileSync(channelFilePath));
	return channels;
};

// Create channel
server.post('/channel', (req, res) => {
	const channel = req.body;
	if(channel) {
		const channels = JSON.parse(fs.readFileSync(channelFilePath));
		const newCount = (channels.count || 0) + 1
		const channelId = newCount;
		channels[channelId] = channel;
		channels.count = newCount;
		fs.writeFileSync(channelFilePath, JSON.stringify(channels));
		res.send('Channel is successfully saved');
	} else {
		res.send('Invalid channel');
	}
});

server.post('/channel/message', (req, res) => {
	const message = req.body.message;
	const channelId = req.body.channelId;
	console.log(`message = ${message}`);
	console.log(`channel ID = ${channelId}`);
	if(!message) { 
		res.send('Invalid message');
		return;
	}
	const messagesFilePath = getChannelMessagesListFilePath(channelId);
	const messages = JSON.parse(fs.readFileSync(messagesFilePath));
	const newCount = (messages.count || 0) + 1
	const messageId = newCount;
	messages[messageId] = message;
	messages.count = newCount;
	fs.writeFileSync(messagesFilePath, JSON.stringify(messages));
	res.send('Message is successfully saved!');
});

// Read channels
server.get('/channel/list', (req, res) => {
	const channels = getChannels();
	res.send(channels);
});

const onOpened = () => {
	initDataDirPath();
	channelFilePath = getChannelListFilePath();
	console.log('Server is up and running!');
};

server.listen(port, onOpened);
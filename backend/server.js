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

const getMessages = (channelId) => {
	const fileUri = `./data/channel_messages_${channelId}.json`;
	if (!fs.existsSync(fileUri)) {
		return {};
	}
	const messages = JSON.parse(fs.readFileSync(fileUri));
	return messages;
};
// Read channels
server.get('/channel/list', (req, res) => {
	const channels = getChannels();
	delete channels.count
	res.send(channels);
});

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

// Read messages
server.get('/channel/message/:channelId', (req, res) => {
	const channelId = req.params.channelId;
	try {
		const messages = getMessages(channelId);
		delete messages.count;
		const validMessages = {} // Not expired
		Object.keys(messages).forEach((key) => {
			const message = messages[key];
			if(!isMessageExpired(new Date(message.expiresOn))) {
				validMessages[key] = message;
			}
		});
		res.json(validMessages);
	} catch(err) {
		res.status(500).json({error: "Failed to get messages."})
	}
});

function isMessageExpired(expiresOn) {
	const now = new Date();
	return now.getTime() >= expiresOn.getTime();
}

server.post('/channel/message', (req, res) => {
	const message = req.body.message;
	const channelId = req.body.channelId;
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



const onOpened = () => {
	initDataDirPath();
	channelFilePath = getChannelListFilePath();
	console.log('Server is up and running!');
};

server.listen(port, onOpened);
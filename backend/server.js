const express = require('express');
const cors = require('cors');
const fs = require('fs');
const uuid = require('uuid/v4');

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










const onOpened = () => {
	channelFilePath = getChannelListFilePath();
	console.log('Server is up and running!');
};

server.listen(port, onOpened);
'use strict';

const {Client, MessageEmbed} = require('discord.js');
//const Bitrix = require('./Bitrix');
const axios = require('axios');

const client = new Client();
const messageEmbed = new MessageEmbed();

const channels = [
	{id: '737549039767388192', name: 'основной', bitrix: '', type: 'chat'},
	{id: '737549324421955616', name: 'echo', bitrix: '122', type: 'user'},
	{id: '737601703427440711', name: 'чат-конченных-людей', bitrix: '968', type: 'chat'},
];

const authors = {
	test: {
		name: 'tester',
		icon: 'https://bitrix2.cdnvideo.ru/b315285/resize_cache/47/ff58db95aecdfa09ae61b51b5fd8f63f/main/c50/c50fc8b187db2c88c872746c4656a47d/123.jpg',
	},
};

client.on('ready', () => {
	// @ts-ignore
	console.log(`Logged in as ${client.user.tag}!`);

	setInterval(function() {
		console.info('Time to check bitrix');

		channels.forEach(channel => {
			if (channel.type === 'chat' && channel.bitrix !== '') {
				console.log('Checking ' + channel.bitrix + ' bitrix analog for ' + channel.name);

				let method = 'im.dialog.messages.get';

				let data = {DIALOG_ID: 'chat' + channel.bitrix};

				const response = axios({
						method: 'POST',
						url: 'https://webclassic.bitrix24.ru/rest/122' + '/' + 'f6ecshxdtphunn6d' + '/' + method,
						data: data,
					},
				).then(data => {

					/**
					 *
					 * @type {BitrixMessage[]}
					 */
					let messages = data.data.result.messages;

					/**
					 *
					 * @type {BitrixUser[]}
					 */
					let users = data.data.result.users;

					let channelId = data.data.result.chat_id;

					// switch (method) {
					// 	case 'im.dialog.messages.get':

					console.log('Looking for unread messages');

					for (let messageCounter = messages.length - 1; messageCounter > 0; messageCounter--) {

						//messages.forEach(message => {
						let message = messages[messageCounter];
						if (message.unread === true) {

							console.log('Unread message found, looking for author');

							/**
							 *
							 * @type {BitrixUser|null}
							 */
							let author = null;

							for (let counter = 0; counter < users.length; counter++) {
								if (users[counter].id === message.author_id) {
									author = users[counter];
								}
							}

							if (author !== null) {
								console.log('Author found: ' + author.name);

								// for(let channelCounter = 0;channelCounter<channels.length;channelCounter++){
								// 	console.log('Looking channel for repost');
								//
								// 	if(channelId===channels[channelCounter]) {
								console.log(author);

// region Отправка дубликата в discord

								const embed = new MessageEmbed()
									// Set the title of the field
									.setAuthor(author.name, author.avatar)
									//.setTitle('SomeUser')
									// Set the color of the embed
									// .setColor(0xff0000)
									// Set the main content of the embed
									.setDescription(message.text);

								// @ts-ignore
								client.channels.cache.get(channel.id).send(embed);

								// endregion

							}

							console.log('Unread message ' + message.text);
						}
					}
					//);
					// 		break;
					// }
					//console.log(data.data);
					//return data.data;
				});
				//
				// let bitrix = new Bitrix(channel);
				//
				// let result = await bitrix.GetChannelMessages(channel.bitrix);
				// console.log('result is', result);
			} else {
				console.log('Skipping ' + channel.bitrix + ' bitrix analog for ' + channel.name);
				// console.log(channel);
			}
		});

	}, 10000);
});

client.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('Pong!');
	}

	// if (msg.content === 'test') {
	// 	client.channels.cache.get(channels.echo.id).send('Text');
	// }

	if (msg.content === 'else') {
		client.channels.cache.get(msg.channel.id).send(msg.channel.name + ' id #' + msg.channel.id);
	}

	if (msg.content === 'another') {
		const embed = new MessageEmbed()
			// Set the title of the field
			.setAuthor(authors.test.name, authors.test.icon)
			//.setTitle('SomeUser')
			// Set the color of the embed
			// .setColor(0xff0000)
			// Set the main content of the embed
			.setDescription('Hello, this is a slick embed!');

		// @ts-ignore
		client.channels.cache.get(channels.echo.id).send(embed);
	}
});

client.login('NzM3NTQ4NDIyNjgwMjgxMjI2.Xx-9fg.8-piL6Y3iq0gRPliGl-rWKLOF2M');
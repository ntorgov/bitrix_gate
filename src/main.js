'use strict';

const {Client, MessageEmbed} = require('discord.js');
const Bitrix = require('./Bitrix');
const axios = require('axios');
const Config = require('./Config');

const client = new Client();
const messageEmbed = new MessageEmbed();

const config = new Config();

client.on('ready', () => {
	// @ts-ignore
	console.log(`Logged in as ${client.user.tag}!`);

	setInterval(function() {
		console.info('Time to check bitrix');

		config.Channels.forEach(channel => {
			if (channel.type === 'chat' && channel.bitrix !== '') {
				console.log('Checking ' + channel.bitrix + ' bitrix analog for ' + channel.name);

				let method = 'im.dialog.messages.get';

				let data = {DIALOG_ID: 'chat' + channel.bitrix};

				const response = axios({
						method: 'POST',
						url: config.BITRIX_URL + method,
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

					console.log('Looking for unread messages');

					/**
					 * Флаг есть ли не прочитанные сообщения
					 * @type {boolean}
					 */
					let haveUnreadMessages = false;

					for (let messageCounter = messages.length - 1; messageCounter >= 0; messageCounter--) {

						let message = messages[messageCounter];

						if (message.unread === true) {

							console.log('Unread message found, looking for author');

							haveUnreadMessages = true;

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

							if (author !== null && author !== 122) {
								console.log('Author found: ' + author.name);

								// region Отправка дубликата в discord

								let messageText = message.text;

								if(messageText===''){
									messageText = '__Какой-то контент__';
								}

								const embed = new MessageEmbed().setAuthor(author.name, author.avatar).
									setDescription(messageText);

								client.channels.cache.get(channel.id).send(embed);

								// endregion

							}

							console.log('Unread message ' + message.text);
						}
					}

					// region Mark all as read

					if(haveUnreadMessages) {

						let bitrix = new Bitrix();

						bitrix.MarkMessageAsRead(channel.bitrix, messages[0].id);
					}
					// endregion
				});
			} else {
				console.log('Skipping ' + channel.bitrix + ' bitrix analog for ' + channel.name);
				// console.log(channel);
			}
		});

		console.info('Checking done');

	}, 10000);
});

client.on('message', msg => {
	if (msg.content !== '' && msg.content !== 'detect') {
		let bitrixChannelId = 0;
		for (let counter = 0; counter <= channels.length - 1; counter++) {
			if (channels[counter].id === msg.channel.id) {
				bitrixChannelId = channels[counter].bitrix;
			}
		}

		if (bitrixChannelId !== 0) {

			let bitrix = new Bitrix();

			bitrix.AddChannelMessage(bitrixChannelId, msg.content);
		}
	}

	if (msg.content === 'detect') {
		client.channels.cache.get(msg.channel.id).send(msg.channel.name + ' id #' + msg.channel.id);
	}
});

client.login(config.DISCORD_TOKEN);
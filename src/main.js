'use strict';

const { Client, MessageEmbed } = require('discord.js');

const Bitrix = require('./Bitrix');
const axios = require('axios');
const Config = require('./Config');
const colors = require('colors');

const client = new Client();
const messageEmbed = new MessageEmbed();

const config = new Config();

client.on('ready', () => {
	// @ts-ignore
	console.log('Logged in as '.grey + client.user.tag.cyan + '!'.grey);

	let checkingCounter = 0;

	setInterval(function () {

		if (config.DEBUG_MODE) {
			console.group(
				'[' + (new Date()).toString() + ']'.grey + ' Checking #'.white + checkingCounter.toString().yellow);
		}

		let statusChanged = false;

		config.Channels.forEach((channel, index) => {
			if (channel.counter >= 3) {
				channel.counter = 0;
				config.Channels[index].counter = 0;
			}
			if (channel.counter < 1 && channel.bitrix !== '') {

				if (config.DEBUG_MODE) {
					console.log('Checking '.white + channel.name.yellow);
				}

				if (!statusChanged) {
					client.user.setActivity('Bitrix24', { type: 'WATCHING' }).
						then(() => {statusChanged = true;}).
						catch(console.error);
				}

				let method = 'im.dialog.messages.get';

				let data = { DIALOG_ID: channel.bitrix };

				const response = axios({
						method: 'POST',
						url: config.BITRIX_URL + method,
						data: data
					}
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

					/**
					 * Флаг есть ли не прочитанные сообщения
					 * @type {boolean}
					 */
					let haveUnreadMessages = false;

					if (channel.lastId === messages[0].id && channel.lastId !== 0) {
						haveUnreadMessages = true;
					}

					if (!haveUnreadMessages) {

						for (let messageCounter = messages.length - 1; messageCounter >= 0; messageCounter--) {

							let message = messages[messageCounter];

							if (message.unread === true) {

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

								if (author !== null && author.id !== config.BITRIX_USER) {
									// region Отправка дубликата в discord

									let messageText = message.text;

									if (messageText === '') {
										messageText = '__Какой-то контент__';
									}

									messageText = messageText.replace(/\[USER=\d+\](.+)\[\/USER\]/gm, '*_$1_*');

									client.channels.cache.get(channel.id).startTyping(2);

									const embed = new MessageEmbed().setAuthor(author.name, author.avatar).
										setDescription(messageText);

									client.channels.cache.get(channel.id).send(embed);

									client.channels.cache.get(channel.id).stopTyping(true);

									// endregion

								}

								if (config.DEBUG_MODE) {
									console.log('Unread message ' + message.text);
								}
							}
						}
					}

					// region Mark all as read

					if (haveUnreadMessages) {

						let bitrix = new Bitrix();

						bitrix.MarkMessageAsRead(channel.bitrix, messages[0].id);

						config.Channels[index].lastId = messages[0].id;
						config.Channels[index].counter = 0;
					} else {
						config.Channels[index].counter++;
					}

					// endregion

					if (statusChanged) {
						client.user.setActivity(null).
							then(() => {statusChanged = true;}).
							catch(console.error);
					}
				}).catch(error => {
					if (config.DEBUG_MODE) {
						console.warn('Error requesting messages', error);
					}
				});
			} else {
				if (config.DEBUG_MODE) {
					console.log(
						'Skipping '.white + channel.name.yellow + ' '.white + config.Channels[index].counter +
						' times '.white);
				}

				config.Channels[index].counter++;
			}

		});

		if (config.DEBUG_MODE) {
			console.groupEnd();
		}

		checkingCounter++;

	}, 10000);
});

client.on('message', msg => {
	if (msg.content !== '' && msg.content !== 'detect') {
		let bitrixChannelId = 0;
		for (let counter = 0; counter <= config.Channels.length - 1; counter++) {
			if (config.Channels[counter].id === msg.channel.id) {
				bitrixChannelId = config.Channels[counter].bitrix;
				config.Channels[counter].counter = 0;
			}
		}

		if (bitrixChannelId !== 0) {

			let bitrix = new Bitrix();

			bitrix.AddChannelMessage(bitrixChannelId, msg.content);
		}
	}

	if (msg.content === 'detect') {
		client.channels.cache.get(msg.channel.id).startTyping(2);

		client.channels.cache.get(msg.channel.id).send(msg.channel.name + ' id #' + msg.channel.id);

		client.channels.cache.get(msg.channel.id).stopTyping(true);
	}
});

client.login(config.DISCORD_TOKEN);
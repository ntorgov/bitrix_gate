'use strict';

/// <reference path="./interfaces/index.d.ts" />

const {Client, MessageEmbed} = require('discord.js');
import  {Bitrix} from "./Bitrix";
// const Bitrix = require('./Bitrix.ts');
const axios = require('axios');
const Config = require('Config');
const colors = require('colors');

const client = new Client();
const messageEmbed = new MessageEmbed();

const config = new Config();

/**
 * Список сообщений
 * @var {IBitrixMessage[]}
 */
// @ts-ignore
let messagesList = [];

client.on('ready', () => {
	// @ts-ignore
	console.log('Logged in as '.grey + client.user.tag.cyan + '!'.grey);

	let checkingCounter = 0;

	setInterval(function () {

		if (config.DEBUG_MODE) {

			console.group(
				// @ts-ignore
				'[' + (new Date()).toString() + ']'.grey + ' Checking #'.white + checkingCounter.toString().yellow);
		}

		// @ts-ignore
		config.Channels.forEach((channel, index) => {
			if (channel.counter >= 3) {
				channel.counter = 0;
				config.Channels[index].counter = 0;
			}
			if (channel.counter < 1 && channel.bitrix !== '') {

				if (config.DEBUG_MODE) {
					// @ts-ignore
					console.log('Checking '.white + channel.name.yellow);
				}

				let method = 'im.dialog.messages.get';

				let data = {DIALOG_ID: channel.bitrix};

				const response = axios({
						method: 'POST',
						url: config.BITRIX_URL + method,
						data: data,
					},
					// @ts-ignore
				).then(data => {

					// @ts-ignore
					if (typeof (messagesList[channel.bitrix]) === 'undefined') {
						// @ts-ignore
						messagesList[channel.bitrix] = [];
					}

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

					// @ts-ignore
					messages.forEach(function (messageData) {
						let messagePresent = false;
						// @ts-ignore
						for (let cnt = 0; cnt < messagesList[channel.bitrix].lastId; cnt++) {
							if (messagePresent) {
								continue;
							}
							// @ts-ignore
							if (messagesList[channel.bitrix][cnt].id === messageData.id) {
								messagePresent = true;
							}
						}
						if (!messagePresent) {
							// @ts-ignore
							messagesList[channel.bitrix].push(messageData);
						}
					})

					let haveUnreadMessages = false;

					// @ts-ignore
					messagesList[channel.bitrix].forEach(function (element, index) {
						if (checkingCounter > 0) {
							if (element.unread === true) {

								// haveUnreadMessages = true;

								/**
								 *
								 * @type {BitrixUser|null}
								 */
								let author = null;

								for (let counter = 0; counter < users.length; counter++) {
									if (users[counter].id === element.author_id) {
										author = users[counter];
									}
								}

								if (author !== null && author.id !== config.BITRIX_USER) {
									// region Отправка дубликата в discord

									let messageText = element.text;

									if (messageText === '') {
										messageText = '__Какой-то контент__';
									}

									const embed = new MessageEmbed().setAuthor(author.name, author.avatar).setDescription(messageText);

									client.channels.cache.get(channel.id).send(embed);

									// @ts-ignore
									messagesList[channel.bitrix][index].unread = false;

									haveUnreadMessages = true;

									// endregion

								}

								if (config.DEBUG_MODE) {
									console.log('Unread message ' + element.text);
								}
							}
						}
					});

					/**
					 * Флаг есть ли не прочитанные сообщения
					 * @type {boolean}
					 */
					// let haveUnreadMessages = false;
					//
					// if (channel.lastId === messages[0].id && channel.lastId !== 0) {
					// 	haveUnreadMessages = true;
					// }
					//
					// if (!haveUnreadMessages) {
					//
					// 	for (let messageCounter = messages.length - 1; messageCounter >= 0; messageCounter--) {
					//
					// 		let message = messages[messageCounter];
					//
					//
					// 	}
					// }

					// region Mark all as read

					if (haveUnreadMessages) {

						// @ts-ignore
						let bitrix = new Bitrix();

						bitrix.MarkMessageAsRead(channel.bitrix, messages[0].id);

						config.Channels[index].lastId = messages[0].id;
						config.Channels[index].counter = 0;
					} else {
						config.Channels[index].counter++;
					}

					// endregion
					// @ts-ignore
				}).catch(error => {
					if (config.DEBUG_MODE) {
						console.warn('Error requesting messages', error);
					}
				});
			} else {
				if (config.DEBUG_MODE) {
					console.log(
						// @ts-ignore
						'Skipping '.white + channel.name.yellow + ' '.white + config.Channels[index].counter +
						// @ts-ignore
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

// @ts-ignore
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

			// @ts-ignore
			let bitrix = new Bitrix();

			bitrix.AddChannelMessage(bitrixChannelId, msg.content);
		}
	}

	if (msg.content === 'detect') {
		client.channels.cache.get(msg.channel.id).send(msg.channel.name + ' id #' + msg.channel.id);
	}
});

client.login(config.DISCORD_TOKEN);
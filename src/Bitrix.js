const axios = require('axios');
const Config = require('./Config');

class Bitrix {
	channelData = {};

	_config = new Config();

	constructor (channelData) {
		console.log('Init');

		if (channelData !== null) {
			this.channelData = channelData;
		}
	}

	/**
	 * Установка сообщения как прочитанного
	 * @param {string|number} chatId ID чата
	 * @param {string|number} messageId ID сообщения
	 * @returns {Promise<void>}
	 * @constructor
	 */
	async MarkMessageAsRead (chatId, messageId) {
		let method = 'im.dialog.read';

		let result = await this.makeRequest(method, { DIALOG_ID: chatId, MESSAGE_ID: messageId });

		return result;
	}

	async GetChannelMessages (channelId) {
		let method = 'im.dialog.messages.get';

		let result = await this.makeRequest(method, { DIALOG_ID: channelId });

		return result;
	}

	async AddChannelMessage (channelId, message) {
		let method = 'im.message.add';

		let result = await this.makeRequest(method, { DIALOG_ID: channelId, MESSAGE: message });

		return result;
	}

	async makeRequest (method, data) {
		console.log('Ready for request ' + method, data);

		const response = await axios({
				method: 'POST',
				url: this._config.BITRIX_URL + method,
				data: data
			}
		).then(async data => {

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

			switch (method) {
				case 'im.dialog.read':
					break;
				case 'im.dialog.messages.get':
					for (let messageCounter = 0; messageCounter < messages.length; messageCounter++) {

						//messages.forEach(message => {
						let message = messages[messageCounter];
						if (message.unread === false) {
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
								return message;
							}

							console.log('Unread message ' + message.text);
						}
					}
					//);
					break;
			}
		});
	}
}

module.exports = Bitrix;
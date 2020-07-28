const axios = require('axios');

class Bitrix {

	BITRIX_HOST = 'https://webclassic.bitrix24.ru/rest/122/f6ecshxdtphunn6d/';

	channelData = {};

	constructor(channelData) {
		console.log('Init');

		if (channelData !== null) {
			this.channelData = channelData;
		}
	}

	async GetChannelMessages(channelId) {
		let method = 'im.dialog.messages.get';

		let result = await this.makeRequest(method, {DIALOG_ID: 'chat' + channelId});

		return result;
	}

	async makeRequest(method, data) {
		console.log('Ready for request' + method, data);

		const response = await axios({
				method: 'POST',
				url: 'https://webclassic.bitrix24.ru/rest/122' + '/' + 'f6ecshxdtphunn6d' + '/' + method,
				data: data,
			},
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
				case 'im.dialog.messages.get':

					console.log('Looking for unread messages');

					for (let messageCounter = 0; messageCounter < messages.length; messageCounter++) {

						//messages.forEach(message => {
						let message = messages[messageCounter];
						if (message.unread === false) {

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
								console.log(this.channelData);
								// throw new Error('Stop');
								return message;
								// 	}
								// }
							}

							console.log('Unread message ' + message.text);
						}
					}
					//);
					break;
			}
			//console.log(data.data);
			//return data.data;
		});
	}
}

module.exports = Bitrix;
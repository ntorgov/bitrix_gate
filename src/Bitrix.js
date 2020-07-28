const axios = require('axios');

class Bitrix {

	BITRIX_HOST = 'https://webclassic.bitrix24.ru/rest/122/f6ecshxdtphunn6d/';

	constructor() {
		console.log('Init');
	}

	GetChannelMessages(channelId) {
		let method = 'im.dialog.messages.get';

		let data = this.makeRequest(method, {DIALOG_ID: 'chat' + channelId});

		return data;
	}

	makeRequest(method, data) {
		console.log('Ready for request' + method, data);

		const response = axios({
				method: 'POST',
				url: 'https://webclassic.bitrix24.ru/rest/122' + '/' + 'f6ecshxdtphunn6d' + '/' + method,
				data: data,
			},
		);

		console.log('waiting for data');

		return response.then(data => {console.log(data.data); return data.data;});
		// .then(function(data) {
		// 	// console.log(data);
		// 	/**
		// 	 * Результаты
		// 	 * @type {BitrixChannelMessages}
		// 	 */
		// 	let result = data.data.result;
		//
		// 	console.log(result);
		//
		// 	return data.data;
		// 	//
		// 	//
		// 	// console.info(result.messages[0].text);
		// });
	}
}

module.exports = Bitrix;
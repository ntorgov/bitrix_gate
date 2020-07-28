const axios = require('axios');

//const method = 'im.dialog.get';
const method = 'im.dialog.messages.get';

axios({
		method: 'POST',
		url: 'https://webclassic.bitrix24.ru/rest/122' + '/' + 'f6ecshxdtphunn6d' + '/' + method,
		data: {
			DIALOG_ID: 'chat968',
		},
	},
).then(function(data) {
	console.log(data);
});
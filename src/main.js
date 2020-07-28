'use strict';

const {Client, MessageEmbed} = require('discord.js');
const Bitrix = require('./Bitrix');

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

				let bitrix = new Bitrix();

				let result = bitrix.GetChannelMessages(channel.bitrix);
				console.log('result is', result);
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
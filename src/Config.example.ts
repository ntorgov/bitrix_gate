import {IChannel} from './interfaces/IChannel';

/**
 * Configuration
 */
class Config {
	DISCORD_TOKEN = 'NzM3NTQ4NDYOUR.TOKEN.HEREPliGl-rWKLOF2M';

	BITRIX_HOST = 'https://your-server.bitrix24.ru';
	BITRIX_USER = 666;
	BITRIX_TOKEN = 'your-token';

	BITRIX_URL = this.BITRIX_HOST + '/rest/' + this.BITRIX_USER + '/' + this.BITRIX_TOKEN + '/';

	/**
	 * Список канало для работы
	 * @type {IChannel[]}
	 */
	Channels = [
		{id: '737549324421955616', name: 'echo', bitrix: this.BITRIX_USER, type: 'user'},
		{id: '737601703427440711', name: 'чат-хороших-людей', bitrix: 'chat968', type: 'chat'},
		{id: '737672107701567499', name: 'сетевые-вопросы', bitrix: 'chat632', type: 'chat'},
		{id: '737672236739330129', name: 'разработка', bitrix: 'chat392', type: 'chat'},
		{id: '737737957145968690', name: 'тестовый-канал', bitrix: 'chat5522', type: 'chat'},
	];

	DEBUG_MODE = false;
}
// import {IBitrixMessage} from './IBitrixMessage';
import {IBitrixUser} from './IBitrixUser';

/**
 * Модель ответа последних сообщений в канале Битрикс24
 *
 * @see https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=93&LESSON_ID=11479&LESSON_PATH=7657.7685.11477.11479 Пародия на документацию
 */
interface IBitrixChannelMessages {

	/**
	 * ID чата
	 * @type {string}
	 */
	chat_id: string;

	/**
	 * Сообщения в канале
	 * @type {IBitrixMessage[]}
	 */
	messages: IBitrixMessage[];

	/**
	 * Пользователи в канале
	 * @type {IBitrixUser[]}
	 */
	users: IBitrixUser[];

	/**
	 * Файлы в канале. Имхо это пока не нужная срань
	 * @type {*[]}
	 */
	files: string[];
}
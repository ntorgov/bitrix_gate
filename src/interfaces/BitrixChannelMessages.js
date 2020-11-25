/**
 * Модель ответа последних сообщений в канале Битрикс24
 *
 * @see https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=93&LESSON_ID=11479&LESSON_PATH=7657.7685.11477.11479 Пародия на документацию
 */
class BitrixChannelMessages {

	/**
	 * ID чата
	 * @type {string}
	 */
	chat_id = '';

	/**
	 * Сообщения в канале
	 * @type {BitrixMessage[]}
	 */
	messages = [];

	/**
	 * Пользователи в канале
	 * @type {BitrixUser[]}
	 */
	users = [];

	/**
	 * Файлы в канале. Имхо это пока не нужная срань
	 * @type {*[]}
	 */
	files = [];
}
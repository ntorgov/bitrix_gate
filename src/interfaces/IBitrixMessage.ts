export interface IBitrixMessage {
	/**
	 * ID сообщения
	 * @type {number}
	 */
	id: number;

	/**
	 * ID чата
	 * @type {number}
	 */
	chat_id: string;

	/**
	 * ID автора
	 * @type {number}
	 */
	author_id: string;

	/**
	 * Дата
	 * @type {string}
	 */
	date: string;

	/**
	 * Сообщение
	 * @type {string}
	 */
	text: string;

	/**
	 * Флаг прочтения
	 * @type {boolean}
	 */
	unread: boolean;
}
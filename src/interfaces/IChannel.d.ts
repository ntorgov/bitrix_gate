/**
 * Структура данных канала
 */
interface IChannel {

	/**
	 * ID канала в Discord
	 */
	id: string;

	/**
	 * Название канала
	 */
	name: string;

	/**
	 * ID канала в битрикс
	 */
	bitrix: string

	/**
	 * Тип канала
	 */
	type: string;

	/**
	 * Счетчик
	 */
	counter: number;

	/**
	 * Последний полученный ID сообщения
	 */
	lastId: number;
}
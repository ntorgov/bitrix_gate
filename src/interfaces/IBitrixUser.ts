/**
 * Интерфейс пользователя битрикс
 */
export interface IBitrixUser {
	id: string;
	name: string;
	first_name: string;
	last_name: string;
	work_position: string;
	color: string;
	avatar: string;
	gender: string;
	birthday: string;
	extranet: string;
	network: string;
	bot: string;
	connector: string;
	external_auth_id: string;
	status: string;
	idle: string;
	last_activity_date: string;
	mobile_last_date: string;
	departments: number[];
	absent: string;
	phones: {
		work_phone: string
		personal_mobile: string;
		personal_phone: string;
	};
}
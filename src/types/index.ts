//Тип для элементов товаров в магазине
export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number | null;
	image: string;
	index: number;
}

//Тип для ответа API на запрос списка товаров
export interface IApiListResponse<Type> {
	total: number;
	items: Type[];
}

//Тип для методов POST, PUT, DELETE
export type TApiPostMethods = 'POST' | 'PUT' | 'DELETE';

//Тип для заказа
export type TOrder = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

//Ошибки
export type FormErrors = {
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
};

//Тип для заказа
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

// Интерфейс для содержимого модального окна
export interface IModalData {
	content: HTMLElement;
}

//Ответ сервера
export interface IApi {
	getProducts: () => Promise<IProduct[]>;
	orderProducts(order: IOrder): Promise<IOrderResult>;
}

// Модель
export interface IAppData {
	products: IProduct[];
	basket: IProduct[];
	order: IOrder | null;
}

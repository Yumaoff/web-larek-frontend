//Тип для элементов товаров в магазине
export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number | null;
  imageUrl: string;
  index: number;
}

//Тип для ответа API на запрос списка товаров
export interface IApiListResponse<Type> {
  total: number;
  items: Type[];
}

//Тип для методов POST, PUT, DELETE
export type TApiPostMethods = 'POST' | 'PUT' | 'DELETE';

//Тип для товара в корзине
export interface CartItem {
  productId: number;
  quantity: number;
}

//Тип для заказа
export interface IOrder {
  id: number;
  email: string;
  phone: string;
  items: CartItem[];
  total: number;
  address: string;
  paymentMethod: string;
}

export interface IOrderResult {
  id: string
  total: number
}

// Интерфейс для содержимого модального окна
export interface IModalData {
  content: HTMLElement;
}

//Корзина
export interface IBasket {
  products: HTMLElement[];
  total: number | null;
  selected: number
}

//Ответ сервера
export interface IApi {
  getProducts: () => Promise<IProduct[]>
  orderProducts(order: IOrder): Promise<IOrderResult>
}
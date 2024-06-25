import { IProduct, IOrder, Events, IAppData } from '../types'; // предполагается, что интерфейсы хранятся в types/index.ts
import { Model } from './base/Model'; // предполагается, что базовый класс Model хранится в соответствующем файле
import {IEvents} from "./base/Events";

export class AppData extends Model<IAppData> {
  private products: IProduct[] = [];
  private basket: IProduct[] = [];
  private order: IOrder;
  private selectedProduct: string | null = null;

  constructor(data: Partial<IAppData>, events: IEvents, products: IProduct[], basket: IProduct[], order: IOrder) {
    super(data, events);
    this.products = products;
    this.basket = basket;
    this.order = order;
}

  // Устанавливаем список продуктов
  setProducts(products: IProduct[]): void {
    this.products = products;
    this.emitChanges('products:changed', { products });
  }

  // Выбираем продукт для отображения в модальном окне
  selectProduct(productId: string): void {
    this.selectedProduct = productId;
    this.emitChanges('product:preview', { productId });
  }

  // Добавляем продукт в корзину
  addProductToBasket(product: IProduct): void {
    this.basket.push(product);
    this.emitChanges('basket:add-product', { product });
  }

  // Удаляем продукт из корзины
  removeProductFromBasket(productId: number): void {
    this.basket = this.basket.filter(product => product.id !== productId);
    this.emitChanges('basket:remove-product', { productId });
  }

  // Получаем продукты в корзине
  getBasketProducts(): IProduct[] {
    return this.basket;
  }

  // Получаем общую стоимость корзины
  getTotalPrice(): number {
    return this.basket.reduce((total, product) => total + (product.price || 0), 0);
  }

  // Очищаем корзину
  clearBasket(): void {
    this.basket = [];
    this.emitChanges('basket:clear', {});
  }

  // Очищаем текущий заказ
  clearOrder(): void {
    this.order = {} as IOrder;
    this.emitChanges('order:clear', {});
  }

  // Устанавливаем значение для поля заказа
  setOrderField<K extends keyof IOrder>(field: K, value: IOrder[K]): void {
    this.order[field] = value;
    this.emitChanges('order:set-field', { field, value });
  }

  // Валидируем поля заказа
  validateOrder(): boolean {
    let isValid = true;
    const errors: Partial<Record<keyof IOrder, string>> = {};

    if (!this.order.email) {
      isValid = false;
      errors.email = 'Email is required';
    }
    if (!this.order.phone) {
      isValid = false;
      errors.phone = 'Phone is required';
    }

    this.emitChanges('order:validate', { errors });
    return isValid;
  }
}
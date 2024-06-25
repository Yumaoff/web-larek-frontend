import { IProduct, IOrder, IAppData } from '../types'; // предполагается, что интерфейсы хранятся в types/index.ts
import { Model } from './base/Model'; // предполагается, что базовый класс Model хранится в соответствующем файле
import {IEvents} from "./base/Events";

export class AppData extends Model<IAppData> {
  protected _products: IProduct[] = [];
  protected _basket: IProduct[] = [];
  protected _order: IOrder;
  protected _selectedProduct: string | null = null;

  constructor(data: Partial<IAppData>, events: IEvents, products: IProduct[], basket: IProduct[], order: IOrder) {
    super(data, events);
    this._products = products;
    this._basket = basket;
    this._order = order;
}

  set products(products: IProduct[]) {
    this._products = products;
  }

  set order(order: IOrder) {
    this._order = order;
  }

  get order() {
    return this._order
  }

  get basket() {
    return this._basket
  }

  get products() {
    return this._products
  }

  // Устанавливаем список продуктов
  setProducts(products: IProduct[]): void {
    this._products = products;
    this.emitChanges('products:changed', { products });
  }

  // Выбираем продукт для отображения в модальном окне
  selectProduct(productId: string): void {
    this._selectedProduct = productId;
    this.emitChanges('product:preview', { productId });
  }

  // Добавляем продукт в корзину
  addProductToBasket(product: IProduct): void {
    this._basket.push(product);
    this.emitChanges('basket:add-product', { product });
  }

  // Удаляем продукт из корзины
  removeProductFromBasket(productId: number): void {
    this._basket = this._basket.filter(product => product.id !== productId);
    this.emitChanges('basket:remove-product', { productId });
  }

  // Получаем продукты в корзине
  getBasketProducts(): IProduct[] {
    return this._basket;
  }

  // Получаем общую стоимость корзины
  getTotalPrice(): number {
    return this._basket.reduce((total, product) => total + (product.price || 0), 0);
  }

  // Очищаем корзину
  clearBasket(): void {
    this._basket = [];
    this.emitChanges('basket:clear', {});
  }

  // Очищаем текущий заказ
  clearOrder(): void {
    this._order = {} as IOrder;
    this.emitChanges('order:clear', {});
  }

  // Устанавливаем значение для поля заказа
  setOrderField<K extends keyof IOrder>(field: K, value: IOrder[K]): void {
    this._order[field] = value;
    this.emitChanges('order:set-field', { field, value });
  }

  // Валидируем поля заказа
  validateOrder(): boolean {
    let isValid = true;
    const errors: Partial<Record<keyof IOrder, string>> = {};

    if (!this._order.email) {
      isValid = false;
      errors.email = 'Email is required';
    }
    if (!this._order.phone) {
      isValid = false;
      errors.phone = 'Phone is required';
    }

    this.emitChanges('order:validate', { errors });
    return isValid;
  }
}
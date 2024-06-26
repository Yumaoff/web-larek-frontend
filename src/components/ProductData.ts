import { ensureElement } from '../utils/utils'
import { IProduct } from "../types";
import { Component } from './base/Component'

interface IProductActions {
  onClick: (event: MouseEvent) => void;
}

export class Product extends Component<IProduct> {
  protected _image?: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLElement;
  protected _index?: HTMLElement;
  protected _productCategory = <Record<string, string>> { 
    "софт-скил": "soft",
    "другое": "other",
    "дополнительное": "additional",
    "кнопка": "button",
    "хард-скил": "hard"
  }


  constructor(blockName: string, element: HTMLElement, actions?: IProductActions) {
    super(element)
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, element);
    this._image = element.querySelector(`.${blockName}__image`);
    this._category = element.querySelector(`.${blockName}__category`);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, element);
    this._description = element.querySelector(`.${blockName}__text`);
    this._button = element.querySelector(`.${blockName}__button`);
    this._index = element.querySelector(`.basket__item-index`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        element.addEventListener('click', actions.onClick);
      }
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this.title);
    }
  }

  set price(value: string) {
    value ? this.setText(this._price, `${value} синапсов`) : this.setText(this._price, `Бесценно`)
  }

  set category(value: string) {
    if (this._category) {
      this.setText(this._category, value);
      const productCategory = this._productCategory[value];
      if (productCategory) {
        this.toggleClass(this._category, `card__category_${productCategory}`, true);
      }
    }
  }

  set description(value: string) {
    if (this._description) {
      this.setText(this._description, value);
    }
  }

  set index(value: number | null) {
    if (this._index) {
      this.setText(this._index, value !== null ? value.toString() : '');
    }
  }

  get button() {
    return this._button
  }
}
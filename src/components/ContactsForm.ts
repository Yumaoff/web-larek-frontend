import { IEvents } from './base/Events';
import { Form } from './common/Form'
import { ensureElement } from '../utils/utils';
import { IOrder } from '../types';

export class ContactsForm extends Form<IOrder> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(element: HTMLFormElement, events: IEvents) {
    super(element, events);

    this._email = ensureElement<HTMLInputElement>('input[name="email"]', this.element)
    this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.element)
  }

  set phone(value: string) {
    if (this._phone) {
        this._phone.value = value;
    }
}

set email(value: string) {
    if (this._email) {
        this._email.value = value;
    }
}
}
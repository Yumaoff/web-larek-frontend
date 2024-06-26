import { Form } from './common/Form';
import { IEvents } from './base/Events';
import { IOrder } from '../types';

export class OrderForm extends Form<IOrder> {
  protected _cashPayment: HTMLButtonElement;
  protected _cardPayment: HTMLButtonElement;
  protected _address: HTMLInputElement;
  protected _paymentMethod: string = '';

  constructor(element: HTMLFormElement, events: IEvents)  {
    super(element, events)

    this._cardPayment = element.querySelector('button[name="card"]');
    this._cashPayment = element.querySelector('button[name="cash"]');
    this._address = element.querySelector('input[name="address"]');

    this._cashPayment.addEventListener('click', () => {
      this.toggleCash();
      this.toggleCard(false);
      this.setPayment(this._cashPayment);
    })

    this._cardPayment.addEventListener('click', () => {
      this.toggleCard();
      this.toggleCash(false);
      this.setPayment(this._cardPayment);
    })

  };

    set address(value: string) {
      this._address.value = value;
    }

  // Устанавливает тип оплаты
  setPayment(button: HTMLButtonElement) {
    if (button.classList.contains('button_alt-active') && button.getAttribute('name') === 'card') {
      this._paymentMethod = 'card'
    } else {
      this._paymentMethod = 'cash'
    }

    this.events.emit('payment:choosed', { payment: this._paymentMethod })
  }

  // Переключает кнопку "оплата картой"
  toggleCard(state: boolean = true) {
    this.toggleClass(this._cardPayment, 'button_alt-active', state);
  }

  toggleCash(state: boolean = true) {
    this.toggleClass(this._cashPayment, 'button_alt-active', state);
  }
  
}
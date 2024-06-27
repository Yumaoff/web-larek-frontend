import { Form } from './common/Form';
import { IEvents } from './base/Events';
import { IOrder } from '../types';

export class OrderForm extends Form<IOrder> {
	protected _cashPayment: HTMLButtonElement;
	protected _cardPayment: HTMLButtonElement;
	protected _address: HTMLInputElement;
	protected _payment: string = '';

	constructor(element: HTMLFormElement, events: IEvents) {
		super(element, events);

		this._cardPayment = element.querySelector('button[name="card"]');
		this._cashPayment = element.querySelector('button[name="cash"]');
		this._address = element.querySelector('input[name="address"]');

		this._cashPayment.addEventListener('click', () => {
			this.toggleCash();
			this.toggleCard(false);
			this.setPayment(this._cashPayment);
		});

		this._cardPayment.addEventListener('click', () => {
			this.toggleCard();
			this.toggleCash(false);
			this.setPayment(this._cardPayment);
		});
	}

	set address(value: string) {
		this._address.value = value;
	}

	set payment(value: string) {
		this.events.emit('payment:choosed', { payment: value });
	}

	// Устанавливает тип оплаты
	setPayment(button: HTMLButtonElement) {
		if (
			button.classList.contains('button_alt-active') &&
			button.getAttribute('name') === 'card'
		) {
			this._payment = 'card';
		} else {
			this._payment = 'cash';
		}

		this.events.emit('payment:choosed', { payment: this._payment });
	}

	// Переключает кнопку "оплата картой"
	toggleCard(state: boolean = true) {
		this.toggleClass(this._cardPayment, 'button_alt-active', state);
	}

	toggleCash(state: boolean = true) {
		this.toggleClass(this._cashPayment, 'button_alt-active', state);
	}

	resetPaymentButtons() {
		this.toggleCard(false);
		this.toggleCash(false);
		this._payment = '';
	}

	resetForm() {
		this.address = '';
		this.resetPaymentButtons();
	}
}

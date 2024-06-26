import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IForm {
	valid: boolean;
	errors: string[];
}

export class Form<IOrder> extends Component<IForm> {
	protected submitBtn: HTMLButtonElement;
	protected formName: string;
	protected _errors: HTMLElement;
	protected _form: HTMLFormElement;

	constructor(element: HTMLFormElement, protected events: IEvents) {
		super(element);

		this.submitBtn = ensureElement<HTMLButtonElement>('.button', this.element);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.element);
		this.formName = this.element.getAttribute('name');

		this.element.addEventListener('submit', (e) => {
			e.preventDefault();
			events.emit(`${this.formName}:submit`);
		});

		this.element.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof IOrder;
			const value = target.value;
			this.onInputChange(field, value);
		});
	}

	protected onInputChange(field: keyof IOrder, value: string) {
		this.events.emit(`${this.formName}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this.submitBtn, !value);
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	close() {
		this._form.reset();
	}

	render(state: Partial<IOrder> & IForm) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.element;
	}
}

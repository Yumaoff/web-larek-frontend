import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(element: HTMLElement, actions: ISuccessActions) {
		super(element);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.element
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.element
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}

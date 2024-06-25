import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import {ensureElement} from "../../utils/utils";

export interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(element: HTMLElement, protected events: IEvents) {
    super(element);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', element);
    this._content = ensureElement<HTMLElement>('.modal__content', element);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.element.addEventListener('click', (event) => {
        if (event.target === this.element) {
            this.close();
        }
    });
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  //Закрытие окна с помощью Esc
  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.element.classList.contains('modal_active')) {
        this.close();
    }
}

  // Установить содержимое модального окна
  set content(content: HTMLElement) {
    this._content.replaceChildren(content);
  }

  // Открыть модальное окно
  open(): void {
    this.toggleClass(this.element, 'modal_active', true);
    this.events.emit('modal:open');
    document.addEventListener('keydown', this.handleKeyDown);
  }

  // Закрыть модальное окно
  close(): void {
    this.toggleClass(this.element, 'modal_active', false);
        document.removeEventListener('keydown', this.handleKeyDown);
    this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.element;
}
}
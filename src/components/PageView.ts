import {Component} from "./base/Component";
import {IEvents} from "./base/Events";
import {ensureElement} from "../utils/utils";

interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export class Page extends Component<IPage> {
  protected _basketCounter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
    this._gallery = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');

    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set basketCounter(value: number) {
    this.setText(this._basketCounter, String(value));
  }

  set gallery(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  set wrapper(value: boolean) {
    this.toggleClass(this._wrapper, 'page__wrapper_locked', value)
  }
}
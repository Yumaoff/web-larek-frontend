export abstract class Component<T> {
  protected readonly element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  // Переключает класс у элемента
  toggleClass(element: HTMLElement, className: string, force?: boolean): void {
    if (force !== undefined) {
      element.classList.toggle(className, force);
    } else {
      element.classList.toggle(className);
    }
  }

  // Устанавливает текстовое содержимое элемента
  protected setText(element: HTMLElement, value: unknown): void {
    if(element){
      element.textContent = String(value);
    }
  }

  // Устанавливает или убирает атрибут disabled у элемента
  setDisabled(element: HTMLElement, state: boolean): void {
    if(element) {
      if (state) {
        element.setAttribute('disabled', 'true');
      } else {
        element.removeAttribute('disabled');
      }
    }
  }

  // Скрывает элемент
  protected setHidden(element: HTMLElement): void {
    element.style.display = 'none';
  }

  // Делает элемент видимым
  protected setVisible(element: HTMLElement): void {
    element.style.display = '';
  }

  // Устанавливает изображение для элемента и альтернативный текст (если указан)
  protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
    if (element) {
      element.src = src;
      if (alt) {
          element.alt = alt;
      }
  }
  }

  // Абстрактный метод render, который должен быть реализован в подклассах
  abstract render(data?: Partial<T>): HTMLElement;
}
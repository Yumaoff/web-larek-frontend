# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

Продукт

```
export interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  image: string;
  index: number;
}
```

Тип для ответа API на запрос списка товаров 

```
export interface IApiListResponse<Type> {
  total: number;
  items: Type[];
}
```

Тип для методов POST, PUT, DELETE 

```
export type TApiPostMethods = 'POST' | 'PUT' | 'DELETE';

```

Тип для заказа
```
export type TOrder = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

```

Ошибки формы

```
export type FormErrors = {
  email?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
};
```

Интерфейс для заказа

```
export interface IOrder {
  email: string;
  phone: string;
  items: string[]; 
  total: number;
  address: string;
  payment: string;
}
```

Интерфейс для результата заказа 

```
export interface IOrderResult {
  id: string;
  total: number;
}
```

Интерфейс для содержимого модального окна 

```
export interface IModalData {
  content: HTMLElement;
}
```

Интерфейс для взаимодействия с API 

```
export interface IApi {
  getProducts: () => Promise<IProduct[]>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}
```

Интерфейс для модели данных приложения

```
export interface IAppData {
  products: IProduct[];
  basket: IProduct[];
  order: IOrder | null;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), в которой презентер связан как с моделью, так и с отображением данных, но они ничего не знают друг о друге:

- слой представление, который отвечает за отображение данных на странице,
- слой данных, который отвечает за хранение и отправление данных на сервер,
- презентер, отвечающий за связь первых двух слоев (то есть слоев представления и данных)

### Базовый код

#### Класс API

Реализует основную логику для выполнения запросов к серверу. В конструктор передаются базовый URL сервера и необязательные параметры для заголовков запросов. 

Методы: 

- `handleResponse(response: Response)` - обрабатывает ответ от сервера, возвращая промис с данными в случае успешного запроса, или промис с ошибкой в случае неудачи.

- `get` - выполняет GET-запрос на указанный эндпоинт и возвращает промис с ответом от сервера в виде объекта.

- `post` - отправляет данные в формате JSON на указанный эндпоинт, выполняя по умолчанию POST-запрос. Тип запроса можно изменить, передав его в качестве третьего параметра. Возвращает промис с ответом от сервера.

#### Класс EventEmitter
Класс EventEmitter выступает в роли посредника для управления событиями в системе. Он позволяет подписываться на события и инициировать их, что используется презентером для обработки событий и другими слоями приложения для их генерации.

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - позволяет подписаться на конкретное событие.
- `emit` - инициирует событие, передавая данные подписчикам.
- `trigger` - возвращает функцию, которая, при вызове, инициирует указанное событие.

Также в классе реализованы следующие дополнительные методы:
- `onAll` -  позволяет прослушивать все события.
- `offAll` - удаляет все зарегистрированные обработчики событий.

#### Базовый Класс Component <T>
Класс Component является базовым для всех представлений. Он поддерживает дженерики и в конструкторе принимает HTML-элемент, который будет наполняться данными из модели.

`constructor (element: HTMLElement)` -  конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента

Основные методы: 

- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключает класс у элемента. Параметры: HTML-элемент, класс для переключения, опциональный булевый параметр для принудительного включения или выключения класса.
- `setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое элемента.
- `setDisabled(element: HTMLElement, state: boolean)` - устанавливает или убирает атрибут disabled у элемента. Параметры: HTML-элемент, булевый флаг, который определяет, будет ли атрибут установлен или снят.
- `setHidden(element: HTMLElement)` - скрывает элемент, устанавливая ему соответствующие стили.
- `setVisible(element: HTMLElement)` - делает элемент видимым, убирая стили скрытия.
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - задает изображение для элемента и альтернативный текст (если указан).
- `render(data?: Partial<T>): HTMLElement` - рендерит элемент с переданными данными. Принимает опциональный параметр data, который может содержать частичные данные типа T.

#### Базовый класс Model
Базовый класс модели данных, работает с дженериками.

`constructor(data: Partial<T>, protected events: IEvents)` - принимает частичные данные типа T и экземпляр интерфейса IEvents для управления событиями.

Методы: 

- `emitChanges(event: string, payload?: object)` - уведомляет об изменении модели, инициируя указанное событие с опциональными данными (payload).

### Слой данных

#### Класс AppData

Класс отвечает за хранение данных приложения \
Расширяет класс Model
Все поля приватные, доступ через методы \
В полях класса хранятся следующие данные:

- `products: IProduct[]` - массив объектов продуктов.
- `basket: IProduct[]` - массив товаров в корзине.
- `order: IOrder` - текущий заказ.
- `selectedProduct: string | null` - ID товара, выбранного для отображения в модальном окне.
- `formErrors` - объект ошибок формы.

Методы для работы с данными:

- `set products(products: IProduct[])` - устанавливает список продуктов.
- `set order(order: IOrder)` - устанавливает текущий заказ.
- `get order()` - возвращает текущий заказ.
- `get basket()` - возвращает корзину.
- `get products()` - возвращает список продуктов.
- `isFirstFormFill()` - проверяет, заполнены ли поля адреса и оплаты в заказе.
- `setProducts(products: IProduct[])` - устанавливает список продуктов и инициирует событие изменения продуктов.
- `getProducts()` - возвращает список продуктов.
- `selectProduct(productId: string)` - выбирает продукт для отображения в модальном окне и инициирует событие предварительного просмотра продукта.
- `addProductToBasket(product: IProduct)` - добавляет продукт в корзину и инициирует событие добавления продукта в корзину.
- `removeProductFromBasket(productId: string)` - удаляет продукт из корзины по его ID и инициирует событие удаления продукта из корзины.
- `getBasketProducts()` - возвращает массив товаров в корзине.
- `getTotalPrice()` - возвращает общую стоимость товаров в корзине.
- `getProduct(cardId: string)` - возвращает продукт по его ID.
- `getBasket()` - возвращает корзину.
- `clearBasket()` - очищает корзину и инициирует событие очистки корзины.
- `getOrder()` - возвращает текущий заказ.
- `clearOrder()` - очищает текущий заказ и инициирует событие очистки заказа.
- `setOrderField(field: keyof TOrder, value: string)` - устанавливает значение для поля заказа и валидирует заказ.
- `validateOrder(field: keyof IOrder)` - валидирует поля заказа и обновляет объект ошибок формы.

### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных. 

#### Класс Form

Класс Form отвечает за управление формами в приложении. Он наследуется от базового класса Component, что позволяет ему использовать обобщенные методы для работы с DOM-элементами.

`constructor(element: HTMLFormElement, protected events: IEvents)`

- element - HTML-элемент формы, который будет управляться данным классом.
- events - экземпляр интерфейса IEvents для управления событиями.

Поля

- submitBtn - кнопка отправки формы.
- formName - имя формы, взятое из атрибута name.
- _errors - элемент для отображения ошибок формы.
- _form - HTML-элемент формы.

Основные методы

- `onInputChange(field: keyof IOrder, value: string)` - метод для обработки изменений в полях ввода. Инициирует событие изменения поля с именем формы и полем.
- `set valid(value: boolean)` - сеттер для установки валидности формы. Если форма не валидна, кнопка отправки блокируется.
- `set errors(value: string)` - сеттер для установки текста ошибок формы.
- `close()` - метод для сброса формы.
- `render(state: Partial<IOrder> & IForm)` - метод для рендеринга состояния формы. Принимает объект состояния, содержащий валидность, ошибки и другие поля.

#### Класс Modal

Класс Modal отвечает за управление модальными окнами в приложении. Он наследуется от базового класса Component, что позволяет ему использовать обобщенные методы для работы с DOM-элементами.

`constructor(element: HTMLElement, protected events: IEvents)`

- element - HTML-элемент, который будет представлять модальное окно.
- events - экземпляр интерфейса IEvents для управления событиями.

Поля

- _closeButton - кнопка для закрытия модального окна.
- _content - элемент для отображения содержимого модального окна.

Основные методы

- `handleKeyDown(event: KeyboardEvent)` - приватный метод для обработки нажатий клавиш. Закрывает модальное окно при нажатии на Escape.
- `set content(content: HTMLElement)` - сеттер для установки содержимого модального окна.
- `open()` - метод для открытия модального окна. Устанавливает класс активности и инициирует событие открытия.
- `close()` - метод для закрытия модального окна. Убирает класс активности и инициирует событие закрытия.
- `render(data: IModalData): HTMLElement` - метод для рендеринга содержимого модального окна. Принимает объект данных модального окна и открывает его.

#### Класс AppApi

Класс AppApi отвечает за взаимодействие с API сервера и расширяет базовый класс Api. Он реализует интерфейс IApi и предоставляет методы для получения продуктов и размещения заказов.

`constructor(cdn: string, baseUrl: string, options?: RequestInit)`

- cdn - строка с URL CDN (Content Delivery Network) для загрузки изображений продуктов.
- baseUrl - базовый URL API сервера.
- options - опциональные параметры для конфигурации запросов.

Поля

- cdn - URL CDN, используемый для загрузки изображений продуктов.

Основные методы

- `getProducts(): Promise<IProduct[]>` - метод для получения списка продуктов. Возвращает промис, который резолвится массивом продуктов с обновленными URL изображений.
- `orderProducts(order: IOrder): Promise<IOrderResult>` - метод для размещения заказа. Возвращает промис, который резолвится результатом заказа.

#### Класс BasketView

Класс Basket отвечает за управление корзиной покупок в приложении. Он наследуется от базового класса Component и реализует методы для управления списком продуктов, общей стоимостью и взаимодействием с пользователем.

`constructor(element: HTMLElement, protected events: IEvents)`

- element - HTML-элемент, представляющий корзину.
- events - экземпляр интерфейса IEvents для управления событиями.

Поля

- _list - элемент списка продуктов в корзине.
- _total - элемент отображения общей стоимости.
- _button - кнопка для оформления заказа.

Основные методы

- `set selected(items: number)` - сеттер для управления состоянием кнопки оформления заказа в зависимости от количества выбранных продуктов.
- `set products(products: HTMLElement[])` - сеттер для обновления списка продуктов в корзине.
- `set total(total: number)` - сеттер для обновления отображения общей стоимости в корзине.

#### Класс ContactsView

Класс ContactsForm отвечает за управление формой контактов в приложении. Он наследуется от базового класса Form и реализует методы для управления полями электронной почты и телефона.

`constructor(element: HTMLFormElement, events: IEvents)`

- element - HTML-элемент формы, представляющий форму контактов.
- events - экземпляр интерфейса IEvents для управления событиями.

Поля

- _email - элемент поля ввода электронной почты.
- _phone - элемент поля ввода телефона.

Основные методы

- `set phone(value: string)` - сеттер для установки значения поля ввода телефона.
- `set email(value: string)` - сеттер для установки значения поля ввода электронной почты.

#### Класс OrderForm

Класс OrderForm отвечает за управление формой заказа в приложении. Он наследуется от базового класса Form и реализует методы для управления полями адреса и способами оплаты.

`constructor(element: HTMLFormElement, events: IEvents)`

- element - HTML-элемент формы, представляющий форму заказа.
- events - экземпляр интерфейса IEvents для управления событиями.

Поля

- _cashPayment - кнопка выбора оплаты наличными.
- _cardPayment - кнопка выбора оплаты картой.
- _address - элемент поля ввода адреса.
- _paymentMethod - строка, представляющая выбранный способ оплаты.

Основные методы

- `set address(value: string)` - сеттер для установки значения поля ввода адреса.
- `setPayment(button: HTMLButtonElement)` - устанавливает выбранный способ оплаты и инициирует событие выбора оплаты.
- `toggleCard(state: boolean = true)` - переключает состояние кнопки выбора оплаты картой.
- `toggleCash(state: boolean = true)` - переключает состояние кнопки выбора оплаты наличными.

#### Класс PageView

Класс Page отвечает за управление основной страницей приложения. Он наследуется от базового класса Component и реализует методы для управления корзиной, галереей и состоянием страницы.

`constructor(container: HTMLElement, protected events: IEvents)`

- container - HTML-элемент, представляющий контейнер страницы.
- events - экземпляр интерфейса IEvents для управления событиями.

Поля

- _basketCounter - элемент для отображения количества товаров в корзине.
- _gallery - элемент галереи товаров.
- _wrapper - основной контейнер страницы.
- _basket - элемент корзины.

Основные методы

- `set basketCounter(value: number)` - сеттер для установки значения счетчика товаров в корзине.
- `set gallery(items: HTMLElement[])` - сеттер для обновления галереи товаров.
- `set wrapper(value: boolean)` - сеттер для переключения состояния заблокированного контейнера страницы.

#### Класс ProductData

Класс Product отвечает за управление компонентом продукта в приложении. Он наследуется от базового класса Component и предоставляет методы для установки различных атрибутов продукта, таких как изображение, заголовок, категория, цена, описание и индекс.

`constructor(blockName: string, element: HTMLElement, actions?: IProductActions)`

- blockName - строка, представляющая базовое имя блока для классов CSS.
- element - HTML-элемент, представляющий элемент продукта.
- actions - опциональный объект, содержащий обработчики событий для компонента.

Поля

- _image - элемент изображения продукта.
- _title - элемент заголовка продукта.
- _category - элемент категории продукта.
- _price - элемент цены продукта.
- _description - элемент описания продукта.
- _button - элемент кнопки продукта.
- _index - элемент индекса продукта.
- _productCategory - объект, содержащий соответствия между категориями продуктов и классами CSS.

Основные методы

- `set title(value: string)` - сеттер для установки значения заголовка продукта.
- `set image(value: string)` - сеттер для установки значения изображения продукта.
- `set price(value: string)` - сеттер для установки значения цены продукта.
- `set category(value: string)` - сеттер для установки значения категории продукта и соответствующего класса CSS.
- `set description(value: string)` - сеттер для установки значения описания продукта.
- `set index(value: number | null)` - сеттер для установки значения индекса продукта.
- `get button()` - геттер для получения элемента кнопки продукта.

#### Класс SuccessView

Класс Success представляет компонент для отображения сообщения об успешном заказе. Он наследуется от базового класса Component и содержит методы для установки общей суммы заказа и обработки события закрытия.

`constructor(element: HTMLElement, actions: ISuccessActions)`

- element - HTML-элемент, который представляет компонент успешного заказа.
- actions - объект, содержащий обработчик события onClick для кнопки закрытия.

Поля

- _close - элемент кнопки закрытия сообщения.
- _total - элемент для отображения общей суммы заказа.

Основные методы

- `set total(value: number)` - сеттер для установки общей суммы заказа и отображения на странице.

### Основные события

- `card:select` - выбор карточки товара для отображения.
- `products:loaded`- выгрузка списка товаров с сервера.
- `card:addtocart` - добавление товара в корзину.
- `card:deletefromcart`  - удаление товара из корзины.
- `modal:open` - открытие модального окна.
- `modal:close` - закрытие модального окна.
- `basket:open` - открытие окна корзины.
- `order:open` - открытие окна заказа.
- `order:submit` - отправка готового заказа.
- `formErrors:change` - отображение ошибок.
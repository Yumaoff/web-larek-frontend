import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { AppApi } from './components/AppApi';
import { IOrder, IProduct, TOrder } from './types';
import { Product } from './components/ProductData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppData } from './components/AppData';
import { Modal } from './components/common/Modal';
import { Basket } from './components/BasketView';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/SuccessView';
import { Page } from './components/PageView';

const events = new EventEmitter();

const cardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');

const page = new Page(document.body, events);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const modalPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const productInBasket = ensureElement<HTMLTemplateElement>('#card-basket');

const api = new AppApi(CDN_URL, API_URL);

const appData = new AppData({}, events, [], [], {
	email: '',
	phone: '',
	payment: null,
	address: '',
	total: 0,
	items: [],
});

api
	.getProducts()
	.then((res) => {
		appData.products = res;
		events.emit('products:loaded', res);
	})
	.catch((err) => console.log(err));

events.on('products:loaded', () => {
	page.gallery = appData.products.map((product) => {
		const initialProduct = new Product('card', cloneTemplate(cardCatalog), {
			onClick: () => events.emit('card:select', product),
		});

		return initialProduct.render({
			image: product.image,
			title: product.title,
			category: product.category,
			price: product.price,
		});
	});
});

events.on('modal:open', () => {
	page.wrapper = true;
});

events.on('modal:close', () => {
	page.wrapper = false;
});

events.on('card:select', (item: IProduct) => {
	const selectedCard = appData.getProduct(item.id);
	const preview = new Product('card', cloneTemplate(modalPreview), {
		onClick: () => {
			if (appData.basket.includes(item)) {
				preview.setText(preview.button, 'В корзину');
				events.emit('card:deleteFromCart', item);
			} else {
				events.emit('card:addToCart', item);
				preview.setText(preview.button, 'Удалить из корзины');
			}
		},
	});

	if (selectedCard.price === null) {
		preview.setDisabled(preview.button, true);
	}

	if (!appData.basket.includes(item)) {
		preview.setText(preview.button, 'В корзину');
	} else {
		preview.setText(preview.button, 'Удалить из корзины');
	}

	modal.render({
		content: preview.render({
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
			description: item.description,
		}),
	});
});

events.on('card:addToCart', (item: IProduct) => {
	appData.addProductToBasket(item);
	page.basketCounter = appData.basket.length;
	events.emit('basket:change');
});

const basket = ensureElement<HTMLTemplateElement>('#basket');
const basketView = new Basket(cloneTemplate(basket), events);

//Обновление содержимого корзины
events.on('basket:change', () => {
	const products = appData.basket.map((item, index) => {
		const product = new Product('card', cloneTemplate(productInBasket), {
			onClick: () => {
				events.emit('card:deleteFromCart', item);
			},
		});

		return product.render({
			price: item.price,
			title: item.title,
			id: item.id,
			index: (index += 1),
		});
	});

	basketView.render({
		products,
		total: appData.getTotalPrice(),
		selected: products.length,
	});
})

//Отображение модального окна корзины
events.on('basket:open', () => {
	modal.render({
		content: basketView.getElement(),
	});
});

events.on('card:deleteFromCart', (item: IProduct) => {
	appData.removeProductFromBasket(item.id);
	page.basketCounter = appData.basket.length;
	events.emit('basket:change');
});

const order = ensureElement<HTMLTemplateElement>('#order');
const orderView = new OrderForm(cloneTemplate(order), events);

const contacts = ensureElement<HTMLTemplateElement>('#contacts');
const contactsView = new ContactsForm(cloneTemplate(contacts), events);



events.on('order:open', () => {
	appData.order.total = appData.getTotalPrice();
	appData.order.items = appData.basket.map((item) => item.id);
	orderView.resetPaymentButtons();
	modal.render({
		content: orderView.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	console.log(orderView)
});

events.on('payment:choosed', (data: { payment: string }) => {
	appData.setOrderField('payment', data.payment);
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;

	orderView.valid = !payment && !address;
	orderView.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');

	const { phone, email } = errors;

	contactsView.valid = !phone && !email;
	contactsView.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof TOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof TOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('order:submit', () => {
	modal.render({
		content: contactsView.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
	console.log(orderView)
});

const success = ensureElement<HTMLTemplateElement>('#success');

events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			const successView = new Success(cloneTemplate(success), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					page.basketCounter = appData.basket.length;
					events.emit('basket:change');
				},
			});

			modal.render({
				content: successView.render({
					total: appData.order.total,
				}),
			});

			
		})
		.catch((err) => console.log(err));
});

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

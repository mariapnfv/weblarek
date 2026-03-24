import './scss/styles.scss';
import { Catalog } from './components/models/Catalog.ts';
import { EventEmitter } from './components/base/Events';
import { Communication } from './components/models/Communication.ts';
import { Basket } from './components/models/Basket.ts';
import { Buyer } from './components/models/Buyer.ts';
import { Api } from './components/base/Api.ts';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct } from "./types";
import { cloneTemplate, ensureElement } from './utils/utils';
import { Gallery } from './components/view/Gallery.ts';
import { Header } from './components/view/Header.ts';
import { CardBasket } from './components/view/CardBasket';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { ListBasket } from './components/view/ListBasket.ts';
import { Modal } from './components/view/Modal.ts';
import { ContactsForm } from './components/view/ContactsForm.ts';
import { OrderForm } from './components/view/OrderForm.ts';
import { SuccessOrder } from './components/view/SuccessOrder.ts';

const events = new EventEmitter();
const api = new Api(API_URL);
const messageService = new Communication(api);
const catalogModel = new Catalog(events);
const buyerModel = new Buyer(events);
const basketModel = new Basket(events);
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.page__wrapper'));
const modal = new Modal(ensureElement('.modal'), events);
const basketView = new ListBasket(cloneTemplate('#basket'), events);
const orderFormView = new OrderForm(cloneTemplate('#order'), events);
const contactsFormView = new ContactsForm(cloneTemplate('#contacts'), events);
const success = new SuccessOrder(cloneTemplate('#success'), events);
const cardPreview = new CardPreview(cloneTemplate('#card-preview'), {
    onClick: () => {
        const item = catalogModel.getPreview();
        if (item) {
            events.emit('card:toggle', item);
        }
    }
});

// Событие изменения товаров в модели
events.on('setItems:change', () => {
    const galleryList = catalogModel.getItems();
    const cards = galleryList.map((item) => {
        const card = new CardCatalog(cloneTemplate('#card-catalog'), {
            onClick: () => events.emit('card:selected', item)
        });
        return card.render({ ...item, image: CDN_URL + item.image });
    });
    gallery.render({ galleryList: cards });
});
messageService.getProducts()
    .then((products) => {
        catalogModel.setItems(products);
    })
    .catch(err => console.error(err));

// Событие изменения выбранной карточки (превью)
events.on('setPreview:change', () => {
    const item = catalogModel.getPreview();
    if (item) {
        const inBasket = basketModel.hasItemBasket(item.id);
        const canBuy = item.price !== null;
        modal.render({
            content: cardPreview.render({
                ...item,
                image: CDN_URL + item.image,
                buttonText: canBuy ? (inBasket ? 'Удалить из корзины' : 'В корзину') : 'Недоступно',
                valid: canBuy
            })
        });
    }
});

// обновление перевью
events.on('card:selected', (item: IProduct) => {
    catalogModel.setPreview(item);
});

// Событие изменения в корзине, чтобы обновить счетчик и перерисовка
events.on('basket:change', () => {
    header.counter = basketModel.getCount();
    updateBasketView();
});

// Событие удаления товара из корзины
events.on('card:remove', (data: { id: string }) => {
    basketModel.removeItemBasket(data.id);
});

// Событие переключения карточки(удаление и добавление в корзину на превью)
events.on('card:toggle', () => {
    const item = catalogModel.getPreview();
    if (item) {
        if (basketModel.hasItemBasket(item.id)) {
            basketModel.removeItemBasket(item.id);
        } else {
            basketModel.addItemBasket(item);
        }
    }
    modal.closeModal();
});
const updateBasketView = () => {
    const items = basketModel.getItemsBasket().map((item, index) => {
        const card = new CardBasket(cloneTemplate('#card-basket'), {
            onClick: () => basketModel.removeItemBasket(item.id)
        });
        return card.render({ ...item, index: index + 1 });
    });

    return basketView.render({
        addbasketList: items,
        finalSum: basketModel.getTotalPrice()
    });
}

// Событие открытия  корзины
events.on('basket:open', () => {
    modal.render({
        content: updateBasketView()
    });
});

//Событие клик по кнопке оформить
events.on('order:open', () => {
    const data = buyerModel.getData();
    const { errors, isValid } = buyerModel.validateBuyer();
    modal.render({
        content: orderFormView.render({
            address: data.address,
            payment: data.payment,
            valid: isValid,
            error: [errors.payment, errors.address].filter(Boolean).join('; ')
        } as any)
    });
});

//  События оформления заказа
events.on('dataBuyer:change', () => {
    const data = buyerModel.getData();
    const { errors, isValid } = buyerModel.validateBuyer();

    orderFormView.render({
        payment: data.payment,
        address: data.address,
        valid: !errors.payment && !errors.address,
        error: [errors.payment, errors.address].filter(Boolean).join('; ')
    } as any);

    contactsFormView.render({
        email: data.email,
        phone: data.phone,
        valid: isValid,
        error: [errors.email, errors.phone].filter(Boolean).join('; ')
    } as any);
});
// обновление модели
events.on('payment:change', (data: { method: string }) => {
    buyerModel.setData({ payment: data.method as any });
});

events.on('order.address:change', (data: { value: string }) => {
    buyerModel.setData({ address: data.value });
});

events.on('contacts.email:change', (data: { value: string }) => {
    buyerModel.setData({ email: data.value });
});

events.on('contacts.phone:change', (data: { value: string }) => {
    buyerModel.setData({ phone: data.value });
});

// Событие  "submit" далее
events.on('order:submit', () => {
    modal.render({
        content: contactsFormView.render({
            email: buyerModel.getData().email,
            phone: buyerModel.getData().phone,
            valid: false,
            error: ''
        } as any)
    });
});

// Событие ввода контактов
events.on('contacts.email:change', (data: { value: string }) => {
    buyerModel.setData({ email: data.value });
    validateContacts();
});

events.on('contacts.phone:change', (data: { value: string }) => {
    buyerModel.setData({ phone: data.value });
    validateContacts();
});
function validateContacts() {
    const { errors, isValid } = buyerModel.validateBuyer();
    if (contactsFormView) {
        contactsFormView.render({
            valid: isValid,
            error: [errors.email, errors.phone].filter(Boolean).join('; ')
        } as any);
    }
}

// Событие по кнопке "Оплатить"
events.on('contacts:submit', () => {
    const orderData = {
        ...buyerModel.getData(),
        total: basketModel.getTotalPrice(),
        items: basketModel.getItemsBasket().map(item => item.id)
    };
    messageService.postOrder(orderData)
        .then((result) => {
            modal.render({
                content: success.render({
                    finalSum: result.total
                })
            });
            basketModel.clearBasket();
            buyerModel.clearData();
        })
        .catch(err => {
            console.error('Ошибка при оформлении заказа:', err);
        });
});

// Событие клика по кнопке "За новыми покупками!" 
events.on('success:close', () => {
    modal.closeModal();
});

// упрвление скроллом
events.on('modal:open', () => {
    document.body.style.overflow = 'hidden';
});

events.on('modal:close', () => {
    document.body.style.overflow = '';
});
import './scss/styles.scss';
import { Catalog } from './components/models/Catalog.ts';
import { EventEmitter } from './components/base/Events';
import { Communication } from './components/models/Communication.ts';
import { Basket } from './components/models/Basket.ts';
import { Buyer, FormErrors } from './components/models/Buyer.ts';
import { Api } from './components/base/Api.ts';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct } from "./types";
import { cloneTemplate, ensureElement } from './utils/utils';
import { Gallery } from './components/view/Gallery.ts';
import { Header } from './components/view/Header.ts';
import { cardBasket } from './components/view/cardBasket.ts';
import { cardCatalog } from './components/view/cardCatalog.ts';
import { cardPreview } from './components/view/cardPreview.ts';
import { Form } from './components/view/Form.ts';
import { listBasket } from './components/view/listBasket.ts';
import { Modal } from './components/view/Modal.ts';
import { contactsForm } from './components/view/contactsForm.ts';
import { orderForm } from './components/view/orderForm.ts';
import { successOrder } from './components/view/successOrder.ts';
import { IBuyer } from './types';

const events = new EventEmitter();
const api = new Api(API_URL);
const messageService = new Communication(api);
const catalogModel = new Catalog(events);
const buyerModel = new Buyer(events);
const basketModel = new Basket(events);
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.page__wrapper'));
const modal = new Modal(ensureElement('.modal'), events);
let activePreviewItem: IProduct | null = null;

// Событие изменения товаров в модели
events.on('setItems:change', () => {
    const galleryList = catalogModel.getItems();
    const cards = galleryList.map((item) => {
        const card = new cardCatalog(cloneTemplate('#card-catalog'), events);
        return card.render({ ...item, image: CDN_URL + item.image });
    });
    gallery.render({ galleryList: cards });
});
messageService.getProducts()
    .then((products) => {
        catalogModel.setItems(products);
    })
    .catch(err => console.error(err));

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

// Событие изменения выбранной карточки (превью)
events.on('setPreview:change', (item: IProduct) => {
    const card = new cardPreview(cloneTemplate(cardPreviewTemplate), events);
    const cardElement = card.render({
        ...item,
        image: CDN_URL + item.image,
    });
    modal.render({
        content: cardElement
    });
});

// Событие открытия превью
events.on('card:selected', (item: IProduct) => {
    activePreviewItem = item;
    renderPreview(item);
    modal.openModal();
});

// Событие изменения в корзине, чтобы обновить счетчик 
events.on('basket:change', () => {
    header.counter = basketModel.getCount();
});

// Событие удаления товара из корзины
events.on('card:remove', (data: { id: string }) => {
    basketModel.removeItemBasket(data.id); // Это вызовет 'basket:change' автоматически
    events.emit('basket:open');
});
// Событие переключения карточки(удаление и добавление в корзину на превью)
events.on('card:toggle', (item: IProduct) => {
    if (basketModel.hasItemBasket(item.id)) {
        basketModel.removeItemBasket(item.id);
    } else {
        basketModel.addItemBasket(item);
    }
    if (activePreviewItem && activePreviewItem.id === item.id) {
        renderPreview(activePreviewItem);
    }
});

// Событие открытия  корзины
events.on('basket:open', () => {
    const basketView = new listBasket(cloneTemplate('#basket'), events);
    const items = basketModel.getItemsBasket().map((item, index) => {
        const card = new cardBasket(cloneTemplate('#card-basket'), events);
        return card.render({
            ...item,
            index: index + 1
        });
    });
    const basketElement = basketView.render({
        addbasketList: items,
        finalSum: basketModel.getTotalPrice()
    });
    modal.content = basketElement;
    modal.openModal();
});

// функция перерисовки превью
const renderPreview = (item: IProduct) => {
    const card = new cardPreview(cloneTemplate(cardPreviewTemplate), events);
    const inBasket = basketModel.hasItemBasket(item.id);
    const canBuy = item.price !== null;

    const previewContent = card.render({
        ...item,
        image: item.image,
        buttonText: canBuy
            ? (inBasket ? 'Удалить из корзины' : 'В корзину')
            : 'Недоступно',
        valid: canBuy
    });

    modal.content = previewContent;
};
//Событие клик по кнопке оформить
let orderFormView: orderForm | null = null;
events.on('order:open', () => {
    const template = ensureElement<HTMLTemplateElement>('#order');
    orderFormView = new orderForm(cloneTemplate(template), events);
    modal.render({
        content: orderFormView.render({
            address: buyerModel.getData().address,
            payment: buyerModel.getData().payment,
            valid: !buyerModel.validateBuyer().errors.address && !buyerModel.validateBuyer().errors.payment, // Проверяем валидность сразу
            errors: []
        })
    });
});

//  Событие выбор способа оплаты
events.on('payment:change', (data: { method: string }) => {
    buyerModel.setData({ payment: data.method as any });

    if (orderFormView) {
        const { errors } = buyerModel.validateBuyer();
        orderFormView.error = [errors.payment, errors.address].filter(Boolean).join('; ');
        orderFormView.valid = !errors.payment && !errors.address;
    }
});

events.on('order.address:change', (data: { value: string }) => {
    buyerModel.setData({ address: data.value });

    if (orderFormView) {
        const { errors } = buyerModel.validateBuyer();
        orderFormView.error = [errors.payment, errors.address].filter(Boolean).join('; ');
        orderFormView.valid = !errors.payment && !errors.address;
    }
});
let contactsFormView: Form<IBuyer> | null = null;

// Событие  "submit" далее
events.on('order:submit', () => {
    contactsFormView = new contactsForm(cloneTemplate('#contacts'), events);
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
    const { errors } = buyerModel.validateBuyer();
    if (contactsFormView) {
        contactsFormView.valid = !errors.email && !errors.phone;
        contactsFormView.error = [errors.email, errors.phone].filter(Boolean).join('; ');
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
            const success = new successOrder(cloneTemplate('#success'), events);
            modal.render({
                content: success.render({
                    finalSum: result.total
                })
            });
            basketModel.clearBasket();
            buyerModel.clearData();
            header.counter = 0;
        })
        .catch(err => {
            console.error('Ошибка при оформлении заказа:', err);
        });
});

// Событие клика по кнопке "За новыми покупками!" 
events.on('success:close', () => {
    modal.closeModal();
});
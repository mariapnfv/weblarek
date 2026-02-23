import './scss/styles.scss';
import { apiProducts } from './utils/data';   // данные из стартера
import { Catalog } from './components/base/models/Catalog.ts';
import { Communication } from './components/base/models/Communication.ts';
import { Basket } from './components/base/models/Basket.ts';
import { Buyer } from './components/base/models/Buyer.ts';
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants';

const catalogModel = new Catalog();
const buyerModel = new Buyer();
const basketModel = new Basket();

// тест Catalog 
console.log(`--------`)
console.log(`тест Catalog`);
catalogModel.setItems(apiProducts.items);
console.log(`Массив товаров из каталога:`, catalogModel.getItems())
console.log(`Получение одного товара по id:`, catalogModel.getItemById(apiProducts.items[0].id))
catalogModel.setPreview(apiProducts.items[0]);
console.log(`Сохранение товара для подробного отображения`, catalogModel.getPreview())

// тест Basket
console.log(`--------`)
console.log(`тест Basket`);
// добавление товара в корзину
basketModel.addItemBasket(apiProducts.items[0])
basketModel.addItemBasket(apiProducts.items[1])
console.log(`массив товаров корзины`, basketModel.getItemsBasket())
console.log(`количесво товаров в корзине: `, basketModel.getCount())
console.log(`стоимость корзины: `, basketModel.getTotalPrice())
console.log(`проверка наличия товара по id (товар есть в корзине) `, basketModel.hasItemBasket(apiProducts.items[0].id))
console.log(`проверка наличия товара по id (товар отсутствует в корзине) `, basketModel.hasItemBasket(apiProducts.items[3].id))
// удаление товара по id
basketModel.removeItemBasket((apiProducts.items[0].id))
console.log(`получение массива товаров после удаления `, basketModel.getItemsBasket())
// очистка корзины
basketModel.clearBasket()
console.log(`получение массива товаров после очистки `, basketModel.getItemsBasket())

// тест Buyer
console.log(`--------`)
console.log(`тест Buyer`);
console.log(`нет данных покупателя`);
buyerModel.getData();
console.log(`ошибки ввода данных покупателя(данные не введены)`, buyerModel.validateBuyer());
buyerModel.setData({ payment: 'cash' });
console.log(`ошибки ввода данных покупателя(указан способ оплаты)`, buyerModel.validateBuyer());
buyerModel.setData({ address: 'г. Пенза ул. Рахманинова' });
console.log(`ошибки ввода данных покупателя(указаны способ оплаты и адрес)`, buyerModel.validateBuyer());
buyerModel.setData({ phone: '+79273333333' });
console.log(`ошибки ввода данных покупателя(указаны способ оплаты, адрес и телефон)`, buyerModel.validateBuyer());
buyerModel.setData({ email: 'maria-test@test.ru' });
console.log(`ошибки ввода данных покупателя(все данные указаны)`, buyerModel.validateBuyer());
console.log(`очистка данных покупателя`);
buyerModel.clearData()
console.log(`данные покупателя после очистки`, buyerModel.getData());


const api = new Api(API_URL);
const messageService = new Communication(api);

messageService.getProducts()
    .then((products) => {
        // Сохраняем полученный массив товаров в модель каталога
        catalogModel.setItems(products);

        // Выводим обновленный каталог в консоль для проверки
        console.log('Данные успешно получены с сервера и сохранены в модель:');
        console.log(catalogModel.getItems());
    })
    .catch((err) => {
        // Обработка ошибок 
        console.log('Ошибка при загрузке каталога:', err);
    });

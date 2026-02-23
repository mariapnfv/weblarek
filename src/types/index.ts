export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

//Интерфейс данных товаров
export interface IProduct {
    id: string; // Уникальный идентификатор товара
    title: string; // Название товара
    image: string; // URL изображения товара
    description: string; // Описание товара
    category: string; // Категория товара
    price: number | null; // Цена товара, null – бесценный
}

//Интерфейс данных покупателя
export type TPayment = 'card' | 'cash' | '';
export interface IBuyer {
    payment: TPayment; // Способ оплаты
    address: string; // Адрес доставки
    email: string; // Электронная почта
    phone: string; // Телефон 
}

//Интерфейс данных заказа
export interface IOrder extends IBuyer{
    total: number; // Финальная сумма заказа
    items: string[]; // Массив ID выбранных товаров (строковые идентификаторы)
}

// Ответ сервера при запросе списка товаров
export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

// Результат успешного оформления заказа
export interface IOrderResult {
    id: string;
    total: number;
}


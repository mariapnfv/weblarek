import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog {
    protected items: IProduct[] = [];
    protected selectedItem: IProduct | null = null;

    constructor(protected events: IEvents,) {
        this.items = [];
    }

    // Сохранение массива товаров
    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('setItems:change');
    }

    // Получение всех товаров
    getItems(): IProduct[] {
        return this.items;
    }

    // Получение одного товара по id
    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    // Сохранение товара для подробного отображения
    setPreview(item: IProduct): void {
        this.selectedItem = item;
        this.events.emit('setPreview:change');
    }

    // Получение товара для подробного отображения
    getPreview(): IProduct | null {
        return this.selectedItem;
    }
}

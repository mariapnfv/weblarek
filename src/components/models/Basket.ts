import { IProduct } from "../../types";

export class Basket {
  protected itemsBasket: IProduct[] = [];

  constructor() {
    this.itemsBasket = [];
  }

  // Получение массива товаров в корзине
  getItemsBasket(): IProduct[] {
    return this.itemsBasket;
  }

  // Добавление товара в корзину
  addItemBasket(item: IProduct): void {
    this.itemsBasket.push(item);
  }

  // Удаление товара из корзины (по id)
  removeItemBasket(id: string): void {
    this.itemsBasket = this.itemsBasket.filter((item) => item.id !== id);
  }

  // Очистка корзины
  clearBasket(): void {
    this.itemsBasket = [];
  }

  // Получение стоимости всех товаров
  getTotalPrice(): number {
    return this.itemsBasket.reduce((total, item) => total +  (item.price || 0), 0);
  }

  // Получение количества товаров
  getCount(): number {
    return this.itemsBasket.length;
  }

  // Проверка наличия товара в корзине по id
  hasItemBasket(id: string): boolean {
    return this.itemsBasket.some((item) => item.id === id);
  }
}

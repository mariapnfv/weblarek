import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Card } from '../view/Card';
import { IProduct } from "../../types/index";
interface ICardBasket extends IProduct {
  index: number;
}
export class cardBasket extends Card<ICardBasket> {
  protected indexItem: HTMLElement;
  protected deleteItem: HTMLButtonElement;
  protected id?: string;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container, events);
    this.indexItem = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteItem = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.deleteItem.addEventListener('click', () => {
      this.events.emit('card:remove', { id: this.id });
    });
  }
  render(data: Partial<ICardBasket>): HTMLElement {
    if (data.id) {
      this.id = data.id;
    }
    return super.render(data);
  }
  set index(value: number) {
    this.indexItem.textContent = String(value);
  }

}
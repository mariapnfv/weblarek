import { ensureElement } from '../../utils/utils';
import { Card } from './Card';
import { IProduct } from "../../types/index";
interface ICardBasket extends IProduct {
  index: number;
}
interface ICardBasketActions {
  onClick: (event: MouseEvent) => void;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexItem: HTMLElement;
  protected deleteItem: HTMLButtonElement;

  constructor(protected container: HTMLElement, actions?: ICardBasketActions) {
    super(container);
    this.indexItem = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteItem = ensureElement<HTMLButtonElement>('.card__button', this.container);
    if (actions?.onClick) {
      this.deleteItem.addEventListener('click', actions.onClick);
    }
  }
  render(data: Partial<ICardBasket>): HTMLElement {
    return super.render(data);
  }
}
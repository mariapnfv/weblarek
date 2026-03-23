
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type IHeaderCounter = {
  counter: number;
}

export class Header extends Component<IHeaderCounter> {
  protected counterBasket: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);
    this.counterBasket = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }
  set counter(count: number) {
    this.counterBasket.textContent = String(count);
  }

}


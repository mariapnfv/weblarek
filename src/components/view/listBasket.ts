import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
interface IBasketView {
    addbasketList: HTMLElement[];
    finalSum: number;
}

export class ListBasket extends Component<IBasketView> {
    protected basketList: HTMLElement;
    protected basketPrice: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }
    set addbasketList(cards: HTMLElement[]) {
        if (cards.length > 0) {
            this.basketList.replaceChildren(...cards);
            this.basketButton.disabled = false;
        }
        else {
            this.basketList.replaceChildren();
            this.basketButton.disabled = true;
        }
    }

    set finalSum(value: number) {
        this.basketPrice.textContent = `${value} синапсов`;
    }

}
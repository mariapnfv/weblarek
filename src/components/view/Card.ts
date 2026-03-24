import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Card<T> extends Component<T> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container);
        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.cardTitle.textContent = String(value);
    }

    set price(value: number | null) {
        this.cardPrice.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
}
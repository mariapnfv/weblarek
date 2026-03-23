import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Card } from '../view/Card';
import { IProduct } from "../../types/index";
import { categoryMap } from "../../utils/constants";

interface ICardPreview extends IProduct {
    buttonText?: string;
    valid?: boolean;
    index?: number;
}
export class cardPreview extends Card<ICardPreview> {
    protected imageCard: HTMLImageElement;
    protected categoryCard: HTMLElement;
    protected textCard: HTMLElement;
    protected buttonCard: HTMLButtonElement;
    protected _data!: IProduct;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this.imageCard = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryCard = ensureElement<HTMLElement>('.card__category', this.container);
        this.textCard = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonCard = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.buttonCard.addEventListener('click', () => {
            if (this._data) {
                this.events.emit('card:toggle', this._data);
            }
        });

    }
    set image(value: string) {
        this.imageCard.src = value;
        if (this._data?.title) {
            this.imageCard.alt = this._data.title;
        }
    }

    set category(value: string) {
        this.categoryCard.textContent = value;
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || '';
        this.categoryCard.className = `card__category ${categoryClass}`;
    }

    set description(value: string) {
        this.textCard.textContent = value;
    }
    set buttonText(text: string) {
        this.buttonCard.textContent = text;
    }

    set valid(value: boolean) {
        this.buttonCard.disabled = !value;
    }

    render(data?: Partial<ICardPreview>): HTMLElement {
        if (data) {
            this._data = Object.assign(this._data ?? {}, data);
        }
        return super.render(data);
    }
}
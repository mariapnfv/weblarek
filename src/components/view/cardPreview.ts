import { ensureElement } from '../../utils/utils';
import { Card } from './Card';
import { IProduct } from "../../types/index";
import { categoryMap } from "../../utils/constants";

interface ICardPreview extends IProduct {
    buttonText?: string;
    valid?: boolean;
    index?: number;
}
interface ICardPreviewActions {
    onClick: () => void;
}

export class CardPreview extends Card<ICardPreview> {
    protected imageCard: HTMLImageElement;
    protected categoryCard: HTMLElement;
    protected textCard: HTMLElement;
    protected buttonCard: HTMLButtonElement;

    constructor(protected container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);
        this.imageCard = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryCard = ensureElement<HTMLElement>('.card__category', this.container);
        this.textCard = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonCard = ensureElement<HTMLButtonElement>('.card__button', this.container);
        if (actions?.onClick) {
            this.buttonCard.addEventListener('click', actions.onClick);
        }

    }
    set image(value: string) {
        this.setImage(this.imageCard, value, this.cardTitle.textContent);
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
        return super.render(data);
    }
}
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';
import { IProduct } from "../../types/index";
import { categoryMap } from "../../utils/constants";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
export type TCardCatalog = Pick<IProduct, 'image' | 'category'>;
export class CardCatalog extends Card<TCardCatalog> {
    protected imageCard: HTMLImageElement;
    protected categoryCard: HTMLElement;


    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this.imageCard = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryCard = ensureElement<HTMLElement>('.card__category', this.container);
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    render(data: Partial<IProduct> & TCardCatalog): HTMLElement {
        return super.render(data);
    }

    set category(value: string) {
        this.categoryCard.textContent = String(value);
        if (value in categoryMap) {
            this.categoryCard.classList.add(
                categoryMap[value as keyof typeof categoryMap]
            );
        }
    }
    set image(value: string) {
        this.imageCard.src = value;
    }
}
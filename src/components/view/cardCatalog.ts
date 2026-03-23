import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Card } from '../view/Card';
import { IProduct } from "../../types/index";
import { categoryMap } from "../../utils/constants";

export type TCardCatalog = Pick<IProduct, 'image' | 'category'>;
export class cardCatalog extends Card<TCardCatalog> {
    protected imageCard: HTMLImageElement;
    protected categoryCard: HTMLElement;
    protected item!: IProduct;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this.imageCard = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryCard = ensureElement<HTMLElement>('.card__category', this.container);
        this.container.addEventListener('click', () => {
            this.events.emit('card:selected', this.item);
        });
    }

    render(data: Partial<IProduct> & TCardCatalog): HTMLElement {
        this.item = data as IProduct;
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
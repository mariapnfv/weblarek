import { IOrder } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Form } from './Form';
import { IEvents } from '../base/Events';
interface IOrderFormView extends Partial<IOrder> {
  valid: boolean;
  errors: string[];
}
export class OrderForm extends Form<IOrderFormView> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.cardButton.addEventListener('click', () => {
      this.events.emit('payment:change', { method: 'card' });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('payment:change', { method: 'cash' });
    });
    this.addressInput.addEventListener('input', (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      this.events.emit('order.address:change', { value });
    });
  }
  set payment(value: string) {
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}

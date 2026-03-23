import { IOrder } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Form } from '../view/Form';
import { IEvents } from '../base/Events';
interface IOrderFormView extends Partial<IOrder> {
  valid: boolean;
  errors: string[];
}
export class orderForm extends Form<IOrderFormView> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.cardButton.addEventListener('click', () => {
      this.payment = 'card';
      this.events.emit('payment:change', { method: 'card' });
    });

    this.cashButton.addEventListener('click', () => {
      this.payment = 'cash';
      this.events.emit('payment:change', { method: 'cash' });
    });
    this.addressInput.addEventListener('input', (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      this.events.emit('order.address:change', { value });
    });
  }
  set payment(value: string) {
    if (value === 'cash') {
      this.cashButton.classList.add('button_alt-active');
      this.cardButton.classList.remove('button_alt-active');
    } else if (value === 'card') {
      this.cardButton.classList.add('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    } else {
      this.cardButton.classList.remove('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    }
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}

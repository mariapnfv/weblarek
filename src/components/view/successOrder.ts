import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type IFinalSum = {
  finalSum: number;
}

export class SuccessOrder extends Component<IFinalSum> {
  protected successOrderSum: HTMLElement;
  protected successOrderClose: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);
    this.successOrderSum = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successOrderClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.successOrderClose.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set finalSum(value: number) {
    this.successOrderSum.textContent = `Списано ${value} синапсов`;
  }

}


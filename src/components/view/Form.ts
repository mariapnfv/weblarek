import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Form<T> extends Component<T> {
  protected errorsForm: HTMLElement;
  protected submitForm: HTMLButtonElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this.errorsForm = ensureElement<HTMLElement>('.form__errors', this.container);
    this.submitForm = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
    this.container.addEventListener('input', (e: Event) => {
      this.events.emit(`${this.container.name}:change`,);
    });
  }
  set error(value: string) {
    this.errorsForm.textContent = String(value);
  }
  set valid(value: boolean) {
    this.submitForm.disabled = !value;
  }
}
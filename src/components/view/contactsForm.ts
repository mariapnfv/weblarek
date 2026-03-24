import { ensureElement } from '../../utils/utils';
import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

type TContactForm = Pick<IBuyer, 'email' | 'phone'> | { error: string };

export class ContactsForm extends Form<TContactForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    }
    set email(email: string) {
        this.emailInput.value = String(email);
    }

    set phone(phone: string) {
        this.phoneInput.value = String(phone);
    }
}
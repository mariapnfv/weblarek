import { ensureElement } from '../../utils/utils';
import { Form } from '../view/Form';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

type TContactForm = Pick<IBuyer, 'email' | 'phone'> | { error: string };

export class contactsForm extends Form<TContactForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        // Слушаем ввод почты
        this.emailInput.addEventListener('input', (e) => {
            this.events.emit('contacts.email:change', { value: (e.target as HTMLInputElement).value });
        });

        // Слушаем ввод телефона
        this.phoneInput.addEventListener('input', (e) => {
            this.events.emit('contacts.phone:change', { value: (e.target as HTMLInputElement).value });
        });

    }
    set email(email: string) {
        this.emailInput.value = String(email);
    }

    set phone(phone: string) {
        this.phoneInput.value = String(phone);
    }
}
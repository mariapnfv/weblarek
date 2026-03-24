import { IBuyer } from '../../types';
import { IEvents } from '../base/Events';

export type FormErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
    protected dataBuyer: IBuyer = {
        payment: '',
        address: '',
        phone: '',
        email: ''
    }

    constructor(protected events: IEvents) { }

    //сохранение данных в модели
    setData(data: Partial<IBuyer>): void {
        this.dataBuyer = { ...this.dataBuyer, ...data };
        this.events.emit('dataBuyer:change');
    }
    //получение всех данных покупателя
    getData(): IBuyer {
        return { ...this.dataBuyer };
    }
    //очистка данных покупателя
    clearData(): void {
        this.dataBuyer = {
            payment: '',
            address: '',
            phone: '',
            email: ''
        };
        this.events.emit('dataBuyer:change');
    }

    //валидация данных
    validateBuyer(): { isValid: boolean; errors: FormErrors } {
        const errors: FormErrors = {};

        if (!this.dataBuyer.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this.dataBuyer.address?.trim()) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.dataBuyer.phone?.trim()) {
            errors.phone = 'Укажите номер телефона';
        }
        if (!this.dataBuyer.email?.trim()) {
            errors.email = 'Укажите email';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }



}


import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type IModalData = { content: HTMLElement }

export class Modal extends Component<IModalData> {
	protected modalElement: HTMLElement;
	protected closeButton: HTMLButtonElement;
	public isActive: boolean = false;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.modalElement = ensureElement<HTMLButtonElement>('.modal__content', this.container);
		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
		this.closeButton.addEventListener('click', () => {
			this.closeModal();
		});

		this.container.addEventListener('click', (event: MouseEvent) => {
			if (event.target === this.container) {
				this.closeModal();
			}
		});

	}
	closeModal() {
		this.container.classList.remove('modal_active');
		document.body.style.overflow = '';
		this.events.emit('modal:close');
		this.isActive = false;
	}
	openModal() {
		this.container.classList.add('modal_active');
		document.body.style.overflow = 'hidden';
		this.events.emit('modal:open');
		this.isActive = true;
	}

	set content(item: HTMLElement) {
		this.modalElement.replaceChildren(item);
	}

	render(data?: IModalData): HTMLElement {
		if (data?.content) {
			this.content = data.content;
		}
		this.openModal();
		return this.container;
	}

}
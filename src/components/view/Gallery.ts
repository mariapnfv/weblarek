import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

type IGalleryData = { galleryList: HTMLElement[] }

export class Gallery extends Component<IGalleryData> {
  protected gallery: HTMLElement;

  constructor(protected container: HTMLElement) {
    super(container);
    this.gallery = ensureElement<HTMLButtonElement>('.gallery', this.container);
  }

  set galleryList(items: HTMLElement[]) {
    this.gallery.replaceChildren(...items);
  }
}
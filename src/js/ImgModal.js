import SimpleLightbox from 'simplelightbox';
import { blockScroll, enableScroll } from './helpers';
import 'simplelightbox/dist/simple-lightbox.min.css';

export class ImgModal {
  #selector;
  constructor(selector) {
    this.modal = null;
    this.#selector = selector;
    this.onOpen = blockScroll;
    this.onClose = enableScroll;
  }

  handle() {
    if (!this.modal) {
      this.modal = new SimpleLightbox(this.#selector);
      this.modal.on('show.simplelightbox', () => this.onOpen(document.body));
      this.modal.on('close.simplelightbox', () => this.onClose(document.body));
    } else {
      this.modal.refresh();
      this.modal.on('show.simplelightbox', () => this.onOpen(document.body));
      this.modal.on('close.simplelightbox', () => this.onClose(document.body));
    }
  }

  get selector() {
    return this.#selector;
  }

  set selector(newSelector) {
    this.#selector = newSelector;
  }
}

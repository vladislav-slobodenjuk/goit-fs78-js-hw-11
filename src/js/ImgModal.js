import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

console.log('check');

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

function blockScroll(el) {
  el.style.height = '100%';
  el.style.overflow = 'hidden';
}

function enableScroll(el) {
  el.style.height = 'unset';
  el.style.overflow = 'unset';
}

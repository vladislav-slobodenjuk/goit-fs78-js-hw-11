import { Loading } from 'notiflix/build/notiflix-loading-aio';

export class Spinner {
  show() {
    Loading.pulse();
    blockScroll(document.body);
  }

  hide() {
    Loading.remove();
    enableScroll(document.body);
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

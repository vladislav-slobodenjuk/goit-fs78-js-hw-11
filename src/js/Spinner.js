import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { blockScroll, enableScroll } from './helpers';

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

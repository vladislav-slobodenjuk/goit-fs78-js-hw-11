import { Notify } from 'notiflix/build/notiflix-notify-aio';

const statuses = {
  EMPTY_QUERY: 'Enter something to search',
  BAD_QUARY:
    'Sorry, there are no images matching your search query. Please try again.',
  END_OF_LIST: "We're sorry, but you've reached the end of search results.",
};

export function notifyEmptyQuery() {
  Notify.warning(statuses.EMPTY_QUERY);
}

export function notifySuccess(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

export function notifyBadQuery() {
  Notify.failure(statuses.BAD_QUARY);
}

export function notifyEndOFList() {
  Notify.warning(statuses.END_OF_LIST);
}

import debounce from 'lodash.debounce';

import { refs } from './refs';
import { ImgService } from './ImgServise';
import { ImgModal } from './ImgModal';
import { createGalleryMarkup } from './createGalleryMarkup';
import { Spinner } from './Spinner';
import {
  notifyBadQuery,
  notifyEmptyQuery,
  notifyEndOFList,
  notifySuccess,
} from './notifications';

// const { formEl, loadMoreBtn, galleryEl } = refs;
const { formEl, inputEl, galleryEl } = refs;
const imgService = new ImgService();
const spinner = new Spinner();
const imgModal = new ImgModal('.gallery .gallery__link');

const debouncedScroll = debounce(handleScroll, 100);

formEl.addEventListener('submit', onSubmit);
// window.addEventListener('scroll', debounce(handleScroll, 100));
// loadMoreBtn.addEventListener('click', loadMore);

function onSubmit(e) {
  e.preventDefault();
  const value = e.target.elements.searchQuery.value.trim();
  if (value.length === 0) return notifyEmptyQuery();
  inputEl.blur();

  imgService.searchQuery = value;
  imgService.resetPages();
  clearGallery();

  window.addEventListener('scroll', debouncedScroll);

  handleGallery().finally(e.target.reset());
}

async function handleGallery() {
  try {
    if (imgService.page > imgService.totalPages) {
      window.removeEventListener('scroll', debouncedScroll);
      throw new Error('end of list');
    }

    spinner.show();
    const { hits, totalHits } = await imgService.getImages();

    if (hits.length === 0) throw new Error('empty result');
    if (imgService.page === 1 && hits.length !== 0) notifySuccess(totalHits);

    const galleryMarkup = createGalleryMarkup(hits);
    updateGallery(galleryMarkup);

    imgService.incrementPage();
    imgModal.handle();
    spinner.hide();
    //
  } catch (error) {
    onError(error);
    spinner.hide();
  }
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function updateGallery(markup) {
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function onError(err) {
  switch (err.message) {
    case 'empty result':
      notifyBadQuery();
      break;

    case 'end of list':
    case 'Request failed with status code 400':
      notifyEndOFList();
      break;

    default:
      console.log(err.message);
      break;
  }
}

// function loadMore() {
//   //
//   handleGallery();
//   const { height: cardHeight } =
//     galleryEl.firstElementChild.getBoundingClientRect();
//   console.log(galleryEl.firstElementChild.getBoundingClientRect());

//   window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
// }

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    handleGallery();
  }
}

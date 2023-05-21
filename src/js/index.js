import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import debounce from 'lodash.debounce';

import { refs } from './refs';
import { ImgService } from './ImgServise';
import { createGalleryMarkup } from './createGalleryMarkup';
import { Spinner } from './Spinner';

import 'simplelightbox/dist/simple-lightbox.min.css';

// const { formEl, loadMoreBtn, galleryEl } = refs;
const { formEl, galleryEl } = refs;
const imgService = new ImgService();
const spinner = new Spinner();
let modal;

formEl.addEventListener('submit', onSubmit);
window.addEventListener('scroll', debounce(handleScroll, 100));
// loadMoreBtn.addEventListener('click', loadMore);

function onSubmit(e) {
  e.preventDefault();
  const value = e.target.elements.searchQuery.value.trim();
  if (value.length === 0) return Notify.warning('Enter somthing to search');

  imgService.searchQuery = value;
  imgService.resetPage();
  clearGallery();

  handleGallery().finally(e.target.reset());
}

async function handleGallery() {
  try {
    spinner.show();
    const { hits, totalHits } = await imgService.getImages();

    if (hits.length === 0 && imgService.page > 1)
      throw new Error('end of list');

    if (hits.length === 0) throw new Error('empty result');

    if (imgService.page === 1 && hits.length !== 0)
      Notify.success(`Hooray! We found ${totalHits} images.`);

    const galleryMarkup = createGalleryMarkup(hits);
    updateGallery(galleryMarkup);
    imgService.incrementPage();

    if (!modal) {
      modal = new SimpleLightbox('.gallery .gallery__link');
      modal.on('show.simplelightbox', () => blockScroll(document.body));
      modal.on('close.simplelightbox', () => enableScroll(document.body));
    } else {
      modal.refresh();
      modal.on('show.simplelightbox', () => blockScroll(document.body));
      modal.on('close.simplelightbox', () => enableScroll(document.body));
    }

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
  // console.log(err);
  switch (err.message) {
    case 'empty result':
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      break;

    case 'end of list':
    case 'Request failed with status code 400':
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
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

function blockScroll(el) {
  el.style.height = '100%';
  el.style.overflow = 'hidden';
}

function enableScroll(el) {
  el.style.height = 'unset';
  el.style.overflow = 'unset';
}

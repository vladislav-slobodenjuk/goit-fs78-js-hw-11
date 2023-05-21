import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import debounce from 'lodash.debounce';

import { ImgService } from './ImgServise';

import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.getElementById('search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
};

// const { formEl, loadMoreBtn, galleryEl } = refs;
const { formEl, galleryEl } = refs;
const imgService = new ImgService();
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
    Loading.pulse();
    blockScroll(document.body);

    const { hits, totalHits } = await imgService.getImages();
    if (hits.length === 0 && imgService.page >= 3)
      throw new Error('end of list');
    if (hits.length === 0) throw new Error('empty result');
    if (imgService.page === 2)
      Notify.success(`Hooray! We found ${totalHits} images.`);

    const markup = createMarkup(hits);
    updateGallery(markup);

    if (!modal) {
      modal = new SimpleLightbox('.gallery .gallery__link', {
        overlayOpacity: 0.8,
      });
      modal.on('show.simplelightbox', () => blockScroll(document.body));
      modal.on('close.simplelightbox', () => enableScroll(document.body));
    } else {
      modal.refresh();
      modal.on('show.simplelightbox', () => blockScroll(document.body));
      modal.on('close.simplelightbox', () => enableScroll(document.body));
    }

    Loading.remove();
    enableScroll(document.body);
  } catch (error) {
    console.log(error.message);
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    // if (error.code === 'ERR_BAD_REQUEST') console.log('catched bad req');
    Loading.remove();
    enableScroll(document.body);
  }
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function updateGallery(markup) {
  galleryEl.insertAdjacentHTML('beforeend', markup);
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

async function fetchImages() {
  try {
    const images = await imgService.getImages();
    if (images.length === 0) throw new Error('empty result');

    return images;
    //
  } catch (error) {
    console.log(error);
    // return console.log('Empty array');
  }
}

function createMarkup(items) {
  return items
    .map(item => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = item;
      return `<div class="col">
                <div class="card photo-card">
                  <a class="gallery__link" href=${largeImageURL}>
                    <img
                      src=${webformatURL.replace('_640', '_340')}
                      alt='${tags}'
                      class="card-img-top object-fit-cover"
                      loading="lazy"
                      style="height: 200px;"
                    />
                  </a>
                  <div class="info card-body d-flex justify-content-between p-2">
                    <p class="info-item card-text small m-0">
                      <b>Likes</b>
                      ${likes}
                    </p>
                    <p class="info-item card-text small m-0">
                      <b>Views</b>
                      ${views}
                    </p>
                    <p class="info-item card-text small m-0">
                      <b>Comments</b>
                      ${comments}
                    </p>
                    <p class="info-item card-text small m-0">
                      <b>Downloads</b>
                      ${downloads}
                    </p>
                  </div>
                </div>
              </div>`;
    })
    .join('');
}

function blockScroll(el) {
  el.style.height = '100%';
  el.style.overflow = 'hidden';
}

function enableScroll(el) {
  el.style.height = 'unset';
  el.style.overflow = 'unset';
}

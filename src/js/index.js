import { ImgService } from './ImgServise';

const refs = {
  formEl: document.getElementById('search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
};

const { formEl, loadMoreBtn, galleryEl } = refs;
const imgService = new ImgService();

formEl.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
// window.addEventListener("scroll", handleScroll);

async function onSubmit(e) {
  e.preventDefault();
  const value = e.target.elements.searchQuery.value.trim();
  if (value.length === 0) return console.log('Empty q notification');

  imgService.searchQuery = value;
  imgService.resetPage();
  clearGallery();

  try {
    const images = await fetchImages();
    console.log(images);
    const markup = createMarkup(images);
    updateGallery(markup);
  } catch (error) {}
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function updateGallery(markup) {
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

async function fetchImages() {
  try {
    const { hits } = await imgService.getImages();
    console.log('file: index.js:47  fetchImages  hits:', hits);
    if (hits.length === 0) throw new Error('empty result');

    return hits;
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
                <div class="card photo-card h-100" ">
                  <img
                    src=${webformatURL}
                    alt=${tags}
                    class="card-img-top"
                    loading="lazy"
                    />
                  <div class="info card-body">
                    <p class="info-item card-text">
                      <b>Likes</b>
                    </p>
                    <p class="info-item card-text">
                      <b>Views</b>
                    </p>
                    <p class="info-item card-text">
                      <b>Comments</b>
                    </p>
                    <p class="info-item card-text">
                      <b>Downloads</b>
                    </p>
                  </div>
                </div>
              </div>`;
    })
    .join('');
  //
}

async function onLoadMore() {
  try {
    const images = await fetchImages();
    console.log(images);
    const markup = createMarkup(images);
    updateGallery(markup);
  } catch (error) {}
}

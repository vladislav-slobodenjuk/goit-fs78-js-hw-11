import { ImgService } from './ImgServise';

const refs = {
  formEl: document.getElementById('search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
};

const { formEl, loadMoreBtn, galleryEl } = refs;
const imgService = new ImgService();

formEl.addEventListener('submit', onSubmit);
// window.addEventListener("scroll", handleScroll);

function onSubmit(e) {
  e.preventDefault();
  const value = e.target.elements.searchQuery.value.trim();
  console.log(value);

  if (value.length === 0) return console.log('Empty q notification');

  imgService.searchQuery = value;
  // imgService.resetPage();
  clearGallery();

  imgService.getImages();
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

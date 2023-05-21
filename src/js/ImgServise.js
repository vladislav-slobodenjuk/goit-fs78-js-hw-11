import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const params = {
  key: '24000598-4cbb5e18617bf8e66757f824b',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 200,
  //set to 40
};

axios.defaults.baseURL = BASE_URL;
axios.defaults.params = params;
// axios.defaults.timeout = 2500;

export class ImgService {
  #searchQuery;
  constructor() {
    this.page = 1;
    this.#searchQuery = '';
  }

  async getImages() {
    const params = { q: this.#searchQuery, page: this.page };
    const { data } = await axios.get('', { params });
    this.incrementPage();
    return data;
  }

  get searchQuery() {
    return this.#searchQuery;
  }

  set searchQuery(newQuery) {
    this.#searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}

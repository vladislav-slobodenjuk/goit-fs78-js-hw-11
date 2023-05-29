import { pixabayInst } from './apiService';

export class ImgService {
  #searchQuery;
  constructor() {
    this.page = 1;
    this.totalPages = 1;
    this.#searchQuery = '';
  }

  async getImages() {
    const params = { q: this.#searchQuery, page: this.page };
    const { data } = await pixabayInst.get('', { params });

    this.totalPages = Math.ceil(data.totalHits / 40);
    return data;
  }

  get searchQuery() {
    return this.#searchQuery;
  }

  set searchQuery(newQuery) {
    this.#searchQuery = newQuery;
  }

  resetPages() {
    this.page = 1;
    this.totalPages = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}

import axios from 'axios';

export const pixabayInst = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '24000598-4cbb5e18617bf8e66757f824b',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  },
});

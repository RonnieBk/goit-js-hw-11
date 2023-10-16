import axios from 'axios';
const perPage = 40;

const url = 'https://pixabay.com/api/';

async function getPictures(inputValue, pageNumber) {
  try {
    const response = await axios.get(url, {
      params: {
        key: '40010182-cc012c30f708a21cd5d6ee6a2',
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNumber,
        per_page: perPage,
      },
    });
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export { getPictures };

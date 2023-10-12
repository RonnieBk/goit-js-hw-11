import axios from 'axios';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const searchQuery = searchForm.elements.searchQuery;
const galleryDiv = document.querySelector('.gallery');
const btnNext = document.querySelector('.load-more');

// axios.defaults.headers.common['x-api-key'] =
//   '40010182-cc012c30f708a21cd5d6ee6a2';

const url = 'https://pixabay.com/api/';

const parameters = {
  key: '40010182-cc012c30f708a21cd5d6ee6a2',
  q: 'dogs',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

const address = `${url}?${parameters.key}`;
// const {
//   webformatURL,
//   largeImageURL,
//   tags,
//   likes,
//   views,
//   comments,
//   downloads,
// } = imageInfo;

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  //   galleryDiv.innerHTML = '';
  getPicturesInfo();
});

async function getPictures(inputValue) {
  try {
    // const response = await axios.get(
    //   'https://pixabay.com/api/?key=40010182-cc012c30f708a21cd5d6ee6a2&q=yellow+flowers&image_type=photo'
    // );
    const response = await axios.get(url, {
      params: {
        key: '40010182-cc012c30f708a21cd5d6ee6a2',
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    console.log('done:)', response.data.hits);
    return response.data.hits;
  } catch (error) {
    console.log('before error');
    console.error(error);
    console.log('after error');
  }
}

async function getPicturesInfo() {
  getPictures(searchQuery.value)
    .then(data => {
      if (data.length === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        console.log('happy');
        return data.map(obj => {
          const imageInfo = {
            webformatURL: obj.webformatURL,
            largeImageURL: obj.largeImageURL,
            tags: obj.tags,
            likes: obj.likes,
            views: obj.views,
            comments: obj.comments,
            downloads: obj.downloads,
          };
          return imageInfo;
        });
      }
    })
    .then(arrayOfImages => {
      console.log(arrayOfImages);
      const markup = arrayOfImages
        .map(image => {
          const {
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          } = image;
          return `<div class="photo-card">
      <img src=${webformatURL} alt='${tags}' loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </div>`;
        })
        .join('');
      galleryDiv.innerHTML = markup;
    })

    .catch(error => {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      console.log(error);
    });
}

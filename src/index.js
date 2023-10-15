import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const searchQuery = searchForm.elements.searchQuery;
const galleryDiv = document.querySelector('.gallery');
const btnNext = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a');

const url = 'https://pixabay.com/api/';

let pageNumber;
let perPage = 40;

btnNext.classList.add('hidden');

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  galleryDiv.innerHTML = '';
  pageNumber = 1;
  getPicturesInfo();
  window.addEventListener('scroll', infiniteScroll);
});

btnNext.addEventListener('click', event => {
  event.preventDefault();
  nextPagePictures();
});

async function getPictures(inputValue) {
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

function getPicturesInfo() {
  getPictures(searchQuery.value)
    .then(data => {
      const dataArray = data.hits;
      const dataTotalHits = data.totalHits;
      if (dataArray.length === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${dataTotalHits} images.`);
        createGallery(dataArray);
        btnNext.classList.remove('hidden');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(`${error}`);
    });
}

function nextPagePictures() {
  pageNumber += 1;
  btnNext.classList.toggle('hidden');
  getPictures(searchQuery.value)
    .then(data => {
      const dataArray = data.hits;
      const dataTotalHits = data.totalHits;

      if (pageNumber * perPage <= dataTotalHits) {
        createGallery(dataArray);
        btnNext.classList.toggle('hidden');
      } else {
        window.removeEventListener('scroll', infiniteScroll);
        throw new Error(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(`${error}`);
      btnNext.classList.add('hidden');
    });
}

function createGallery(array) {
  const markup = array
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
      <a href='${largeImageURL}'><img src='${webformatURL}' alt="${tags}" title="" loading="lazy"/></a>
        <div class="info">
        <p class="info-item">
          <b>Likes</b><br>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b><br>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b><br>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b><br>
          ${downloads}
        </p>
      </div>
    </div>`;
    })
    .join('');
  galleryDiv.innerHTML += markup;
  lightbox.refresh();
  scrollWin();
}

function scrollWin() {
  const { height: cardHeight } =
    galleryDiv.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function infiniteScroll() {
  const scroll = Math.floor(window.scrollY + window.innerHeight);
  const docHeight = Math.floor(
    document.documentElement.getBoundingClientRect().height
  );
  if (scroll === docHeight) {
    nextPagePictures();
  }
}

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPictures } from './pixabay-api';

const searchForm = document.querySelector('#search-form');
const searchQuery = searchForm.elements.searchQuery;
const galleryDiv = document.querySelector('.gallery');
const btnNext = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a');

let pageNumber;
let perPage = 40;
let dataTotalHits;

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  btnNext.classList.add('hidden');
  galleryDiv.innerHTML = '';
  pageNumber = 1;
  getPicturesInfo();
  window.addEventListener('scroll', infiniteScroll);
});

btnNext.addEventListener('click', event => {
  event.preventDefault();
  nextPagePictures();
});

async function getPicturesInfo() {
  try {
    const data = await getPictures(searchQuery.value, pageNumber);
    const dataArray = await data.hits;
    dataTotalHits = data.totalHits;
    if (dataArray.length === 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${dataTotalHits} images.`);
      createGallery(dataArray);
      if (dataTotalHits > perPage) {
        btnNext.classList.remove('hidden');
      }
    }
  } catch (error) {
    Notiflix.Notify.failure(`${error}`);
  }
}

async function nextPagePictures() {
  try {
    btnNext.classList.toggle('hidden');
    if (pageNumber * perPage <= dataTotalHits) {
      pageNumber += 1;
      const data = await getPictures(searchQuery.value, pageNumber);
      const dataArray = await data.hits;
      createGallery(dataArray);
      btnNext.classList.toggle('hidden');
    } else {
      window.removeEventListener('scroll', infiniteScroll);
      throw new Error(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.failure(`${error}`);
    btnNext.classList.add('hidden');
  }
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

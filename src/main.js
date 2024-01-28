import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const API_KEY = '41875605-6b47be3c8e074a549a6d5f149';
const BASE_URL = 'https://pixabay.com/api';

async function fetchImages(query, page = 1) {
  return axios
    .get(`${BASE_URL}/`, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 3, // TODO: change quantity
        page,
      },
    })
    .then(({ data }) => data.hits);
}

const refs = {
  searchForm: document.querySelector('form'),
  imagesContainer: document.querySelector('.gallery-container'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
  loader: document.querySelector('.loader'),
};

let query = '';
let page = 1;
let maxPage = 0;

const ERROR_MESSAGES = {
  noImages:
    'Sorry, there are no images matching your search query. Please try again!',
  enterQuery: 'Please enter a search query!',
};

refs.searchForm.addEventListener('submit', handleSearch);

async function handleSearch(event) {
  event.preventDefault();

  refs.imagesContainer.innerHTML = '';
  page = 1;

  const form = event.currentTarget;
  query = form.elements.input.value.trim();

  if (!query) {
    refs.imagesContainer.innerHTML = '';
    showIziToast(ERROR_MESSAGES.enterQuery);
    return;
  }

  try {
    showLoader();
    const data = await fetchImages(query);
    showImagesGallery(data);

    if (data.length > 0) {
      refs.loadMoreBtn.classList.remove('is-hidden');
      refs.loadMoreBtn.addEventListener('click', handleLoadMore);
    } else {
      refs.loadMoreBtn.classList.add('is-hidden');
    }
  } catch {
    onFetchError();
  } finally {
    hideLoader();
    form.reset();
  }
}

async function handleLoadMore() {
  page += 1;

  refs.loadMoreBtn.classList.add('is-hidden');
  showLoader();

  try {
    const data = await fetchImages(query, page);

    showImagesGallery(data);
    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();

    if (page === data.totalHits) {
      refs.loadMoreBtn.classList.add('is-hidden');
      refs.loadMoreBtn.removeEventListener('click', handleLoadMore);
    }
  }
}

function showImagesGallery(images) {
  const createQueryImagesMarkup = ({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  }) => `
      <li class="gallery">
      <a href="${largeImageURL}">
        <img class="image-preview" src="${webformatURL}" alt="${tags}">
      </a>
      <div class="image-description">
      <p>Likes ${likes}</p>
      <p>Views ${views}</p>
      <p>Comments ${comments}</p>
      <p>Downloads ${downloads}</p>
      </div>
    </li>
    `;

  const galleryMarkup = images.map(createQueryImagesMarkup).join('');

  refs.imagesContainer.insertAdjacentHTML('beforeend', galleryMarkup);
  lightbox.refresh();
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onFetchError() {
  showIziToast(ERROR_MESSAGES.noImages);
}

function showIziToast(
  message,
  messageColor = 'white',
  position = 'topRight',
  color = 'red'
) {
  iziToast.show({
    message,
    messageColor,
    position,
    color,
  });
}

function showLoader() {
  refs.loader.classList.remove('is-hidden');
}

function hideLoader() {
  refs.loader.classList.add('is-hidden');
}

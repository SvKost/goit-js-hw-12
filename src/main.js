import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '41875605-6b47be3c8e074a549a6d5f149';
const BASE_URL = 'https://pixabay.com/api';

async function fetchImages(query) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const response = await fetch(`${BASE_URL}/?${searchParams}`);
  const data = await response.json();
  return data.hits;
}

const refs = {
  searchForm: document.querySelector('form'),
  imagesContainer: document.querySelector('.gallery-container'),
};

const ERROR_MESSAGES = {
  noImages:
    'Sorry, there are no images matching your search query. Please try again!',
  enterQuery: 'Please enter a search query!',
};

refs.searchForm.addEventListener('submit', handleSearch);

async function handleSearch(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const query = form.elements.input.value.trim();

  if (query) {
    refs.imagesContainer.innerHTML = '';
    showLoader();

    try {
      const data = await fetchImages(query);
      if (data.length === 0) {
        showIziToast(ERROR_MESSAGES.noImages);
      } else {
        showImagesGallery(data);
      }
    } catch {
      onFetchError();
    } finally {
      hideLoader();
      form.reset();
    }
  } else {
    showIziToast(ERROR_MESSAGES.enterQuery);

    refs.imagesContainer.innerHTML = '';
  }
}

function showImagesGallery(images) {
  refs.imagesContainer.innerHTML = '';

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
  const loadingString = document.querySelector('.loader');
  loadingString.classList.remove('hidden');
}

function hideLoader() {
  const loadingString = document.querySelector('.loader');
  loadingString.classList.add('hidden');
}

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '41875605-6b47be3c8e074a549a6d5f149';
const BASE_URL = 'https://pixabay.com/api';

const searchForm = document.querySelector('form');
const imagesContainer = document.querySelector('.gallery-container');

searchForm.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const query = form.querySelector('input').value.trim();

  if (query) {
    imagesContainer.innerHTML = '';
    showLoader();

    fetchImages(query)
      .then(images => {
        if (images.length === 0) {
          iziToast.show({
            message:
              'Sorry, there are no images matching your search query. Please try again!',
            messageColor: 'white',
            position: 'topRight',
            color: 'red',
          });
        } else {
          showImagesGallery(images);
        }
      })
      .catch(onFetchError)
      .finally(() => {
        hideLoader();
        form.reset();
      });
  } else {
    iziToast.show({
      message: 'Please enter a search query!',
      messageColor: 'white',
      position: 'topRight',
      color: 'red',
    });

    imagesContainer.innerHTML = '';
  }
}

function fetchImages(query) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return fetch(`${BASE_URL}/?${searchParams}`).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json().then(data => data.hits);
  });
}

function showImagesGallery(images) {
  imagesContainer.innerHTML = '';

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

  imagesContainer.insertAdjacentHTML('beforeend', galleryMarkup);
  lightbox.refresh();
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onFetchError() {
  iziToast.show({
    message:
      'Sorry, there are no images matching your search query. Please try again!',
    messageColor: 'white',
    position: 'topRight',
    color: 'red',
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

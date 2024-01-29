import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const API_KEY = '41875605-6b47be3c8e074a549a6d5f149';
const BASE_URL = 'https://pixabay.com/api';

let query = '';
let page = 1;
let maxPage = 0;
let per_page = 40;

async function fetchImages(query, page = 1) {
  const response = await axios.get(`${BASE_URL}/`, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page,
      page,
    },
  });

  const { hits, totalHits } = response.data;
  maxPage = Math.ceil(totalHits / per_page);

  return { hits, totalHits };
}

const refs = {
  searchForm: document.querySelector('form'),
  imagesContainer: document.querySelector('.gallery-container'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
  loader: document.querySelector('.loader'),
};

refs.searchForm.addEventListener('submit', handleSearch);

const cardHeight = refs.imagesContainer.getBoundingClientRect().height;

async function handleSearch(event) {
  event.preventDefault();

  refs.imagesContainer.innerHTML = '';
  page = 1;

  const form = event.currentTarget;
  query = form.elements.input.value.trim();

  if (!query) {
    refs.imagesContainer.innerHTML = '';
    showIziToast(ERROR_MESSAGES.enterQuery);
    hideLoader();
    refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }

  try {
    const { hits, totalHits } = await fetchImages(query);
    showImagesGallery(hits);

    if (hits.length > 0 && hits.length !== totalHits) {
      showLoader();
      refs.loadMoreBtn.classList.remove('is-hidden');
      refs.loadMoreBtn.addEventListener('click', handleLoadMore);
      window.scrollBy({ top: cardHeight, behavior: 'smooth' });
    } else {
      refs.loadMoreBtn.classList.add('is-hidden');
      if (hits.length === 0) {
        showIziToast(ERROR_MESSAGES.noImages);
      } else {
        showIziToast(ERROR_MESSAGES.endOfResults);
      }
    }
  } catch (error) {
    showIziToast(ERROR_MESSAGES.noImages);
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
    const { hits } = await fetchImages(query, page);

    showImagesGallery(hits);

    if (page < maxPage) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    } else {
      refs.loadMoreBtn.classList.add('is-hidden');
      showIziToast(ERROR_MESSAGES.endOfResults);
      refs.loadMoreBtn.removeEventListener('click', handleLoadMore);
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
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

const ERROR_MESSAGES = {
  noImages:
    'Sorry, there are no images matching your search query. Please try again!',
  enterQuery: 'Please enter a search query!',
  endOfResults: "We're sorry, but you've reached the end of search results.",
};

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

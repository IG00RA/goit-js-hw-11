import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/styles.css';
import { fetchImages } from './fetchImages';

const HITS_PER_PAGE = 40;

let userInput = '';
let page = 1;
let totalPages = HITS_PER_PAGE;
let gallery = '';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
  text: document.querySelector('.end-list'),
};

const renderText = () => {
  refs.text.innerHTML =
    "We're sorry, but you've reached the end of search results.";
};

const render = data => {
  if (page === 1 && data.hits.length > 0) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  if (totalPages >= data.totalHits && data.hits.length > 0) {
    refs.button.classList.add('hidden');
    renderText();
  }
  if (data.hits.length < 1) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  fetchData(data);

  gallery = new SimpleLightbox('.gallery a');

  addScroll();
};

const loadMoreImgs = () => {
  page += 1;
  totalPages += HITS_PER_PAGE;
  gallery.refresh();
  fetchImages(userInput, render, page, HITS_PER_PAGE);
};

const handleSubmit = e => {
  e.preventDefault();
  totalPages = HITS_PER_PAGE;
  const { value } = e.target.elements.searchQuery;
  if (userInput === value.trim()) {
    return;
  }
  userInput = value.trim();
  if (userInput.length > 0) {
    page = 1;
    refs.button.classList.add('hidden');
    refs.gallery.innerHTML = '';
    fetchImages(userInput, render, page, HITS_PER_PAGE);
  }
  if (userInput.length < 1) {
    Notify.failure('Oops, please enter your request');
  }
  refs.text.innerHTML = '';
  refs.form.reset();
};

const addScroll = () => {
  if (page > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } else {
    refs.button.classList.remove('hidden');
  }
};

const fetchData = data => {
  const item = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="wrap">
         <div class="photo-card">
        <a class="gallery__link" href="${largeImageURL}">
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
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
  </div>
  </div>
                  `
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', item);
};

refs.form.addEventListener('submit', handleSubmit);
refs.button.addEventListener('click', loadMoreImgs);

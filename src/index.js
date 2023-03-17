import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchImages } from './js/fetchImages';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
  text: document.querySelector('.end-list'),
};
const HITS_PER_PAGE = 40;
let userInput = '';
let page = 1;
let totalPages = HITS_PER_PAGE;
let gallery = '';

const loadMoreImgs = () => {
  page += 1;
  totalPages += HITS_PER_PAGE;
  gallery.refresh();
  fetchImages(userInput, render, page);
};

refs.form.addEventListener('submit', handleSubmit);
refs.button.addEventListener('click', loadMoreImgs);

function handleSubmit(e) {
  e.preventDefault();
  const { value } = e.target.elements.searchQuery;
  userInput = value.trim();
  if (userInput.length > 0) {
    page = 1;
    fetchImages(userInput, render, page);
  }
  if (userInput.length < 1) {
    Notify.failure('Oops, please enter your request');
  }
  refs.form.reset();
}

function render(data) {
  if (page === 1) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  if (totalPages >= data.totalHits) {
    refs.button.classList.add('hidden');
    refs.text.classList.remove('hidden');
  }
  if (data.hits.length < 1) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

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
  gallery = new SimpleLightbox('.gallery a', {
    download: true,
    captionDelay: 250,
  });
  if (page > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
  refs.button.classList.remove('hidden');
}

import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchImages } from './js/fetchImages';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
};

let userInput = '';

refs.form.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const { value } = e.target.elements.searchQuery;
  userInput = value.trim();
  if (userInput.length > 0) {
    fetchImages(userInput, render);
  }
  if (userInput.length < 1) {
    Notify.failure('Oops, please enter your request');
  }
  refs.form.reset();
}

function render(data) {
  console.log(data.hits);
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
  refs.gallery.innerHTML = '';
  refs.gallery.insertAdjacentHTML('beforeend', item);
  new SimpleLightbox('.gallery a', { download: true, captionDelay: 250 });
}

import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/styles.css';
import { fetchImages } from './fetchImages';
import { debounce } from 'debounce';
import { PixabayResponse, Refs } from './infinity';

const HITS_PER_PAGE = 40;
const gallery: SimpleLightbox = new SimpleLightbox('.gallery a');

let userInput = '';
let page = 0;
let totalPages = 0;
let totalHits = 0;

const refs: Refs = {
  form: document.getElementById('search-form') as HTMLFormElement,
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
  text: document.querySelector('.end-list'),
  topButton: document.getElementById('myBtn') as HTMLButtonElement,
};

const renderText = () => {
  refs.text &&
    (refs.text.innerHTML =
      "We're sorry, but you've reached the end of search results.");
  refs.topButton && (refs.topButton.style.display = 'block');
  refs.button && refs.button.classList.add('hidden');
};

const handleData = (data: PixabayResponse): void => {
  totalHits = data.totalHits;
  refs.button?.classList.remove('hidden');
  if (page === 1 && data.hits.length > 0) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }
  if (totalPages >= data.totalHits && data.hits.length > 0) {
    renderText();
  }
  if (data.hits.length === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  renderGallery(data);
  if (page > 1) {
    addScroll();
  }
  gallery.refresh();
};

const loadMoreImgs = async () => {
  page += 1;
  totalPages += HITS_PER_PAGE;
  gallery.refresh();

  try {
    const imageData = await fetchImages(userInput, page, HITS_PER_PAGE);
    handleData(imageData);
  } catch (error) {
    Notify.failure(`${error.message}. Please try again.`);
  }
};

const handleSubmit = (e: Event) => {
  e.preventDefault();
  page = 0;
  totalPages = HITS_PER_PAGE;
  refs.button?.classList.add('hidden');
  const formEvent = e.target as HTMLFormElement;
  const { value } = formEvent?.elements['searchQuery'] as HTMLInputElement;
  if (userInput === value.trim()) {
    return;
  }
  userInput = value.trim();
  if (userInput.length > 0 && refs.gallery) {
    refs.gallery.innerHTML = '';
    loadMoreImgs();
  }
  if (userInput.length < 1) {
    Notify.failure('Oops, please enter your request');
  }
  refs.topButton && (refs.topButton.style.display = 'none');
  refs.text && (refs.text.innerHTML = '');
  refs.form?.reset();
};

const addScroll = () => {
  if (page > 1 && refs.gallery && refs.gallery.firstElementChild) {
    const { height: cardHeight } =
      refs.gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 3,
      behavior: 'smooth',
    });
  }
};

const renderGallery = data => {
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
  refs.gallery?.insertAdjacentHTML('beforeend', item);
};

const topFunction = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  refs.topButton && (refs.topButton.style.display = 'none');
};

refs.topButton && (refs.topButton.style.display = 'none');
refs.form?.addEventListener('submit', handleSubmit);
refs.topButton?.addEventListener('click', topFunction);
refs.button?.addEventListener('click', debounce(loadMoreImgs, 500));

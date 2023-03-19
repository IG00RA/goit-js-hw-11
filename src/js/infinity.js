import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/styles.css';
import { fetchImages } from './fetchImages';

const HITS_PER_PAGE = 40;
const gallery = new SimpleLightbox('.gallery a');
const observer = new IntersectionObserver(onButtonIntersect);

let userInput = '';
let page = 0;
let totalPages = HITS_PER_PAGE;
let totalHits = '';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
  text: document.querySelector('.end-list'),
  topButton: document.getElementById('myBtn'),
};

function onButtonIntersect(entities) {
  const [button] = entities;
  if (button.isIntersecting && totalPages < totalHits) {
    try {
      loadMoreImgs();
    } catch (error) {
      Notify.failure(`${error.message}. Please try again.`);
    }
  }
}

const renderText = () => {
  refs.text.innerHTML =
    "We're sorry, but you've reached the end of search results.";
  refs.topButton.style.display = 'block';
};

const handleData = ({ data }) => {
  totalHits = data.totalHits;
  if (page === 1 && data.hits.length > 0) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }
  if (totalPages >= data.totalHits && data.hits.length > 0) {
    renderText();
  } else {
    observer.observe(refs.button);
  }
  if (data.hits.length < 1) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  renderGallery(data);
  addScroll();
  gallery.refresh();
  observer.observe(refs.button);
};

const loadMoreImgs = async () => {
  page += 1;
  totalPages += HITS_PER_PAGE;
  gallery.refresh();
  const imageData = await fetchImages(userInput, page, HITS_PER_PAGE);
  handleData(imageData);
};

const handleSubmit = async e => {
  e.preventDefault();
  totalPages = HITS_PER_PAGE;
  const { value } = e.target.elements.searchQuery;
  if (userInput === value.trim()) {
    return;
  }
  userInput = value.trim();
  if (userInput.length > 0) {
    page = 1;
    refs.gallery.innerHTML = '';
    try {
      const imageData = await fetchImages(userInput, page, HITS_PER_PAGE);
      handleData(imageData);
    } catch (error) {
      Notify.failure(`${error.message}. Please try again.`);
    }
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
  refs.gallery.insertAdjacentHTML('beforeend', item);
};

const topFunction = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  refs.topButton.style.display = 'none';
};

refs.topButton.style.display = 'none';
refs.form.addEventListener('submit', handleSubmit);
refs.topButton.addEventListener('click', topFunction);

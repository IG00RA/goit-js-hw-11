var _a, _b;
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
let totalPages = 0;
let totalHits = 0;
const refs = {
    form: document.getElementById('search-form'),
    gallery: document.querySelector('.gallery'),
    button: document.querySelector('.load-more'),
    text: document.querySelector('.end-list'),
    topButton: document.getElementById('myBtn'),
};
function onButtonIntersect(entities) {
    if (entities.length > 0 &&
        entities[0].isIntersecting &&
        totalPages < totalHits &&
        refs.gallery &&
        refs.gallery.innerHTML) {
        loadMoreImgs();
    }
}
const renderText = () => {
    refs.text &&
        (refs.text.innerHTML =
            "We're sorry, but you've reached the end of search results.");
    refs.topButton && (refs.topButton.style.display = 'block');
};
const handleData = ({ data }) => {
    totalHits = data.totalHits;
    if (page === 1 && data.hits.length > 0) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    if (totalPages >= data.totalHits && data.hits.length > 0) {
        renderText();
    }
    if (data.hits.length === 0) {
        return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    renderGallery(data);
    if (page > 1) {
        addScroll();
    }
    gallery.refresh();
    refs.button && observer.observe(refs.button);
};
const loadMoreImgs = async () => {
    page += 1;
    totalPages += HITS_PER_PAGE;
    gallery.refresh();
    try {
        const imageData = await fetchImages(userInput, page, HITS_PER_PAGE);
        handleData(imageData);
    }
    catch (error) {
        Notify.failure(`${error.message}. Please try again.`);
    }
};
const handleSubmit = (e) => {
    var _a;
    e.preventDefault();
    page = 0;
    totalPages = HITS_PER_PAGE;
    const { value } = e.target.elements.namedItem('searchQuery');
    if (userInput === value.trim()) {
        return;
    }
    userInput = value.trim();
    if (userInput.length > 0) {
        refs.gallery && (refs.gallery.innerHTML = '');
        loadMoreImgs();
    }
    if (userInput.length < 1) {
        Notify.failure('Oops, please enter your request');
    }
    refs.topButton && (refs.topButton.style.display = 'block');
    refs.text && (refs.text.innerHTML = '');
    (_a = refs.form) === null || _a === void 0 ? void 0 : _a.reset();
};
const addScroll = () => {
    var _a;
    if (page > 1 && refs.gallery && refs.gallery.firstElementChild) {
        const { height: cardHeight } = (_a = refs.gallery.firstElementChild) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        window.scrollBy({
            top: cardHeight * 3,
            behavior: 'smooth',
        });
    }
};
const renderGallery = (data) => {
    var _a;
    const item = data.hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads, }) => `<div class="wrap">
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
                  `)
        .join('');
    (_a = refs.gallery) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', item);
};
const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    refs.topButton && (refs.topButton.style.display = 'none');
};
refs.topButton && (refs.topButton.style.display = 'none');
(_a = refs.form) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', handleSubmit);
(_b = refs.topButton) === null || _b === void 0 ? void 0 : _b.addEventListener('click', topFunction);

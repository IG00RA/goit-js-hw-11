var _a, _b, _c;
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/styles.css';
import { fetchImages } from './fetchImages';
import { debounce } from 'debounce';
const HITS_PER_PAGE = 40;
const gallery = new SimpleLightbox('.gallery a');
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
const renderText = () => {
    refs.text &&
        (refs.text.innerHTML =
            "We're sorry, but you've reached the end of search results.");
    refs.topButton && (refs.topButton.style.display = 'block');
    refs.button && refs.button.classList.add('hidden');
};
const handleData = (data) => {
    var _a;
    totalHits = data.totalHits;
    (_a = refs.button) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
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
    var _a, _b;
    e.preventDefault();
    page = 0;
    totalPages = HITS_PER_PAGE;
    (_a = refs.button) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    const formEvent = e.target;
    const { value } = formEvent === null || formEvent === void 0 ? void 0 : formEvent.elements['searchQuery'];
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
    (_b = refs.form) === null || _b === void 0 ? void 0 : _b.reset();
};
const addScroll = () => {
    if (page > 1 && refs.gallery && refs.gallery.firstElementChild) {
        const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
        window.scrollBy({
            top: cardHeight * 3,
            behavior: 'smooth',
        });
    }
};
const renderGallery = data => {
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
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    refs.topButton && (refs.topButton.style.display = 'none');
};
refs.topButton && (refs.topButton.style.display = 'none');
(_a = refs.form) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', handleSubmit);
(_b = refs.topButton) === null || _b === void 0 ? void 0 : _b.addEventListener('click', topFunction);
(_c = refs.button) === null || _c === void 0 ? void 0 : _c.addEventListener('click', debounce(loadMoreImgs, 500));

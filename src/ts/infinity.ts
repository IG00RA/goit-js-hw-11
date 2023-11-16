import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/styles.css';
import { fetchImages } from './fetchImages';

const HITS_PER_PAGE: number = 40;
const gallery: SimpleLightbox = new SimpleLightbox('.gallery a');

const observer = new IntersectionObserver(onButtonIntersect);

let userInput: string = '';
let page: number = 0;
let totalPages: number = 0;
let totalHits: number = 0;

interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  collections: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

interface Refs {
  form: HTMLFormElement | null;
  gallery: HTMLDivElement | null;
  button: HTMLButtonElement | null;
  text: HTMLParagraphElement | null;
  topButton: HTMLButtonElement | null;
}

interface MyIntersectionObserverEntry extends IntersectionObserverEntry {}

const refs: Refs = {
  form: document.getElementById('search-form') as HTMLFormElement,
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
  text: document.querySelector('.end-list'),
  topButton: document.getElementById('myBtn') as HTMLButtonElement,
};

function onButtonIntersect(entities: MyIntersectionObserverEntry[]): void {
  if (
    entities.length > 0 &&
    entities[0].isIntersecting &&
    totalPages < totalHits &&
    refs.gallery &&
    refs.gallery.innerHTML
  ) {
    loadMoreImgs();
  }
}

const renderText = (): void => {
  refs.text &&
    (refs.text.innerHTML =
      "We're sorry, but you've reached the end of search results.");
  refs.topButton && (refs.topButton.style.display = 'block');
};

const handleData = (data: PixabayResponse): void => {
  totalHits = data.totalHits;
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
  refs.button && observer.observe(refs.button);
};

const loadMoreImgs = async (): Promise<void> => {
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

const handleSubmit = (e: Event): void => {
  e.preventDefault();
  page = 0;
  totalPages = HITS_PER_PAGE;
  const { value } = (e.target as HTMLFormElement).elements.namedItem(
    'searchQuery'
  ) as HTMLInputElement;
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
  refs.form?.reset();
};

const addScroll = (): void => {
  if (page > 1 && refs.gallery && refs.gallery.firstElementChild) {
    const { height: cardHeight } =
      refs.gallery.firstElementChild?.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 3,
      behavior: 'smooth',
    });
  }
};

const renderGallery = (data): void => {
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
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  refs.topButton && (refs.topButton.style.display = 'none');
};

refs.topButton && (refs.topButton.style.display = 'none');
refs.form?.addEventListener('submit', handleSubmit);
refs.topButton?.addEventListener('click', topFunction);

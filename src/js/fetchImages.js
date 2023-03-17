import { Notify } from 'notiflix/build/notiflix-notify-aio';
export function fetchImages(userInput, render, page) {
  fetch(
    `https://pixabay.com/api/?key=34434498-1935a5c1deda7e012c81c56f8&q=${userInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  )
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    })
    .then(data => {
      render(data);
    })
    .catch(error => console.log(error));
}

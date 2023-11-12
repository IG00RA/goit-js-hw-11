import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api';
const KEY = '34434498-1935a5c1deda7e012c81c56f8';
const DEF_OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';

export const fetchImages = async (userInput, page, hits) => {
  const response = await axios.get(
    `${BASE_URL}/?key=${KEY}&q=${userInput}&${DEF_OPTIONS}&per_page=${hits}&page=${page}`
  );
  return response;
};

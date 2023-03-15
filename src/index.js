import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

const renderItem = (data, language) => {
  const item = data
    .map(
      ({ flags, name, capital, population }) =>
        `<li style="display: flex"><img src="${flags.svg}" alt="${name.official}" width="50px" height="40px"><h2 class="country-name"> ${name.official}</h2></li>
                <li><b>Capital:</b> ${capital}</li>
                <li><b>Population:</b> ${population}</li>
                <li><b>Languages:</b> ${language}</li>
                `
    )
    .join('');
  refs.list.innerHTML = '';
  refs.list.insertAdjacentHTML('beforeend', item);
};

const renderList = data => {
  const list = data
    .map(
      ({ flags, name }) =>
        `<li style="display: flex;font-size: x-large;align-items: center"><img src="${flags.svg}" alt="${name.official}" width="50px" height="40px"><p class="country-name"> ${name.official}</p></li>`
    )
    .join('');
  refs.list.innerHTML = '';
  refs.list.insertAdjacentHTML('beforeend', list);
};

function onInputChange(e) {
  const userInput = e.target.value.trim();
  e.target.value = userInput;
  if (e.target.value.length > 0) {
    fetchCountries(userInput, renderItem, renderList);
  }
  if (e.target.value.length === 0) {
    refs.list.innerHTML = '';
  }
}

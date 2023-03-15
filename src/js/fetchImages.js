import { Notify } from 'notiflix/build/notiflix-notify-aio';
export function fetchCountries(userInput, renderItem, renderList) {
  fetch(
    `https://restcountries.com/v3.1/name/${userInput}?fields=name,capital,population,flags,languages`
  )
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Notify.failure('Oops, there is no country with that name', {
        position: 'center-top',
      });
    })
    .then(data => {
      if (data) {
        if (data.length > 10) {
          return Notify.info(
            'Too many matches found. Please enter a more specific name.',
            {
              position: 'center-top',
            }
          );
        }
        if (data.length === 1) {
          const languages = data.map(d => d.languages);
          const lang = [];
          for (const el of languages) {
            lang.push(Object.values(el));
          }
          const language = lang.join(',').split(',').join(', ');
          return renderItem(data, language);
        }

        renderList(data);
      }
    });
}

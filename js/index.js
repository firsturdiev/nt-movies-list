const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

// Show movies

var elMoviesList = document.querySelector('.movies');
var tempMovie = document.querySelector('#tempMovie').content;
var moviesFragment = document.createDocumentFragment();
var movies = moviesData.slice(0, 50);

function showMovies(movies, searchWord) {
  elMoviesList.innerHTML = '';

  for (var i = 0; i < movies.length; i++) {
    var newMovie = tempMovie.cloneNode(true);
    newMovie.querySelector('.movie__poster').src = movies[i].youtubePoster;
    newMovie.querySelector('.movie__poster').alt = `Poster of ${movies[i].title}`;
    newMovie.querySelector('.movie__title').title = movies[i].title;
    if (searchWord.source !== '(?:)' && searchWord)
      newMovie.querySelector('.movie__title').innerHTML = movies[i].title.replace(searchWord, `<mark class="p-0 bg-warning">${searchWord.source}</mark>`);
    else
      newMovie.querySelector('.movie__title').textContent = movies[i].title;
    newMovie.querySelector('.movie__info-rating').textContent = movies[i].imdbRating;
    newMovie.querySelector('.movie__info-year').textContent = movies[i].year;
    newMovie.querySelector('.movie__info-duration').textContent = `${Math.ceil(movies[i].runtime / 60)}h ${movies[i].runtime % 60}min`;
    newMovie.querySelector('.movie__genres').textContent = movies[i].categories.join(', ');
    newMovie.querySelector('.movie__more-link').dataset.index = movies[i].imdbId;
    newMovie.querySelector('.movie__bookmark').dataset.uniqueId = movies[i].imdbId;

    if (bookmarks.findIndex(bookmark => bookmark.imdbId === movies[i].imdbId) >= 0) {
      newMovie.querySelector('.movie__bookmark').classList.add('movie__bookmark--added');
      newMovie.querySelector('.movie__bookmark').children[0].src = './img/icon-bookmark-added.svg';
      newMovie.querySelector('.movie__bookmark').children[1].textContent = 'Added to bookmark';
    }
    
    moviesFragment.appendChild(newMovie);
  }

  elMoviesList.appendChild(moviesFragment);
}

showMovies(movies, '');


// Show movie info 

var elMovieModal = document.querySelector('#movieModal');

elMoviesList.addEventListener('click', (e) => {
  if (e.target.matches('.movie__more-link')) {
    let movie = movies.find(movie => movie.imdbId === e.target.dataset.index);
    elMovieModal.dataset.uniqueId = movie.imdbId;
    elMovieModal.querySelector('.movie__title').textContent = movie.title;
    elMovieModal.querySelector('.movie__info-rating').textContent = movie.imdbRating;
    elMovieModal.querySelector('.movie__info-year').textContent = movie.year;
    elMovieModal.querySelector('.movie__info-duration').textContent = `${Math.ceil(movie.runtime / 60)}h ${movie.runtime % 60}min`;
    elMovieModal.querySelector('.movie__trailer').src = `https://www.youtube.com/embed/${movie.youtubeId}`;
    elMovieModal.querySelector('.movie__summary').textContent = movie.summary;
    elMovieModal.querySelector('.movie__imdb-link').href = `https://www.imdb.com/title/${movie.imdbId}`;
    elMovieModal.querySelector('.movie__bookmark').dataset.uniqueId = movie.imdbId;

    if (bookmarks.findIndex(bookmark => bookmark.imdbId === movie.imdbId) >= 0) {
      elMovieModal.querySelector('.movie__bookmark').classList.add('movie__bookmark--added');
      elMovieModal.querySelector('.movie__bookmark').children[0].src = './img/icon-bookmark-added.svg';
      elMovieModal.querySelector('.movie__bookmark').children[1].textContent = 'Added to bookmark';
    }
  }
})

elMovieModal.addEventListener('hidden.bs.modal', () => {
  elMovieModal.querySelector('.movie__trailer').src = '';
  elMovieModal.querySelector('.movie__bookmark').classList.remove('movie__bookmark--added');
  elMovieModal.querySelector('.movie__bookmark').children[0].src = './img/icon-bookmark-add.svg';
  elMovieModal.querySelector('.movie__bookmark').children[1].textContent = 'Add to bookmark';

  if (bookmarks.findIndex(bookmark => bookmark.imdbId === elMovieModal.dataset.uniqueId) >= 0) {
    elMoviesList.querySelector(`.movie__bookmark[data-unique-id="${elMovieModal.dataset.uniqueId}"`).classList.add('movie__bookmark--added');
    elMoviesList.querySelector(`.movie__bookmark[data-unique-id="${elMovieModal.dataset.uniqueId}"`).children[0].src = './img/icon-bookmark-added.svg';
    elMoviesList.querySelector(`.movie__bookmark[data-unique-id="${elMovieModal.dataset.uniqueId}"`).children[1].textContent = 'Added to bookmark';
  }
  else {
    elMoviesList.querySelector(`.movie__bookmark[data-unique-id="${elMovieModal.dataset.uniqueId}"`).classList.remove('movie__bookmark--added');
    elMoviesList.querySelector(`.movie__bookmark[data-unique-id="${elMovieModal.dataset.uniqueId}"`).children[0].src = './img/icon-bookmark-add.svg';
    elMoviesList.querySelector(`.movie__bookmark[data-unique-id="${elMovieModal.dataset.uniqueId}"`).children[1].textContent = 'Add to bookmark';
  }
})

// Filters

let filteredMovies = [];
const elFilters = document.querySelector('.filters');
const elFiltersQuery = elFilters.q;
const elFiltersCategories = elFilters.categories;
const elFiltersYearMin = elFilters.from_year;
const elFiltersYearMax = elFilters.to_year;
const elFiltersRating = elFilters.rating;
const elFiltersFilter = elFilters.filter;

function filterMovies(arr, option) {
  if (option === 'a-z') {
    arr.sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    })
  }
  else if (option === 'z-a') {
    arr.sort((a, b) => {
      if (a.title > b.title) return -1;
      if (a.title < b.title) return 1;
      return 0;
    })
  }
  else if (option === 'rating') {
    arr.sort((a, b) => {
      return b.imdbRating - a.imdbRating;
    })
  }
  else if (option === 'year') {
    arr.sort((a, b) => {
      return b.year - a.year;
    })
  }
}

elFilters.addEventListener('submit', e => {
  e.preventDefault();

  let regexSearch = new RegExp(elFiltersQuery.value.trim(), 'gi');
  filteredMovies = movies.filter(movie => {
    return (
      (movie.title.match(regexSearch)) &&
      (elFiltersCategories.value.includes('all') || movie.categories.includes(elFiltersCategories.value)) &&
      (movie.year >= (Number(elFiltersYearMin.value) || 1900) && movie.year <= (Number(elFiltersYearMax.value) || 2021)) &&
      (movie.imdbRating >= Number(elFiltersRating.value))
    );
  });

  if (filteredMovies.length > 0) {
    filterMovies(filteredMovies, elFiltersFilter.value)
    showMovies(filteredMovies, regexSearch);
  }
  else
    elMoviesList.innerHTML = '<p class="text-center fw-bold h2 mb-0">No movie found</p>'
})


// Bookmarks

elMoviesList.addEventListener('click', e => {
  if (e.target.matches('.movie__bookmark')) {
    if (e.target.matches('.movie__bookmark--added')) {
      e.target.classList.remove('movie__bookmark--added');
      e.target.children[0].src = './img/icon-bookmark-add.svg';
      e.target.children[1].textContent = 'Add to bookmark';

      let bookmarkIndex = bookmarks.findIndex(bookmark => e.target.dataset.uniqueId === bookmark.imdbId);
      bookmarks.splice(bookmarkIndex, 1);
      console.log(bookmarks);
    }
    else {
      e.target.classList.add('movie__bookmark--added');
      e.target.children[0].src = './img/icon-bookmark-added.svg';
      e.target.children[1].textContent = 'Added to bookmark';

      let newBookmark = movies.find(movie => e.target.dataset.uniqueId === movie.imdbId);
      bookmarks.push(newBookmark);
      console.log(bookmarks);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
})

elMovieModal.addEventListener('click', e => {
  if (e.target.matches('.movie__bookmark')) {
    if (e.target.matches('.movie__bookmark--added')) {
      e.target.classList.remove('movie__bookmark--added');
      e.target.children[0].src = './img/icon-bookmark-add.svg';
      e.target.children[1].textContent = 'Add to bookmark';

      let bookmarkIndex = bookmarks.findIndex(bookmark => e.target.dataset.uniqueId === bookmark.imdbId);
      bookmarks.splice(bookmarkIndex, 1);
      console.log(bookmarks);
    }
    else {
      e.target.classList.add('movie__bookmark--added');
      e.target.children[0].src = './img/icon-bookmark-added.svg';
      e.target.children[1].textContent = 'Added to bookmark';

      let newBookmark = movies.find(movie => e.target.dataset.uniqueId === movie.imdbId);
      bookmarks.push(newBookmark);
      console.log(bookmarks);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
})

// Pagination

// const elsPaginationLinks = document.querySelectorAll('.pagination__link');

// let numberOfItems = movies.length;
// const numberPerPage = 10;
// const currentPage = 1;
// let numberOfPages = Math.ceil(numberOfItems / numberPerPage);

// function accomodatePage(clickedPage) {
//   if (clickedPage <= 1) {
//     return clickedPage + 1;
//   }
//   if (clickedPage >= numberOfPages) {
//     return clickedPage - 1;
//   };

//   return clickedPage;
// }

// function buildPagination(clickedPage) {
//   const currPageNum = accomodatePage(clickedPage);

//   if (numberOfPages >= 5) {
//     for (let i = -1; i < 4; i++) {
//       elsPaginationLinks[i + 1].textContent = currPageNum + i;
//     }
//   }
//   else {
//     for (let i = 0; i < numberOfPages; i++) {
//       elsPaginationLinks[i + 1].textContent = i + 1;
//     }
//   }
// }

// function buildPage(currPage) {
//   const trimStart = (currPage - 1) * numberPerPage;
//   const trimEnd = trimStart + numberPerPage;

//   if (filteredMovies.length > 0) {
//     numberOfItems = filteredMovies.length;
//     numberOfPages = Math.ceil(numberOfItems / numberPerPage)
//     showMovies(filteredMovies.slice(trimStart, trimEnd), new RegExp(elFiltersQuery.value.trim(), 'gi'));
//     return;
//   }
//   showMovies(movies.slice(trimStart, trimEnd), '');
// }

// window.onload = () => {
//   buildPage(1);
//   buildPagination(currentPage);

//   elsPaginationLinks.forEach(link => {
//     link.addEventListener('click', (e) => {
//       e.preventDefault();

//       let clickedPage = Number(link.textContent);
//       buildPagination(clickedPage);
//       console.log(`Page clicked on ${clickedPage}`);
//       buildPage(clickedPage);
//     })
//   })
// }

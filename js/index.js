// Show movies

var elMoviesList = document.querySelector('.movies');
var tempMovie = document.querySelector('#tempMovie').content;
var moviesFragment = document.createDocumentFragment();
var movies = moviesData.slice(0, 100);

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
      movies[i].title;
    newMovie.querySelector('.movie__info-rating').textContent = movies[i].imdbRating;
    newMovie.querySelector('.movie__info-year').textContent = movies[i].year;
    newMovie.querySelector('.movie__info-duration').textContent = `${Math.ceil(movies[i].runtime / 60)}h ${movies[i].runtime % 60}min`;
    newMovie.querySelector('.movie__genres').textContent = movies[i].categories.join(', ');
    newMovie.querySelector('.movie__more-link').dataset.index = i;

    moviesFragment.appendChild(newMovie);
  }

  elMoviesList.appendChild(moviesFragment);
}

showMovies(movies, '');


// Show movie info 

var elMovieMoreBtn = document.querySelectorAll('.movie__more-link');
var elMovieModal = document.querySelector('#movieModal');

elMovieMoreBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    var movie = movies[Number(btn.dataset.index)];
    elMovieModal.querySelector('.movie__title').textContent = movie.title;
    elMovieModal.querySelector('.movie__info-rating').textContent = movie.imdbRating;
    elMovieModal.querySelector('.movie__info-year').textContent = movie.year;
    elMovieModal.querySelector('.movie__info-duration').textContent = `${Math.ceil(movie.runtime / 60)}h ${movie.runtime % 60}min`;
    elMovieModal.querySelector('.movie__trailer').src = `https://www.youtube.com/embed/${movie.youtubeId}`;
    elMovieModal.querySelector('.movie__summary').textContent = movie.summary;
    elMovieModal.querySelector('.movie__imdb-link').href = `https://www.imdb.com/title/${movie.imdbId}`;
  })
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

// Show movies

var elMoviesList = document.querySelector('.movies');
var tempMovie = document.querySelector('#tempMovie').content;
var moviesFragment = document.createDocumentFragment();
var movies = moviesData.slice(0, 50);

for (var i = 0; i < movies.length; i++) {
  var newMovie = tempMovie.cloneNode(true);
  newMovie.querySelector('.movie__poster').src = `http://i3.ytimg.com/vi/${movies[i].ytid}/maxresdefault.jpg`;
  newMovie.querySelector('.movie__poster').alt = `Poster of ${movies[i].Title}`;
  newMovie.querySelector('.movie__title').textContent = movies[i].Title;
  newMovie.querySelector('.movie__title').title = movies[i].Title;
  newMovie.querySelector('.movie__info-rating').textContent = movies[i].imdb_rating;
  newMovie.querySelector('.movie__info-year').textContent = movies[i].movie_year;
  newMovie.querySelector('.movie__info-duration').textContent = `${Math.ceil(movies[i].runtime / 60)}h ${movies[i].runtime % 60}min`;
  newMovie.querySelector('.movie__genres').textContent = movies[i].Categories.split('|').join(', ');
  newMovie.querySelector('.movie__more-link').dataset.index = i;

  moviesFragment.appendChild(newMovie);
}

elMoviesList.appendChild(moviesFragment);


// Show movie info 

var elMovieMoreBtn = document.querySelectorAll('.movie__more-link');
var elMovieModal = document.querySelector('#movieModal');

elMovieMoreBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    var movie = movies[Number(btn.dataset.index)];
    elMovieModal.querySelector('.movie__title').textContent = movie.Title;
      elMovieModal.querySelector('.movie__info-rating').textContent = movie.imdb_rating;
      elMovieModal.querySelector('.movie__info-year').textContent = movie.movie_year;
      elMovieModal.querySelector('.movie__info-duration').textContent = `${Math.ceil(movie.runtime / 60)}h ${movie.runtime % 60}min`;
      elMovieModal.querySelector('.movie__trailer').src = `https://www.youtube.com/embed/${movie.ytid}`;
      elMovieModal.querySelector('.movie__summary').textContent = movie.summary;
      elMovieModal.querySelector('.movie__imdb-link').href = `https://www.imdb.com/title/${movie.imdb_id}`;
  })
})
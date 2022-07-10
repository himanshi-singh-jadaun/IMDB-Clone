// function func(){

//   let search = $("#searchText").val()+event.key;
//   getMoviesDropDown(search);

// }
var movie_fav = [];
window.onload = function () {
  var temp = document.getElementById('searchText');
  if (temp) {
    temp.addEventListener('keyup', function (event) {
      if (event.code === 'Enter') {
        event.preventDefault();
      } else {
        let searchText = $("#searchText").val();
        getMoviesDropDown(searchText);
      }
    });
  }
}

$(document).ready(() => {
  $("#searchForm").on("submit", (e) => {
    let searchText = $("#searchText").val();
    getMovies(searchText);
    e.preventDefault();
  });
});
// localStorage.clear();
function getMoviesDropDown(searchText) {
  axios
    .get("https://www.omdbapi.com/?apikey=d48a63e2&s=" + searchText)
    .then((response) => {
      console.log(response);
      let movies = response.data.Search;
      let output = "";
      $.each(movies, (index, movie) => {
        output += `
            <div class="drop-down drop-row">

         
           <div><img src="${movie.Poster}" height="50" width="100"></div> 
           <div class="drop-movie">${movie.Title}</div>
   
           <div>
           <a onclick="saveMovie('${movie.imdbID}')" class="btn btn-danger">
           <i class="fa fa-heart"></i></a>
           <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-warning" href="#">Know More!</a>
           </div>
           

           </div>
       
        `;
      });

      $("#movies").html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}


function getMovies(searchText) {
  axios
    .get("https://www.omdbapi.com/?apikey=d48a63e2&s=" + searchText)
    .then((response) => {
      console.log(response);
      let movies = response.data.Search;
      let output = "";
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${movie.Poster}">
              <h5>${movie.Title}</h5>
              <div class="movie-button">
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
              
              </div>
              
              <div>
              <a   onclick="saveMovie('${movie.imdbID}')"  class=" btn btn-danger" href="#">
               <i class="fa fa-heart"></i>Add to favourites</a>
         
              </div>
              </div>
          </div>
       
        `;
      });

      $("#movies").html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getMoviesById(id) {
  axios
    .get("https://www.omdbapi.com/?apikey=d48a63e2&i=" + id)
    .then((response) => {
      let movie = response.data;
      movie_fav.push(movie);
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  window.location = "movie.html";
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem("movieId");

  axios
    .get("https://www.omdbapi.com/?apikey=d48a63e2&i=" + movieId)
    .then((response) => {
      console.log(response);
      let movie = response.data;

      let output = `
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a onclick="saveMovie('${movie.imdbID}')" class="btn btn-danger">
            <i class="fa fa-heart"></i>Add to favourites</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $("#movie").html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}


function output_movie_fav(movie_fav) {
  let output_favourite = "";
  movie_fav.forEach((movie) => {
    output_favourite += `
    <div class="col-md-3">
    <div class="well text-center">
      <img src="${movie.Poster}">
      <h5>${movie.Title}</h5>
      <div class="movie-button">
      <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Know More!</a>
      </div>
      <div>    
      <a onclick="deleteMovieFromLocal('${movie.imdbID}')" class="btn btn-light" href="#"><i class="fas fa-heart-broken"></i>Remove from favourites</a> 
  </div>
      
      </div>
  </div>
    `;
  })
  $("#favourite_movie").html(output_favourite);
}


// Is movie saved in Local Storage?
function checkMovies() {
  const isPresent = localStorage.getItem("movies");
  let movies = [];
  if (isPresent) movies = JSON.parse(isPresent);

  return movies;
}

// save movie to local storage
function saveMovie(movie) {


  let movies = checkMovies();

  movies.push(movie);
  localStorage.setItem("movies", JSON.stringify(movies));
}

// Fetching alarms from local storage
function fetchMovie() {
  let movies = checkMovies();
  movies.forEach((movie) => {
    getMoviesById(movie);
  });
  setTimeout(() => { output_movie_fav(movie_fav) }, 1000);
}


function deleteMovieFromLocal(movie) {
  let movies = checkMovies();

  const index = movies.indexOf(movie);
  movies.splice(index, 1);

  localStorage.setItem("movies", JSON.stringify(movies));
  location.reload();

  // fetchMovie();
}
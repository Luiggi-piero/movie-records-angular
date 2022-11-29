import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from 'src/app/models';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movies-home',
  templateUrl: './movies-home.component.html',
  styleUrls: ['./movies-home.component.scss'],
})
export class MoviesHomeComponent implements OnInit {
  movies: Movie[] = [];
  outstandingMovies: Movie[] = [];
  watchedMovies: Movie[] = [];

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.moviesService.getMovies().subscribe((movies: Movie[]) => {
      this.movies = movies;
    });
  }

  // Se actualiza con cada cambio de estado
  ngDoCheck(): void {
    if (this.movies.length && !this.watchedMovies.length) {
      this.outstandingMovies = this.movies.filter(
        (movie: Movie) => !movie.isFav && !movie.isWatched
      );
      this.watchedMovies = this.movies.filter(
        (movie: Movie) => movie.isWatched
      );
    }
  }

  onFavClick(movie: Movie): void {
    // Se invierte el estado de favorito
    // Si la pelicula es favorito entonces ya fue vista
    this.moviesService
      .updateMovie({
        ...movie,
        isFav: !movie.isFav, //false
        isWatched: !movie.isFav ? true : movie.isWatched, // true
      })
      .subscribe((updateMovie: Movie) => {
        if (updateMovie.isWatched) {
          // Pelicula vista
          const movieSeen = this.watchedMovies.find(
            (movie: Movie) => movie.id === updateMovie.id
          );
          // si existe la pelicula en watchedMovies lo actualiza
          if (movieSeen) {
            this.watchedMovies = this.watchedMovies.map((movie: Movie) => {
              if (movie.id === updateMovie.id) return updateMovie;
              else return movie;
            });
          }
          // No existe la pelicula en watchedMovies entonces lo agrega
          else this.watchedMovies.push(updateMovie);

          // Se retira la pelicula del arreglo outstandingMovies por que fue vista
          this.outstandingMovies = this.outstandingMovies.filter(
            (movie: Movie) => movie.id !== updateMovie.id
          );
        } else {
          this.watchedMovies = this.watchedMovies.filter(
            (movie: Movie) => movie.id !== updateMovie.id
          );
          // Pelicula no vista
          const unseenMovie = this.outstandingMovies.find(
            (movie: Movie) => movie.id === updateMovie.id
          );
          // si existe la pelicula en outstandingMovies lo actualiza
          if (unseenMovie) {
            this.outstandingMovies = this.outstandingMovies.map(
              (movie: Movie) => {
                if (movie.id === updateMovie.id) return updateMovie;
                else return movie;
              }
            );
          }
          // No existe la pelicula en watchedMovies entonces lo agrega
          else this.outstandingMovies.push(updateMovie);
        }
      });
  }
  onWatchedClick(movie: Movie): void {
    const movieTemp = { ...movie, isWatched: !movie.isWatched };
    // Si la pelicula no fue vista entonces no es favorita
    movieTemp.isFav = movieTemp.isWatched ? movieTemp.isFav : false;

    this.moviesService
      .updateMovie(movieTemp)
      .subscribe((updatedMovie: Movie) => {
        if (updatedMovie.isWatched) {
          this.watchedMovies.push(updatedMovie);
          this.outstandingMovies = this.outstandingMovies.filter(
            (movie: Movie) => movie.id !== updatedMovie.id
          );
        } else {
          this.watchedMovies = this.watchedMovies.filter(
            (movie: Movie) => movie.id !== updatedMovie.id
          );
          this.outstandingMovies.push(updatedMovie);
        }
      });
  }
}

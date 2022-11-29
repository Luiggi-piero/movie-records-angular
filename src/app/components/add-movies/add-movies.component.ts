import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Router } from '@angular/router';
import { Movie } from 'src/app/models';

@Component({
  selector: 'app-add-movies',
  templateUrl: './add-movies.component.html',
  styleUrls: ['./add-movies.component.scss'],
})
export class AddMoviesComponent implements OnInit {
  movieTitle: string = '';
  imageUrl: string = '';
  isFavorite: boolean = false;
  isWatched: boolean = false;

  constructor(private moviesService: MoviesService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.movieTitle && this.imageUrl) {
      const newMovie: Movie = {
        title: this.movieTitle,
        image: this.imageUrl,
        isFav: this.isFavorite,
        isWatched: this.isWatched,
        id: Math.round(Math.random() * 10000),
      };

      this.moviesService
        .addMovie(newMovie)
        .subscribe((movie: Movie) => this.router.navigate(['/']));
    }
  }
}

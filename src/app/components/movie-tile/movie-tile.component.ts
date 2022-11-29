import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faNotFav,
  faEye as faNotWatched,
} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-movie-tile',
  templateUrl: './movie-tile.component.html',
  styleUrls: ['./movie-tile.component.scss'],
})
export class MovieTileComponent implements OnInit {
  @Input() imageUrl: string = '';
  @Input() id: number = 0;
  @Input() isWatched: boolean = false;
  @Input() isFavorite: boolean = false;

  @Output() favoriteClick = new EventEmitter();
  @Output() watchedClick = new EventEmitter();

  // Establece las imagenes(opciones) por defecto
  faFavorite = faNotFav;
  faWatched = faNotWatched;

  constructor() {}

  ngOnInit(): void {
    this.faFavorite = this.isFavorite ? faHeart : faNotFav;
    this.faWatched = this.isWatched ? faEye : faNotWatched;
  }

  onFavoriteClick(): void {
    this.favoriteClick.emit();
  }

  onWatchedClick(): void {
    this.watchedClick.emit();
  }
}

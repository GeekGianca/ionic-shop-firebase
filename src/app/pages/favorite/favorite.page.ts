import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { FavoriteService } from 'src/app/services/favorite.service';
import { Favorite } from 'src/app/interfaces/favorites';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  private loading: any;
  public favorites = new Array<Favorite>();
  public favoritesUsr = new Array<Favorite>();
  private favoritSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private favoriteService: FavoriteService,
    private toastCtrl: ToastController) {
    this.favoritSubscription = this.favoriteService.getFavorites().subscribe(data => {
      this.favorites = data;
      this.favorites.forEach(fav => {
        if(fav.userId == this.authService.getAuth().currentUser.uid){
          this.favoritesUsr.push(fav);
        }
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.favoritSubscription.unsubscribe();
  }

  remover(id: string){
    this.favoriteService.deleteFavorite(id);
  }
}

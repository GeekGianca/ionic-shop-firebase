import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Favorite } from '../interfaces/favorites';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoritesCollections: AngularFirestoreCollection<Favorite>;
  private afstore: AngularFirestore;
  constructor(private afs: AngularFirestore) {
    this.favoritesCollections = this.afs.collection<Favorite>('FavProducts');
  }

  getFavorites() {
    return this.favoritesCollections.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  addFavorite(favorites: Favorite) {
    return this.favoritesCollections.add(favorites);
  }

  getFavorite(id: string) {
    return this.favoritesCollections.doc<Favorite>(id).valueChanges();
  }

  updateFavorite(id: string, favorite: Favorite) {
    return this.favoritesCollections.doc<Favorite>(id).update(favorite);
  }

  deleteFavorite(id: string) {
    return this.favoritesCollections.doc(id).delete();
  }
}

import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { Favorite } from 'src/app/interfaces/favorites';
import { Shop } from 'src/app/interfaces/shop';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  private productId: string = null;
  public product: Product = {};
  public productUpd: Product = {};
  public favorite: Favorite = {};
  public favorites = new Array<Favorite>();
  public shopCart: Shop = {};
  public shopCarts = new Array<Shop>();
  public cartTotal: number;
  public totalPrice: number;
  private totalCart: number;
  private loading: any;
  private productSubscription: Subscription;
  private favoriteSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private storage: Storage
  ) {
    this.productId = this.activatedRoute.snapshot.params['id'];
    this.cartTotal = 1;
    this.totalCart = 0;
    this.favorite = null;
    if (this.productId) this.loadProduct();
  }
  ngOnInit() {
  }

  ngOnDestroy(){
    this.productSubscription.unsubscribe();
  }

  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
      this.product = data;
      this.totalPrice = Number(this.product.price);
      this.storage.get("shopCart").then((val)=>{
        if(val != null){
          this.shopCarts = val;
        }
      });
    });
    this.favoriteSubscription = this.favoriteService.getFavorites().subscribe(data =>{
      this.favorites = data;
      this.favorites.forEach(fav =>{
        console.log('Favorite Objects',fav);
        if(fav.name == this.product.name && this.authService.getAuth().currentUser.uid == fav.userId){
          this.favorite = fav;
        }
      });
    });
  }

  async addOrRemoveFavorite(){
    console.log("Favorite object", this.favorite);
    console.log("Product object", this.product);
    if(this.favorite == {} || this.favorite == null){
      this.favorite = {};
      this.favorite.price = this.product.price;
      this.favorite.name = this.product.name;
      this.favorite.userId = this.authService.getAuth().currentUser.uid;
      this.favorite.picture = this.product.picture;
      this.favorite.description = this.product.descriptionShort;
      await this.favoriteService.addFavorite(this.favorite);
    }else{
      await this.favoriteService.deleteFavorite(this.favorite.id);
      this.favorite = null;
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  more(){
    console.log("More products");
    if(this.cartTotal < this.product.quantity){
      console.log("Enter");
      this.cartTotal = this.cartTotal + 1;
      this.totalPrice = this.totalPrice + this.totalPrice;
    }
  }

  remove(){
    console.log("Remove products");
    if(this.cartTotal > 1){
      this.cartTotal = this.cartTotal - 1;
      this.totalPrice = this.totalPrice - this.totalPrice;
    }
  }

  addCart(){
    this.shopCart.name = this.product.name;
    this.shopCart.picture = this.product.picture;
    this.shopCart.price = this.product.price;
    this.shopCart.totalQuantity = this.cartTotal;
    this.shopCart.totalPrice = this.totalPrice;
    this.shopCarts.push(this.shopCart);
    console.log(this.shopCarts);
    this.storage.set("shopCart", this.shopCarts);
    this.presentToast('Se agrego al carrito de compras');
    this.navCtrl.navigateBack("/shop");
  }
}

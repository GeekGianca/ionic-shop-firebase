import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Shop } from 'src/app/interfaces/shop';
import { Record } from 'src/app/interfaces/record';
import { Product } from 'src/app/interfaces/product';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { RecordService } from 'src/app/services/record.service';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  public shopCarts = new Array<Shop>();
  private record: Record = {};
  public totalShoping: number;
  private productsUpd: Product = {};
  private productsLst = new Array<Product>();
  private products = new Array<string>();
  private loading: any;
  private productsSubscription: Subscription;

  constructor(
    private recordService: RecordService,
    private storage: Storage,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private authService: AuthService,
    public alertController: AlertController) {
    this.totalShoping = 0;
    this.productsSubscription = this.productService.getProducts().subscribe(data => {
      this.productsLst = data;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.totalShoping = 0;
    this.products = new Array<string>();
    this.loadShopingCart();
  }

  loadShopingCart() {
    this.storage.get("shopCart").then((val) => {
      if (val != null) {
        this.shopCarts = val;
        this.shopCarts.forEach(obj => {
          this.products.push(obj.name);
          this.totalShoping = this.totalShoping + obj.totalPrice;
        });
      }
    });
  }

  eliminar(cart: Shop) {
    var index = this.shopCarts.indexOf(cart);
    this.shopCarts.splice(index);
    console.log(this.shopCarts);
    this.storage.remove('shopCart');
    this.storage.set('shopCart', this.shopCarts);
    this.totalShoping = this.totalShoping - cart.totalPrice;
    this.loadShopingCart();
  }

  async realizarCompra() {
    if (this.shopCarts.length > 0) {
      await this.presentLoading();
      this.record.createdAt = new Date().getTime();
      this.record.products = this.products;
      this.record.quantityProducts = this.shopCarts.length;
      this.record.totalPurchase = this.totalShoping;
      this.record.userId = this.authService.getAuth().currentUser.uid;
      this.productsLst.forEach(pls => {
        this.shopCarts.forEach(sc => {
          if (sc.name == pls.name) {
            this.productsUpd = pls;
            this.productsUpd.quantity = this.productsUpd.quantity - sc.totalQuantity;
            this.productService.updateProduct(this.productsUpd.id, this.productsUpd);
          }
        });
      });
      await this.recordService.addRecord(this.record);
      await this.loading.dismiss();
      this.storage.remove('shopCart');
      this.totalShoping = 0;
      this.shopCarts = new Array<Shop>();
      this.presentAlertConfirm('Compra realizada', 'Se ha realizado la compra exitosamente, puedes ver el detalle en tu historial.');
    } else {
      this.presentAlertConfirm('Carrito de compras vacio', 'No existen productos en stock en este momento.');
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Realizando compra...' });
    return this.loading.present();
  }

  async presentAlertConfirm(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
            this.navCtrl.navigateBack('/shop');
          }
        }
      ]
    });

    await alert.present();
  }
}

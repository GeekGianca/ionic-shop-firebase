import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  private loading: any;
  public products = new Array<Product>();
  private productsSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private toastCtrl: ToastController
  ) {
    this.productsSubscription = this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
  
  ngOnInit() {
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }

  favorite(id: string, isfavorite: boolean){
    
  }
}

import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Shop } from 'src/app/interfaces/shop';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  public totalCart: number;
  public shops = new Array<Shop>();
  public totalStore: number;
  constructor(private storage: Storage) {
    this.totalStore = 0;
   }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storage.get("shopCart").then((val) =>{
      if(val != null){
        this.shops = val;
        this.totalStore = this.shops.length;
        console.log(this.shops.length);
      }
    });
  }
}

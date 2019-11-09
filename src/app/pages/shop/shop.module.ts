import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShopPage } from './shop.page';

const routes: Routes = [
  {
    path: 'shop',
    component: ShopPage,
    children: [
      { path: 'product', loadChildren: '../product/product.module#ProductPageModule' },
      { path: 'cart', loadChildren: '../cart/cart.module#CartPageModule' },
      { path: 'history', loadChildren: '../history/history.module#HistoryPageModule' },
      { path: 'favorite', loadChildren: '../favorite/favorite.module#FavoritePageModule' }
    ]
  },
  {
    path: '',
    redirectTo: 'shop/product',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ShopPage]
})
export class ShopPageModule {}

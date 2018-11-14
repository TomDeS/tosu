import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ShoppingCartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ShopModule { }

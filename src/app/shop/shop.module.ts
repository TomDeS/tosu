import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { ProductsComponent } from './components/products/products.component';
import { BasketComponent } from './components/basket/basket.component';

@NgModule({
  declarations: [
    ProductsComponent,
    BasketComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ShopModule { }
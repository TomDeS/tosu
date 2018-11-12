import { Component, OnInit } from '@angular/core';

import { Product } from '../../../interfaces/shop/product';
import { Basket } from '../../../interfaces/shop/basket';
import { ShopService } from '../../../services/shop.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styles: []
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  basket: Basket[] = [];

  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.products = this.shopService.getProducts();
  }

  addToCart(productKey: number, i: number): void {
    // check if already added

    if (this.basket.find(x => x.$productKey === productKey)) {
      this.updateQuantity(productKey, 1);
    } else {
      this.addProduct(productKey);
    }
    console.log(JSON.stringify(this.basket));
  }

  updateQuantity(productKey, change): void {
    const i = this.basket.findIndex(p => p.$productKey === productKey);

    const newQuantity = this.basket[i].quantity + change;
    if (newQuantity === 0) {
      this.basket.splice(i, 1);
    } else {
      this.basket[i].quantity = newQuantity;
    }
  }

  addProduct(productKey): void {
    const product = this.products.filter(obj => {
      return obj.$key === productKey;
    });


    this.basket.push(
      {
        $productKey: product[0].$key,
        name: product[0].name,
        price: product[0].price,
        quantity: 1
      }
    );

  }

}

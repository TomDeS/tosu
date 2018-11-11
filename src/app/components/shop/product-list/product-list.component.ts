import { Component, OnInit } from '@angular/core';

import { Product } from '../../../interfaces/shop/product';
import { ShopService } from '../../../services/shop.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styles: []
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
 
  category: string;

  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.products = this.shopService.getProducts();
  }

  addToCart(){

  }

}

import { Injectable } from '@angular/core';

import { PRODUCTS } from '../data/default-products';

@Injectable({
  providedIn: 'root'
})
export class ShopService {


  getProducts() {
    return PRODUCTS;
  }

  constructor() { }
}

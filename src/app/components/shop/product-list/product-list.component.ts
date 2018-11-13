/*
  @TODO: we needed this running ASAP. Needs a lot of refactoring.
*/

import { Component, OnInit } from '@angular/core';

import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  basketForm: FormGroup;

  items: Observable<any[]>;

  constructor(private shopService: ShopService, private fb: FormBuilder, db: AngularFirestore) {
    this.items = db.collection('items').valueChanges();
  }

  ngOnInit() {
    this.products = this.shopService.getProducts();

    this.basketForm = this.fb.group({
      name: '',
      additionalProducts: this.fb.array([]),
      standardProducts: '',
      timestamp: '',
    })

  }


  get additionalProductsForm() {
    return this.basketForm.get('additionalProducts') as FormArray
  }

  addAdditionalProduct() {
    const additionalProduct = this.fb.group({
      quantity: [],
      productName: [],
    })

    this.additionalProductsForm.push(additionalProduct);
  }

  deleteAdditionalProduct(i) {
    this.additionalProductsForm.removeAt(i)
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



  addToCart(productKey: number, i: number): void {
    // check if already added
    if (this.basket.find(x => x.$productKey === productKey)) {
      this.updateQuantity(productKey, 1);
    } else {
      this.addProduct(productKey);
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

    this.basketForm.patchValue({
      standardProducts: (this.basket),
      timestamp: Date.now()
    });

  }


}

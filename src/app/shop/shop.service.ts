import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class ShopService {

  private dbPath = '/';

  webshopRef: AngularFireList<any> = null;

  constructor(private db: AngularFireDatabase) {
    this.webshopRef = db.list(this.dbPath);
  }

  getAllProducts(): any {
    return this.db.list('products').valueChanges();
  }

  getCart(): AngularFireList<any> {
    return this.db.list('/basket');
  }

  updateCart(key: string, value: any): any {
    let self = this;
    this.db.list('/basket').update(key, value).catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }

}

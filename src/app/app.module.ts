import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BankaccountComponent } from './components/bankaccount/bankaccount.component';
import { PlayerComponent } from './components/player/player.component';
import { ProductListComponent } from './components/shop/product-list/product-list.component';
import { ProductFilterComponent } from './components/shop/product-filter/product-filter.component';
import { ShoppingCartComponent } from './components/shop/shopping-cart/shopping-cart.component';



@NgModule({
  declarations: [
    AppComponent,
    BankaccountComponent,
    PlayerComponent,
    ProductListComponent,
    ProductFilterComponent,
    ShoppingCartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'be-tosu'),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

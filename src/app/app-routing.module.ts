import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankaccountComponent } from './bankaccounts/components/bankaccount/bankaccount.component';
import { PlayerComponent } from './players/containers/player/player.component';
import { ProductsComponent } from './shop/components/products/products.component';
import { BasketComponent } from './shop/components/basket/basket.component';

const routes: Routes = [
  { path: '', component: PlayerComponent, pathMatch: 'full' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'fries', component: ProductsComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'bankaccount', component: BankaccountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

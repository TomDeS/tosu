import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankaccountComponent } from './components/bankaccount/bankaccount.component';
import { PlayerComponent } from './components/player/player.component';
import { ProductListComponent } from './components/shop/product-list/product-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'fries', component: ProductListComponent },
  { path: 'home', component: PlayerComponent },
  { path: 'tools', component: BankaccountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

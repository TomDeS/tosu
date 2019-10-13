import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankaccountComponent } from './bankaccount/components/bankaccount/bankaccount.component';
import { PlayerComponent } from './player/containers/player/player.component';


const routes: Routes = [
  { path: '', component: PlayerComponent, pathMatch: 'full' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'tools', component: BankaccountComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

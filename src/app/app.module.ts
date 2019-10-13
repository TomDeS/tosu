import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BankaccountComponent } from './bankaccount/components/bankaccount/bankaccount.component';
import { PlayerDetailComponent } from './player/components/player-detail/player-detail.component';
import { PlayerNyanComponent } from './player/components/player-nyan/player-nyan.component';
import { PlayerComponent } from './player/containers/player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    BankaccountComponent,
    PlayerDetailComponent,
    PlayerNyanComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

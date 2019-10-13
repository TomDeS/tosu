import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerDetailComponent } from './components/player-detail/player-detail.component';
import { PlayerComponent } from './containers/player/player.component';
import { PlayerNyanComponent } from './components/player-nyan/player-nyan.component';

@NgModule({
  declarations: [PlayerDetailComponent, PlayerComponent, PlayerNyanComponent],
  imports: [
    CommonModule
  ]
})
export class PlayerModule { }

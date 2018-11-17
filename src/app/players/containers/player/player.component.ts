import { Component, OnInit } from '@angular/core';

// Services
import { Player } from '../../models/player.interface';
import { PlayerService } from '../../player.service';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styles: []
})
export class PlayerComponent implements OnInit {
  players: Player[];

  addPlayer(newPlayer): void {
    if (newPlayer) {
      this.players.push(
        {
          timestamp: Date.now(),
          name: newPlayer,
          score: 0
        }
      );
    }
  }


  constructor(private playerService: PlayerService) { }

  ngOnInit() {
  }

}

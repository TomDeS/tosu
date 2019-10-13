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
  nyanify: boolean = false;
  playing: boolean = false;


  getDefaultPlayers(): void {
    this.players = this.playerService.getDefaultPlayers();
  }


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

  removePlayer(i: number): void {
    this.players.splice(i, 1);
    this.playerService.updateLocalStorage(this.players);
  }


  startRandom(nyan): void {
    // Shared
    const playersLength: number = this.players.length;
    this.playing = true;


    if (nyan) {
      // call nyan logic
    } else {
      const minScore = 5;
      const maxScore: number = (playersLength >= (100 - minScore)) ? playersLength : 100;

      this.playerService.assignRandomValues(this.players, playersLength, minScore, maxScore);
    }

  }


  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.getDefaultPlayers();
  }

}

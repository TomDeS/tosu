// Angular
import { Component, OnInit } from '@angular/core';


// Services
import { Player } from '../../models/player.interface';
import { PlayerService } from '../../player.service';



@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styles: []
})

export class PlayerDetailComponent implements OnInit {


  players: Player[];
  winners: Player[];
  unit = '%';
  className = 'progress-bar';


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

  onSelect(i: number): void {
    this.players.splice(i, 1);
    this.playerService.updateLocalStorage(this.players);
  }

  getDefaultPlayers(): void {
    this.players = this.playerService.getDefaultPlayers();
  }


  startRandom(): void {
    const playersLength: number = this.players.length;
    const minScore = 5;
    const maxScore: number = (playersLength >= (100 - minScore)) ? playersLength : 100;

    this.playerService.assignRandomValues(this.players, playersLength, this.unit, this.className, minScore, maxScore);
  }


  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.getDefaultPlayers();
    // this.getHistory(); @TODO implement history based on local storage
    // this.winners = this.playerService.getWinners();
  }


}

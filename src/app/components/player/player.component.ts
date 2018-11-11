// Angular
import { Component, OnInit } from '@angular/core';


// Services
import { Player } from '../../interfaces/player.interface';
import { TosuService } from '../../services/tosu.service';



@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styles: []
})
export class PlayerComponent implements OnInit {


  players: Player[];
  winners: Player[];
  unit: string = '%';
  className: string = 'progress-bar';


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
    this.tosuService.updateLocalStorage(this.players);
  }

  getDefaultPlayers(): void {
    this.players = this.tosuService.getDefaultPlayers();
  }


  startRandom(): void {
    const playersLength: number = this.players.length;
    const minScore: number = 5;
    const maxScore: number = (playersLength >= (100 - minScore)) ? playersLength : 100;

    this.tosuService.assignRandomValues(this.players, playersLength, this.unit, this.className, minScore, maxScore);
  }


  constructor(private tosuService: TosuService) { }

  ngOnInit() {
    this.getDefaultPlayers();
    // this.getHistory(); @TODO implement history based on local storage
    this.winners = this.tosuService.getWinners();
  }


}

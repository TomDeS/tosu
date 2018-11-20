import { Component, OnInit, Input } from '@angular/core';



import { Player } from '../../models/player.interface';
import { PlayerService } from '../../player.service';



@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styles: []
})

export class PlayerDetailComponent implements OnInit {
  @Input() players: Player[];


  winners: Player[];

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    // this.getHistory(); @TODO implement history based on local storage
    // this.winners = this.playerService.getWinners();
  }


}

import { Component, OnInit, Input } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

import { Player } from '../../models/player.interface';
import { PlayerService } from '../../player.service';
import { NyanService } from '../../nyan.service';


@Component({
  selector: 'app-player-nyan',
  templateUrl: './player-nyan.component.html',
  styles: []
})
export class PlayerNyanComponent implements OnInit {
  @Input() players: Player[];

  @ViewChild('nyanCanvas', {static: false}) nyanCanvas: ElementRef;
  public context: CanvasRenderingContext2D;


  names = [];
  winner: string;

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.nyanCanvas.nativeElement).getContext('2d');

    this.createGraph();
  }


  createGraph() {
    const playersLength: number = this.names.length;
    this.nyanService.createGraph(this.names, playersLength, this.context);


  }

  getNames(players) {
    let names = [];
    for (let i = 0; i < players.length; i++) {
      names[i] = this.players[i].name;
    }

    return names;
  }

  constructor(private playerService: PlayerService, private nyanService: NyanService) {
  }

  ngOnInit() {
    this.names = this.getNames(this.players);
  }


}

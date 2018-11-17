import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

import { PlayerService } from '../../player.service';

@Component({
  selector: 'app-player-nyan',
  templateUrl: './player-nyan.component.html',
  styles: []
})
export class PlayerNyanComponent implements OnInit {

  @ViewChild('nyanCanvas') nyanCanvas: ElementRef;
  public context: CanvasRenderingContext2D;


  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.nyanCanvas.nativeElement).getContext('2d');
    
    this.createGraph(this.names);
  }

  names = ["Player1", "Player2", "Player3", "Player4"];

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
  }


  createGraph(names) {
    this.playerService.createGraph(names, this.context);
  }
}

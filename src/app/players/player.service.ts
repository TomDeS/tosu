import { Injectable } from '@angular/core';

import { Player } from './models/player.interface';
import { PLAYERS } from './data/default-players';
import { TosuService } from '../tosu.service';


@Injectable({
  providedIn: 'root'
})

export class PlayerService {
  winner: Player[] = [];

  getDefaultPlayers(): Player[] {
    const local = this.checkLocalStorage();

    if (local) {
      return local;
    } else {
      return PLAYERS;
    }
  }

  checkLocalStorage(storage?: string) {
    // Returns false if there's nothing in local storage.
    // Otherwise, returns value
    const localPlayers = localStorage.getItem('players');

    return localPlayers ? JSON.parse(localPlayers) : false;

  }


  updateLocalStorage(playerHistory: Player[]) {


    localStorage.setItem('players', JSON.stringify(playerHistory));

    // Get winner of this round
    const max = playerHistory.reduce(function (prev, current) {
      if (+current.score > +prev.score) {
        return current;
      } else {
        return prev;
      }
    });

    // add winner to local storage
    this.winner.push(max);

    // only remember last 20 entries
    if (this.winner.length > 20) {
      this.winner.splice(0, 1);
    }
    localStorage.setItem('history', JSON.stringify(this.winner));
  }


  getWinners() {

    return this.winner;

  }


  assignRandomValues(players: Player[], nrPlayers: number, unit: string, className: string, minScore: number, maxScore: number) {
    const numbers = [];
    let unique = [];
    const playerHistory: Player[] = [];
    const check = [];

    for (; unique.length < nrPlayers;) {
      numbers.push(this.tosuService.getRandomNumber(minScore, maxScore));
      unique = Array.from(new Set(numbers));
    }

    // Assign random numbers to class
    const now: number = Date.now();
    for (let i = 0; i < nrPlayers; i++) {
      this.givePoints(className, i, unique[i], unit);

      playerHistory[i] = {
        timestamp: now,
        name: players[i].name,
        score: unique[i]
      };

    }
    check[0] = {
      $key: 0,
      result: playerHistory
    };

  }

  givePoints(className: string, i: number, value: number, unit: string) {
    const id = className + i;

    document.getElementById(id).style.width = value + unit;
    document.getElementById(id).innerText = value + ' points';
  }

  constructor(private tosuService: TosuService) { }

}

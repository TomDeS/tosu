import { Injectable } from '@angular/core';

// Interfaces
import { Player, defaultPlayers } from '../interfaces/player.interface';

// Data
import { PLAYERS } from '../data/default-players';



@Injectable({
  providedIn: 'root'
})
export class TosuService {

  getRandomNumber(lower: number, upper: number) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }

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

  winner: Player[] = [];

  updateLocalStorage(playerHistory: Player[]) {


    localStorage.setItem('players', JSON.stringify(playerHistory));

    // Get winner of this round
    var max = playerHistory.reduce(function (prev, current) {
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
    let numbers = [];
    let unique = [];
    let playerHistory: Player[] = [];
    let check = [];

    for (; unique.length < nrPlayers;) {
      numbers.push(this.getRandomNumber(minScore, maxScore));
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
    console.log(JSON.stringify(check));

  }

  givePoints(className: string, i: number, value: number, unit: string) {
    const id = className + i;

    document.getElementById(id).style.width = value + unit;
    document.getElementById(id).innerText = value + ' points';
  }

  constructor() {
  }

}

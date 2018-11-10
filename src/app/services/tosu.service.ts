import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TosuService {

  getRandomNumber(lower: number, upper: number) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }


  constructor() { }
}

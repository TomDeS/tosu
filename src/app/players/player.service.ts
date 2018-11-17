import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { ViewChild, ElementRef } from '@angular/core';


import { Player } from './models/player.interface';
import { PLAYERS } from './data/default-players';
import { TosuService } from '../tosu.service';




@Injectable({
  providedIn: 'root'
})

export class PlayerService {


  winner: Player[] = [];
  nyanChart = [];

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







  changeDataSets(i, nrOfSimulations, indices, labels, yVals, datas, names, nrOfNames, myChart) {
    if (i <= nrOfSimulations) {
      indices = [];
      labels.push("dummy");

      for (var t = 0; t < nrOfNames; t++) {
        var count = 0;
        for (var z = 0; z < nrOfNames; z++) {
          if (yVals[t] < yVals[z] && t != z) {
            count++;
          }
        }
        indices[count] = t;
      }

      var percentageOfSimulations = i / nrOfSimulations;

      for (var t = 0; t < nrOfNames; t++) {
        var value = yVals[t];
        if (t == indices[0]) {
          value = value + this.randn_bm(1, percentageOfSimulations);
        } else if (t == indices[nrOfNames - 1]) {
          value = value + this.randn_bm(-1, percentageOfSimulations);
        } else {
          value = value + this.randn_bm(0, percentageOfSimulations);
        }
        yVals[t] = value;
        datas[t].push(value);
      }

      var str = "Wie gaat er om frieten? ";
      for (var t = 0; t < nrOfNames; t++) {
        if (t < nrOfNames - 2) {
          str += names[indices[t]] + ", ";
        }
        if (t == nrOfNames - 2) {
          str += names[indices[t]] + " of ";
        }
        if (t == nrOfNames - 1) {
          str += names[indices[t]] + "...";
        }
      }

      myChart.update();
      document.getElementById('wie').innerHTML = str;
      if (i === nrOfSimulations) {
        document.getElementById('wie').innerHTML = "Wie gaat er om frieten? " + names[indices[0]] + "!!!";
      }
    }
  }









  randn_bm(bool, percentageOfSimulations) {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    var stdMultiplier = 4;
    if (percentageOfSimulations > 0.95) {
      stdMultiplier = 8;
    } else if (percentageOfSimulations > 0.9) {
      stdMultiplier = 7.5;
    } else if (percentageOfSimulations > 0.8) {
      stdMultiplier = 7;
    }

    var rdn = stdMultiplier * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    if (bool == 0) {
      return rdn;
    } else if (bool == -1) {
      //loser
      var newRdn = Math.random();
      if (newRdn > 0.95) {
        //52.5% change to increase
        rdn = Math.abs(rdn);
      }
      return rdn;
    } else {
      //winner
      var newRdn = Math.random();
      if (newRdn > 0.95) {
        //52.5% change to decrease
        rdn = -Math.abs(rdn);
      }
      return rdn;
    }
  }


  handleSound(sound, soundPlaying, soundButton) {
    if (Boolean(soundPlaying)) {
      sound.pause();
      soundPlaying = 0;
      soundButton.firstElementChild.src = "assets/img/nosound.png";
    } else {
      sound.play();
      soundPlaying = 1;
      soundButton.firstElementChild.src = "assets/img/sound.png";
    }
    return soundPlaying;
  }



  createGraph(names, ctx) {
    const nrOfNames = names.length;
    const nrOfSimulations = 700;
    var factor = Math.floor(nrOfNames / 3);

    var i = 1;
    var indices = [];

    //variable to store gradient
    // var ctx = this.context;

    //creating the gradient of the line in the chart
    var gradientStroke = ctx.createLinearGradient(0, 0, 0, 450);
    gradientStroke.addColorStop(0.25, "rgba(244, 67, 54, 1)");
    gradientStroke.addColorStop(0.35, "rgba(255, 152, 0, 1)");
    gradientStroke.addColorStop(0.5, "rgba(255, 235, 59, 1)");
    gradientStroke.addColorStop(0.6, "rgba(76, 175, 80, 1)");
    gradientStroke.addColorStop(0.8, "rgba(33, 150, 243, 1)");
    gradientStroke.addColorStop(1, "rgba(103, 58, 183, 1)");

    //creating the gradient of the fill in the chart
    var gradientFill = ctx.createLinearGradient(0, 0, 0, 450);

    const nr = 300

    var labels = ["dummy"];
    for (var l = 1; l < nr + 1; l++) {
      labels.push("dummy");
    }

    var yVals = [250];
    for (var t = 1; t < nrOfNames; t++) {
      yVals.push(250);
    }

    var datas = [];
    for (var t = 0; t < nrOfNames; t++) {
      var yVal = yVals[t];
      var data1 = [yVal];
      for (var j = 1; j < nr + 1; j++) {
        yVal = yVal + this.randn_bm(0, 0);
        data1.push(yVal);
        yVals[t] = yVal;
      }
      datas.push(data1);
    }

    var cat = new Image();

    cat.src = "assets/img/NyanCat.png";
    cat.width = 100 * 0.8 ^ factor;
    cat.height = 50 * 0.8 ^ factor;
    Chart.pluginService.register({
      afterUpdate: function (chart) {
        for (var index = 0; index < chart.config.data.datasets.length; index++) {
          chart.config.data.datasets[index]._meta[0].data[labels.length - 1]._model.pointStyle = cat;
          var xCo = chart.config.data.datasets[index]._meta[0].data[labels.length - 1]._model.x;
          var yCo = chart.config.data.datasets[index]._meta[0].data[labels.length - 1]._model.y;
        }
      }
    });

    var listOfDataSets = [];
    for (var t = 0; t < nrOfNames; t++) {
      var newSet = {
        borderColor: gradientStroke,
        pointBorderColor: gradientStroke,
        pointBackgroundColor: gradientStroke,
        pointHoverBackgroundColor: gradientStroke,
        pointHoverBorderColor: gradientStroke,
        pointBorderWidth: 10,
        pointHoverRadius: 1,
        pointHoverBorderWidth: 5,
        pointRadius: 0,
        fill: true,
        backgroundColor: gradientFill,
        borderWidth: 4 * 0.7 ^ factor,
        data: datas[t]
      }
      listOfDataSets.push(newSet);
    }

    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: listOfDataSets
      },
      options: {
        showAllTooltips: true,
        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              return names[tooltipItem.datasetIndex];
            },
            label: function (tooltipItem, data) {
              return names[tooltipItem.datasetIndex];
            }
          }
        },
        scaleShowLabels: false,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "none"
        },
        scales: {
          yAxes: [
            {
              position: "right",
              ticks: {
                fontColor: "#303F9F",
                beginAtZero: true,
                maxTicksLimit: 1,
                padding: 100
              },
              gridLines: {
                drawTicks: false,
                display: false,
                drawBorder: false
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                display: false
              },
              gridLines: {
                zeroLineColor: "transparent",
                drawTicks: false,
                display: false,
                drawBorder: false
              }
            }
          ]
        }
      }
    });
    myChart.too


    setInterval(() => { this.changeDataSets(i++, nrOfSimulations, indices, labels, yVals, datas, names, nrOfNames, myChart); }, 1);

  }


}
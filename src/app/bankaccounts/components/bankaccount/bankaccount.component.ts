import { Component, OnInit } from '@angular/core';

import { Account, CountryFormat } from '../../models/account.interface';
import { TosuService } from '../../../tosu.service';
import { BankaccountService } from '../../bankaccount.service';


@Component({
  selector: 'app-bankaccount',
  template: `
    <div class="card">
    <button (click)="generateAccounts([['Belgian', 'BE'], ['Dutch', 'NL']])" class="btn btn-outline-primary" >
      Generate another set
    </button>
    <button (click)="generateAccounts([['Belgian', 'BE']])" class="btn btn-outline-primary" >
      Generate Belgian account
    </button>
    <button (click)="generateAccounts([['Dutch', 'NL']])" class="btn btn-outline-primary" >
      Generate Dutch account
    </button>

      <ul>
        <li *ngFor="let account of accounts; let i = index;">
          Random valid {{account.country}} bank account: {{account.account}}
        </li>
      </ul>
    
    </div>
    
  `,
  styles: []
})

export class BankaccountComponent implements OnInit {
  accounts: Account[] = [];
  countries: CountryFormat[] = [];


  constructor(private tosuService: TosuService, private bankaccountService: BankaccountService) { }

  ngOnInit() {
    this.generateAccounts([['Belgian', 'BE'], ['Dutch', 'NL']]);
  }


  generateAccounts(countries) {
    const length = countries.length;

    for (let i = 0; i < length; i++) {
      // Generate accounts
      this.accounts.push(
        {
          country: countries[i][0],
          code: countries[i][1],
          account: this.bankaccountService.generateBankAccount(countries[i][1])
        }
      );
    }

  }


}

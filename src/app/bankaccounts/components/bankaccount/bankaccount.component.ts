import { Component, OnInit } from '@angular/core';

import { Account, CountryFormat } from '../../models/account.interface';
import { TosuService } from '../../../tosu.service';
import { BankaccountService } from '../../bankaccount.service';


@Component({
  selector: 'app-bankaccount',
  template: `
    <div class="card">
      <ul>
        <li *ngFor="let account of accounts; let i = index;">
          Random valid {{account.country}} bank account number: {{account.account}}
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
    //    this.generateAccounts([['Dutch', 'NL', 10, true], ['Belgian', 'BE', 9, false]]);
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

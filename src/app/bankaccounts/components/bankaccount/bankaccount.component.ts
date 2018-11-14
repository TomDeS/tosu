import { Component, OnInit } from '@angular/core';

import { TosuService } from '../../../tosu.service';
import { BankaccountService } from '../../bankaccount.service';


@Component({
  selector: 'app-bankaccount',
  template: `
    <div class="card">
      Random valid Dutch bank account number: <span id='nl-account'>...</span>
    </div>
  `,
  styles: []
})

export class BankaccountComponent implements OnInit {

  constructor(private tosuService: TosuService, private bankaccountService: BankaccountService) { }

  ngOnInit() {
    document.getElementById('nl-account').innerText = this.bankaccountService.generateDutchAccount('NL');
  }

}

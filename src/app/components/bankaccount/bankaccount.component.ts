import { Component, OnInit } from '@angular/core';

import { TosuService } from '../../services/tosu.service';
import { BankService } from '../../services/bank.service';


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

  constructor(private tosuService: TosuService, private bankService: BankService) { }

  ngOnInit() {
    document.getElementById('nl-account').innerText = this.bankService.generateDutchAccount('NL');
  }

}

import { Injectable } from '@angular/core';

import { TosuService } from '../tosu.service';


@Injectable({
  providedIn: 'root'
})

export class BankaccountService {


  generateBankAccount(countryCode: string) {
    let digits: number[] = [];


    // Get random bank identification code
    const bankIdentification: string[] = this.getRandomBankIdentification(countryCode);

    // Get digits
    switch (countryCode) {
      case 'NL':
        digits = this.generateDutchDigits();
        console.log('digits: ', digits);
        break;
      case 'BE':
        digits = this.generateBelgianDigits(bankIdentification);
        break;
      default:
        break;
    }

    // Calculate the checksum
    const checkSum: number = this.calculateCheckSum(countryCode, bankIdentification, digits);

    // Return bank account number
    return countryCode + checkSum + bankIdentification[0] + digits.join('');
  }


  generateDutchDigits() {
    /*
        Format: 2L 2N 4L 10N
        Example: NL 64 FLOR 6627 0021 83
        @2L: country code, fixed (NL)
        @2N: check sum, calculated based on 2L4L10N00
        @4L: Bank identification, 4 letters
        @10N: 10 random base 10 digits, should pass eleven test for Dutch bank accounts
    */

    const digitsLength = 10;
    const elevenTest = true;

    // Get digits, but they should pass the eleven test
    return this.getNumbers(digitsLength, elevenTest);
  }


  generateBelgianDigits(bankIdentification: string[]) {
    /**
      Format: 2L 2N 3N 7N 2N 
      Example: BE 68 539 0075 470 34
      @2L: country code, fixed (BE)
      @2N: check sum, calculated based on 2L4
      @3N: bank identification
      @7N: 7 random base 10 digits
      @2N: check sum for 7 previous digits, remainder of modulo 97 (if 0, checksum is 97)
    */

    const digitsLength = 9;
    const elevenTest = false;

    // Get digits, no need to pass the eleven test
    const numbers = this.getNumbers(digitsLength, elevenTest);

    // calculate mod 97 of the sub check
    return this.getModulo(bankIdentification, numbers, digitsLength);

  }

  getRandomBankIdentification(country: string) {
    let bic: string = '';
    let bicValue: number = 0;

    // Array source: https://www.betaalvereniging.nl/en/focus/giro-based-and-online-payments/bank-identifier-code-bic-for-sepa-transactions/
    const dutchBIC: string[] = ['AABN', 'ABNA', 'ADYB', 'AEGO', 'ANDL', 'ARBN',
      'ARSN', 'ASNB', 'ATBA', 'BCDM', 'BCIT', 'BICK', 'BINK', 'BKCH',
      'BKMG', 'BLGW', 'BMEU', 'BNDA', 'BNGH', 'BNPA', 'BOFA', 'BOFS',
      'BOTK', 'BUNQ', 'CHAS', 'CITC', 'CITI', 'COBA', 'DEUT', 'DHBN',
      'DLBK', 'DNIB', 'EBUR', 'FBHL', 'FLOR', 'FRGH', 'FRNX', 'FTSB',
      'FVLB', 'GILL', 'HAND', 'HHBA', 'HSBC', 'ICBK', 'INGB', 'ISAE',
      'ISBK', 'KABA', 'KASA', 'KNAB', 'KOEX', 'KRED', 'LOCY', 'LOYD',
      'LPLN', 'MHCB', 'MOYO', 'NNBA', 'NWAB', 'PCBC', 'RABO', 'RBRB',
      'SNSB', 'SOGE', 'TEBU', 'TRIO', 'UBSW', 'UGBI', 'VOWA', 'ZWLB'];


    switch (country.toUpperCase()) {
      case 'NL':
        bic = dutchBIC[this.tosuService.getRandomNumber(0, dutchBIC.length - 1)];
        break;

      case 'BE':
        bicValue = this.tosuService.getRandomNumber(0, 999);
        bic = bicValue.toString();

        // Format should be NNN
        if (bic.length == 2) {
          bic = '0' + bic;
        } else if (bic.length == 1) {
          bic = '00' + bic;
        }
        break;

      default:
        bic = 'ERROR'
    }


    return [bic];
  }

  getNumbers(count: number, elevenTest: boolean) {
    let i, j, k, p1, p2: number;
    let digits: number[] = [];
    let pass11 = false;
    const maxDigit = count;


    // get {count} random base 10 numbers
    for (i = 0; i < count; i++) {
      digits[i] = this.tosuService.getRandomNumber(0, maxDigit);
    }

    // If 11-test is applicable, verify generated numbers
    if (elevenTest) {
      // check if they pass the 11-test
      pass11 = this.perform11test(digits);

      // 11-test failed
      if (!pass11) {

        // take two random digits
        p1 = this.tosuService.getRandomNumber(0, maxDigit);
        p2 = this.tosuService.getRandomNumber(0, maxDigit);

        // make sure we didn't select twice the same digit
        while (p1 === p2) {
          p2 = this.tosuService.getRandomNumber(0, maxDigit);
        }

        for (j = 0; j <= maxDigit && pass11 === false; j++) {
          digits[p1] = j;
          for (k = 0; k <= maxDigit && pass11 === false; k++) {
            digits[p2] = k;
            pass11 = this.perform11test(digits);
          }
        }

        // Re-evaluate pass11
        if (!pass11) {
          // We went through all options without success. Start over.
          this.getNumbers(count, elevenTest);
        }
      }
    }

    return digits;
  }



  getModulo(bankIdentification: string[], digits: number[], maxDigit) {
    let modulo: number = 0;
    let modDigit1: number = 0;
    let modDigit2: number = 0;
    const identification = bankIdentification[0];
    // Concatenate digits to identification, remove last two digits and convert the array to an integer
    const digitsNumbers: number = parseInt(identification.concat(digits.slice(0, -2).join('')), 10);


    // Calculate modulo
    modulo = digitsNumbers % 97;

    if (modulo !== 0) {
      modDigit1 = parseInt(('' + modulo)[0], 10);
      modDigit2 = parseInt(('' + modulo)[1], 10);
    }

    // replace digits with last numbers
    digits.splice(maxDigit - 2, 1, modDigit1);
    digits.splice(maxDigit - 1, 1, modDigit2);

    console.log("mod digits: ", digits);
    return digits;

  }


  getLetterValue(letters: string) {
    let i = 0;
    let letterValue = '';

    for (i = 0; i < letters.length; i++) {
      // 'A' === 65, but we need it as 10
      letterValue += letters.charCodeAt(i) - 55;
    }

    return letterValue;
  }

  perform11test(nr: number[]) {
    let sum = 0;
    let j = 0;
    let i = 0;

    for (i = 10; i >= 1; i--) {
      sum += nr[j] * i;
      j++;
    }

    if ((sum % 11) === 0) {
      return true;
    }

    return false;
  }


  calculateCheckSum(country: string, bankIdentification: string[], numbers: number[]) {
    const countryValue = this.getLetterValue(country);
    console.log("countryvalue: ", countryValue);
    let identification: string = '';

    if (country === 'NL') {
      console.log('bankidentificaiton: ', bankIdentification[0]);
      identification = this.getLetterValue(bankIdentification[0]);
      console.log('identificaiton: ', identification);
    } else {
      identification = bankIdentification[0];
    }

    const checkCombination = identification + numbers.join('') + countryValue + '00';

    console.log('checkCombination: ', checkCombination);

    /*
    Piece-wise calculation D mod 97 can be done in many ways. One such way is as follows:
        1. Starting from the leftmost digit of D, construct a number using the first 9 digits and call it N.
        2. Calculate N mod 97.
        3. Construct a new 9-digit N by concatenating above result (step 2) with the next 7 digits of D.
        If there are fewer than 7 digits remaining in D but at least one, then construct a new N, which
        will have less than 9 digits, from the above result (step 2) followed by the remaining digits of D
        4. Repeat steps 2–3 until all the digits of D have been processed
        The result of the final calculation in step 2 will be D mod 97 = N mod 97.
        5. Calculate 98 - final result
    */

    let accString: string = checkCombination;
    let checkNr: string;
    let modNr: number;
    let result: number;


    checkNr = accString.substring(0, 9);
    modNr = parseInt(checkNr, 10) % 97;

    accString = accString.substring(9, accString.length);

    while (accString.length > 0) {
      checkNr = "" + modNr + accString.substring(0, 7);
      modNr = parseInt(checkNr, 10) % 97;
      accString = accString.substring(7, accString.length);

      if (accString.length < 7) {
        accString = accString.substring(0, accString.length);
      }
    }

    result = 98 - modNr;

    return result;
  }

  constructor(private tosuService: TosuService) { }

}

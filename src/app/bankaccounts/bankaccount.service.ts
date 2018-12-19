import { Injectable } from '@angular/core';

import { TosuService } from '../tosu.service';


@Injectable({
  providedIn: 'root'
})

export class BankaccountService {


  generateBankAccount(countryCode: string): string {
    let digits: number = 0;


    // Get random bank identification code
    const bankIdentification: string[] = this.getRandomBankIdentification(countryCode);

    // Get digits
    switch (countryCode) {
      case 'NL':
        digits = this.generateDutchDigits();
        break;
      case 'BE':
        digits = this.generateBelgianDigits(bankIdentification);
        break;
      default:
        break;
    }

    
    // Calculate the checksum
    const checkSum: string = this.calculateCheckSum(countryCode, bankIdentification, digits);


    // Return bank account number
    return countryCode + checkSum + bankIdentification[0] + digits;
  }


  generateDutchDigits(): number {
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


  generateBelgianDigits(bankIdentification: string[]): number {
    /**
      Format: 2L 2N 3N 7N 2N 
      Example: BE 68 539 0075 470 34
      @2L: country code, fixed (BE)
      @2N: check sum, calculated based on 2L4
      @3N: bank identification
      @7N: 7 random base 10 digits
      @2N: check sum for 7 previous digits, remainder of modulo 97 (if 0, checksum is 97)
    */

    const digitsLength = 7;
    const elevenTest = false;

    // Get digits, no need to pass the eleven test
    const numbers = this.getNumbers(digitsLength, elevenTest);
    
    // calculate mod 97 of the sub check and add to numbers
    return this.getModulo(bankIdentification, numbers, digitsLength);

  }

  getRandomBankIdentification(country: string): string[] {
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

  getNumbers(count: number, elevenTest: boolean): number {
    let i: number = 0;
    let j: number = 0;
    let k: number = 0;
    let p1: number = 0;
    let p2: number = 0;
    let digits: number[] = [];
    let pass11: boolean = false;
    const highestDigit: number = 9;


    // get {count} random base 10 numbers
    for (i = 0; i < count; i++) {
      if (i === 0) {
        digits[i] = this.tosuService.getRandomNumber(1, highestDigit); // first digit may not be zero
      } else {
        digits[i] = this.tosuService.getRandomNumber(0, highestDigit);
      }
    }

    // If 11-test is applicable, verify generated numbers
    if (elevenTest) {
      // check if they pass the 11-test
      pass11 = this.perform11test(digits);

      // 11-test failed
      if (!pass11) {

        // take two random digits
        p1 = this.tosuService.getRandomNumber(0, highestDigit);
        p2 = this.tosuService.getRandomNumber(0, highestDigit);

        // make sure we didn't select twice the same digit
        while (p1 === p2) {
          p2 = this.tosuService.getRandomNumber(0, highestDigit);
        }

        for (j = 0; j < count && pass11 === false; j++) {
          digits[p1] = j;
          for (k = 0; k < count && pass11 === false; k++) {
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



    return parseInt(digits.join(''), 10);
  }



  getModulo(bankIdentification: string[], digits: number, nrOfDigits: number): number {

    // 1. Convert bank identification and digits to number
    const identification: number = parseInt(bankIdentification[0], 10);
    

    // 2. Make one number from identifciation and digits
    let number: number = (identification * Math.pow(10, nrOfDigits)) + digits;
    
    
    // 3. Calculate modulo
    let modulo: number = number % 97;
    

    // 4. Append modulo to number
    let modDigit1: string = '0';
    let modDigit2: string = '0';

    if (modulo === 0) {
      // If modulo === 0 then, take 97 as check sum
      modDigit1 = '9';
      modDigit2 = '7';    
    } else if (modulo <= 9) {
      // If modulo <= 9, first digit is 0
      modDigit1 = '0';
      modDigit2 = ('' + modulo)[0];    
    } else {
      modDigit1 = ('' + modulo)[0];
      modDigit2 = ('' + modulo)[1];
    }
    
    number = parseInt('' + digits + modDigit1 + modDigit2, 10);


    // 5. Return new digits with modulo at the end
    return number;

  }


  getLetterValue(letters: string): string {
    let i: number = 0;
    let letterValue: string = '';

    for (i = 0; i < letters.length; i++) {
      // 'A' === 65, but we need it as 10
      letterValue += letters.charCodeAt(i) - 55;
    }

    return letterValue;
  }

  perform11test(nr: number[]): boolean {
    let sum: number = 0;
    let j: number = 0;
    let i: number = 0;

    for (i = 10; i >= 1; i--) {
      sum += nr[j] * i;
      j++;
    }

    if ((sum % 11) === 0) {
      return true;
    }

    return false;
  }


  calculateCheckSum(country: string, bankIdentification: string[], numbers: number): string {
    const countryValue = this.getLetterValue(country);
    let identification: string = '';

    if (country === 'NL') {
      identification = this.getLetterValue(bankIdentification[0]);
    } else {
      identification = bankIdentification[0];
    }

    const checkCombination = identification + numbers + countryValue + '00';

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
    let checkSum: number;
    let result: string;


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

    checkSum = 98 - modNr;

    // If checksum <= 9; add a leading 0.
    if (checkSum <= 9) {
      result = ('0' + checkSum);
    } else {
      result = ('' + checkSum);
    }

    return result;
  }

  constructor(private tosuService: TosuService) { }

}

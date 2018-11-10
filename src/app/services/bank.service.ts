import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BankService {

  generateDutchAccount(countryCode: string) {

    /*
      Format: 2L 2N 4L 10N
      Example: NL12INGB06989972161

      @2L: country code, fixed (NL)
      @2N: check sum, calculated based on 2L4L10N00
      @4L: Bank identification, 4 letters
      @10N: 10 random base 10 numbers, should pass eleven test
    */

    const bankIdentification: string[] = this.getRandomBankIdentification(countryCode);
    const numbers: number[] = this.getNumbers(10);
    const checkSum: number = this.calculateCheckSum(countryCode, bankIdentification, numbers);

    return countryCode + checkSum + bankIdentification[0] + numbers.join('');
  }


  getRandomBankIdentification(country: string) {
    // Array source: https://www.betaalvereniging.nl/en/focus/giro-based-and-online-payments/bank-identifier-code-bic-for-sepa-transactions/
    const dutchBIC: string[] = ['AABN', 'ABNA', 'ADYB', 'AEGO', 'ANDL', 'ARBN', 'ARSN', 'ASNB', 'ATBA', 'BCDM', 'BCIT', 'BICK', 'BINK', 'BKCH', 'BKMG', 'BLGW', 'BMEU', 'BNDA', 'BNGH', 'BNPA', 'BOFA', 'BOFS', 'BOTK', 'BUNQ', 'CHAS', 'CITC', 'CITI', 'COBA', 'DEUT', 'DHBN', 'DLBK', 'DNIB', 'EBUR', 'FBHL', 'FLOR', 'FRGH', 'FRNX', 'FTSB', 'FVLB', 'GILL', 'HAND', 'HHBA', 'HSBC', 'ICBK', 'INGB', 'ISAE', 'ISBK', 'KABA', 'KASA', 'KNAB', 'KOEX', 'KRED', 'LOCY', 'LOYD', 'LPLN', 'MHCB', 'MOYO', 'NNBA', 'NWAB', 'PCBC', 'RABO', 'RBRB', 'SNSB', 'SOGE', 'TEBU', 'TRIO', 'UBSW', 'UGBI', 'VOWA', 'ZWLB'];
    const bic: string = dutchBIC[this.getRandomNumber(0, dutchBIC.length - 1)];
    const bicValue: string = this.getLetterValue(bic);


    return [bic, bicValue];
  }

  getNumbers(count: number) {
    let i, j, k, p1, p2: number;
    let digits: number[] = [];
    let pass11: boolean = false;
    const maxDigit: number = 9;


    // get {count} random base 10 numbers
    for (i = 0; i < count; i++) {
      digits[i] = this.getRandomNumber(0, maxDigit);
    }


    // check if they pass the 11-test
    pass11 = this.perform11test(digits);

    // 11-test failed
    if (!pass11) {

      // take two random digits
      p1 = this.getRandomNumber(0, maxDigit);
      p2 = this.getRandomNumber(0, maxDigit);

      // make sure we didn't select twice the same digit
      while (p1 === p2) {
        p2 = this.getRandomNumber(0, maxDigit);
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
        this.getNumbers(count);
      }

    }

    return digits;
  }


  getLetterValue(letters: string) {
    let i: number = 0;
    let letterValue: string = '';


    for (i = 0; i < letters.length; i++) {
      // 'A' === 65, but we need it as 10
      letterValue += letters.charCodeAt(i) - 55;
    }
    return letterValue;

  }

  perform11test(nr: number[]) {
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


  calculateCheckSum(country: string, bankIdentification: string[], numbers: number[]) {
    const countryValue = this.getLetterValue(country);
    const checkCombination = bankIdentification[1] + numbers.join('') + countryValue + '00';


    /*
    Piece-wise calculation D mod 97 can be done in many ways. One such way is as follows:			
        1. Starting from the leftmost digit of D, construct a number using the first 9 digits and call it N.			
        2. Calculate N mod 97.			
        3. Construct a new 9-digit N by concatenating above result (step 2) with the next 7 digits of D. If there are fewer than 7 digits remaining in D but at least one, then construct a new N, which will have less than 9 digits, from the above result (step 2) followed by the remaining digits of D			
        4. Repeat steps 2–3 until all the digits of D have been processed			
        The result of the final calculation in step 2 will be D mod 97 = N mod 97.			
        5. Calculate 98 - final result			
    */

    let accString = checkCombination;
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


  getRandomNumber(lower: number, upper: number) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;

  }

  constructor() { }
}

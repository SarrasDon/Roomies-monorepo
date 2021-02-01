import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'balance' })
export class BalancePipe implements PipeTransform {
  transform(balance: number) {
    if (!balance) {
      return 0;
    }
    const balanceStr = balance.toString();
    if (balanceStr.length >= 4) {
      return Math.round(balance);
    }
    return balance;
  }
}

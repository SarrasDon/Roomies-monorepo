import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'balance' })
export class BalancePipe implements PipeTransform {
  transform(balance: number) {
    const balanceStr = balance.toString();
    if (balanceStr.length >= 4) {
      return Math.round(balance);
    }
    return balance;
  }
}

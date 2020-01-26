import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expenseAmount',
  pure: true
})
export class ExpenseAmountPipe implements PipeTransform {
  transform(amount: number) {
    if (amount % 1 !== 0) {
      return Math.round(amount);
    }

    return amount;
  }
}

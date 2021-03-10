import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expenseAmount',
  pure: true
})
export class ExpenseAmountPipe implements PipeTransform {
  transform(amount: number) {
    if (amount % 1 !== 0) {
      return amount.toFixed(2);
    }

    return amount + '.00';
  }
}

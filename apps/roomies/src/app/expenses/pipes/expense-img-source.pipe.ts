import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from '../../shared/models';

@Pipe({
  name: 'expenseImgSource',
  pure: true
})
export class ExpenseImgSourcePipe implements PipeTransform {
  transform(expense: Expense) {
    return `assets/icons/${expense.reason.reason.toLowerCase()}.svg`;
  }
}
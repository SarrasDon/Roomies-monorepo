import { PipeTransform, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'expenseDate' })
export class ExpenseDatePipe implements PipeTransform {
  transform(value: Date, ...args: any[]) {
    const today = Date.now();
    const valueDate = new Date(value);
    if (today - valueDate.getTime() < 60 * 1000) {
      return 'Just now';
    }

    const format =
      today - valueDate.getTime() < 24 * 60 * 60 * 1000
        ? 'shortTime'
        : 'longDate';
    return new DatePipe('en-us').transform(value, format);
  }
}

import { PipeTransform, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'expenseDate' })
export class ExpenseDatePipe implements PipeTransform {
  transform(date: Date, ...args: any[]) {
    const now = Date.now();
    const valueDate = new Date(date).getTime();

    if (now - valueDate < 60 * 1000) {
      return 'Just now';
    }

    const baseDate = new Date().setUTCHours(0, 0, 0, 0);
    const format = baseDate < valueDate ? 'shortTime' : 'longDate';
    return new DatePipe('en-us').transform(date, format);
  }
}

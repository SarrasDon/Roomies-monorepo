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
    const day = new Date().getDay();
    const valueDay = valueDate.getDay();
    const format = day === valueDay ? 'shortTime' : 'longDate';
    return new DatePipe('en-us').transform(value, format);
  }
}

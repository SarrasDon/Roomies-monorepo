import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { Expense } from '@roomies/expenses.contracts';

@Component({
  selector: 'roomies-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseItemComponent implements OnInit {
  @Input() expense: Expense;
  @Input() reason: string;
  @Input() user: string;

  @HostListener('swipe', ['$event']) swipe(event: { deltaX: number }) {
    const direction =
      Math.abs(event.deltaX) > 20 ? (event.deltaX > 0 ? 'right' : 'left') : '';

    this.left = direction === 'left';
  }

  @HostBinding('class.left') left = false;

  constructor() {}

  ngOnInit() {}
}

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Expense } from '@roomies/expenses.contracts';
import { deleteExpense, ExpensesState, preDeleteExpense } from '../../store';

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

  @HostBinding('class.left')
  left = false;

  constructor(private store: Store<ExpensesState>) {}

  ngOnInit() {}

  onExpenseDelete() {
    this.store.dispatch(preDeleteExpense({ expense: this.expense }));
  }
}

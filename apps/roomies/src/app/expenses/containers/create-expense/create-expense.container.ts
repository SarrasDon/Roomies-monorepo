import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetExpenseReasons, CreateExpense } from '../../state/expenses.actions';
import { ExpensesState } from '../../state/expenses.state';
import { ExpenseReason } from '../../../shared/models/expenseReason.model';

@Component({
  selector: 'roomies-create-expense-container',
  template:
    '<roomies-create-expense [reasons]="reasons | async" [pending]="pending | async" (formSubmitted)="onFormSubmitted($event)"></roomies-create-expense>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateExpenseContainerComponent implements OnInit {
  @Select(ExpensesState.reasons) reasons: Observable<ExpenseReason[]>;
  @Select(ExpensesState.pendingSave) pending: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetExpenseReasons());
  }

  onFormSubmitted($event: {
    reason: ExpenseReason;
    amount: number;
    date: Date;
  }) {
    const { reason, amount, date } = $event;
    this.store.dispatch(new CreateExpense(reason, amount, date));
  }
}

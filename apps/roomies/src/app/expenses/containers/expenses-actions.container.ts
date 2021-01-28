import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ExpenseReason } from '@roomies/expenses.contracts';
import { Observable } from 'rxjs';
import { getCurrentUser } from '../../auth/store';
import { storeSnapshot } from '../../shared/utils';
import { createExpense, incrementTotal } from '../state';
import { selectExpenseReasons } from '../state/expense.selectors';

@Component({
  selector: 'roomies-expenses-actions-container',
  template: `
    <roomies-expenses-actions
      [reasons]="reasons$ | async"
      [isLoading]="isLoading$ | async"
      (formSubmitted)="onFormSubmitted($event)"
    ></roomies-expenses-actions>
  `,
  styles: [
    `
      :host {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 1;
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesActionsContainer {
  reasons$ = this.store.pipe(select(selectExpenseReasons));
  isLoading$: Observable<boolean>;

  constructor(private store: Store) { }

  onFormSubmitted($event: {
    reason: ExpenseReason;
    amount: number;
    date: Date;
  }) {
    const { reason, amount, date } = $event;
    const user = storeSnapshot(this.store, getCurrentUser);
    // update the store optimistically
    const clientId = (Math.random() * 10000).toString();
    this.store.dispatch(
      createExpense({ reason, amount, date, clientId, user })
    );
    this.store.dispatch(incrementTotal({ amount, userId: user._id }));
  }
}

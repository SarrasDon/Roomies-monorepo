import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Select, Store as NgxsStore } from '@ngxs/store';
import { ExpenseReason } from '@roomies/expenses.contracts';
import { Observable } from 'rxjs';
import { getCurrentUser } from '../../auth/state';
import { storeSnapshot } from '../../shared/utils';
import { CreateExpense, ExpenseSelectors, incrementTotal } from '../state';

@Component({
  selector: 'roomies-expenses-actions-container',
  template: `
    <roomies-expenses-actions
      [reasons]="reasons | async"
      [isLoading]="isLoading | async"
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
export class ExpensesActionsContainer implements OnInit {
  @Select(ExpenseSelectors.reasons) reasons: Observable<ExpenseReason[]>;
  @Select(ExpenseSelectors.isLoading) isLoading: Observable<boolean>;

  constructor(private ngxsStore: NgxsStore, private store: Store) {}

  ngOnInit() {}

  onFormSubmitted($event: {
    reason: ExpenseReason;
    amount: number;
    date: Date;
  }) {
    const { reason, amount, date } = $event;
    const user = storeSnapshot(this.store, getCurrentUser);
    this.ngxsStore.dispatch(new CreateExpense(reason, amount, date));
    // update the store optimistically
    this.store.dispatch(incrementTotal({ amount, userId: user._id }));
  }
}

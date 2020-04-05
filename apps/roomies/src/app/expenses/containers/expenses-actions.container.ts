import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CreateExpense, ExpenseSelectors } from '../state';
import { ExpenseReason } from '@roomies/expenses.contracts';

@Component({
  selector: 'roomies-expenses-actions-container',
  template: `
    <roomies-expenses-actions
      [reasons]="reasons | async"
      [isLoading]="isLoading | async"
      (formSubmitted)="onFormSubmitted($event)"
    ></roomies-expenses-actions>
  `
})
export class ExpensesActionsContainer implements OnInit {
  @Select(ExpenseSelectors.reasons) reasons: Observable<ExpenseReason[]>;
  @Select(ExpenseSelectors.isLoading) isLoading: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit() {}

  onFormSubmitted($event: {
    reason: ExpenseReason;
    amount: number;
    date: Date;
  }) {
    const { reason, amount, date } = $event;
    this.store.dispatch(new CreateExpense(reason, amount, date));
  }
}

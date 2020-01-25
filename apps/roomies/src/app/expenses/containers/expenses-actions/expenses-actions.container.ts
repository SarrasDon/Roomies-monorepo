import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ExpenseReason } from '../../../shared/models';
import {
  ExpenseSelectors,
  GetExpenseReasons,
  CreateExpense
} from '../../state';

@Component({
  selector: 'roomies-expenses-actions-container',
  template:
    '<roomies-expenses-actions [reasons]="reasons | async"  (formSubmitted)="onFormSubmitted($event)"></roomies-expenses-actions>'
})
export class ExpensesActionsContainer implements OnInit {
  @Select(ExpenseSelectors.reasons) reasons: Observable<ExpenseReason[]>;

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

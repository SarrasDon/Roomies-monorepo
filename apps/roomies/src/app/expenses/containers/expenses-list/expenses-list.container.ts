import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Expense } from '../../../shared/models/expense.model';
import { GetExpenses } from '../../state/expenses.actions';
import { ExpensesState } from '../../state/expenses.state';

@Component({
  selector: 'roomies-expenses-list-container',
  template: `
    <roomies-expenses-list
      [expenses]="expenses$ | async"
      (paging)="onPaging($event)"
    >
    </roomies-expenses-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesListContainer {
  @Select(ExpensesState.expenses) expenses$: Observable<Expense[]>;

  constructor(private store: Store) {}

  onPaging(e) {
    this.store.dispatch(new GetExpenses(e.first, e.rows));
  }
}

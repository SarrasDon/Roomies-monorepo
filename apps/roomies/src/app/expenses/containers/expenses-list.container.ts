import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Expense } from '../../shared/models';
import { ExpensesListComponent } from '../components';
import { ExpenseSelectors, GetExpenses, GetExpensesCount } from '../state';

@Component({
  selector: 'roomies-expenses-list-container',
  template: `
    <roomies-expenses-list #list [expenses]="expenses$ | async">
    </roomies-expenses-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesListContainer implements AfterViewInit, OnDestroy {
  @ViewChild(ExpensesListComponent, { static: false })
  list: ExpensesListComponent;

  @Select(ExpenseSelectors.expenses)
  expenses$: Observable<Expense[]>;

  sub: Subscription;

  constructor(private store: Store) {}

  ngAfterViewInit(): void {
    this.store.dispatch(new GetExpensesCount());
    this.list.paging
      .pipe(
        // debounceTime(100),
        distinctUntilChanged((x, y) => {
          return y.first - x.first <= 10;
        })
      )
      .subscribe(({ first, rows }) =>
        this.store.dispatch(new GetExpenses(first, rows))
      );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

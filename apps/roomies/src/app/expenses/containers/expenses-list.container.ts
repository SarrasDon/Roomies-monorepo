import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ExpensesListComponent } from '../components';
import { ExpensesState, loadExpenses, selectExpenses } from '../store';

@Component({
  selector: 'roomies-expenses-list-container',
  template: `
    <roomies-expenses-list #list [expenses]="expenses$ | async">
    </roomies-expenses-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesListContainer implements AfterViewInit, OnDestroy {
  @ViewChild(ExpensesListComponent, { static: false })
  list: ExpensesListComponent;

  expenses$ = this.store.pipe(select(selectExpenses));

  sub: Subscription;

  constructor(private store: Store<ExpensesState>) { }

  ngAfterViewInit(): void {
    this.sub = this.list.paging
      .pipe(
        // debounceTime(100),
        distinctUntilChanged((x, y) => {
          return y.first - x.first <= 10;
        })
      )
      .subscribe(({ first, rows }) =>
        this.store.dispatch(loadExpenses({ index: first, limit: rows }))
      );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

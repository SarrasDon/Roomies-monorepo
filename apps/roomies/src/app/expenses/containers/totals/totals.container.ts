import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Total } from '../../../shared/models';
import { GetTotals } from '../../state/expenses.actions';
import { ExpensesState } from '../../state/expenses.state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'roomies-totals-container',

  template: `
    <roomies-totals
      [totals]="totals$ | async"
      [myBalance]="myBalance$ | async"
    ></roomies-totals>
  `,
  styleUrls: ['./totals.container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalsContainerComponent implements OnInit {
  @Select(ExpensesState.totals) totals$: Observable<Total[]>;
  @Select(ExpensesState.balance) balance$: Observable<number>;
  myBalance$: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.myBalance$ = this.balance$.pipe(
      map(b =>
        b < 0
          ? `Σου χρωστάει ${b} euros!`
          : b > 0
          ? `Χρωστάς ${b} euros!`
          : `Perfectly balanced as all things should be!`
      )
    );
    this.store.dispatch(new GetTotals());
  }
}

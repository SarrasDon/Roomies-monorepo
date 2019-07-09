import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetTotals } from '../../state/expenses.actions';
import { ExpensesState } from '../../state/expenses.state';

@Component({
  selector: 'roomies-totals-container',

  template: `
    <roomies-totals
      [totals]="totals$ | async"
      [myBalance]="balance$ | async"
    ></roomies-totals>
  `,
  styleUrls: ['./totals.container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalsContainerComponent implements OnInit {
  @Select(ExpensesState.totals) totals$: Observable<
    { name: string; value: number }[]
  >;
  @Select(ExpensesState.balance) balance$: Observable<number>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetTotals());
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ExpenseSelectors, GetTotals } from '../../state';

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
  @Select(ExpenseSelectors.totals) totals$: Observable<
    { name: string; value: number }[]
  >;
  @Select(ExpenseSelectors.balance) balance$: Observable<{
    amount: number;
    sign: 'positive' | 'negative' | 'balanced';
  }>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetTotals());
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../auth/state';
import { ExpenseSelectors, GetTotals } from '../state';

@Component({
  selector: 'roomies-totals-container',

  template: `
    <roomies-totals
      [totals]="totals$ | async"
      [myBalance]="balance$ | async"
      [userImagesDict]="userImagesDict$ | async"
    ></roomies-totals>
  `,
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

  @Select(AuthState.userImagesDict) userImagesDict$: Observable<any>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetTotals());
  }
}

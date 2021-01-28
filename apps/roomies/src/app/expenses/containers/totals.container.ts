import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUserImageDict } from '../../auth/store';
import {
  getTotals,
  selectBalanceWithSign,
  selectTotalsWithNames,
  TotalState
} from '../state/totals.state';

@Component({
  selector: 'roomies-totals-container',
  template: `
    <roomies-totals
      [totals]="totals$ | async"
      [myBalance]="balance$ | async"
      [userImagesDict]="userImagesDict$ | async"
    ></roomies-totals>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalsContainerComponent implements OnInit {
  totals$ = this.store.select(selectTotalsWithNames);
  balance$ = this.store.select(selectBalanceWithSign);
  userImagesDict$ = this.store.select(getUserImageDict);

  constructor(private store: Store<TotalState>) { }

  ngOnInit() {
    this.store.dispatch(getTotals());
  }
}

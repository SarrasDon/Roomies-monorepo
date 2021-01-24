import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store as ngrxStore } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { getUserImageDict } from '../../auth/state';
import { getTotals, selectBalanceWithSign, selectTotalsWithNames } from '../state/totals.state';

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
  totals$ = this.store.select(selectTotalsWithNames)
  balance$ = this.store.select(selectBalanceWithSign)

  userImagesDict$ = this.store.select(getUserImageDict)

  constructor(private store: ngrxStore) { }

  ngOnInit() {
    this.store.dispatch(getTotals());
  }
}

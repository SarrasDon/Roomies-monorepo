import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store as ngrxStore } from '@ngrx/store';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthState } from '../../auth/state';
import { ExpenseSelectors } from '../state';
import { getTotals, selectBalanceWithSign, selectTotals, selectTotalsWithNames } from '../state/totals.state';

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

  @Select(AuthState.userImagesDict) userImagesDict$: Observable<any>;

  constructor( private store: ngrxStore) {}

  ngOnInit() {
    this.store.dispatch(getTotals());
  }
}

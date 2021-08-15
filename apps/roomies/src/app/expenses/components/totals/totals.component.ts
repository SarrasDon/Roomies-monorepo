import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { delay, map, tap } from 'rxjs/operators';
import { getUsersSorted } from '../../../auth/store';
import {
  TOTAL_COUNTER_AFTER_DIALOG_CLOSED_DELAY,
  TOTAL_COUNTER_WAIT_DOWN_DELAY,
} from '../../expenses.config';
import {
  selectBalanceWithSign,
  selectTotalsWithNames,
  TotalState,
} from '../../store';

@Component({
  selector: 'roomies-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalsComponent implements OnInit {
  totals$ = this.store.pipe(select(selectTotalsWithNames));
  users$ = this.store.pipe(select(getUsersSorted));

  balance$ = this.store.pipe(
    select(selectBalanceWithSign),
    delay(
      TOTAL_COUNTER_AFTER_DIALOG_CLOSED_DELAY + TOTAL_COUNTER_WAIT_DOWN_DELAY
    ),
    map(({ amount, sign }) => ({
      amount: amount,
      color: sign,
      width: this.countDigits(amount),
    }))
  );

  showDataLabel$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.HandsetPortrait])
    .pipe(map((state) => !state.matches));

  constructor(
    public breakpointObserver: BreakpointObserver,
    private store: Store<TotalState>
  ) {}

  ngOnInit() {}

  countDigits(amount: number) {
    let count = 0;
    let n = Math.round(amount);
    while (n > 1) {
      n = n / 10;
      count = count + 1;
    }
    return count || 1;
  }
}

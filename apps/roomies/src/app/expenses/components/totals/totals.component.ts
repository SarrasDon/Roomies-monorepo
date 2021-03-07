import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { delay, map, publish, refCount, tap } from 'rxjs/operators';
import { getUserImageDict } from '../../../auth/store';
import {
  TOTAL_COUNTER_AFTER_DIALOG_CLOSED_DELAY,
  TOTAL_COUNTER_WAIT_DOWN_DELAY,
} from '../../expenses.config';
import {
  getTotals,
  getTotalsForMonth,
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
  date = new Date();
  totals$ = this.store.pipe(select(selectTotalsWithNames));
  balanceWithSign$ = this.store.pipe(
    select(selectBalanceWithSign),
    publish(),
    refCount()
  );
  balance$ = this.balanceWithSign$.pipe(
    delay(
      TOTAL_COUNTER_AFTER_DIALOG_CLOSED_DELAY + TOTAL_COUNTER_WAIT_DOWN_DELAY
    )
  );

  balanceColor$ = this.balanceWithSign$.pipe(
    map((balance) => this.calculatebalanceClass(balance))
  );
  balanceWidth$ = this.balanceWithSign$.pipe(
    map(({ amount }) => this.countDigits(amount) + 'ch')
  );
  userImagesDict$ = this.store.pipe(select(getUserImageDict));

  showDataLabel$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.HandsetPortrait])
    .pipe(map((state) => !state.matches));

  readonly colorScheme = {
    domain: ['var(--chart-color-1)', 'var(--chart-color-2)'],
  };

  constructor(
    public breakpointObserver: BreakpointObserver,
    private store: Store<TotalState>
  ) { }

  ngOnInit() {
    const month = this.date.getMonth();
    const year = this.date.getFullYear();
    this.store.dispatch(getTotalsForMonth({ month, year }));
  }

  calculatebalanceClass(balance: { amount: number; sign: string }) {
    return balance ? balance.sign : ''
  }

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

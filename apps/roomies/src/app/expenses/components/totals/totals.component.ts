import {
  BreakpointObserver,
  Breakpoints
} from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { merge, timer } from 'rxjs';
import { map, pairwise, distinctUntilChanged, tap, skip, filter, switchMap, mapTo, delay, take } from 'rxjs/operators';
import { getUserImageDict } from '../../../auth/store';
import { getTotals, selectBalanceWithSign, selectTotalsWithNames, TotalState } from '../../store';
import {
  BAR_PADDING,
  IMAGES_TOP,
  IMAGE_BORDER_WIDTH,
  IMAGE_RADIUS
} from './chart-setup';

@Component({
  selector: 'roomies-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalsComponent implements OnInit {
  totals$ = this.store.pipe(select(selectTotalsWithNames));
  myBalance$ = this.store.pipe(select(selectBalanceWithSign), skip(1), take(1));
  myBalanceIncreased$ = this.store.pipe(select(selectBalanceWithSign),
    skip(1),
    pairwise(),
    filter((a) => a[0].amount < a[1].amount),
    map((a) => a[1]),
    tap(() => this.balanceClass = "goUp"),
    delay(100),
    tap(() => this.balanceClass = "waitDown"),
    delay(200),
    tap(() => this.balanceClass = "initial"),
  );

  balance$ = merge(this.myBalance$, this.myBalanceIncreased$)

  balanceColor$ = this.store.pipe(select(selectBalanceWithSign), map(balance => this.calculatebalanceColor(balance)))
  userImagesDict$ = this.store.pipe(select(getUserImageDict));

  showDataLabel$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.HandsetPortrait])
    .pipe(map(state => !state.matches));

  imagesTop = IMAGES_TOP;
  imageSize = 2 * IMAGE_RADIUS;
  barPadding = BAR_PADDING;
  readonly colorScheme = {
    domain: ['#42a5f5', '#80d6ff']
  };
  imageBorders = [
    `${IMAGE_BORDER_WIDTH}px solid ${this.colorScheme.domain[0]}`,
    `${IMAGE_BORDER_WIDTH}px solid ${this.colorScheme.domain[1]}`
  ];

  balanceColor = 'orange';
  balanceClass = 'initial'
  constructor(public breakpointObserver: BreakpointObserver, private store: Store<TotalState>) { }

  ngOnInit() {
    this.store.dispatch(getTotals());
  }

  calculatebalanceColor(balance: {
    amount: number;
    sign: string
  }) {
    if (!balance) {
      return 'orange';
    }
    return balance.sign === 'positive'
      ? 'green'
      : balance.sign === 'negative'
        ? 'red'
        : 'orange';
  }
}

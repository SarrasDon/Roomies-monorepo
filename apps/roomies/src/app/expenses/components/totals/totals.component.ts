import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { merge, partition, zip } from 'rxjs';
import {
  delay,
  filter,
  map,
  mapTo,
  publish,
  refCount,
  scan,
  skip,
  take,
} from 'rxjs/operators';
import { getUserImageDict } from '../../../auth/store';
import { UiService } from '../../../core/services';
import {
  getTotals,
  selectBalanceWithSign,
  selectTotalsWithNames,
  TotalState,
} from '../../store';
import {
  BAR_PADDING,
  IMAGES_TOP,
  IMAGE_BORDER_WIDTH,
  IMAGE_RADIUS,
} from './chart-setup';

@Component({
  selector: 'roomies-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalsComponent implements OnInit {
  totals$ = this.store.pipe(select(selectTotalsWithNames));
  initBalance$ = this.store.pipe(
    select(selectBalanceWithSign),
    skip(1),
    take(1)
  );
  myBalanceChanged$ = this.store.pipe(
    select(selectBalanceWithSign),
    skip(1),
    scan(
      (acc, curr) => ({
        balance: curr,
        increased: acc.balance && acc.balance.amount < curr.amount,
      }),
      { balance: null, increased: undefined }
    )
  );

  balanceStreams$ = partition(this.myBalanceChanged$, (res) =>
    Boolean(res.increased)
  );

  myBalanceIncreased$ = this.balanceStreams$[0].pipe(
    map(({ balance }) => balance)
  );
  myBalanceDecreased$ = this.balanceStreams$[1].pipe(
    map(({ balance }) => balance)
  );

  increaseAfterDialogClosed$ = zip(
    this.myBalanceIncreased$,
    this.uiService.createExpenseDialogClosed
  ).pipe(
    map((events) => events[0]),
    delay(500),
    publish(),
    refCount()
  );
  waitDownDelay = 100;

  increaseAnimated$ = this.increaseAfterDialogClosed$.pipe(
    delay(this.waitDownDelay)
  );

  balanceAnimation$ = merge(
    this.increaseAfterDialogClosed$.pipe(mapTo('goUp')),
    this.increaseAfterDialogClosed$.pipe(
      delay(this.waitDownDelay),
      mapTo('waitDown')
    ),
    this.increaseAfterDialogClosed$.pipe(delay(200), mapTo('initial'))
  );

  balance$ = merge(
    this.initBalance$,
    this.increaseAnimated$,
    this.myBalanceDecreased$
  );

  balanceColor$ = this.store.pipe(
    select(selectBalanceWithSign),
    map((balance) => this.calculatebalanceColor(balance))
  );
  userImagesDict$ = this.store.pipe(select(getUserImageDict));

  showDataLabel$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.HandsetPortrait])
    .pipe(map((state) => !state.matches));

  imagesTop = IMAGES_TOP;
  imageSize = 2 * IMAGE_RADIUS;
  barPadding = BAR_PADDING;
  readonly colorScheme = {
    domain: ['#42a5f5', '#80d6ff'],
  };
  imageBorders = [
    `${IMAGE_BORDER_WIDTH}px solid ${this.colorScheme.domain[0]}`,
    `${IMAGE_BORDER_WIDTH}px solid ${this.colorScheme.domain[1]}`,
  ];

  balanceColor = 'orange';
  balanceClass = 'initial';
  constructor(
    public breakpointObserver: BreakpointObserver,
    private store: Store<TotalState>,
    private uiService: UiService
  ) {}

  ngOnInit() {
    this.store.dispatch(getTotals());
  }

  calculatebalanceColor(balance: { amount: number; sign: string }) {
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

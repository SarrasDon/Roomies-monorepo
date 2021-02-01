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
import { map } from 'rxjs/operators';
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
  myBalance$ = this.store.pipe(select(selectBalanceWithSign));
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
      ? 'red'
      : balance.sign === 'negative'
        ? 'green'
        : 'orange';
  }
}

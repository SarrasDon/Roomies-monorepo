import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints
} from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Dictionary } from '@roomies/shared.data';
import { User } from '@roomies/user.contracts';
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
  @Input() totals: { value: number; name: string }[] = [];
  @Input() userImagesDict: {
    name: string;
    avatarUrl: string;
  }[];

  _myBalance: {
    amount: number;
    sign: 'positive' | 'negative' | 'balanced';
  } = null;

  get myBalance() {
    return this._myBalance;
  }

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

  @Input('myBalance') set setBalance(balance: {
    amount: number;
    sign: 'positive' | 'negative' | 'balanced';
  }) {
    this._myBalance = balance;
    this.calculatebalanceColor();
  }

  balanceColor = 'orange';

  showDataLabel$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.HandsetPortrait])
    .pipe(map(state => !state.matches));

  constructor(public breakpointObserver: BreakpointObserver) {}

  ngOnInit() {}

  calculatebalanceColor() {
    if (!this.myBalance) {
      this.balanceColor = 'orange';
    }
    this.balanceColor =
      this.myBalance.sign === 'positive'
        ? 'red'
        : this.myBalance.sign === 'negative'
        ? 'green'
        : 'orange';
  }
}

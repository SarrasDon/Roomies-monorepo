import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints
} from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'roomies-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalsComponent implements OnInit {
  @Input() totals: { value: number; name: string }[] = [];

  _myBalance: {
    amount: number;
    sign: 'positive' | 'negative' | 'balanced';
  } = null;

  get myBalance() {
    return this._myBalance;
  }

  @Input('myBalance') set setBalance(balance: {
    amount: number;
    sign: 'positive' | 'negative' | 'balanced';
  }) {
    this._myBalance = balance;
    this.calculatebalanceColor();
  }

  balanceColor = 'orange';

  readonly colorScheme = {
    domain: ['#008CE0', '#00AEEF']
  };

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

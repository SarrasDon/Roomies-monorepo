import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'roomies-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalsComponent implements OnInit {
  @Input() totals: { value: number; name: string }[] = [];
  @Input() myBalance: {
    amount: number;
    sign: 'positive' | 'negative' | 'balanced';
  };

  get balanceColor() {
    if (!this.myBalance) {
      return 'orange';
    }
    return this.myBalance.sign === 'positive'
      ? 'red'
      : this.myBalance.sign === 'negative'
      ? 'green'
      : 'orange';
  }

  colorScheme = {
    domain: ['#008CE0', '#00AEEF']
  };

  constructor() {}

  ngOnInit() {}
}

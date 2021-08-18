import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { UiService } from '../../../core/services';
import theme from '../../../theme.config.json';
import {
  selectCurrentMonth,
  selectMonthlyExpensesWithReason,
  selectMonthlyTotal,
  MonthlyExpenseState,
} from '../../store';

@Component({
  selector: 'roomies-monthly-expenses',
  templateUrl: './monthly-expenses.component.html',
  styleUrls: ['./monthly-expenses.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyExpensesComponent implements OnInit {
  monthlyExpenses$ = this.store.pipe(
    select(selectMonthlyExpensesWithReason),
    map((monthlyExpenses) => {
      const names = monthlyExpenses.map((i) => i.name.toLowerCase());
      const varNames = names.map((n) => `${n}-color`);

      return {
        results: monthlyExpenses,
        scheme: { domain: varNames.map((n) => theme[n]) },
      };
    })
  );

  monthlyTotal$ = this.store.pipe(select(selectMonthlyTotal));
  currentMonth$ = this.store.pipe(select(selectCurrentMonth));

  constructor(
    public store: Store<MonthlyExpenseState>,
    private uiService: UiService
  ) {}

  ngOnInit(): void {}

  scrollToTop() {
    this.uiService.scrollToTop();
  }
}

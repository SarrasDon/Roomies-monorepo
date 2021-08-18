import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  monthlyExpenseFeatureKey,
  monthlyExpensesAdapter,
  MonthlyExpenseState,
} from './monthlyExpenses.reducer';

export const selectMonthlyExpensesState = createFeatureSelector<MonthlyExpenseState>(
  monthlyExpenseFeatureKey
);

export const {
  selectAll: selectMonthlyExpenses,
} = monthlyExpensesAdapter.getSelectors(selectMonthlyExpensesState);

export const selectMonthlyTotal = createSelector(
  selectMonthlyExpenses,
  (monthlyExpenses) => monthlyExpenses.reduce((acc, cur) => acc + cur.total, 0)
);

export const selectCurrentMonth = createSelector(
  selectMonthlyExpensesState,
  (state) => {
    const { month, year } = state.currentMonth;
    return new Date(year, month);
  }
);

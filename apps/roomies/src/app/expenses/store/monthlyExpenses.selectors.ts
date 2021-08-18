import { createSelector } from '@ngrx/store';
import { selectExpensesFeatureState } from './feature.selector';
import { monthlyExpensesAdapter } from './monthlyExpenses.reducer';

export const selectMonthlyExpensesState = createSelector(
  selectExpensesFeatureState,
  (state) => state.monthlyExpenses
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

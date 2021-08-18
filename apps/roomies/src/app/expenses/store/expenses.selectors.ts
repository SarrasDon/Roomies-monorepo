import { createSelector } from '@ngrx/store';
import { expensesAdapter } from './expenses.reducer';
import { selectExpensesFeatureState } from './feature.selector';

export const selectExpensesState = createSelector(
  selectExpensesFeatureState,
  (state) => state.expenses
);

export const { selectAll: selectExpenses } = expensesAdapter.getSelectors(
  selectExpensesState
);

export const selectExpenseReasonsEntities = createSelector(
  selectExpensesState,
  (state) => state.reasons
);

export const selectExpenseReasons = createSelector(
  selectExpensesState,
  (state) => Object.values(state.reasons || {})
);

export const selectIsLoading = createSelector(
  selectExpensesState,
  (state) => state.isLoading
);

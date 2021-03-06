import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import {
  expensesAdapter,
  expensesFeatureKey,
  ExpensesState
} from './expenses.reducer';

export const selectExpensesState = createFeatureSelector<ExpensesState>(
  expensesFeatureKey
);

export const { selectAll: selectExpenses } = expensesAdapter.getSelectors(
  selectExpensesState
);

export const selectExpenseReasons = createSelector(
  selectExpensesState,
  (state) => state.reasons
);

export const selectIsLoading = createSelector(
  selectExpensesState,
  (state) => state.isLoading
);

import { createSelector } from '@ngrx/store';
import {
  ExpensesState,
  expensesFeatureKey,
  expensesAdapter,
} from './expenses.state';
import { createFeatureSelector } from '@ngrx/store';

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

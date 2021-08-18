import { createSelector } from '@ngrx/store';
import { selectExpensesFeatureState } from './feature.selector';
import { totalsAdapter } from './totals.reducer';

export const selectTotalsState = createSelector(
  selectExpensesFeatureState,
  (state) => state.totals
);

export const {
  selectAll: selectTotals,
  selectIds: selectTotalIds,
} = totalsAdapter.getSelectors(selectTotalsState);

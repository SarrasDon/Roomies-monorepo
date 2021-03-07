import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TotalState, totalsFeatureKey } from './totals.reducer';

export const selectTotalsState = createFeatureSelector<TotalState>(
  totalsFeatureKey
);
export const selectTotals = createSelector(
  selectTotalsState,
  (state) => state.totals
);


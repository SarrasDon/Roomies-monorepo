import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TotalState, totalsFeatureKey, totalsAdapter } from './totals.reducer';

export const selectTotalsState = createFeatureSelector<TotalState>(
  totalsFeatureKey
);

export const {
  selectAll: selectTotals,
  selectIds: selectTotalIds
} = totalsAdapter.getSelectors(selectTotalsState);

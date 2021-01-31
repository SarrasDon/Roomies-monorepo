import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TotalState, totalsFeatureKey } from './totals.reducer';

export const selectTotalsState = createFeatureSelector<TotalState>(
  totalsFeatureKey
);
export const selectTotals = createSelector(
  selectTotalsState,
  (state) => state.totals
);

export const selectTotalsWithNames = createSelector(selectTotals, (totals) =>
  totals
    .map((t) => ({
      name: t.user.name,
      value: t.total,
    }))
    .sort((a, b) => b.value - a.value)
);

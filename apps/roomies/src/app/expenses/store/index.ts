import { createSelector } from '@ngrx/store';
import { getCurrentUser, getUserEntities } from '../../auth/store';
import { selectTotals, selectTotalsState } from './totals.selectors';
import { calcBalance } from './utils';

export * from './expenses.actions';
export * from './expenses.effects';
export * from './expenses.reducer';
export * from './expenses.selectors';
export * from './totals.actions';
export * from './totals.effects';
export * from './totals.reducer';
export * from './totals.selectors';

export const selectBalance = createSelector(
  selectTotalsState,
  getCurrentUser,
  (state, user) => calcBalance(state.totals, user?._id)
);
export const selectBalanceWithSign = createSelector(
  selectBalance,
  (balance) => ({
    amount: balance ? Math.abs(balance) : 0,
    sign: balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'balanced',
  })
);

export const selectTotalsWithNames = createSelector(selectTotals, getUserEntities, (totals, users) =>
  totals
    .map((t) => ({
      name: users[t._id].name,
      value: t.total,
    }))
    .sort((a, b) => b.value - a.value)
);

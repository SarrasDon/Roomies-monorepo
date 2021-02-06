import { createSelector } from '@ngrx/store';
import { getCurrentUser } from '../../auth/store';
import { selectTotalsState } from './totals.selectors';
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

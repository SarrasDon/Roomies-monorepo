import { createSelector } from '@ngrx/store';
import { getCurrentUser } from '../../auth/state';
import { selectTotals } from './totals.state';
import { calcBalance } from './utils';

export * from './expense.selectors';
export * from './expenses.actions';
export * from './expenses.state';
export * from './totals.state';

export const selectBalance = createSelector(
  selectTotals,
  getCurrentUser,
  (totals, user) => calcBalance(totals, user._id)
);
export const selectBalanceWithSign = createSelector(
  selectBalance,
  (balance) => ({
    amount: balance ? Math.abs(balance) : 0,
    sign: balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'balanced',
  })
);

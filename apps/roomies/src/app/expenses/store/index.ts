import { createSelector } from '@ngrx/store';
import { getCurrentUser, getUsersSorted } from '../../auth/store';
import { selectTotalIds, selectTotals } from './totals.selectors';
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
  selectTotals,
  getCurrentUser,
  (totals, user) => calcBalance(totals, user?._id)
);
export const selectBalanceWithSign = createSelector(
  selectBalance,
  (balance) => ({
    amount: balance ? Math.abs(balance) : 0,
    sign: balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'balanced',
  })
);

export const selectTotalsWithNames = createSelector(
  selectTotals,
  getUsersSorted,
  (totals, users) =>
    users.map((u) => ({
      name: u.name,
      value: totals.find((t) => t._id === u._id).total,
      _id: totals.find((t) => t._id === u._id)._id
    }))
);

export const selectTotalIdsSorted = createSelector(
  getUsersSorted,
  (users) =>
    users.map((u) => u._id)
)

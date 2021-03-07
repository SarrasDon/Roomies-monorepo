import { createReducer, on } from '@ngrx/store';
import { Total } from '../../shared/models';
import { createExpense, createExpenseFail } from './expenses.actions';
import { totalsLoaded } from './totals.actions';
import { calcBalance, incrementUserTotal } from './utils';

export const totalsFeatureKey = 'totals';

export interface TotalState {
  totals: Total[];
}

const initialState: TotalState = { totals: [] };

const _totalsReducer = createReducer(
  initialState,
  on(totalsLoaded, (state, { totals, userId }) => {
    return {
      ...state,
      totals: totals.slice().sort((a, b) => (a._id === userId ? -1 : 1)),
    };
  }),
  on(createExpense, (state, { user, amount }) => {
    const totals = incrementUserTotal(state.totals, amount, user._id);
    const balance = calcBalance(totals, user._id);
    return { ...state, totals, balance };
  }),
  on(createExpenseFail, (state, { user, amount }) => {
    const totals = incrementUserTotal(state.totals, amount, user._id);
    return { ...state, totals };
  })
);

export function totalsReducer(state: TotalState, action: any) {
  return _totalsReducer(state, action);
}

import {
  createReducer,
  on
} from '@ngrx/store';
import { Total } from '../../shared/models';
import {
  incrementTotal,
  totalsLoaded
} from './totals.actions';
import { calcBalance, incrementUserTotal } from './utils';

export const totalsFeatureKey = 'totals';

export interface TotalState {
  totals: Total[];
  balance: number;
}

const initialState: TotalState = { totals: [], balance: 0 };


const _totalsReducer = createReducer(
  initialState,
  on(totalsLoaded, (state, { totals, userId }) => {
    const count = (totals[0] || { count: 0 }).count;
    if (!count) {
      return state;
    }

    const balance = calcBalance(totals, userId);

    return {
      ...state,
      totals: totals.slice().sort((a, b) => (a.user._id === userId ? -1 : 1)),
      balance,
    };
  }),
  on(incrementTotal, (state, { userId, amount }) => {
    const totals = incrementUserTotal(state.totals, amount, userId);
    const balance = calcBalance(totals, userId);
    return { ...state, totals, balance };
  })
);
export function totalsReducer(state: TotalState, action: any) {
  return _totalsReducer(state, action);
}

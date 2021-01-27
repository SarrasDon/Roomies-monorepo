import {
  Action,
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from '@ngrx/store';
import { Total } from '../../shared/models';
import { createExpenseFail } from './expenses.actions';
import { decrementUserTotal, incrementUserTotal } from './utils';

export const totalsFeatureKey = 'totals';

export interface TotalState {
  totals: Total[];
}

const initialState: TotalState = { totals: [] };

export const getTotals = createAction('[Totals] Get Totals per User');
export const totalsLoaded = createAction(
  '[Totals] Totals loaded',
  props<{ totals: Total[]; userId: string }>()
);
export const incrementTotal = createAction(
  '[Totals] Increment Total',
  props<{ amount: number; userId: string }>()
);

const _totalsReducer = createReducer(
  initialState,
  on(totalsLoaded, (state, { totals, userId }) => {
    const count = (totals[0] || { count: 0 }).count;
    if (!count) {
      return state;
    }

    return {
      ...state,
      totals: totals.slice().sort((a, b) => (a.user._id === userId ? -1 : 1)),
    };
  }),
  on(incrementTotal, (state, { userId, amount }) => {
    const totals = incrementUserTotal(state.totals, amount, userId);
    return { ...state, totals };
  }),
  on(createExpenseFail, (state, { userId, amount }) => {
    const totals = decrementUserTotal(state.totals, amount, userId);
    return { ...state, totals };
  })
);
export function totalsReducer(state: TotalState, action: Action) {
  return _totalsReducer(state, action);
}

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

import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import { Total } from "../../shared/models";
import { calcTotal } from "./expenses.state";

export const totalsFeatureKey = 'totals';

export interface TotalState {
  totals: Total[];
  balance: number;
}

const initialState: TotalState = { totals: [], balance: 0 };

export const getTotals = createAction('[Totals] Get Totals per User');
export const totalsLoaded = createAction('[Totals] Totals loaded', props<{ totals: Total[], userId: string }>());


const _totalsReducer = createReducer(
  initialState,
  on(totalsLoaded, (state, { totals, userId }) => {
    const count = (totals[0] || { count: 0 }).count;
    if (!count) {
      return state;
    }
    const sum = calcTotal(totals);
    const userTotal = (totals.find(t => t.user._id === userId) || { total: 0 })
      .total;
    const balance = sum / count - userTotal;

    return {
      ...state,
      totals: totals.slice().sort((a, b) => (a.user._id === userId ? -1 : 1)),
      balance
    };
  })
)


export function totalsReducer(state: TotalState, action: any) {
  return _totalsReducer(state, action)
}

export const selectExpensesState = createFeatureSelector<TotalState>(totalsFeatureKey)
export const selectTotals = createSelector(selectExpensesState, state => state.totals);
export const selectBalance = createSelector(selectExpensesState, (state) => state.balance);
export const selectBalanceWithSign = createSelector(selectBalance, balance => ({
  amount: balance ? Math.abs(balance) : 0,
  sign: balance > 0
    ? 'positive'
    : balance < 0
      ? 'negative'
      : 'balanced'
}))

export const selectTotalsWithNames = createSelector(selectTotals, totals => totals.map(t => ({
  name: t.user.name,
  value: t.total
}))
  .sort((a, b) => b.value - a.value))

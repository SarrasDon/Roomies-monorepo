import { createReducer, on } from '@ngrx/store';
import { Total } from '../../shared/models';
import { createExpense, createExpenseFail } from './expenses.actions';
import { totalsLoaded } from './totals.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export const totalsFeatureKey = 'totals';

export interface TotalState extends EntityState<Total> { }

export const totalsAdapter = createEntityAdapter(
  {
    selectId: (total: Total) => total._id
  }
)

const initialState: TotalState = totalsAdapter.getInitialState()

const _totalsReducer = createReducer(
  initialState,
  on(totalsLoaded, (state, { totals }) => {
    return totalsAdapter.upsertMany(totals, state);
  }),
  on(createExpense, (state, { user, amount }) => {
    if (!state.entities[user._id]) {
      return state;
    }
    const userTotalAmount = state.entities[user._id].total ?? 0;
    return totalsAdapter.updateOne(
      {
        id: user._id,
        changes: {
          total: userTotalAmount + amount
        }
      }, state);
  }),
  on(createExpenseFail, (state, { user, amount }) => {
    if (!state.entities[user._id]) {
      return state;
    }
    const userTotalAmount = state.entities[user._id].total ?? 0;

    return totalsAdapter.updateOne(
      {
        id: user._id,
        changes: {
          total: Math.max(userTotalAmount - amount, 0)
        }
      }, state);
  })
);

export function totalsReducer(state: TotalState, action: any) {
  return _totalsReducer(state, action);
}
